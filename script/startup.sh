#!/bin/sh

# 先关闭服务
sh shutdown.sh
# --server.port：启动端口
nohup java -jar -Xms128m -Xmx128m gen.jar --server.port=6969 &
