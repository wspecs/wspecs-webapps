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
var express_1 = require("express");
var router_config_1 = require("./../lib/router-config");
var Cookies = require("cookies");
var PAGE_NOT_FOUND = 'Oops, the page you\'re looking for is missing.';
var SERVER_ERROR = 'Something went wrong!';
var BasicRoutes = /** @class */ (function () {
    function BasicRoutes(basePath, errorMessage404, serverErrorMessage) {
        if (errorMessage404 === void 0) { errorMessage404 = PAGE_NOT_FOUND; }
        if (serverErrorMessage === void 0) { serverErrorMessage = SERVER_ERROR; }
        var _this = this;
        this.basePath = basePath;
        this.errorMessage = errorMessage404;
        this.router = express_1.Router();
        this.router.use(router_config_1.RESOLVE);
        this.router.use(router_config_1.CACHE);
        this.router.use(router_config_1.SERVE);
        this.router.use(function (req, res, next) {
            req.basePath = '/' + _this.basePath;
            req.cookies = new Cookies(req, res);
            req.errorFunction = _this.showError;
            req.serverErrorMessage = serverErrorMessage;
            next();
        });
    }
    BasicRoutes.prototype.error404 = function (req, res) {
        return this.showError(res, 404);
    };
    BasicRoutes.prototype.showError = function (res, code, message) {
        if (code === void 0) { code = 404; }
        if (message === void 0) { message = this.errorMessage; }
        var page = { error: { code: code, message: message } };
        res.status = code;
        res.cache(this.basePath + '/error', page);
    };
    BasicRoutes.prototype.getCookie = function (req, name) {
        req.cookies.get(name);
    };
    BasicRoutes.prototype.setCookie = function (req, name, value, options) {
        if (options === void 0) { options = {}; }
        req.cookies.set(name, value, __assign({ httpOnly: true, path: '/' + this.basePath }, options));
    };
    BasicRoutes.prototype.get = function () {
        this.router.get('*', this.error404.bind(this));
        return this.router;
    };
    return BasicRoutes;
}());
exports.BasicRoutes = BasicRoutes;
