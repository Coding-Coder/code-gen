#!/bin/sh

echo "开始构建..."

mvn clean package

echo "复制文件到build目录"

build_dir="build"

if [ ! -d "$build_dir" ]; then
  mkdir $build_dir
fi

cp -r gen/target/*.jar build
cp -r script/* build
cp -r db/gen.db build/gen.db

echo "构建完毕"