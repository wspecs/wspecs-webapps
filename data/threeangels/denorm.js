const BookInfo= require('./../../models/threeangels/book-info');
const BookParagraph = require('./../../models/threeangels/book-paragraph');
const args = require('./../../lib/args');

const fs = require('fs');
const json = JSON.parse(fs.readFileSync('data/threeangels/json/' + args.options.book + '.json'));

BookInfo.update({code: json.info.code}, json.info, {upsert: true}, err => {
  if (err) {
    console.log(err);
  } else {
    if (!args.options.info_only) {
      for (const par of json.paragraphs) {
        BookParagraph.update({code: par.code, k: par.k}, par, {upsert: true}, err => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Inserted ${par.code} paragraph ${par.k}`);
          }
        })
      }
    }
    console.log(`Upserted book ${json.info.code}`);
  }
});
