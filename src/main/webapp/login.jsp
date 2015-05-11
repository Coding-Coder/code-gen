<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户登录</title>
<jsp:include page="easyui_lib.jsp"></jsp:include>
<style type="text/css">
.login_msg {
color:red;
}
</style>
</head>
<body>
<div id="win" class="easyui-window" 
	style="width:350px;height:230px;"
	title="用户登录" 
	collapsible="false" minimizable="false" maximizable="false" 
	closable="false" draggable="false">
	
	<form id="fm" style="padding:10px 20px 10px 40px;" onkeypress="keyPress(event)">
		<p id="msg" class="login_msg">&nbsp;</p>
		<table>
			<tr><td>用户名: </td><td><input name="username" type="text" class="easyui-validatebox" required="true"></td></tr>
			<tr><td>密    码: </td><td><input name="password" type="password" class="easyui-validatebox" required="true"></td></tr>
			<tr>
			<td></td>
			<td>
				<div style="padding:5px;">
					<a href="javascript:void(0)" onclick="login();" class="easyui-linkbutton" icon="icon-ok">登录</a>
				</div>
			</td></tr>
		</table>
	</form>
	
</div>


<script type="text/javascript">
var $msg = $('#msg');

function login(){
	
	$('#fm').form('submit',{
		url: ctx + 'login.do',
		onSubmit: function(){
			return $(this).form('validate');
		},
		success: function(resultTxt){
			var result = $.parseJSON(resultTxt);
			if (result.success){
				window.location = ctx + 'login/main.jsp';
			} else {
				var errorMsg = result.errorMsg;
				$msg.html(errorMsg);
			}
		}
	});

}

function keyPress(event){
	if(event.keyCode == 13){
		login();
	}
}

// 自动登录
// $('#fm').form('load',{username:'admin',password:'admin'});
// login();
</script>
</body>
</html>