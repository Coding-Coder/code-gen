欢迎使用autoCode
===================
> **更新列表:**

> - 2015-9-25,前端改造,使用FDUI
> - 2015-5-15,新建了一个QQ群:328180219欢迎加群探讨
> - 升级为依赖[durcframework-core](https://git.oschina.net/durcframework/durcframework-core)框架
> - 解决SQLSERVER数据库的schema问题.

项目介绍
-------------------
> **autoCode介绍**

> - autoCode是一个代码生成工具。基于velocity模板引擎，采用SpringMVC + mybatis + jquery easyUI + mysql

> **其特点主要有**

> - 用户登陆 - 每个用户有他自己独立的数据库连接配置和模板配置；
> - 数据源配置 - 可以配置多个数据源,多种数据库类型(目前支持Mysql,MSServer数据库,可以扩展)；
> - 模板配置 - 定义自己的模板,采用velocity模板语法.这样可以根据模板来生成不同的代码,如POJO,Dao,mybatis配置文件等；
> - 操作简单 - 生成代码只需三步:1. 选择数据源;2. 选择表;3. 选择模板。

> **部署程序步骤:**

> 1. Maven构建eclipse工程,运行Maven命令:mvn eclipse:eclipse,完成后导入到eclipse中
> 2. 导入数据库(MYSQL),SQL文件在项目根目录下,名为autoCode.sql,运行里面的内容即可
> 3. 修改数据库连接参数,配置文件在src/main/resources/config.properties
> 4. 启动项目,运行Maven命令:mvn jetty:run
> 5. 浏览器输入http://localhost:8088/autoCode/login.jsp

登录用户名密码均为admin
端口默认用了8088,如需修改,前往pom.xml,找到maven-jetty-plugin插件的port参数.
