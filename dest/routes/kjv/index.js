"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var kjv_1 = require("./../../models/kjv");
var books = require("./books");
var router_1 = require("./../router");
var ERROR_MESSAGE = 'Oops, the page you\'re looking for is missing.';
var KJVRoutes = /** @class */ (function (_super) {
    __extends(KJVRoutes, _super);
    function KJVRoutes() {
        return _super.call(this, 'kjv') || this;
    }
    KJVRoutes.prototype.getBookName = function (number) {
        if (number < 1 || number > 66) {
            throw new Error('number out of range');
        }
        return books.names[number - 1][0];
    };
    KJVRoutes.prototype.getBookNumber = function (name) {
        var search = name.toLowerCase().replace(/[^a-z0-9]+/, '');
        for (var idx = 0; idx < books.names.length; idx++) {
            if (books.names[idx].some(function (x) { return x.toLowerCase() === search; })) {
                return idx + 1;
            }
        }
        return -1;
    };
    KJVRoutes.prototype.searchPage = function (req, res) {
        var _this = this;
        var query = (req.params.query || '').trim();
        var start = Number(req.params.start) || 0;
        return kjv_1.KJV.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip(start)
            .limit(20)
            .exec().then(function (docs) {
            var page = {
                results: docs.map(function (x) {
                    x.bookName = _this.getBookName(x.book);
                    return x;
                }),
                pageContent: 'results',
            };
            res.cache('kjv/layout', page);
        });
    };
    ;
    KJVRoutes.prototype.versePage = function (req, res) {
        var _this = this;
        var query = {
            book: Number(req.params.book) || this.getBookNumber(req.params.book),
            chapter: req.params.chapter,
            verse: req.params.verse,
        };
        return kjv_1.KJV.find(query).sort('verse').exec().then(function (verses) {
            var page = {
                pageContent: 'chapter',
                verses: verses,
                book: _this.getBookName(verses[0].book),
            };
            res.cache('kjv/layout', page);
        });
    };
    ;
    KJVRoutes.prototype.chapterPage = function (req, res) {
        var _this = this;
        var query = {
            book: Number(req.params.book) || this.getBookNumber(req.params.book),
            chapter: req.params.chapter,
        };
        return kjv_1.KJV.find(query).sort('verse').exec().then(function (verses) {
            var page = {
                pageContent: 'chapter',
                verses: verses,
                book: _this.getBookName(verses[0].book),
            };
            res.cache('kjv/layout', page);
        });
    };
    ;
    KJVRoutes.prototype.bookPage = function (req, res) {
        var bookIndex = Number(req.params.book) || this.getBookNumber(req.params.book);
        var bookName = this.getBookName(bookIndex);
        var page = {
            bookIndex: bookIndex,
            bookName: bookName,
            chapterCount: books.chapterCount[bookIndex - 1],
            pageContent: 'book',
        };
        res.cache('kjv/layout', page);
    };
    ;
    KJVRoutes.prototype.homePage = function (req, res) {
        var page = {
            pageContent: 'home',
            books: books.names.map(function (x) { return x[0]; }),
        };
        res.cache('kjv/layout', page);
    };
    ;
    KJVRoutes.prototype.get = function () {
        this.router.get('/search/:query/:start', this.searchPage.bind(this));
        this.router.get('/search/:query', this.searchPage.bind(this));
        this.router.get('/:book/:chapter/:verse', this.versePage.bind(this));
        this.router.get('/:book/:chapter', this.chapterPage.bind(this));
        this.router.get('/:book', this.bookPage.bind(this));
        this.router.get('/', this.homePage.bind(this));
        return _super.prototype.get.call(this);
    };
    return KJVRoutes;
}(router_1.BasicRoutes));
var routes = new KJVRoutes().get();
module.exports = routes;
