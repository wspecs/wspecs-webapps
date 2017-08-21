/**
 * Models for songs in the hymns et lounges.
 */
const mongoose = require('./../../lib/database').mongoose,
      Schema = mongoose.Schema;

const MODEL_NAME = 'BOOKPARAGRAPH';

let schema = Schema({
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

schema.index({text: 'text'});

module.exports = mongoose.model(MODEL_NAME, schema);
