#!/bin/sh

server_dest="../gen/src/main/resources/public"

rm -rf dist/*
npm run build:prod
echo "复制dist文件内容到gen/src/main/resources/public"
rm -rf $server_dest
mkdir -p $server_dest
cp -r dist/* $server_dest
