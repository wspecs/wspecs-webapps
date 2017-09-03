/**
 * Models for songs in the hymns et lounges.
 */
const mongoose = require('./../../lib/database').mongoose,
      Schema = mongoose.Schema;

const MODEL_NAME = 'KJV';

let schema = Schema({
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

schema.index(
    {text: 'text'},
    {"weights": { text: 1}}
)

module.exports = mongoose.model(MODEL_NAME, schema);
