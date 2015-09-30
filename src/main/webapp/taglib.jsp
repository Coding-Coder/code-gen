<%@page import="org.durcframework.autocode.common.PropertiesManager"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value='<%=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/" %>'/>
<c:set var="resources" value="${ctx}resources/"/>
<c:set var="fdui" value="${resources}fdui/"/>
<c:set var="debugModel" value='<%=PropertiesManager.getInstance().get("debugModel") %>'/>

