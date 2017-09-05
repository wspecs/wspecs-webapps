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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./../lib/utils");
var server_config_1 = require("./../lib/server-config");
var removeAccents = require('remove-accents');
var router_1 = require("./router");
var ERROR_MESSAGE = 'Oops, the page you\'re looking for is missing.';
var DEFAULT_CHAPTER = { title: '', number: '' };
var HymnalRoutes = /** @class */ (function (_super) {
    __extends(HymnalRoutes, _super);
    function HymnalRoutes(basePath, database, hymnalIndexes, details) {
        if (details === void 0) { details = {}; }
        var _this = _super.call(this, basePath) || this;
        _this.DB = database;
        _this.hymnalIndexes = hymnalIndexes;
        _this.router.use(function (req, res, next) {
            server_config_1.serverConfig.toc = hymnalIndexes;
            req.serverConfig = Object.assign({
                number: _this.getCookie(req, 'num') || 1,
            }, server_config_1.serverConfig, details);
            next();
        });
        return _this;
    }
    HymnalRoutes.prototype.sortKey = function (a) {
        return removeAccents(a.title)
            .replace(/ /g, '').replace(/\W/g, '').toLowerCase();
    };
    HymnalRoutes.prototype.validSongNumber = function (n) {
        return !isNaN(n) && n >= 1 && n <= 654;
    };
    HymnalRoutes.prototype.toSong = function (doc) {
        var song = doc.toObject();
        song.prev = song.number > 1 ? song.number - 1 : 0;
        song.next = song.number < 654 ? song.number + 1 : 0;
        song.chunk = utils_1.chunk;
        song.pageContent = 'song';
        return song;
    };
    HymnalRoutes.prototype.slidesPage = function (req, res) {
        var _this = this;
        var number = req.params.number;
        var numbers = String(number)
            .replace(/ /g, '')
            .split(',')
            .map(function (x) { return Number(x); })
            .filter(function (x) { return !isNaN(x); });
        for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
            var num = numbers_1[_i];
            if (!this.validSongNumber(num)) {
                this.showError(res);
                return;
            }
        }
        return this.DB.find({ number: { $in: numbers } }).exec().then(function (docs) {
            res.cache(_this.basePath + '/presentation', {
                showSearch: !req.params.number,
                // return the songs in the order they were requested.
                songs: docs.map(function (doc) { return _this.toSong(doc); }).sort(function (a, b) {
                    return numbers.indexOf(a.number) - numbers.indexOf(b.number);
                }),
            });
        });
    };
    HymnalRoutes.prototype.songPage = function (req, res) {
        var _this = this;
        var number = req.params.number || this.getCookie(req, 'num') || 1;
        return this.DB.findOne({ number: number }).exec().then(function (doc) {
            _this.setCookie(req, 'num', number);
            res.cache(_this.basePath + '/layout', _this.toSong(doc));
        });
    };
    ;
    HymnalRoutes.prototype.tocAlphabeticPage = function (req, res) {
        var _this = this;
        var songIndex = (req.params.index || 'A')[0].toUpperCase();
        return this.DB.find({ azIndex: songIndex })
            .select('title number verses -_id')
            .exec().then(function (docs) {
            docs.sort(function (a, b) { return _this.sortKey(a).localeCompare(_this.sortKey(b)); });
            var alphaIndexes = docs.map(function (item) {
                item.summary = item.verses[0].join(' ');
                return item;
            });
            var page = {
                indexes: alphaIndexes,
                songIndex: songIndex,
                pathPrefix: 'az',
                pageContent: 'index',
                songIndexes: _this.hymnalIndexes.az.map(function (x) { return x.key; })
            };
            res.serve(_this.basePath + '/layout', page);
        });
    };
    HymnalRoutes.prototype.tocNumericPage = function (req, res) {
        var _this = this;
        var songIndex = parseInt(req.params.index, 10) || 1;
        return this.DB.find({ number: { $gte: songIndex, $lt: songIndex + 50 } })
            .select('title number verses -_id')
            .exec().then(function (docs) {
            docs.sort(function (a, b) { return a.number - b.number; });
            var numericIndexes = docs.map(function (item) {
                item.summary = item.verses[0].join(' ');
                return item;
            });
            var page = {
                songIndex: songIndex,
                pathPrefix: 'numero',
                indexes: numericIndexes,
                songIndexes: _this.hymnalIndexes.numbers.map(function (x) { return x.key; }),
                pageContent: 'index',
            };
            res.serve(_this.basePath + '/layout', page);
        });
    };
    HymnalRoutes.prototype.categoryPage = function (req, res) {
        var _this = this;
        var category = req.params.category || this.hymnalIndexes.category[0].title;
        var categoryInfo = this.hymnalIndexes.category.find(function (x) { return x.subTitle === category || x.title === category; });
        return this.DB.find({ number: { $gte: categoryInfo.start, $lte: categoryInfo.end } })
            .select('title number verses -_id')
            .exec().then(function (docs) {
            docs.sort(function (a, b) { return a.number - b.number; });
            var categoryIndexes = docs.map(function (item) {
                item.summary = item.verses[0].join(' ');
                return item;
            });
            var page = {
                categoryInfo: categoryInfo,
                indexes: categoryIndexes,
                pageContent: 'category',
                songIndexes: _this.hymnalIndexes.numbers.map(function (x) { return x.key; }),
            };
            res.serve(_this.basePath + '/layout', page);
        });
    };
    HymnalRoutes.prototype.searchPage = function (req, res) {
        var _this = this;
        var query = (req.params.query || '').trim();
        if (this.validSongNumber(Number(query))) {
            res.redirect('/' + this.basePath + '/chant/' + query);
            return;
        }
        return this.DB.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .select('title number verses -_id')
            .skip(0)
            .limit(10)
            .exec().then(function (docs) {
            var page = {
                query: query,
                songs: (docs || []).map(function (item) {
                    item.summary = item.verses[0].join(' ');
                    return item;
                }),
                pageContent: 'results',
            };
            res.cache(_this.basePath + '/layout', page);
        });
    };
    ;
    HymnalRoutes.prototype.homePage = function (req, res) {
        var page = {
            pageContent: 'home',
        };
        res.serve(this.basePath + '/layout', page);
    };
    ;
    HymnalRoutes.prototype.get = function () {
        this.router.get('/presentation/:number', this.slidesPage.bind(this));
        this.router.get('/presentation', this.slidesPage.bind(this));
        this.router.get('/chant/:number', this.songPage.bind(this));
        this.router.get('/chant', this.songPage.bind(this));
        this.router.get('/song/:number', this.songPage.bind(this));
        this.router.get('/song', this.songPage.bind(this));
        this.router.get('/az/:index', this.tocAlphabeticPage.bind(this));
        this.router.get('/az', this.tocAlphabeticPage.bind(this));
        this.router.get('/numero/:index', this.tocNumericPage.bind(this));
        this.router.get('/numero', this.tocNumericPage.bind(this));
        this.router.get('/category/:category', this.categoryPage.bind(this));
        this.router.get('/category', this.categoryPage.bind(this));
        this.router.get('/search/:query', this.searchPage.bind(this));
        this.router.get('/accueil', this.homePage.bind(this));
        this.router.get('/', this.homePage.bind(this));
        return _super.prototype.get.call(this);
    };
    return HymnalRoutes;
}(router_1.BasicRoutes));
exports.HymnalRoutes = HymnalRoutes;
