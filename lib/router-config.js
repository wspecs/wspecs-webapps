const serverConfig = require('./server-config');
const utils = require('./functions');
const ejs = require('ejs');
const fs = require('fs');
const User = require('../models/user');
const minify = require('html-minifier').minify;
const mkdirp = require('mkdirp');
const log = require('./log');

const minificationOptions = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  decodeEntities: true,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  removeComments: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
};

function minifyResponse(res, name, data, cachePath) {
  const content = fs.readFileSync('templates/' + name + '.ejs', 'utf8');
  let html = minify(ejs.render(content, data, {
    filename: __dirname + '/../templates/' + name,
  }), minificationOptions);
  if (cachePath) {
    mkdirp(cachePath.substr(0, cachePath.lastIndexOf('/')), err => {
      fs.writeFileSync(cachePath, html, 'utf8');
      res.send(html);
    });
  } else {
    res.send(html);
  }
}

module.exports.SERVE = function(req, res, next) {
  res.serve = (name, options) => {
    const config = req.serverConfig || serverConfig;
    const data = Object.assign(config, (options || {}));
    minifyResponse(res, name, data);
  }
  next();
}

module.exports.RESOLVE = function(req, res, next) {
  res.resolve = (error, value) => {
    utils.resolve(error, res, value);
  }
  next();
}

module.exports.ADMIN_LOGIN = function(req, res, next) {
  if (!req.user) {
    res.redirect('/admin/login');
  } else {
    next();
  }
}

module.exports.ADMIN_SESSION = function(req, res, next) {
  if (req.adminSession && req.adminSession.user) {
    User.findOne({ username: req.adminSession.user.username }, (err, user) => {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.adminSession.user = user;
        res.locals.user = user;
      }
      next();
    });
  } else {
    next();
  }
}

module.exports.errorHandler = (err, req, res) => {
  res.send('done');
}

module.exports.CACHE = function(req, res, next) {
  res.cache = (name, options) => {
    const config = req.serverConfig || serverConfig;
    const data = Object.assign({}, config, (options || {}));
    if (data.cache !== undefined && !data.cache) {
      minifyResponse(res, name, data);
      return;
    }
    const cachePath = 'data/cache' + req.basePath + req.url + '.html';
    res.sendFile(cachePath, {root: './'}, err => {
      if (err) {  // No cached page
        log.warn('no cache for %s', cachePath);
        minifyResponse(res, name, data, cachePath);
      } else {
        log.info('Serving from cache data; %s', cachePath);
      }
    });
  }
  next();
}
module.exports.handlerDecorator = function(handler, errorFn) {
  return function(req, res) {
    try {
      const response = handler(req, res);
      if (response && typeof response.catch === 'function') {
        response.catch(error => {
          log.error(error);
          req.errorFunction(res, 500, req.serverErrorMessage);
        });
      }
    } catch(error) {
      log.error(error);
      req.errorFunction(res, 500, req.serverErrorMessage);
    }
  }
}
