const express = require('express')
const router = express.Router()
const removeAccents = require('remove-accents');
const session = require('client-sessions');
const Cookies = require('cookies');
const serverConfig = require('./../../lib/server-config')
const rc = require('./../../lib/router-config')
const chunk = require('./../../lib/functions').chunk;
const HL = require('./../../models/hl')
const hlConfig = require('./config');
const indexes = require('./indexes');

router.use(session(hlConfig.session));
router.use(rc.RESOLVE);
router.use(rc.CACHE);
router.use(rc.SERVE);

const showError = (res, code) => {
  code = code || 404;
  const page = {error: {
    code,
    message: 'Oops, la page que vous cherchez n\'existe pas.',
  }}
  res.status = code;
  res.serve('hl/error', page);
}

const toSong = (doc) => {
  const song = doc.toObject();
  song.prev = song.number > 1 ? song.number - 1 : 0;
  song.next = song.number < 654 ? song.number + 1 : 0;
  song.chunk = chunk;
  song.pageContent = 'song';
  return song;
}
const sortKey = (a) => removeAccents(a.title).replace(/ /g, '');
const validSongNumber = (n) => (!isNaN(n) && n >= 1 && n <= 654)

router.use((req, res, next) => {
  req.basePath = '/hl';
  serverConfig.toc = indexes;
  serverConfig.session = req.hlSession;
  req.cookies = new Cookies(req, res, {
    httpOnly: true,
    path: '/hl',
  });
  req.serverConfig = Object.assign({
    number: req.cookies.get('num') || 1,
  }, serverConfig, hlConfig.details);
  req.errorFunction = showError;
  req.serverErrorMessage = 'Ça ne marche pas!';
  next();
});

const presentationHandler = (req, res) => {
  const number = req.params.number;
  const numbers = String(number)
    .replace(/ /g, '')
    .split(',')
    .map(x => Number(x))
    .filter(x => !isNaN(x));
  for (const num of numbers) {
    if (!validSongNumber(num)) {
      showError(res, 404);
      return;
    }
  }
  return HL.find({number: {$in: numbers}}).exec().then(docs => {
    res.cache('hl/presentation', {
      showSearch: !req.params.number,
      // return the songs in the order they were requested.
      songs: docs.map(doc => toSong(doc)).sort((a, b) => {
        return numbers.indexOf(a.number) - numbers.indexOf(b.number);
      }),
    });
  });
}
router.get('/presentation', rc.handlerDecorator(presentationHandler));
router.get('/presentation/:number', rc.handlerDecorator(presentationHandler));

let chantHandler = (req, res) => {
  const number = req.params.number || req.cookies.get('num') || 1;
  return HL.findOne({number: number}).exec().then(doc => {
    req.cookies.set('num', number);
    res.cache('hl/layout', toSong(doc));
  });
};
router.get('/chant', rc.handlerDecorator(chantHandler));
router.get('/chant/:number', rc.handlerDecorator(chantHandler));

const songIndexHandler = (req, res) => {
  const songIndex = (req.params.index || 'A')[0].toUpperCase();
  return HL.find({azIndex: songIndex})
    .select('title number verses -_id')
    .exec().then(docs => {
      docs.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
      const page = {
        songIndex,
        pathPrefix: 'az',
        songIndexes: indexes.az.map(x => x.key)};
      page.indexes = docs.map(item => {
        item.summary = item.verses[0].join(' ');
        return item;
      });
      page.pageContent = 'index';
      res.serve('hl/layout', page);
  });
}
router.get('/az', rc.handlerDecorator(songIndexHandler));
router.get('/az/:index', rc.handlerDecorator(songIndexHandler));

const songIndexHandlerNumber = (req, res) => {
  const songIndex = parseInt(req.params.index, 10) || 1;
  return HL.find({number: { $gte: songIndex, $lt: songIndex + 50 }})
    .select('title number verses -_id')
    .exec().then(docs => {
      docs.sort((a, b) => a.number - b.number);
      const page = {
        songIndex,
        pathPrefix: 'numero',
        songIndexes: indexes.numbers.map(x => x.key)};
      page.indexes = docs.map(item => {
        item.summary = item.verses[0].join(' ');
        return item;
      });
      page.pageContent = 'index';
      res.serve('hl/layout', page);
  });
}
router.get('/numero', rc.handlerDecorator(songIndexHandlerNumber));
router.get('/numero/:index', rc.handlerDecorator(songIndexHandlerNumber));

const songIndexHandlerCategory = (req, res) => {
  const category = req.params.category || indexes.category[0].title;
  const categoryInfo = indexes.category.find(
      x => x.subTitle === category || x.title === category);
  return HL.find({number: { $gte: categoryInfo.start, $lte: categoryInfo.end }})
    .select('title number verses -_id')
    .exec().then(docs => {
      docs.sort((a, b) => a.number - b.number);
      let page = {
        categoryInfo,
        songIndexes: indexes.numbers.map(x => x.key)};
      page.indexes = docs.map(item => {
        item.summary = item.verses[0].join(' ');
        return item;
      });
      page.pageContent = 'category';
      res.serve('hl/layout', page);
  });
}
router.get('/category', rc.handlerDecorator(songIndexHandlerCategory));
router.get('/category/:category', rc.handlerDecorator(songIndexHandlerCategory));

const searchHandler = (req, res) => {
  const query = (req.params.query || '').trim();
  if (validSongNumber(Number(query))) {
     res.redirect('/hl/chant/' + query);
     return;
  }
  return HL.find(
      {$text: {$search: query}},
      {score: {$meta: 'textScore'}})
    .sort({score:{$meta:'textScore'}})
    .select('title number verses -_id')
    .skip(0)
    .limit(10)
    .exec().then(docs => {
      const page = {query};
      page.songs = (docs || []).map(item => {
        item.summary = item.verses[0].join(' ');
        return item;
      });
      page.pageContent = 'results';
      res.cache('hl/layout', page);
    });
};
router.get('/search/:query', rc.handlerDecorator(searchHandler));
router.get('/recherche/:query', rc.handlerDecorator(searchHandler));

const homeHandler = (req, res) => {
  const page = {
    pageContent: 'home',
  };
  res.serve('hl/layout', page);
};
router.get('', rc.handlerDecorator(homeHandler));
router.get('/accueil', rc.handlerDecorator(homeHandler));

router.get('*', (req, res) => {
  showError(res, 404);
});

module.exports = router
