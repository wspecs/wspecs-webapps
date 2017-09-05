"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var path_1 = require("path");
function configureRest(app, express) {
    // session limit in seconds
    app.set('sessionAge', app.get('sessionAge') || (2 * 60 * 60));
    app.set('secret', app.get('secret') || 'secret');
    app.locals.cookieOptions = {
        path: app.get('path'),
        maxAge: 60 * 1000 * 1000,
        httpOnly: false,
    };
    /**
     * Set the public path fo the application
     */
    app.use(express.static(path_1.join(__dirname, '/../../public'), { maxAge: 31557600000 }));
    /**
     * Define default headers for the application.
     */
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
        res.setHeader('Date', (new Date()).toString());
        next();
    });
    /**
     * Initialize body parser for POST methods
     */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    /**
     * Add parser to get/set cookies.
     */
    app.use(cookieParser());
    /**
     * Set the view path for ejs render
     */
    app.set('view engine', 'ejs');
    app.set('views', 'templates');
}
exports.configureRest = configureRest;
;
