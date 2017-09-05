"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var en_bcv_parser_1 = require("bible-passage-reference-parser/js/en_bcv_parser");
/**
 * @param {string} text Possible bible reference.
 * @param {string} osis Bible reference in osis format.
 * @return {string} html reference for th text specified.
 */
function getReplacement(text, osis) {
    if (text.trim().indexOf(' ') === -1) {
        return text;
    }
    var verses = osis.split('-');
    // Transform Exodus 34:6-Exodus 34:7 to Exodus 34:6-7
    if (verses.length > 1) {
        var verseIndex = verses[verses.length - 1].lastIndexOf('.');
        if (verseIndex !== -1) {
            osis = verses[0] + '-' + verses[verses.length - 1].substring(verseIndex + 1);
        }
    }
    var href = "https://www.bible.com/bible/1/" + osis + ".kjv";
    return "<a class=\"bible\" href=\"" + href + "\" title=\"" + osis + "\">" + text + "</a>";
}
/**
 * @example
 * @param {content} content Text to parse
 * @param {string} original Potential bible verse.
 * @param {string=} context Optional contextual text for a verse.
 * @return {string} HTML text with link to all bible verses.
 */
function updateContent(content, original, context) {
    if (context === void 0) { context = ''; }
    var osises = (new en_bcv_parser_1.bcv_parser).parse(original).osis().split(',');
    if (context && !osises.join().trim()) {
        osises = (new en_bcv_parser_1.bcv_parser).parse_with_context(original, context).osis().split(',');
    }
    var parts = original.split(';');
    if (parts.length === osises.length) {
        for (var index = 0; index < osises.length; index++) {
            if (osises[index]) {
                content = content.replace(parts[index], getReplacement(parts[index], osises[index]));
            }
        }
    }
    else if (parts.length > 1) {
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            content = updateContent(content, part, parts[0]);
        }
    }
    else if (parts.length === 1) {
        var transformParts = parts.join().split(',').map(function (item, idx) {
            if (idx > 0) {
                item = ',' + item;
            }
            return item;
        });
        for (var _a = 0, transformParts_1 = transformParts; _a < transformParts_1.length; _a++) {
            var part = transformParts_1[_a];
            content = updateContent(content, part, parts[0]);
        }
    }
    return content;
}
/**
 * @param {string} content Text to parse.
 * @return {string} HTML text with link to all bible verses.
 */
function highlightReferences(content) {
    var parse = (new en_bcv_parser_1.bcv_parser).parse(content);
    for (var index = parse.entities.length - 1; index >= 0; index--) {
        var entity = parse.entities[index];
        var indices = entity.absolute_indices;
        var original = content.substring(indices[0], indices[1]);
        if (entity.type === 'b' || entity.type === 'bc') {
            continue;
        }
        content = updateContent(content, original);
    }
    return content;
}
exports.highlightReferences = highlightReferences;
