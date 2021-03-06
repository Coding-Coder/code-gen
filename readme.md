<p align="center">
    <!-- http://www.akuziti.com/yw/ 使用This Night 60像素-->
	<img src="https://gitee.com/naraka47/pic-go-store/raw/master/img/20210707104509.png" />
</p>
<h3 align="center">把简单的重复劳动交给code-gen,省下来的时间多陪陪家人</h3>
<hr/>
<p align="center">
    <img src="https://jaywcjlove.github.io/sb/lang/chinese.svg">
    <a target="_blank" href="https://github.com/Coding-Coder">
        <img alt="Author" src="https://img.shields.io/badge/Author-Coding--Coder-orange"/>
    </a>
    <a target="_blank" href="https://github.com/Coding-Coder/code-gen">
        <img alt="Github" src="https://img.shields.io/badge/Github-%E9%A1%B9%E7%9B%AE%E5%9C%B0%E5%9D%80-red" />
    </a>
    <a target="_blank" href="https://github.com/Coding-Coder/code-gen/releases">
        <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/Coding-Coder/code-gen">
    </a>
</p>
<p align="center">
    <a target="_blank" href="https://spring.io/projects/spring-boot">
        <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-2.3.2.RELEASE-blueviolet" />
    </a>
    <a target="_blank" href="https://www.apache.org/licenses/LICENSE-2.0.html">
        <img alt="JDK" src="https://img.shields.io/badge/JDK-1.8%2B-blue" />
    </a>
	<a target="_blank" href="https://github.com/Coding-Coder/code-gen/blob/master/LICENSE">
        <img alt="GitHub license" src="https://img.shields.io/github/license/Coding-Coder/code-gen">
    </a>
    <img src="https://img.shields.io/badge/OS-linux%2C%20win%2C%20mac-blue.svg">
	<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Coding-Coder/code-gen">
    <!-- <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/Coding-Coder/code-gen/total"> -->
</p>

一款代码生成工具，可自定义模板生成不同的代码，支持MySQL、Oracle、SQL Server、PostgreSQL。

- 只需要一个Java8环境，下载后即可运行使用。
- 步骤简单，只需配置一个数据源，然后勾选模板即可生成代码。
- 默认提供了通用的实体类、mybatis接口、mybatis配置文件模板，可以快速开发mybatis应用。

> 用到的技术：SpringBoot + Mybatis + Vue

## 项目说明
- 本项目是基于[tanghc/code-gen](https://gitee.com/durcframework/code-gen) 之上的定制型代码生成器

## 使用步骤
- 前往[发行版页面](https://github.com/Coding-Coder/code-gen/releases) ，下载最新版本zip文件
- 解压zip，如果是Mac/Linux操作系统，运行`startup.sh`文件启动，Windows操作系统运行cmd输入`java -jar gen.jar`启动
- 浏览器访问`http://localhost:6969/`

默认端口是6969，**更改端口号**按如下方式：
- Mac/Linux操作系统：打开`startup.sh`文件，修改`--server.port`参数值
- Windows操作系统：可执行：`java -jar gen.jar --server.port=端口号`

### docker运行
- 方式一：下载公共镜像

`docker pull tanghc2020/gen:latest`

下载完毕后，执行`docker run --name gen -p 6969:6969 -d <镜像ID>`

浏览器访问`http://ip:6969/`

后续更新替换jar文件和view文件夹即可。

- 方式二：本地构建镜像

clone代码，然后执行`docker-build.sh`脚本

执行`docker run --name gen -p 6969:6969 -d <镜像ID>`

## 其它
- [快速搭建SpringBoot+Mybatis应用](https://gitee.com/durcframework/code-gen/wikis/pages?sort_id=2478942&doc_id=27724)
- [更多模板](https://gitee.com/durcframework/code-gen/wikis/pages?sort_id=2979234&doc_id=27724)
- [代码生成器原理](https://gitee.com/durcframework/code-gen/wikis/pages?sort_id=3287812&doc_id=27724)

## 工程说明
- front：前端vue
- gen：后端服务
- db：数据库初始化文件
- script：辅助脚本

## 本地开发

### 前后端分离启动
- 运行`gen`下的`com.gitee.gen.GenApplication`（SpringBoot工程）
- 运行`front`下的前端项目，详见：[readme](./front/README.md)

### SpringBoot整合Vue启动
- `cd front & npm run build:dev`
- 运行`gen`下的`com.gitee.gen.GenApplication`（SpringBoot工程）
- 浏览器访问`http://localhost:6969/`

## 参与贡献

欢迎贡献代码，完善功能，PR请提交到`pr`分支

## 自主构建

> 需要安装Maven3，Java8

- 自动构建[推荐]：

Mac/Linux系统可直接执行`build.sh`进行构建，构建结果在`dist/gen`文件夹下。

- 手动构建：
    
    `cd front`
    
    - 执行`npm run build:prod`
    
    `cd ..`
    
    - 执行`mvn clean package`，在`gen/target`下会生成一个`gen-1.0.0-SNAPSHOT.jar`（xx表示本号）
    - 将`gen-1.0.0-SNAPSHOT.jar`放在`dist/gen`下，确保jar和`view`在同一目录
    - 执行`java -jar gen-xx-SNAPSHOT.jar`
    - 浏览器访问`http://localhost:6969/`

- 将vue.js打包到jar包内：
    - `cd front & npm run build:prod`
    - 复制`dist/gen/view`内所有内容到`gen`项目的`resources/static`下
    - 注释`GeneratorConfig#addResourceHandlers`方法体中的内容
    - 执行`mvn clean package`，在`gen/target`下会生成一个`gen-1.0.0-SNAPSHOT.jar`（xx表示本号）
    - 执行`java -jar gen-xx-SNAPSHOT.jar`
    - 浏览器访问`http://localhost:6969/`

## 常用模板
下载template中的模板，通过页面的批量导入模板功能导入即可使用。

## 效果图

![代码生成](https://gitee.com/naraka47/pic-go-store/raw/master/img/20210707200014.png)

![生成结果](https://gitee.com/naraka47/pic-go-store/raw/master/img/20210707195809.png)

![模板管理](https://gitee.com/naraka47/pic-go-store/raw/master/img/20210707195843.png)
