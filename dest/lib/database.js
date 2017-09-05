"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mg = require("mongoose");
var config_1 = require("./config");
var database = mg;
database.Promise = global.Promise;
/**
 * Local constiables.
 */
var host = "127.0.0.1:27017/" + config_1.config.col;
var url = "mongodb://" + host;
if (config_1.config.col_auth) {
    url = "mongodb://" + config_1.config.col + ":" + config_1.config.col_auth + "@" + host;
}
if (config_1.config.col) {
    database.connect(url);
}
exports.mongoose = mg;
