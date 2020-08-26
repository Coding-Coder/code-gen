#!/bin/sh

# 关闭服务

pid=$(ps -ef | grep gen.jar | grep -v grep | awk '{print $2}')
if [ -n "$pid" ]; then
  echo "stop gen.jar, pid:" "$pid"
  kill -9 "$pid"
fi
