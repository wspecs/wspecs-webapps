/**
 * Models for songs in the hymns et lounges.
 */
const mongoose = require('./../../lib/database').mongoose,
      Schema = mongoose.Schema;

const MODEL_NAME = 'HL';

let schema = Schema({
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

schema.index(
    {title: 'text', number: 'text', verses: 'text', category: 'text',},
    {"weights": { title: 3, number: 3, category: 2, verses: 1, }}
)

module.exports = mongoose.model(MODEL_NAME, schema);
