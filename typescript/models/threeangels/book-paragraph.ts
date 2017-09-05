import {Document} from 'mongoose'
import {mongoose} from './../../lib/database';

const MODEL_NAME = 'BOOKPARAGRAPH';

export interface IBookParagraph extends Document {
  chapter: string;
  text: string;
  ref: string;
  code: string;
  k: number;
}

let schema = new mongoose.Schema({
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

export const BookParagraph = mongoose.model<IBookParagraph>(MODEL_NAME, schema);
