"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./../../lib/database");
var MODEL_NAME = 'BOOKPARAGRAPH';
var schema = new database_1.mongoose.Schema({
    chapter: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    ref: {
        type: String,
    },
    code: {
        type: String,
        required: true,
    },
    k: {
        type: Number,
        required: true,
    },
});
schema.index({ text: 'text' });
exports.BookParagraph = database_1.mongoose.model(MODEL_NAME, schema);
