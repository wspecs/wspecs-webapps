#!/bin/zsh

if [[ $# -eq 0 ]] ; then
    echo 'Missing project name'
    exit 1
fi

if [ ! -d "routes/$1" ]; then
  echo "Directory routes/$1 does not exist."
fi

PUBLIC_DIR="/var/www/PUBLIC/$1"

duplicate() {
  echo "Duplicating $PUBLIC_DIR/$1"
  rm -rf $PUBLIC_DIR/$1
  cp -r $1 $PUBLIC_DIR/$2
}

partial_duplicate() {
  rm -rf $PUBLIC_DIR/$1
  cp -r $1/$2 $PUBLIC_DIR/$1
}

mkdir -p $PUBLIC_DIR
for name in config.json lib package.json web.js
do
  duplicate $name
done

for name in models public templates routes data
do
  partial_duplicate $name $1
done

sed -i "s|exports = router|exports = (a) => a.use('', router)|g" $PUBLIC_DIR/routes/index.js
sed -i 's|../../lib|../lib|g' $PUBLIC_DIR/**/*.js
sed -i "s|../../models/$1|../models|g" $PUBLIC_DIR/**/*.js
sed -i "s|/$1||g" $PUBLIC_DIR/routes/*.js
sed -i "s|$1/||g" $PUBLIC_DIR/routes/*.js

sed -i "s|data/$1|data|g" $PUBLIC_DIR/data/*.js
#
# Fix text for export. Remove subpath
sed -i "s|<%- base %>$1|<%- base %>|g" $PUBLIC_DIR/templates/*.ejs
sed -i "s|<%- base %>$1|<%- base %>|g" $PUBLIC_DIR/templates/**/*.ejs
sed -i "s|src=\"$1|src=\"|g" $PUBLIC_DIR/templates/*.ejs
sed -i "s|src=\"$1|src=\"|g" $PUBLIC_DIR/templates/**/*.ejs
sed -i "s|href=\"$1|href=\"|g" $PUBLIC_DIR/templates/*.ejs
sed -i "s|href=\"$1|href=\"|g" $PUBLIC_DIR/templates/**/*.ejs
sed -i "s|href=\"/$1|href=\"|g" $PUBLIC_DIR/templates/**/*.ejs
sed -i "s|href=\"/$1|href=\"|g" $PUBLIC_DIR/templates/**/*.ejs
sed -i "s|content=\"/$1|content=\"|g" $PUBLIC_DIR/templates/*.ejs
sed -i "s|content=\"/$1|content=\"|g" $PUBLIC_DIR/templates/**/*.ejs

echo 'module.exports = {}' > $PUBLIC_DIR/models/user.js
