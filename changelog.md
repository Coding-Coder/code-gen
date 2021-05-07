# changelog

## 1.4.15

- 修复PostgreSQL的numeric字段映射为题

## 1.4.14

- 修复`不支持“variant”数据类型`错误 [#I3CSLO](https://gitee.com/durcframework/code-gen/issues/I3CSLO)
- 修复数据库名字带点.生成错误问题 [#I2EBRL](https://gitee.com/durcframework/code-gen/issues/I2EBRL)

## 1.4.13

- 优化类型转换

## 1.4.12

- PostgreSQL数据源可指定schema（模板中可使用：`${table.schema}`）

## 1.4.11

- 优化模板管理交互

## 1.4.10

- 修复PostgreSQL数值类型映射问题

## 1.4.9

- 新增`${context.delPrefix}变量（删除前缀）`

## 1.4.8

- 支持PostgreSQL的jsonb类型

## 1.4.7

- 修复PostgreSQL生成多个相同字段问题
- 优化PostgreSQL精度类型
- 优化Mysql表查询 [#I3C57N](https://gitee.com/durcframework/code-gen/issues/I3C57N)
- 修复可以看到删除掉的模板 [#I3AX6E](https://gitee.com/durcframework/code-gen/issues/I3AX6E)


## 1.4.6

- 模板新增时间变量

```
${context.datetime}：日期时间，年月日时分秒
${context.date}：日期，年月日
${context.time}：时间，时分秒
```

## 1.4.5

- 可以格式化xml代码（application.properties中设置`gen.format-xml=true`）

## 1.4.4

- jtds驱动替换成sqljdbc4

## 1.4.3

- 【优化】模板编辑页面滚动条下拉可固定右侧变量区域
- 【优化】模板编辑页面保存按钮优化

## 1.4.2

- 修复oracle下同一库不同用户无法显示表问题
- 修复模板名称重复问题
- 数据源下拉框显示用户名
- 修复${table.hasBigDecimalField}不生效问题

## 1.4.1

- 修复数据库字段单个单词全部大写的情况下，实体字段会全部大写
- 修复oracle的number类型映射问题
- 生成代码页面自动选择上一次数据源
- 修复新建模版template_config里group_name会丢失问题

## 1.4.0

- 增加模板组，可以根据需求选择不同的组的模板
- 可以给数据源配置默认的包名、删除前缀、以及模板组
- 表名检索忽略大小写
- 新增生成历史，可以对历史配置再次生成代码

## 1.3.5

- 修复mybatis的jdbcType隐射BIGINT错误
- 修复oracle隐射number类型错误

## 1.3.4

- 修复Mysql表名为关键字生成报错问题
- 优化交互

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
