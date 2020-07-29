#!/bin/sh

# 版本号
version="gen"
# 构建目录
dist_dir="dist"
# 输出目录
target_dir="$dist_dir/$version"

echo "开始构建..."

cd front

rm -rf dist/*
npm run build:prod
echo "复制dist文件内容到gen/src/main/resources/public"
rm -rf ../gen/src/main/resources/public/*
cp -r dist/* ../gen/src/main/resources/public

cd ..


mvn clean package

echo "复制文件到$target_dir"

rm -rf $dist_dir
mkdir -p $target_dir

cp -r gen/target/*.jar $target_dir/gen.jar
cp -r script/* $target_dir
cp -r db/gen.db $target_dir/gen.db

echo "打成zip包"

cd $dist_dir
zip -r -q "$version.zip" $version

echo "构建完毕"