<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>数据源配置</title>
<style type="text/css">
	.fitem{margin: 4px;}
	.fitem input{width:200px;}
</style>
</head>
<body>
 <div id="toolbar">
		<a href="#" class="easyui-linkbutton" iconCls="icon-add" plain="true" onclick="crud.add()">添加数据源</a>
	</div>
	<table id="dg" title="数据源列表" class="easyui-datagrid"
			url="${ctx}listDataSource.do"
			toolbar="#toolbar" pagination="true"
			rownumbers="false" fitColumns="true" singleSelect="true">
		<thead>
			<tr>
				<th data-options="field:'name',align:'center'">名称</th>
				<th data-options="field:'driverClass',align:'center'">驱动</th>
				<th data-options="field:'jdbcUrl',align:'center'">连接</th>
				<th data-options="field:'_account',align:'center',formatter:accountFormater">账号/密码</th>
				<th data-options="field:'_operate',align:'center',align:'center',formatter:formatOper">操作</th>
			</tr>
		</thead>
	</table>
	
	<div id="dlg" class="easyui-dialog" style="width:500px;height:380px;padding:10px 20px"
			closed="true" modal="true" buttons="#dlg-buttons">
		<form id="fm" method="post" novalidate>
			<div class="fitem">
				<label>名称(Alias):</label><br>
				<input name="name" class="easyui-validatebox" required="true">
			</div>
			<div class="fitem">
				<label>驱动(Driver):</label><br>
				<select class="easyui-combobox" name="driverClass" required="true">
					<option value="com.mysql.jdbc.Driver" selected>com.mysql.jdbc.Driver</option>
					<option value="net.sourceforge.jtds.jdbc.Driver">net.sourceforge.jtds.jdbc.Driver</option>
				</select>
			</div>
			<div class="fitem">
				<label>连接(Url):</label><br>
				<input name="jdbcUrl" class="easyui-validatebox" style="width: 400px;" required="true">
			</div>
			<div class="fitem">
				<label>用户名(Username):</label><br>
				<input name="username" class="easyui-validatebox" required="true">
			</div><div class="fitem">
				<label>密码(Password):</label><br>
				<input name="password" class="easyui-validatebox" required="true">
			</div>
		</form>
	</div>
	<div id="dlg-buttons">
		<a href="#" class="easyui-linkbutton" iconCls="icon-ok" onclick="crud.save(); return false;">保存</a>
		<a href="#" class="easyui-linkbutton" iconCls="icon-cancel" onclick="crud.closeDlg(); return false;">取消</a>
	</div>
	
<jsp:include page="../easyui_lib.jsp"></jsp:include>
<script type="text/javascript" src="${ctx}js/Action.js"></script>
<script type="text/javascript" src="${ctx}js/MaskUtil.js"></script>
<script type="text/javascript" src="${ctx}js/MsgUtil.js"></script>
<script type="text/javascript">
var url;
var that = this;
var crud = Crud.create({
	pk:'dcId'
	,addUrl:ctx + 'addDataSource.do'
	,updateUrl:ctx + 'updateDataSource.do'
	,delUrl:ctx + 'delDataSource.do'
	,dlgId:'dlg'
	,formId:'fm'
	,gridId:'dg'
});


function formatOper(val,row,index){
	return '<a href="#" onclick="'+FunUtil.createFun(that,'testConnection',row)+'">连接测试</a>'+
		' | <a href="#" onclick="'+FunUtil.createFun(crud,'update',row)+'">修改</a>'+
		' | <a href="#" onclick="'+FunUtil.createFun(crud,'del',row)+'">删除</a>';
}

function accountFormater(val,row,index){
	return row.username + "/" + row.password;
}

function testConnection(row){
	MaskUtil.mask('测试连接中...');
	
	Action.jsonAsyncActByData(ctx + 'connectionTest.do',row,function(e){
		MaskUtil.unmask();
		if(e.success){
			MsgUtil.alert('连接成功');
		}else{
			MsgUtil.error(e.errorMsg);
		}
	});
}

</script>
</body>
</html>