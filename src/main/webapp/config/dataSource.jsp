<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>数据源配置</title>
<style type="text/css">
.fm_lab{text-align: right;padding:10px;}
</style>
</head>
<body>
	 <div id="toolbar">
		<a href="#" class="easyui-linkbutton" iconCls="icon-add" plain="true" onclick="crud.add()">添加数据源</a>
	</div>
	<table id="dg"></table>
	
	<div id="dlg" class="easyui-dialog" style="width:500px;padding:10px 20px"
			closed="true" modal="true" buttons="#dlg-buttons" doSize="true">
		<form id="fm" method="post">
			<table>
				<tr>
					<td class="fm_lab">名称(Alias):</td><td><input name="name" class="easyui-validatebox" required="true"></td>
				</tr>
				<tr><td class="fm_lab">驱动(Driver):</td>
					<td>
						<select class="easyui-combobox" name="driverClass" required="true">
							<option value="com.mysql.jdbc.Driver" selected>com.mysql.jdbc.Driver</option>
							<option value="net.sourceforge.jtds.jdbc.Driver">net.sourceforge.jtds.jdbc.Driver</option>
						</select>
					</td>
				</tr>
				<tr>
					<td class="fm_lab">连接(Url):</td><td><input name="jdbcUrl" class="easyui-validatebox" style="width: 300px;" required="true"></td>
				</tr>
				<tr>
					<td class="fm_lab">用户名(Username):</td><td><input name="username" class="easyui-validatebox" required="true"></td>
				<tr>
					<td class="fm_lab">密码(Password):</td><td><input name="password" class="easyui-validatebox" required="true"></td>
				</tr>
			</table>
		</form>
	</div>
	<div id="dlg-buttons">
		<a href="#" class="easyui-linkbutton" iconCls="icon-ok" onclick="crud.save(); return false;">保存</a>
		<a href="#" class="easyui-linkbutton" iconCls="icon-cancel" onclick="crud.closeDlg(); return false;">取消</a>
	</div>
	
<jsp:include page="../easyui_lib.jsp"></jsp:include>
<script type="text/javascript">
var that = this;
var crud = Crud.create({
	pk:'dcId'
	,listUrl:ctx + 'listDataSource.do'
	,addUrl:ctx + 'addDataSource.do'
	,updateUrl:ctx + 'updateDataSource.do'
	,delUrl:ctx + 'delDataSource.do'
	,dlgId:'dlg'
	,formId:'fm'
	,gridId:'dg'
});

crud.buildGrid([
	{field:'name',title:'名称'}  
	,{field:'driverClass',title:'驱动'}
	,{field:'jdbcUrl',title:'连接'}
	,{field:'_account',title:'账号/密码',formatter:accountFormater}    
	,{field:'_oper',title:'操作',formatter:formatOper}     
]);

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