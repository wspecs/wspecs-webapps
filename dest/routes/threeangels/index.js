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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var router_config_1 = require("./../../lib/router-config");
var utils_1 = require("./utils");
var book_info_1 = require("./../../models/threeangels/book-info");
var book_paragraph_1 = require("./../../models/threeangels/book-paragraph");
var router_1 = require("./../router");
var ERROR_MESSAGE = 'Oops, the page you\'re looking for is missing.';
var DEFAULT_CHAPTER = { title: '', number: '' };
var ThreeAngels = /** @class */ (function (_super) {
    __extends(ThreeAngels, _super);
    function ThreeAngels() {
        return _super.call(this, 'threeangels') || this;
    }
    /**
     * @param {string} code Book code
     * @return {string} Cookie path
     */
    ThreeAngels.prototype.getBookPath = function (code) {
        return '/' + this.basePath + '/book/' + code;
    };
    ThreeAngels.prototype.readPage = function (req, res) {
        var path = req.cookies.get('read') || '/' + this.basePath + '/book/DA/1';
        res.redirect(path);
    };
    ;
    ThreeAngels.prototype.booksPage = function (req, res) {
        return book_info_1.BookInfo.find({}).exec()
            .then(function (docs) {
            var books = docs.filter(function (x) { return Boolean(x.summary.summary); });
            var tags = [];
            for (var _i = 0, books_1 = books; _i < books_1.length; _i++) {
                var book = books_1[_i];
                var _loop_1 = function (tag) {
                    if (!tags.find(function (x) { return x === tag; })) {
                        tags.push(tag);
                    }
                };
                for (var _a = 0, _b = book.summary.tags; _a < _b.length; _a++) {
                    var tag = _b[_a];
                    _loop_1(tag);
                }
            }
            tags.sort();
            res.serve('threeangels/books', { books: books, tags: tags });
        }).catch(function (e) { return res.send(e); });
    };
    ;
    ThreeAngels.prototype.tocPage = function (req, res) {
        return book_info_1.BookInfo.findOne({ code: req.params.code.toUpperCase() }).exec()
            .then(function (doc) {
            var book = doc.toObject();
            var page = {
                book: book,
                pageContent: 'toc',
                chapterIndex: req.cookies.get('chapter') || book.chapters[0].number,
            };
            res.cache('threeangels/layout', page);
        });
    };
    ThreeAngels.prototype.chapterPage = function (req, res) {
        var _this = this;
        var code = req.params.code.toUpperCase();
        var chapter = req.params.chapter;
        return book_info_1.BookInfo.findOne({ code: code }).exec().then(function (doc) {
            var page = {
                pagination: { next: DEFAULT_CHAPTER, previous: DEFAULT_CHAPTER },
                chapterIndex: 0,
                chapter: DEFAULT_CHAPTER,
            };
            page.chapterIndex = doc.chapters.findIndex(function (x) { return x.number === chapter; });
            if (page.chapterIndex > 0) {
                page.pagination.previous = doc.chapters[page.chapterIndex - 1];
            }
            if (page.chapterIndex < (doc.chapters.length - 1)) {
                page.pagination.next = doc.chapters[page.chapterIndex + 1];
            }
            req.cookies.set('chapter', chapter, {
                path: _this.getBookPath(code),
                httpOnly: true,
            });
            req.cookies.set('read', code + '/' + chapter, {
                path: '/threeangels/book/read',
                httpOnly: true,
            });
            page.chapter = doc.chapters[page.chapterIndex];
            return book_paragraph_1.BookParagraph.find({ code: code, chapter: chapter }).exec().then(function (paragraphs) {
                paragraphs.sort(function (a, b) { return a.k - b.k; });
                res.cache('threeangels/layout', __assign({}, page, { book: doc.toObject(), paragraphs: paragraphs.map(function (x) {
                        x.text = utils_1.highlightReferences(x.text);
                        return x;
                    }), pageContent: 'chapter' }));
            });
        });
    };
    ThreeAngels.prototype.get = function () {
        this.router.get('/book/:code/:chapter', this.chapterPage.bind(this));
        this.router.get('/book/read', this.readPage.bind(this));
        this.router.get('/book/:code', this.tocPage.bind(this));
        this.router.get('/book', this.booksPage.bind(this));
        return _super.prototype.get.call(this);
    };
    __decorate([
        router_config_1.handlerDecorator,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], ThreeAngels.prototype, "readPage", null);
    __decorate([
        router_config_1.handlerDecorator,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], ThreeAngels.prototype, "booksPage", null);
    __decorate([
        router_config_1.handlerDecorator,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], ThreeAngels.prototype, "tocPage", null);
    __decorate([
        router_config_1.handlerDecorator,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], ThreeAngels.prototype, "chapterPage", null);
    return ThreeAngels;
}(router_1.BasicRoutes));
var routes = new ThreeAngels().get();
module.exports = routes;
