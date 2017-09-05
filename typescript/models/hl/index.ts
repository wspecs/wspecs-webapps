import {Document} from 'mongoose';
import {mongoose} from './../../lib/database';

export interface IHL extends Document {
  number: number;
  title: string;
  category: string;
  azIndex: string;
  parts: string[];
  verses: any[];
  slides: string[];
  summary?: string;
}
const MODEL_NAME = 'HL';

let schema = new mongoose.Schema({
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

export const HL = mongoose.model<IHL>(MODEL_NAME, schema);
