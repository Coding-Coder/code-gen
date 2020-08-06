# changelog

## 1.2.0

- 支持PostgreSQL

## 1.1.4

- 修改mysql驱动为com.mysql.cj.jdbc.Driver
- 修改mysql jdbc连接串,增加serverTimezone=Asia/Shanghai
- 修复数据库名(dbName)包含'-'的异常.如(platform-cloud)

## 1.1.3

- 新增${context.dbName}数据库名称变量

## 1.1.2

- 调整生成结果树状展示

## 1.1.1

- 优化下划线字段转驼峰字段算法 [I1PDHW](https://gitee.com/durcframework/code-gen/issues/I1PDHW)

## 1.1.0

- 结果页面可下载代码
- 优化Connection连接数
- 修复测试连接问题

## 1.0.2

- 优化交互

## 1.0.1

- 新增复制代码功能

## 1.0.0

- 重构前端页面，采用elementUI
- 优化了生成步骤
- 优化了模板编辑页面
