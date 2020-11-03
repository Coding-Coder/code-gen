# changelog

## 1.3.3

- 修复生成结果无法过滤文件错误

## 1.3.2

- 优化启动脚本

## 1.3.1

- 修复筛选表格后全选选中所有数据BUG

## 1.3.0

- 支持C#变量，可生成C#文件
- 支持表过滤
- 支持数据源复制

## 1.2.2

- 优化模板编辑界面

## 1.2.1

- 修复保存模板时的错误
- 模板编辑器新增行号
- 新增admin-vue-CRUD模板 [doc](https://gitee.com/durcframework/code-gen/wikis/pages?sort_id=2688205&doc_id=27724)

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
