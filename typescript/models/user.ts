import {mongoose} from './../lib/database';
import * as randomstring from 'randomstring';
import * as passwordHash from 'password-hash';

const MODEL_NAME = 'User';
let schema = new mongoose.Schema({
  first: {type: String, required: true,},
  last: {type: String, required: true,},
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {type: String, required: true},
  id: {
    type: String,
    required: true,
    unique: true,
    default: randomstring.generate(24),
  },
});

schema.pre('save', function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // generate a salt
  this.password = passwordHash.generate(this.password);
  next();
});

schema.methods.comparePassword = function(password) {
  return passwordHash.verify(password, this.password);
};

export const User = mongoose.model(MODEL_NAME, schema);
