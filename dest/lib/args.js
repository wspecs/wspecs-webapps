"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @module
*/
var minimist = require("minimist");
exports.options = minimist(process.argv.slice(2));
exports.command = process.argv[2];
exports.operation = process.argv[3];
/**
 * Get command line flag value
 * @example
 * // return sample.md
 * // > nodemodule.js --filename sample.md
 * // OR
 * // > nodemodule.js -f sample.md
 * get('filename', 'f');
 * @param {string} longName - full name for the flag
 * @param {string} shortName - short name for the flga
 * @return {string} flag value
 */
function get(longName, shortName) {
    return exports.options[shortName] || exports.options[longName];
}
exports.get = get;
/**
 * Check if flag is specify
 * @example
 * // return true
 * // > nodemodule.js --filename sample.md -d ./
 * hasKey('filename');
 * // return false
 * hasKey('directory');
 * @param {string} key - flag name
 * @return {boolean} - true when flag is found.
 */
function hasKey(key) {
    return get(key) !== undefined;
}
exports.hasKey = hasKey;
/**
 * Get value for flags directory (or -d).
 * @return {string} - value for directory flag
 */
function getDirectory() {
    return get('directory', 'd') || '.';
}
exports.getDirectory = getDirectory;
/**
 * Check if module is running in debug mode
 * @return {boolean} true when module is running in debug mode
 */
function debugMode() {
    var devMode = ['init', 'dev', 'debug', 'map', 'data'].some(function (x) {
        return process.argv[2] === x;
    });
    return devMode || hasKey('debug');
}
exports.debugMode = debugMode;
/**
 * Set defaul flag value
 * @param {string} key - flag to set
 * @param {boolean|string|undefined} [value=true] - flag's value
 * @return {void}
 */
function setDefault(key, value) {
    value = value || value === undefined;
    var flag = "--" + key + "=" + value;
    if (typeof value === 'boolean') {
        flag = "--" + (value ? '' : 'no') + key;
    }
    process.argv[process.argv.length] = flag;
    reload();
}
exports.setDefault = setDefault;
/**
 * Reload all the args.
 * @return {void}
 */
function reload() {
    var options = minimist(process.argv.slice(2));
    module.exports.options = options;
    module.exports.command = process.argv[2];
    module.exports.operation = process.argv[3];
    for (var key in options) {
        if (options[key] === true && key.indexOf('no') === 0) {
            delete options[key];
            options[key.substr(2)] = false;
        }
    }
}
exports.reload = reload;
