"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./../../lib/database");
var MODEL_NAME = 'SDAH';
var schema = new database_1.mongoose.Schema({
    number: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    azIndex: {
        type: String,
        required: true,
    },
    parts: {
        type: [String],
        required: true,
    },
    slides: {
        type: [String],
        required: true,
    },
    verses: {
        type: Array,
        required: true,
    },
});
schema.index({ title: 'text', number: 'text', verses: 'text', category: 'text', }, { "weights": { title: 3, number: 3, category: 2, verses: 1, } });
exports.SDAH = database_1.mongoose.model(MODEL_NAME, schema);
