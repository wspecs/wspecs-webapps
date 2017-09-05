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
var config_1 = require("./config");
var args = require("./args");
config_1.config.isProd = (args.get('instance') == 'prod');
config_1.config.isDev = !config_1.config.isProd;
if (config_1.config.isProd) {
    config_1.config.base = "" + config_1.config.prod.url + config_1.config.path + "/";
}
else {
    config_1.config.port += 1;
    config_1.config.base = config_1.config.dev.url + ":" + config_1.config.port + config_1.config.path + "/";
}
args.reload();
exports.serverConfig = __assign({}, config_1.config, args.options);
