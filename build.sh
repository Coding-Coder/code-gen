#!/bin/sh

# 版本号
app_name="gen"
# 构建目录
dist_dir="dist"
# 输出目录
target_dir="$dist_dir/$app_name"

rm -rf $dist_dir

echo "开始构建..."

cd front

npm install --unsafe-perm

npm run build:prod --unsafe-perm

cd ..

mvn clean package

echo "复制文件到$target_dir"

cp -r gen/target/*.jar $target_dir/gen.jar
cp -r script/* $target_dir

echo "打成zip包"

cd $dist_dir
zip -r -q "$app_name.zip" $app_name

echo "构建完毕"