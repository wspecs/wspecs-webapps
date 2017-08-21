#!/bin/zsh

PROD_DIR="/var/www/PROD/webapps"

if [[ $# -eq 0 ]] ; then
    echo 'Missing project name'
    exit 1
fi

if [ ! -d "routes/$1" ]; then
  echo "Directory routes/$1 does not exist."
fi

duplicate() {
  echo "Duplicating $PROD_DIR/$1"
  rm -rf $PROD_DIR/$1
  cp -r $1 $PROD_DIR/$2
}

partial_duplicate() {
  mkdir -p $PROD_DIR/$1/$2
  duplicate $1/$2 $1/
}

generate_library() {
  if [ ! -d "$PROD_DIR/$1" ]; then
    duplicate $1 $1
  fi
}


mkdir -p $PROD_DIR
for name in config.json lib node_modules package.json README.md web.js
do
  duplicate $name
done

for name in models public templates routes
do
  partial_duplicate $name $1
  for f in $name/*
  do
    [ -d "$f" ] && generate_library $f
  done
done

cp routes/index.js $PROD_DIR/routes
rm -rf $PROD_DIR/data/cache/$1
