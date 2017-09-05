"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var home = require("./home");
var threeangels = require("./threeangels");
var sdah = require("./sdah");
var kjv = require("./kjv");
var hl = require("./hl");
function routes(app) {
    app.use('/hl', hl);
    app.use('/kjv', kjv);
    app.use('/sdah', sdah);
    app.use('/threeangels', threeangels);
    app.use('/', home);
}
exports.routes = routes;
