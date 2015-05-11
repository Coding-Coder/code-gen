<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>模板配置</title>
<style type="text/css">
	.fitem{margin: 4px;}
	.fitem input{width:200px;}
	.codeArea{
		font-size:13px;
		border: dotted #ccc 1px;
		padding: 3px;
		font-family: 宋体,Consolas,sans-serif;
	}
	.codeText{
		width: 100%;font-size:13px;font-family: 宋体,Consolas,sans-serif;
	}
</style>
</head>
<body>
 <div id="toolbar">
		<a href="#" class="easyui-linkbutton" iconCls="icon-add" plain="true" onclick="add()">添加模板</a>
	</div>
	<table id="dg" title="模板列表" class="easyui-datagrid"
			style="width:500px;"
			url="${ctx}listTemplate.do"
			toolbar="#toolbar" pagination="true" striped="true"
			rownumbers="false" fitColumns="true" singleSelect="true">
		<thead>
			<tr>
				<th data-options="field:'name',align:'center'">模板名</th>
				<th data-options="field:'content',align:'center',formatter:formatContent">内容</th>
				<th data-options="field:'_operate',align:'center',formatter:formatOper">操作</th>
			</tr>
		</thead>
	</table>
<br>
	<div id="dlg" class="easyui-window" 
		style="width:1000px;height:600px;padding:10px 20px"
		data-options="modal:true,closed:true,minimizable:false,collapsible:false">
		
		<div class="easyui-layout" data-options="fit:true">
			<div data-options="region:'center'" style="padding:10px;">
				<form id="fm" method="post" novalidate>
					<div class="fitem">
						<label>模板名:</label><br>
						<input name="name" class="easyui-validatebox" required="true">
					</div>
					<hr style="border-bottom: dotted 1px gray;border-top: 0px;">
					<div class="fitem">
						<label>内容:</label><br>
						<textarea class="codeText" name="content" rows="22" required="true"></textarea>
					</div>
				</form>
			</div>
			<div data-options="region:'south',border:false" style="text-align:right;padding:5px 0 0;">
				<a href="#" class="easyui-linkbutton" iconCls="icon-ok" onclick="crud.save(); return false;">保存</a>
				<a href="#" class="easyui-linkbutton" iconCls="icon-cancel" onclick="crud.closeDlg(); return false;">取消</a>
			</div>
		</div>
		
	</div>
	
<div id="viewWin"
	class="easyui-window" 
	title="模板内容" 
	style="width:800px;height:450px;padding:5px;"   
    data-options="closed:true,minimizable:false,collapsible:false">   
	    
	<div class="easyui-layout" data-options="fit:true">
		<div data-options="region:'center'" style="padding:10px;">
			<div id="viewCode" class="codeArea"></div>
		</div>
		<div data-options="region:'south',border:false" style="text-align:right;padding:5px 0 0;">
			<a class="easyui-linkbutton" data-options="iconCls:'icon-ok'" href="javascript:void(0)" onclick="$('#viewWin').window('close');">确定</a>
		</div>
	</div>
</div> 

<jsp:include page="../easyui_lib.jsp"></jsp:include>
<script type="text/javascript">
function showEg(){
	$('#eg').show(500);
}

var url;
var that = this;
var crud = Crud.create({
	pk:'tcId'
	,addUrl:ctx + 'addTemplate.do'
	,updateUrl:ctx + 'updateTemplate.do'
	,delUrl:ctx + 'delTemplate.do'
	,dlgId:'dlg'
	,formId:'fm'
	,gridId:'dg'
});

function add(){
	crud.add('添加模板');
	//$('#dlg').panel('maximize');
}

function formatOper(val,row,index){
	return '<a href="#" onclick="'+FunUtil.createFun(crud,'update',row)+'">修改</a>'+
		' | <a href="#" onclick="'+FunUtil.createFun(crud,'del',row)+'">删除</a>';
}

function formatContent(val,row){
	return '<a href="#" onclick="'+FunUtil.createFun(that,'showContent',row)+'">查看</a>';
}

// 展示内容
function showContent(row){
	$('#viewCode').html(HtmlUtil.parseToHtml(row.content));
	$('#viewWin').window('open');
}
</script>

<!-- 保持session -->
<iframe src="${ctx}keepSession.jsp" frameborder="0" height="0" width="0" style="height: 0px;width: 0px;"></iframe>
</body>
</html>