const Hymn = require('./../../dest/models/sdah').SDAH;

let fs = require('fs');
let hymns = JSON.parse(fs.readFileSync('data/sdah/json/hymns.json'));
let category = JSON.parse(fs.readFileSync('data/sdah/json/category.json'));
let removeAccents = require('remove-accents');

function getCategory(index) {
  const cat = category.find(s => s.start <= index && s.end >= index);
  if (cat) {
    return cat.title + (cat.subTitle ? (' - ' + cat.subTitle) : '');
  }
}

const keys = [];
for (let song of hymns) {
  song.azIndex = removeAccents(song.title.replace(/\W/g, '')[0].toUpperCase());
  song.category = getCategory(song.number);
  song.verses = [];
  for (const key of song.parts) {
    song.verses.push(song[key]);
  }
  Hymn.update({number: song.number}, song, {upsert: true}, err => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(`Upserted song ${song.number}`);
    }
  });
}
