/**
 * Models for songs in the hymns et lounges.
 */
const mongoose = require('./../../lib/database').mongoose,
      Schema = mongoose.Schema;

const MODEL_NAME = 'BOOKINFO';

let schema = Schema({
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
});

module.exports = mongoose.model(MODEL_NAME, schema);
