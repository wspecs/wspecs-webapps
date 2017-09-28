#!/bin/zsh

if [[ $# -eq 0 ]] ; then
    echo 'Missing project name'
    exit 1
fi

if [ ! -d "typescript/routes/$1" ]; then
  echo "Directory routes/$1 does not exist."
  exit 1
fi

PUBLIC_DIR="/var/www/PUBLIC/$1"

header() {
  echo ''
  echo $1
  echo '*****************************'
}

duplicate() {
  echo "Duplicating $PUBLIC_DIR/$1"
  rm -rf $PUBLIC_DIR/$1
  cp -r $1 $PUBLIC_DIR/$2
}

partial_duplicate() {
  rm -rf $PUBLIC_DIR/$1
  mkdir -p $PUBLIC_DIR/$1
  cp -r $1/$2/** $PUBLIC_DIR/$1
}

mkdir -p $PUBLIC_DIR
for name in config.json package.json index.js tsconfig.json scripts .gitignore
do
  duplicate $name
done

for name in public templates data
do
  echo "Copying partial folder $name"
  partial_duplicate $name $1
done

header 'Typescript'
rm -rf $PUBLIC_DIR/typescript
for name in models routes
do
  echo "Copying partial folder typescript/$name"
  mkdir -p $PUBLIC_DIR/typescript/$name
  cp -r typescript/$name/*.* $PUBLIC_DIR/typescript/$name
  cp -r typescript/$name/$1/** $PUBLIC_DIR/typescript/$name

  if ls $PUBLIC_DIR/typescript/$name/*.ts 1> /dev/null 2>&1; then
    echo "Generating CSS bundle file"
    for entry in `ls $PUBLIC_DIR/typescript/$name/*.ts`; do
      echo "Checking import for $entry"
      entry=$(echo ${entry##*/} | sed s/.ts//g)
      sed -i "s|\.\./$entry|$entry|g" $PUBLIC_DIR/**/*.ts
    done
  fi
done

echo 'Copying library files.'
cp -r typescript/lib $PUBLIC_DIR/typescript/lib
cp -r typescript/web.ts $PUBLIC_DIR/typescript/

header 'String replacements'
for name in models lib; do
  sed -i "s|\.\./../$name|../$name|g" $PUBLIC_DIR/**/*.ts
  sed -i "s|$name/$1|$name|g" $PUBLIC_DIR/**/*.ts
done;
sed -i "s|basePath = '$1'|basePath = ''|g" $PUBLIC_DIR/**/*.ts


sed -i "s|data/$1|data|g" $PUBLIC_DIR/data/*.js
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
header 'Done'

TIMESTAMP=$(date +%s)

updateGit() {
  cd $1
  git add -A
  git commit -am "auto update $TIMESTAMP"
  git status
  git push
}

updateGit ./
updateGit $PUBLIC_DIR

exit 0
