import {Router} from 'express';
import {CACHE, RESOLVE, SERVE, handlerDecorator} from './../../lib/router-config';
import {highlightReferences} from './utils';
import * as Cookies from 'cookies';
import {BookInfo, IBookInfo} from './../../models/threeangels/book-info';
import {BookParagraph} from './../../models/threeangels/book-paragraph';
import {AppRequest, AppResponse} from '../../lib/types'
import {BasicRoutes} from './../router';


const ERROR_MESSAGE = 'Oops, the page you\'re looking for is missing.';
const DEFAULT_CHAPTER = {title: '', number: ''};

class ThreeAngels extends BasicRoutes {

  constructor() {
    super('threeangels');
  }

  /**
   * @param {string} code Book code
   * @return {string} Cookie path
   */
  private getBookPath(code) {
    return '/' + this.basePath + '/book/' + code;
  }

  @handlerDecorator
  readPage(req: AppRequest, res: AppResponse) {
    const path = req.cookies.get('read') || '/' + this.basePath + '/book/DA/1';
    res.redirect(path);
  };

  @handlerDecorator
  booksPage(req, res) {
    return BookInfo.find({}).exec()
      .then(docs => {
        const books = docs.filter(x => Boolean(x.summary.summary));
        const tags = [];
        for (const book of books) {
          for (const tag of book.summary.tags) {
            if (!tags.find(x => x === tag)) {
              tags.push(tag);
            }
          }
        }
        tags.sort();
        res.serve('threeangels/books', {books, tags});
      }).catch(e => res.send(e));
  };

  @handlerDecorator
  tocPage(req, res) {
    return BookInfo.findOne({code: req.params.code.toUpperCase()}).exec()
      .then(doc => {
        const book = doc.toObject() as IBookInfo;
        const page = {
          book,
          pageContent: 'toc',
          chapterIndex: req.cookies.get('chapter') || book.chapters[0].number,
        };
        res.cache('threeangels/layout', page);
      });
  }

  @handlerDecorator
  chapterPage(req, res) {
    const code = req.params.code.toUpperCase();
    const chapter = req.params.chapter;
    return BookInfo.findOne({code}).exec().then(doc => {
      let page = {
        pagination: {next: DEFAULT_CHAPTER, previous: DEFAULT_CHAPTER},
        chapterIndex: 0,
        chapter: DEFAULT_CHAPTER,
      };
      page.chapterIndex  = doc.chapters.findIndex(x => x.number === chapter);
      if (page.chapterIndex > 0) {
        page.pagination.previous = doc.chapters[page.chapterIndex - 1];
      }
      if (page.chapterIndex < (doc.chapters.length - 1)) {
        page.pagination.next = doc.chapters[page.chapterIndex + 1];
      }
      req.cookies.set('chapter', chapter, {
        path: this.getBookPath(code),
        httpOnly: true,
      });
      req.cookies.set('read', code + '/' + chapter, {
        path: '/threeangels/book/read',
        httpOnly: true,
      });
      page.chapter = doc.chapters[page.chapterIndex];
      return BookParagraph.find({code, chapter}).exec().then(paragraphs => {
        paragraphs.sort((a, b) => a.k - b.k);
        res.cache('threeangels/layout', {
          ...page,
          book: doc.toObject(),
          paragraphs: paragraphs.map(x => {
            x.text = highlightReferences(x.text);
            return x;
          }),
          pageContent: 'chapter',
        });
      });
    });
  }

  get() {
    this.router.get('/book/:code/:chapter', this.chapterPage.bind(this));
    this.router.get('/book/read', this.readPage.bind(this));
    this.router.get('/book/:code', this.tocPage.bind(this));
    this.router.get('/book', this.booksPage.bind(this));
    return super.get();
  }
}

const routes = new ThreeAngels().get();
export = routes;
