<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改密码</title>
</head>
<body>
<div class="result-wrap">
	<div class="result-content" id="updatePanel">
		<table class="insert-tab" width="100%">
        	<tbody>
                <tr>
                    <th width="120"><i class="require-red">*</i>原密码：</th>
                    <td id="oldPswd" width="180"></td>
                    <td id="oldPswdMsg"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>新密码：</th>
                    <td id="newPswd"></td>
                     <td id="newPswdMsg"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>重复新密码：</th>
                    <td id="newPswd2"></td>
                     <td id="newPswd2Msg"></td>
                </tr>
                <tr>
                     <th></th>
                     <td colspan="2">
                         <input id="updatePswdBtn" class="btn btn-primary btn6 mr10" value="保存" type="button">
                         <input class="btn btn6" onclick="history.go(-1)" value="返回" type="button">
                     </td>
                 </tr>
         	</tbody>
         </table>
	</div>
</div>
<script type="text/javascript">
(function(){
	
var panel = new FDFormPanel({
	controls:[
		new FDPasswordBox({domId:'oldPswd',name:'oldPswd',msgId:'oldPswdMsg'
			,validates:[
			{rule:{notNull:true},successClass:'green',errorClass:'require-red',successMsg:'√',errorMsg:'原密码不能为空'}
			,{rule:{minLength:6,maxLength:16},successClass:'green',errorClass:'require-red',successMsg:'√',errorMsg:'密码长度必须为6~16'}
			]})
		,new FDPasswordBox({domId:'newPswd',name:'newPswd',msgId:'newPswdMsg'
			,validates:[
			{rule:{notNull:true},successClass:'green',errorClass:'require-red',successMsg:'√',errorMsg:'新密码不能为空'}
			,{rule:{minLength:6,maxLength:16},successClass:'green',errorClass:'require-red',successMsg:'√',errorMsg:'密码长度必须为6~16'}
			]})
		,new FDPasswordBox({domId:'newPswd2',name:'newPswd2',msgId:'newPswd2Msg'
			,validates:[
			{rule:{notNull:true},successClass:'green',errorClass:'require-red',successMsg:'√',errorMsg:'重复密码不能为空'}
			,{validateHandler:compareSamePswd,successClass:'green',errorClass:'require-red',successMsg:'√',errorMsg:'两次密码不一致'}
			]})
	]
});

function compareSamePswd(val) {
	return (val == panel.getControl('newPswd').getValue());
}

$('#updatePswdBtn').click(function(){
	if(panel.validate()) {
		var data = panel.getData();
		
		Action.post(ctx + 'updateUserPassword.do',data,function(e){
			if(e.success) {
				FDWindow.alert('密码修改成功,请重新登录',function(){
					logout();
				});
			}else{
				FDWindow.alert(e.message);
			}
		});
	}
});

})();
</script>
</body>
</html>