const mongoose = require('./../lib/database').mongoose,
      Schema = mongoose.Schema,
      randomstring = require('randomstring'),
      passwordHash = require('password-hash');

const MODEL_NAME = 'User';
let schema = Schema({
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

module.exports = mongoose.model(MODEL_NAME, schema);
