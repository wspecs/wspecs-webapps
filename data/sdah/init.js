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

let count = 0;
for (let song of hymns) {
  song.azIndex = removeAccents(song.title.replace(/\W/g, '')[0].toUpperCase());
  song.category = getCategory(song.number);
  song.verses = [];
  for (const key of song.parts) {
    song.verses.push(song[key]);
  }
  Hymn.update({number: song.number}, song, {upsert: true}).exec()
    .then(() => {
      console.log(`Upserted song ${song.number}`)
      if (++count === hymns.length) process.exit();
    })
    .catch(err => console.log(err));
}
