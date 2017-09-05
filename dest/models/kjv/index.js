"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./../../lib/database");
var MODEL_NAME = 'KJV';
var schema = new database_1.mongoose.Schema({
    book: {
        type: Number,
        required: true,
    },
    chapter: {
        type: Number,
        required: true,
    },
    verse: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});
schema.index({ text: 'text' }, { "weights": { text: 1 } });
exports.KJV = database_1.mongoose.model(MODEL_NAME, schema);
