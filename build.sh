#!/bin/sh

echo "开始构建..."

cd front

npm run build:prod
echo "复制dist文件内容到gen/src/main/resources/public"
rm -rf ../gen/src/main/resources/public/*
cp -r dist/* ../gen/src/main/resources/public

cd ..

mvn clean package

echo "复制文件到bin目录"

dist_mkdir="bin"

if [ ! -d "$dist_mkdir" ]; then
  mkdir $dist_mkdir
fi

rm -rf build/*

cp -r gen/target/*.jar $dist_mkdir
cp -r script/* $dist_mkdir
cp -r db/gen.db $dist_mkdir/gen.db

echo "构建完毕"