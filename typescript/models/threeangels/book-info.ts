import {Document} from 'mongoose'
import {mongoose} from './../../lib/database';

const MODEL_NAME = 'BOOKINFO';

export interface IBookInfo extends Document {
  title: string;
  author: string;
  code: string;
  pages: number;
  year: string;
  publisher: string;
  chapters: Array<{
    title: string;
    number: string;
  }>;
  summary: {
    preview: string[];
    tdlr: string;
    summary: string;
    tags: string[];
    color: string;
  };
}

let schema = new mongoose.Schema({
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
    color: String,  // Hex Value
  }
});

export const BookInfo = mongoose.model<IBookInfo>(MODEL_NAME, schema);
