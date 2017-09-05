"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./log");
var fs_1 = require("fs");
var configPath = __dirname + '/../../config.json';
var authPath = (process.env.HOME || process.env.USERPROFILE) + '/.wsconfig';
function getConfig() {
    var config;
    try {
        // Attemp to read localconfig first
        config = JSON.parse(fs_1.readFileSync('config.json', 'utf8'));
    }
    catch (e) {
        // Fallback to ws-lib default config
        config = JSON.parse(fs_1.readFileSync(configPath, 'utf8'));
    }
    try {
        // Attempts to read config file.
        var content = fs_1.readFileSync(config.wsConfigPath || authPath, 'utf8');
        content.split('\n').forEach(function (line) {
            var args = line.split(' ');
            if (args.length === 2) {
                config[args[0].replace(':', '')] = args[1];
            }
        });
        config.col_auth = config['api_scope_' + config.col];
    }
    catch (e) {
        log_1.warn('Could not read wsconfig');
    }
    config.version = (new Date()).getTime();
    return config;
}
exports.getConfig = getConfig;
exports.config = getConfig();
