"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_config_1 = require("./server-config");
var utils_1 = require("./utils");
var ejs_1 = require("ejs");
var fs_1 = require("fs");
var user_1 = require("../models/user");
var html_minifier_1 = require("html-minifier");
var mkdirp = require("mkdirp");
var log = require("./log");
var minificationOptions = {
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
    var content = fs_1.readFileSync('templates/' + name + '.ejs', 'utf8');
    var html = html_minifier_1.minify(ejs_1.render(content, data, {
        filename: __dirname + '/../../templates/' + name,
    }), minificationOptions);
    if (cachePath) {
        mkdirp(cachePath.substr(0, cachePath.lastIndexOf('/')), function (err) {
            fs_1.writeFileSync(cachePath, html, 'utf8');
            res.send(html);
        });
    }
    else {
        res.send(html);
    }
}
exports.minifyResponse = minifyResponse;
function SERVE(req, res, next) {
    res.serve = function (name, options) {
        if (options === void 0) { options = {}; }
        var config = req.serverConfig || server_config_1.serverConfig;
        var data = __assign({}, config, options);
        minifyResponse(res, name, data);
    };
    next();
}
exports.SERVE = SERVE;
function RESOLVE(req, res, next) {
    res.resolve = function (error, value) {
        utils_1.resolve(error, res, value);
    };
    next();
}
exports.RESOLVE = RESOLVE;
function ADMIN_LOGIN(req, res, next) {
    if (!req.user) {
        res.redirect('/admin/login');
    }
    else {
        next();
    }
}
exports.ADMIN_LOGIN = ADMIN_LOGIN;
function ADMIN_SESSION(req, res, next) {
    if (req.adminSession && req.adminSession.user) {
        user_1.User.findOne({ username: req.adminSession.user.username }, function (err, user) {
            if (user) {
                req.user = user;
                delete req.user.password;
                req.adminSession.user = user;
                res.locals.user = user;
            }
            next();
        });
    }
    else {
        next();
    }
}
exports.ADMIN_SESSION = ADMIN_SESSION;
function CACHE(req, res, next) {
    res.cache = function (name, options) {
        if (options === void 0) { options = {}; }
        var config = req.serverConfig || server_config_1.serverConfig;
        var data = __assign({}, config, options);
        if (data.cache !== undefined && !data.cache) {
            minifyResponse(res, name, data);
            return;
        }
        var cachePath = 'data/cache' + req.basePath + req.url + '.html';
        res.sendFile(cachePath, { root: './' }, function (err) {
            if (err) {
                log.warn('no cache for %s', cachePath);
                minifyResponse(res, name, data, cachePath);
            }
            else {
                log.info('Serving from cache data; %s', cachePath);
            }
        });
    };
    next();
}
exports.CACHE = CACHE;
function handlerDecorator(target, key, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var req = args[0];
        var res = args[1];
        try {
            var response = originalMethod.apply(this, args);
            if (response && typeof response.catch === 'function') {
                response.catch(function (error) {
                    log.error(error);
                    req.errorFunction(res, 500, req.serverErrorMessage);
                });
            }
            return response;
        }
        catch (error) {
            log.error(error);
            req.errorFunction(res, 500, req.serverErrorMessage);
        }
        return;
    };
    return descriptor;
}
exports.handlerDecorator = handlerDecorator;
/*
export function handlerDecorator(handler) {
  return function(req: AppRequest, res: AppResponse) {
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
*/
