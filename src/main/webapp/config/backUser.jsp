<%@page import="org.durcframework.autocode.common.AutoCodeContext"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户管理</title>
<style type="text/css">
.fm_lab{text-align: right;padding:10px;}
</style>
</head>
<body>
<%
	if(!AutoCodeContext.getInstance().isAdmin()){
	request.getRequestDispatcher("/login.jsp").forward(request, response);
	return;
}
%>
     <div id="toolbar">
        <a href="#" class="easyui-linkbutton" iconCls="icon-add" plain="true" onclick="crud.add()">添加</a>
    </div>
    <table id="dg"></table>
    
    <div id="dlg" class="easyui-dialog" style="width:520px;height:220px;padding:10px 20px"
            closed="true" modal="true" buttons="#dlg-buttons">
        <form id="fm" method="post">
            <table>
        <tr>
            <td class="fm_lab">用户名:</td><td><input id="username" name="username" class="easyui-validatebox" required="true"></td>
        </tr>
        <tr>
            <td class="fm_lab">密码:</td><td><input name="password" class="easyui-validatebox" required="true"></td>
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
    pk:'username'
    ,listUrl:ctx + 'listBackUser.do'
    ,addUrl:ctx + 'addBackUser.do'
    ,updateUrl:ctx + 'updateBackUser.do'
    ,delUrl:ctx + 'delBackUser.do'
    ,dlgId:'dlg'
    ,formId:'fm'
    ,gridId:'dg'
});

crud.buildGrid([
        {field:'username',title:'用户名'}
    ,    {field:'password',title:'密码'}
    ,    {field:'addTime',title:'添加时间'}
    ,crud.createOperColumn()   
]);
</script>
</body>
</html>