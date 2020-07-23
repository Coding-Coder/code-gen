#!/bin/sh

echo "开始构建..."

mvn clean package

echo "复制文件到build目录"

cp -r generator/target/*.jar build
cp -r script/* build
cp -r db/generator.db build/generator.db

echo "构建完毕"