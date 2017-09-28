#!/bin/zsh

echo "JOB PROD BUNDLE"

PROD_DIR="/var/www/PROD/webapps"

if [[ $# -eq 0 ]]; then
    echo 'Missing project name'
    exit 1
fi

if [ ! -d "typescript/routes/$1" ]; then
  echo "Directory typescript/routes/$1 does not exist."
  exit 1
fi

# =================
# Bundle CSS files
# =================
if ls public/$1/css/*.css 1> /dev/null 2>&1; then
  echo "Generating CSS bundle file"
  for entry in `ls public/$1/css/*.css | grep -v min.css`; do
    echo "Minifying $entry"
    new_name=$(echo $entry | sed 's/\.css/\.min.css/g')
    uglifycss $entry > $new_name
  done
  rm -rf public/$1/css/bundle.min.css
  uglifycss public/$1/css/*.css > public/$1/css/bundle.min.css
fi
# =================
# Bundle JS files
# =================
if ls public/$1/js/*.js 1> /dev/null 2>&1; then
  echo "Generating JS bundle file"

  for entry in `ls public/$1/js/*.js | grep -v min.js`; do
    echo "Minifying $entry"
    new_name=$(echo $entry | sed 's/\.js/\.min.js/g')
    uglifyjs -m -- $entry > $new_name
  done

  rm -rf public/$1/js/bundle.min.js
  uglifyjs -m -- public/$1/js/*.js > public/$1/js/bundle.min.js
fi
