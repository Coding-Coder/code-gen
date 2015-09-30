<%@page import="org.durcframework.autocode.common.PropertiesManager"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value='<%=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/" %>'/>
<c:set var="resources" value="${ctx}resources/"/>
<c:set var="fdui" value="http://localhost/fdui/build/"/>
<c:set var="easyui" value="${assets}easyui/"/>
<c:set var="debugModel" value='<%=PropertiesManager.getInstance().get("debugModel") %>'/>

