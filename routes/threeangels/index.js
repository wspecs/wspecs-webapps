const express = require('express')
let router = express.Router()
let serverConfig = require('./../../lib/server-config')
const rc = require('./../../lib/router-config')
const BookInfo = require('./../../models/threeangels/book-info')
const BookParagraph= require('./../../models/threeangels/book-paragraph')
const threeangelsUtils = require('./utils');
const Cookies = require('cookies');

router.use(rc.RESOLVE);
router.use(rc.CACHE);
router.use(rc.SERVE);

/**
 * @param {string} code Book code
 * @return {string} Cookie path
 */
function getBookPath(code) {
  return '/threeangels/book/' + code;
}

let showError = (res, code, message) => {
  const page = {error: {
    code,
    message: message || 'Oops, the page you\'re looking for is missing.',
  }};
  res.status = code;
  res.cache('threeangels/error', page);
}

router.use((req, res, next) => {
  // Path for caching templates
  req.errorFunction = showError;
  req.serverErrorMessage = 'Something went wrong in the backend';
  req.basePath = '/threeangels';
  req.cookies = new Cookies(req, res);
  next();
});


let readPage = (req, res) => {
  const path = req.cookies.get('read') || '/threeangels/book/DA/1';
  res.redirect(path);
};
router.get('/book/read', readPage);

let booksPage = (req, res) => {
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
// TODO Add decorator
router.get('/book', booksPage);

let tocPage = (req, res) => {
  return BookInfo.findOne({code: req.params.code.toUpperCase()}).exec()
    .then(doc => {
      let page = {};
      page.book = doc.toObject();
      page.pageContent = 'toc';
      page.chapterIndex = req.cookies.get('chapter') || page.book.chapters[0].number;
      res.cache('threeangels/layout', Object.assign(serverConfig, page));
    });
};
router.get('/book/:code', rc.handlerDecorator(tocPage));

let chapterPage = (req, res) => {
  const code = req.params.code.toUpperCase();
  const chapter = req.params.chapter;
  return BookInfo.findOne({code}).exec().then(doc => {
    let page = {pagination: {}};
    page.chapterIndex  = doc.chapters.findIndex(x => x.number === chapter);
    if (page.chapterIndex > 0) {
      page.pagination.previous = doc.chapters[page.chapterIndex - 1];
    }
    if (page.chapterIndex < (doc.chapters.length - 1)) {
      page.pagination.next = doc.chapters[page.chapterIndex + 1];
    }
    req.cookies.set('chapter', chapter, {
      path: getBookPath(code),
      httpOnly: true,
    });
    req.cookies.set('read', code + '/' + chapter, {
      path: '/threeangels/book/read',
      httpOnly: true,
    });
    page.chapter = doc.chapters[page.chapterIndex];
    return BookParagraph.find({code, chapter}).exec().then(paragraphs => {
      paragraphs.sort((a, b) => a.number - b.number);
      page.book = doc.toObject();
      paragraphs = paragraphs.sort((a, b) => a.k - b.k);
      page.paragraphs = paragraphs.map(x => {
        x.text = threeangelsUtils.highlightReferences(x.text);
        return x;
      });
      page.pageContent = 'chapter';
      res.cache('threeangels/layout', page);
    });
  });
};
router.get('/book/:code/:chapter', rc.handlerDecorator(chapterPage));

router.get('*', (req, res) => {
  showError(res, 404);
});

module.exports = router
