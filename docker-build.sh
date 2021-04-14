#!/bin/sh

git pull

sh build.sh

# 打包并运行docker镜像

# 创建镜像
docker build -t tanghc2020/gen .
