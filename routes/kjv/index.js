const express = require('express')
const router = express.Router()
const Cookies = require('cookies');
const serverConfig = require('./../../lib/server-config')
const rc = require('./../../lib/router-config')
const KJV = require('./../../models/kjv')
const kjvConfig = require('./config');
const books = require('./books');

router.use(rc.RESOLVE);
router.use(rc.CACHE);
router.use(rc.SERVE);

function getBookName(number) {
  if (number < 1 || number > 66) {
    throw new Error('number out of range');
  }
  return books.names[number- 1][0];
}

function getBookNumber(name) {
  const search = name.toLowerCase().replace(/[^a-z0-9]+/, '');
  for (let idx = 0; idx < books.names.length; idx++) {
    if (books.names[idx].some(x => x.toLowerCase() === search)) {
      return idx + 1;
    }
  }
  return -1;
}

const showError = (res, code) => {
  code = code || 404;
  const page = {error: {
    code,
    message: 'Oops, we could not find this page.',
  }}
  res.status = code;
  res.serve('kjv/error', page);
}

const searchPage = (req, res) => {
  const query = (req.params.query || '').trim();
  const start = Number(req.params.start) || 0;
  return KJV.find(
      {$text: {$search: query}},
      {score: {$meta: 'textScore'}})
    .sort({score:{$meta:'textScore'}})
    .skip(start)
    .limit(20)
    .exec().then(docs => {
      const page = {
        results: docs.map(x => {
          x.bookName = getBookName(x.book);
          return x;
        }),
        pageContent: 'results',
      }
      res.cache('kjv/layout', page);
    });
};
router.get('/search/:query', rc.handlerDecorator(searchPage));
router.get('/search/:query/:start', rc.handlerDecorator(searchPage));

router.use((req, res, next) => {
  req.basePath = '/kjv';
  req.cookies = new Cookies(req, res, {
    httpOnly: true,
    path: '/kjv',
  });
  req.errorFunction = showError;
  req.serverErrorMessage = 'Something went wrong!';
  next();
});

let versePage = (req, res) => {
  const query = {
    book: Number(req.params.book) || getBookNumber(req.params.book),
    chapter: req.params.chapter,
    verse: req.params.verse,
  };
  return KJV.find(query).sort('verse').exec().then(verses => {
    const page = {
      pageContent: 'chapter',
      verses,
      book: getBookName(verses[0].book),
    }
    res.cache('kjv/layout', page);
  })
};

router.get('/:book/:chapter/:verse', rc.handlerDecorator(versePage));

let chapterPage = (req, res) => {
  const query = {
    book: Number(req.params.book) || getBookNumber(req.params.book),
    chapter: req.params.chapter,
  };
  return KJV.find(query).sort('verse').exec().then(verses => {
    const page = {
      pageContent: 'chapter',
      verses,
      book: getBookName(verses[0].book),
    }
    res.cache('kjv/layout', page);
  })
};
router.get('/:book/:chapter', rc.handlerDecorator(chapterPage));

let bookPage = (req, res) => {
  const bookIndex = Number(req.params.book) || getBookNumber(req.params.book);
  const bookName = getBookName(bookIndex);

  const page = {
    bookIndex,
    bookName,
    chapterCount: books.chapterCount[bookIndex],
    pageContent: 'book',
  }
  res.cache('kjv/layout', page);
};
router.get('/:book', rc.handlerDecorator(bookPage));

let homePage = (req, res) => {
  const page = {
    pageContent: 'home',
  }
  res.cache('kjv/layout', page);
};
router.get('/', rc.handlerDecorator(homePage));

router.get('*', (req, res) => {
  showError(res, 404);
});

module.exports = router
