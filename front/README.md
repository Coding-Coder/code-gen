# 前端vue实现

  前提：先安装好npm，[npm安装教程](https://blog.csdn.net/zhangwenwu2/article/details/52778521)

1. 启动服务端程序
2. `cd front`
3. 执行`npm install --registry=https://registry.npm.taobao.org`，（下载依赖，执行一次即可）
4. 执行`npm run dev`，访问`http://localhost:9528/`，（后续每次启动都需要执行）


- 修改端口号：打开`vue.config.js`，找到`port`属性

## 打包放入到服务端步骤

- 自动构建

执行`npm run build:prod`
