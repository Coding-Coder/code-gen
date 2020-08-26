#!/bin/sh

rm -rf dist/*
npm run build:prod
echo "复制dist文件内容到gen/src/main/resources/public"
rm -rf ../gen/src/main/resources/public/*
cp -r dist/* ../gen/src/main/resources/public
