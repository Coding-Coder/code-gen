<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title><sitemesh:write property="title" /></title>
	<link href="${ctx}favicon.ico" rel="SHORTCUT ICON">
	<link rel="stylesheet" type="text/css" href="${resources}css/common.css"/>
	<link rel="stylesheet" type="text/css" href="${resources}css/main.css"/>
	<!-- fdui css -->
	<link href="${fdui}styles/theme/aristo/theme.css" rel="stylesheet" type="text/css" />
	<link href="${fdui}styles/primeui-1.1-min.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript">var ctx = '${ctx}';</script>
	<!-- fdui js -->
	<c:choose>
		<c:when test="${debugModel}">
			<script type="text/javascript" src="${fdui}js/fdui.all.js"></script>
		</c:when>
		<c:otherwise>
		    <script type="text/javascript" src="${fdui}js/fdui.all.min.js"></script>
		</c:otherwise>
	</c:choose>
	<script type="text/javascript" src="${resources}js/libs/jquery.min.js"></script>
	<script type="text/javascript" src="${resources}js/libs/modernizr.min.js"></script>
	<script type="text/javascript" src="${resources}js/libs/Action.js"></script>
	<script type="text/javascript" src="${resources}js/util/NavUtil.js"></script>
	<script type="text/javascript" src="${resources}js/util/MaskUtil.js"></script>
	<script type="text/javascript" src="${resources}js/util/HtmlUtil.js"></script>
	<script type="text/javascript" src="${resources}js/util/FunUtil.js"></script>
	<script type="text/javascript" src="${ctx}sys/VelocityHelper.js"></script>
	
	<style type="text/css">
		.sub-body{margin: 10px;}
	</style>
	<sitemesh:write property="head" />
</head>
<body>
<div class="topbar-wrap white">
    <div class="topbar-inner clearfix">
        <div class="topbar-logo-wrap clearfix">
            <h1 class="topbar-logo none"><a href="${ctx}sys/home.jsp" class="navbar-brand">后台管理</a></h1>
            <ul class="navbar-list clearfix">
                <li><a href="${ctx}sys/home.jsp">首页</a></li>
            </ul>
        </div>
        <div class="top-info-wrap">
            <ul class="top-info-list clearfix">
                <li><a href="#" onclick="VelocityHelper.show(); return false;">Velocity参数</a></li>
                <li><a href="${ctx}sys/updatePswd.jsp">修改密码</a></li>
                <li><a href="javascript:void(0)" onclick="logout();">退出</a></li>
            </ul>
        </div>
    </div>
</div>
<div class="container clearfix">
    <!-- 菜单 -->
    <%@ include file="menu.jsp" %>
    <!--/sidebar-->
    <div class="main-wrap">
         <div class="crumb-wrap" id="nav-content">
            <div id="crumbId" class="crumb-list"><i class="icon-font"></i><a href="${ctx}sys/home.jsp">首页</a><span class="crumb-step">&gt;</span><span class="crumb-name"><sitemesh:write property="title" /></span></div>
        </div>
        <div class="sub-body">
	        <sitemesh:write property="body" />
        </div>
    </div>
    <!--/main-->
</div>
<script type="text/javascript">
function logout() {
	$.ajax({
		type: "POST",
	    url: ctx + 'logout.do',
	  	dataType:'json',
	    success: function(result){
			if (result.success){
				goLogin();
			} 
		},
		error:function(){
			goLogin();
		}
	});
}

if (typeof(jQuery) != 'undefined') {
    $(document).ajaxError(function (event, request, settings) {
        if (request.getResponseHeader("X-timeout") && request.status == 401) {
        	goLogin();
        }else{
        	alert("系统异常");
        }
    });
}

function goLogin() {
	// 页面跳转
	location.replace(ctx + 'needLogin.html');
}

// 菜单高亮
$(".uuid-${param.srId}").parent().addClass('on');
</script>
<!-- 保持session -->
<iframe src="${ctx}keepSession.jsp" frameborder="0" height="0" width="0" style="height: 0px;width: 0px;"></iframe>
</body>
</html>