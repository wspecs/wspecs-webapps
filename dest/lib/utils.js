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
var constants_1 = require("./constants");
/**
 * Show partial results and give indexes for jump to next results.
 * @param {Array<Object>} arr - list to paginate
 * @param {number} page - page number to show
 * @param {number} slice - maximum of number per page
 * @param {boolean} [reverse=true] - True to show latest item first
 * @param {boolean} [hidePages=false] - True to show inner page numbers
 * @return {{
 *  data: Arrray<Object>,
 *  start: number,
 *  end: number,
 *  page: number,
 *  prev: number,
 *  next: number,
 *  last: number,
 *  pages: Array<number>
 * }} - paginatino info
 */
function paginate(arr, page, slice, reverse, hidePages) {
    if (page === void 0) { page = constants_1.PAGE; }
    if (slice === void 0) { slice = constants_1.SLICE; }
    if (reverse === void 0) { reverse = true; }
    if (hidePages === void 0) { hidePages = false; }
    if (page < 1)
        page = 1;
    if (slice < -1)
        slice = 10;
    if (slice > 25) {
        slice = 25;
    }
    if (arr) {
        if (reverse === true)
            arr = arr.reverse();
    }
    else
        arr = [];
    var count = arr.length;
    var start = 1 + ((page - 1) * slice);
    var end = slice + ((page - 1) * slice);
    arr = arr.slice(start - 1, end);
    if (count < end) {
        arr = arr.slice(0, count % slice);
    }
    var prev = page > 1 ? (page - 1) : false;
    var next = count > end ? (page + 1) : false;
    start = count > 0 ? start : 0;
    end = count > end ? end : count;
    var result = {
        data: arr,
        start: start,
        end: end,
        next: next,
        prev: prev,
        count: count
    };
    if (hidePages) {
        return __assign({}, result, { slice: slice });
    }
    return __assign({}, result, { page: page, last: Math.ceil(count / slice), pages: getPages(page, slice, count, 7) });
}
exports.paginate = paginate;
;
/**
 * Pagination helper.
 * @param {number} current - index for the current page
 * @param {number} slice - how many item per page
 * @param {number} total - number of item in the list to paginate
 * @param {number} size - len of the array
 * @return {Array<string>} page indexes to jump to.
 */
function getPages(current, slice, total, size) {
    size--;
    var max = Math.ceil(total / slice);
    if (max < size)
        size = max;
    var end = current + Math.ceil(size / 2);
    var start = end - size;
    if (start < 1) {
        end = end - start;
        start = 1;
    }
    if (end > max)
        end = max;
    if (start < 1)
        start = 1;
    var result = [];
    for (var i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}
/**
 * Helper function slice array into multiple chunk.
 * @param {Array<T>} Array to partition
 * @param {number} chunkSize how many arrays to produce
 * @return {Array<Array<T>}
 */
function chunk(arr, chunkSize) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
        result.push(arr.slice(i, i + chunkSize));
    return result;
}
exports.chunk = chunk;
function resolve(err, res, body) {
    if (body === void 0) { body = {}; }
    if (err) {
        res.statusCode = 500;
        res.send({ success: false });
    }
    else {
        res.send(__assign({}, body, { success: true }));
    }
}
exports.resolve = resolve;
;
