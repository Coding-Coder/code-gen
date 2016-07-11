<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>首页</title>
</head>
<body>
<p style="font-size:14px">欢迎使用代码生成系统</p>
如果您首次使用本系统，请按以下步骤操作：
<ol>
	<li>配置数据源。模板的生成需要依赖数据库表</li>
	<li>配置模板。基于Velocity模板引擎，<a href="javascript:void(0)" onclick="showVelocity(); return false;">点此查看</a>Velocity参数列表</li>
	<li>生成代码。只需三步即可生成代码文件</li>
</ol>

<strong>示例:</strong><br>
=======表结构=======<br>
<img src="../table.png">
<div class="easyui-tabs" style="width:800px;height:400px;">
<div title="模板内容" style="padding:5px">
<pre>
package &#36;{context.packageName}.entity;

import org.durcframework.entity.BaseEntity;

public class &#36;{context.javaBeanName} extends BaseEntity {
## 此处用foreach循环构建java类中的属性
#foreach(&#36;column in &#36;columns) 
    private &#36;{column.javaType} &#36;{column.javaFieldName};
#end

## 此处用foreach循环构建属性的get/set方法
#foreach(&#36;{column} in &#36;{columns}) 
    public void set&#36;{column.javaFieldNameUF}(&#36;{column.javaType} &#36;{column.javaFieldName}){
        this.&#36;{column.javaFieldName} = &#36;{column.javaFieldName};
    }

    public &#36;{column.javaType} get&#36;{column.javaFieldNameUF}(){
        return this.&#36;{column.javaFieldName};
    }

#end
}
</pre>
	</div>
	<div title="生成后的代码" style="padding:5px">
<pre>
package datasourceconfig.entity;

import org.durcframework.entity.BaseEntity;

publc class DatasourceConfig extends BaseEntity {
    private int dcId;
    private String name;
    private String driverClass;
    private String jdbcUrl;
    private String username;
    private String password;
    private String backUser;

    public void setDcId(int dcId){
        this.dcId = dcId;
    }

    public int getDcId(){
        return this.dcId;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

    public void setDriverClass(String driverClass){
        this.driverClass = driverClass;
    }

    public String getDriverClass(){
        return this.driverClass;
    }

    public void setJdbcUrl(String jdbcUrl){
        this.jdbcUrl = jdbcUrl;
    }

    public String getJdbcUrl(){
        return this.jdbcUrl;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public String getUsername(){
        return this.username;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public String getPassword(){
        return this.password;
    }

    public void setBackUser(String backUser){
        this.backUser = backUser;
    }

    public String getBackUser(){
        return this.backUser;
    }

}
</pre>
	</div>
</div>

<script type="text/javascript" src="${easyuiCtx}res/js/VelocityContext.js"></script>
</body>
</html>