"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var args_1 = require("./args");
var chalk = require("chalk");
var INFO = chalk.white;
var DATA = chalk.cyan;
var ERROR = chalk.magenta;
var WARN = chalk.yellow;
/**
 * Generic function to write to the console
 * @param {Array<Object>} texts - argument for logging
 * @param {!Function} writer - chalk writer
 * @param {string} context - log category (e.g INFO, ERROR)
 * @param {string} line - additional text to log.
 * @return {void}
 */
function write(texts, writer, context, line) {
    if (typeof texts[0] === 'object' || Array.isArray(texts[0])) {
        data(texts[0]);
        return;
    }
    line = line || writer(texts[0]);
    context = "[" + (new Date()).toString() + "] " + (context || '');
    var index = 1;
    for (; index < texts.length; index++) {
        if (line.indexOf('%s') === -1) {
            break;
        }
        line = line.replace('%s', writer.bold(texts[index]));
    }
    console.log(context + writer(line));
    for (; index < texts.length; index++) {
        console.log(context + writer(texts[index]));
    }
}
exports.write = write;
/**
 * Handles all default logs.
 * @return {void}
 */
function print() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    write(args, INFO);
}
exports.print = print;
/**
 * Prepend INFO to logs
 * @return {void}
 */
function info() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    write(args, INFO, chalk.green('INFO: '));
}
exports.info = info;
;
/**
 * Handles all warning logs.
 */
function warn() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    write(args, WARN, chalk.yellow('WARNING: '));
}
exports.warn = warn;
;
function data() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    for (var index = 0; index < arguments.length; index++) {
        console.log(DATA(JSON.stringify(arguments[index], null, 2)));
    }
}
exports.data = data;
function error() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    write(arguments, ERROR, chalk.red('ERROR: '));
}
exports.error = error;
;
/**
 * Handles all debugging logs--only print in development mode.
 */
function debug() {
    if (args_1.debugMode()) {
        write(arguments, INFO, chalk.magenta('DEBUG: '));
    }
}
exports.debug = debug;
;
