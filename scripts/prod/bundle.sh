#!/bin/zsh

PROD_DIR="/var/www/PROD/webapps"

if [[ $# -eq 0 ]] ; then
    echo 'Missing project name'
    exit 1
fi

if [ ! -d "routes/$1" ]; then
  echo "Directory routes/$1 does not exist."
  exit 1
fi

# =================
# Bundle CSS files
# =================
if ls public/$1/css/*.css 1> /dev/null 2>&1; then
	echo "Generating CSS bundle file"
	rm -rf public/$1/css/bundle.min.css
	uglifycss public/$1/css/*.css > public/$1/css/bundle.min.css
fi
# =================
# Bundle JS files
# =================
if ls public/$1/js/*.js 1> /dev/null 2>&1; then
	echo "Generating JS bundle file"
	rm -rf public/$1/js/bundle.min.js
	uglifyjs -m -- public/$1/js/*.js > public/$1/js/bundle.min.js
fi
