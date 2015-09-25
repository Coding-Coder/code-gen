<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<title><sitemesh:write property="title" /></title>
<link rel="stylesheet" type="text/css" href="${resources}css/common.css"/>
<link rel="stylesheet" type="text/css" href="${resources}css/main.css"/>
<!-- fdui css -->
<link id="fd_theme" href="${resources}fdui/theme/aristo/theme.css" rel="stylesheet" type="text/css" />
<link href="${resources}fdui/primeui-1.1-min.css" rel="stylesheet" type="text/css" />
<!-- fdui js -->
<c:when test="${debugModel}">
<script type="text/javascript" src="${resources}fdui/fdui.all.js"></script>
</c:when>
<c:otherwise>
    <script type="text/javascript" src="${resources}fdui/fdui.all.min.js"></script>
</c:otherwise>
   <script type="text/javascript" src="${resources}js/libs/jquery.min.js"></script>
<script type="text/javascript" src="${resources}js/libs/modernizr.min.js"></script>