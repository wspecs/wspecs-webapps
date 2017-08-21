root_dir=./
lib_path=${root_dir}lib
wslib_path=/var/www/LIB/lib

echo "Importing wslib files"
for i in $(cat ${root_dir}.wslib); do
  echo "Copying wslib file ${i}.js"
  cp ${wslib_path}/${i}.js ${lib_path}/${i}.js
done
