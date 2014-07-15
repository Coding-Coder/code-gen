<%@page import="org.durcframework.autocode.common.AutoCodeContext"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="../../taglib.jsp" %>
<span style="float: right; padding-right: 10px;">
欢迎,<%=AutoCodeContext.getInstance().getUser().getUsername()%> | <a href="javascript:void(0)" onclick="logout(); return false;">安全退出</a>
</span>
<script type="text/javascript">
function logout(){
	$.ajax({
		type: "POST",
	    url: '${ctx}logout.do',
	  	dataType:'json',
	    success: function(result){
			if (result.success){
				var win = window.parent || window;
				win.location.reload();
			} 
		},
		error:function(){
			window.location.reload();
		}
	});
}
</script>
<span style="padding-left: 5px; font-size: 16px;">
<!-- 		<img src="images/blocks.gif" width="20" height="20" align="absmiddle" /> -->
代码生成系统
</span>
