#!/bin/bash

# 打包并运行docker镜像

# 打包
mvn clean package

# 创建镜像
docker build -t gen .

# 获取镜像id
image_id=`docker images gen --format "{{.ID}}" | awk '{print $1}'`

echo "运行gen镜像，镜像ID：$image_id"

docker run --name gen -p 6969:6969 -d $image_id

echo "启动完毕，访问:http://ip:6969"