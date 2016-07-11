<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>模板配置</title>
<!-- codemirror -->
<link rel="stylesheet" href="${resources}codemirror/lib/codemirror.css">
<script src="${resources}codemirror/lib/codemirror.js"></script>
<script src="${resources}codemirror/mode/velocity/velocity.js"></script>
<link rel="stylesheet" href="${resources}codemirror/theme/neat.css">
<!-- codemirror end -->
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
	.easyui-validatebox {width: 300px;}
</style>
<%@ include file="../easyui_lib.jsp" %>
</head>
<body>

	<div class="easyui-panel search-panel">
		 <form id="schForm">
	        <table>
                <tr>
                	<td class="fm_lab">模板名:</td><td><input name="nameSch" type="text"></td>      
					<td><a id="schBtn" class="easyui-linkbutton" iconCls="icon-search">查询</a></td>
                </tr>
	        </table>
	    </form>
	</div>

	<div id="toolbar">
	    <a id="addBtn" class="easyui-linkbutton" iconCls="icon-add" plain="true">添加</a>
	</div>
    
    <table id="dg"></table>
    
    <div id="dlg" class="easyui-dialog" style="width:1000px;height:600px;padding:10px 20px;"
            closed="true" modal="true" buttons="#dlg-buttons">
        <form id="fm" method="post">
            <table class="insert-tab">
                <tr>
		            <td class="fm_lab"><s>*</s>模板名:</td>
		            <td><input name="name" type="text" class="easyui-validatebox" required="true"></td>
		            <td colspan="2"><a href="#" class="link" onclick="top.showVelocity(); return false;">查看Velocity参数</a></td>
		        </tr>
		        <tr>
		            <td class="fm_lab"><s>*</s>文件名:</td>
		            <td><input name="fileName" type="text" class="easyui-validatebox" required="true"></td>
		            <td class="fm_lab"><s>*</s>保存路径:</td>
		            <td><input name="savePath" type="text" class="easyui-validatebox" required="true"></td>
		        </tr>
                <tr>
		            <td class="fm_lab"><s>*</s>内容:</td>
		            <td colspan="3">
		            	<textarea id="codeText" class="codeText" name="content" required="true"></textarea>
		            </td>
		        </tr>
                </table>
        </form>
    </div>
    <div id="dlg-buttons">
        <a id="saveBtn" class="easyui-linkbutton" iconCls="icon-ok">保存</a>
        <a id="cancelBtn" class="easyui-linkbutton" iconCls="icon-cancel">取消</a>
    </div>
    
    <div id="viewWin"
		class="easyui-window" 
		title="模板内容" 
		style="width:900px;height:600px;padding:5px;"   
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
    
<script type="text/javascript">
(function(){
var that = this;

var pk = 'tcId'; // java类中的主键字段
var listUrl = ctx + 'listTemplate.do'; // 查询
var addUrl = ctx + 'addTemplate.do'; // 添加
var updateUrl = ctx + 'updateTemplate.do'; // 修改
var delUrl = ctx + 'delTemplate.do'; // 删除
var submitUrl = ''; // 提交URL

var toolbarId = 'toolbar'; // 工具条ID

var $dialog = $('#dlg'); // 窗口
var $form = $('#fm'); // 表单
var $grid = $('#dg'); // 表格
var $schForm = $('#schForm'); // 查询表单

var $schBtn = $('#schBtn'); // 查询按钮
var $saveBtn = $('#saveBtn'); // 保存按钮
var $cancelBtn = $('#cancelBtn'); // 取消按钮
var $addBtn = $('#addBtn'); // 添加按钮

// 初始化表格
$grid.datagrid({    
	url:listUrl
   	,columns:[[
       {field:'name',title:'模版名'}
     , {field:'fileName',title:'文件名'}
     , {field:'savePath',title:'路径'}
     , {field:'content',title:'内容',formatter:function(val,row){
	     	return formatContent(val,row);
	     }}
    	,{field:'_btn1',title:'操作',align:'center',formatter:function(val,row){
	 	 return '<a href="#" onclick="'+FunUtil.createFun(that,'edit',row)+' return false;">修改</a>'
	 	 + '<span class="opt-split">|</span>'
	 	 + '<a href="#" onclick="'+FunUtil.createFun(that,'del',row)+' return false;">删除</a>'
	  }}
   	]]
   	,toolbar:'#' + toolbarId
	,pagination:true
	,fitColumns:true
	,singleSelect:true
	,striped:true
    ,pageSize:20
});

// 初始化事件
$addBtn.click(function(){
	$dialog.dialog('open').dialog('setTitle','添加');
	$form.trigger('reset');
	submitUrl = addUrl;
	
	
	var editor = getAddEditor();
	editor.setValue('');
	editor.focus();
});

$schBtn.click(function(){
	var data = getFormData($schForm);
	$grid.datagrid('load',data);
});

$saveBtn.click(function(){
	save();
});

$cancelBtn.click(function(){
	$dialog.dialog('close');
});


// 编辑
this.edit = function(row){
	if (row){
		$dialog.dialog('open').dialog('setTitle','修改');
		$form.form('clear').form('load',row);
		
		var editor = getAddEditor();
		editor.setValue(row.content);
		
		submitUrl = updateUrl + ['?',pk,'=',row[pk]].join('');
	}
}

// 保存
this.save = function(){
	var self = this;
	$form.form('submit',{
		url: submitUrl,
		onSubmit: function(){
			return $(this).form('validate');
		},
		success: function(resultTxt){
			var result = $.parseJSON(resultTxt);
			Action.execResult(result,function(result){
				$dialog.dialog('close');// close the dialog
				$grid.datagrid('reload');
			});
		}
	});
}

// 删除
this.del = function(row){
	if(row){
		$.messager.confirm('确认','确定要删除该数据吗?',function(r){
			if (r){
				Action.post(delUrl,row,function(result){
					Action.execResult(result,function(result){
						$grid.datagrid('reload');
					});
				});
			}
		});
	}
}

function getAddEditor() {
	if(!window.addEditor) {
		window.addEditor = CodeMirror.fromTextArea(document.getElementById('codeText'), {
	        tabMode: "indent",
	        theme: "neat",
	        lineNumbers: true,
	        indentUnit: 4,
	        mode: "text/velocity"
	    });
		
		window.addEditor.setSize(800,360);
	}
	return window.addEditor;
}

function getViewEditor() {
	if(!window.viewEditor) {
		window.viewEditor = CodeMirror.fromTextArea(document.getElementById("viewCode"), {
	        tabMode: "indent",
	        theme: "neat",
	        lineNumbers: true,
	        indentUnit: 4,
	        readOnly:true,
	        mode: "text/velocity"
	    });
		
		window.viewEditor.setSize(800,500);
	}
	return window.viewEditor;
}

window.formatContent = function(val,row){
	return '<a href="#" onclick="'+FunUtil.createFun(that,'showContent',row)+'">查看</a>';
}

//展示内容
window.showContent = function(row){
	$('#viewWin').window('setTitle',row.name);
	$('#viewWin').window('open');
	
	var editor = getViewEditor();
	editor.setValue(row.content);
}

})();

</script>
</body>
</html>