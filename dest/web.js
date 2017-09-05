"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var routes_1 = require("./routes");
var log_1 = require("./lib/log");
var rest_config_1 = require("./lib/rest-config");
var server_config_1 = require("./lib/server-config");
/**
 * The server.
 *
 * @class Server
 */
var Server = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    function Server() {
        //create expressjs application
        this.app = express();
        rest_config_1.configureRest(this.app, express);
        routes_1.routes(this.app);
    }
    Server.prototype.start = function () {
        this.app.listen(server_config_1.serverConfig.port, function () {
            log_1.info('port: %s', server_config_1.serverConfig.port);
            log_1.info('url: %s', server_config_1.serverConfig.base);
        });
    };
    return Server;
}());
exports.Server = Server;
