"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./../../lib/database");
var MODEL_NAME = 'BOOKINFO';
var schema = new database_1.mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
    },
    year: {
        type: String,
    },
    publisher: {
        type: String,
    },
    chapters: {
        type: [{
                title: String,
                number: String,
            }],
        required: true,
    },
    summary: {
        preview: [String],
        tdlr: String,
        summary: String,
        tags: [String],
        color: String,
    }
});
exports.BookInfo = database_1.mongoose.model(MODEL_NAME, schema);
