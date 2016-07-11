<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>文件生成</title>
<!-- codemirror -->
<script src="${resources}codemirror/lib/codemirror.js"></script>
<script src="${resources}codemirror/mode/xml/xml.js"></script>
<script src="${resources}codemirror/mode/css/css.js"></script>
<script src="${resources}codemirror/mode/javascript/javascript.js"></script>
<script src="${resources}codemirror/mode/htmlmixed/htmlmixed.js"></script>
<script src="${resources}codemirror/mode/htmlembedded/htmlembedded.js"></script>
<script src="${resources}codemirror/mode/clike/clike.js"></script>
<script src="${resources}codemirror/mode/velocity/velocity.js"></script>
<link rel="stylesheet" href="${resources}codemirror/lib/codemirror.css">
<link rel="stylesheet" href="${resources}codemirror/theme/neat.css">
<style type="text/css">.CodeMirror {border-top: 1px solid black; border-bottom: 1px solid black;}</style>
<!-- codemirror end -->
<style type="text/css">
	.step{margin-bottom: 20px;padding:5px;border-bottom: 2px solid #95b8e7;}
	.codeArea{font-size:13px;border: dotted #ccc 1px;padding: 3px;font-family: 宋体,Consolas,sans-serif ;}
</style>
</head>
<body>
<div id="stepMsg" class="step">第一步,选择数据源</div>

<div id="step1">
	<table id="gdDataSource" title="数据源列表" class="easyui-datagrid"
			url="${ctx}listDataSource.do"
			toolbar="#toolbar" pagination="true"
			rownumbers="false" fitColumns="true" singleSelect="true">
		<thead>
			<tr>
				<th data-options="field:'_operate',align:'center',align:'center',formatter:formatOper">操作</th>
				<th data-options="field:'dbName',align:'center'">名称</th>
				<th data-options="field:'jdbcUrl',align:'center'">连接</th>
			</tr>
		</thead>
	</table>
</div>

<div id="step2" style="display: none;width: 600px;">
	<fieldset style="border: 1px solid #ccc;font-size: 12px;">
	    <legend>输入包名</legend>
	    package: <input id="packageName" type="text" style="width:260px; "/> (不填则表名作为包名)
	</fieldset>
	<br>
	<table id="dgTable"></table>
	<br>
	<a href="#" class="easyui-linkbutton" iconCls="icon-forward" onclick="goStep3(); return false;">下一步</a>
</div>

<div id="step3" style="display: none;">
	<div id="templateTb">
		模板名:&nbsp;<input id="tempSch" class="easyui-textbox" type="text"></input>
		<a href="#" class="easyui-linkbutton" iconCls="icon-search" onclick="searchTemplate(); return false;">搜索</a>
	</div>
	<table id="dgTemplate"></table>
	<br>
	<a href="#" class="easyui-linkbutton" iconCls="icon-ok" onclick="finish(); return false;">生成</a>
</div>

<div id="win"
	class="easyui-window" 
	title="代码生成结果" 
	style="width:1000px;height:650px;padding:5px;"   
    data-options="modal:true,closed:true,minimizable:false,collapsible:false">   
	    
	<div class="easyui-layout" data-options="fit:true">
		<div data-options="region:'west',split:true" style="width:200px;padding: 5px;">
			<a id="dlBtn" target="_blank" href="${ctx}downloadZip.do">下载ZIP</a>
			<a id="copyCode" href="javascript:void(0)" style="cursor:default;display: none;">复制代码</a>
			<div id="tree" style="margin-top: 5px;"></div>
		</div>
		<div data-options="region:'center'" style="padding:10px;">
			<textarea id="codeContent" name="code">点击树菜单查看代码</textarea>
		</div>
		<div data-options="region:'south',border:false" style="text-align:right;padding:5px 0 0;">
			<a class="easyui-linkbutton" data-options="iconCls:'icon-ok'" href="javascript:void(0)" onclick="$('#win').window('close');">确定</a>
		</div>
	</div>
</div>  

<div id="viewWin"
	class="easyui-window" 
	title="模板内容" 
	style="width:900px;height:600px;padding:5px;"   
    data-options="modal:true,maximizable:true,closed:true,minimizable:false">   
	    
	<div class="easyui-layout" data-options="fit:true">
		<div data-options="region:'center'" style="padding:10px;">
			<textarea id="viewCode" name="code"></textarea>
		</div>
		<div data-options="region:'south',border:false" style="text-align:right;padding:5px 0 0;">
			<a class="easyui-linkbutton" data-options="iconCls:'icon-ok'" href="javascript:void(0)" onclick="$('#viewWin').window('close');">确定</a>
		</div>
	</div>
</div>  


<jsp:include page="../easyui_lib.jsp"></jsp:include>
<script type="text/javascript" src="${easyuiCtx}res/js/jquery.zclip/jquery.zclip.min.js"></script>
<script type="text/javascript">
var that = this;
// 请求参数
var GeneratorParam = {
	dcId:0
	,tableNames:[]
	,tcIds:[]
	,packageName:''
}

function formatOper(val,row,index){
	return '<a href="javascript:void(0)" onclick="'+FunUtil.createFun(that,'selectDataSource',row)+'">选择</a>';
}

// 选择数据源
function selectDataSource(row){
	
	MaskUtil.mask();
	
	testConnection(row,function(row){
		MaskUtil.unmask();
		
		GeneratorParam.dcId = row.dcId;
		
		showStep2(function(){
			$('#dgTable').datagrid({    
				title:'数据源['+row.dbName+']',
			    url:ctx + 'listTable.do?dcId='+row.dcId,
			    columns:[[    
			        {field:'ck',title:'',checkbox:true}  
			        ,{field:'tableName',title:'表名'}  
			    ]]
			    ,width:500
			    ,height:500
			    ,striped:true
			    ,checkOnSelect:true
			    ,onLoadSuccess:function(e){
			    	if(e.errorMsg){
						MsgUtil.error(e.errorMsg);
					}
			    }
			});
		})
	})
}

// 显示第二步
function showStep2(callback){
	$('#step1').hide(500,callback);
	$('#stepMsg').html('第二步,选择表');
	$('#step2').show(500);
}

// 显示第三步
function showStep3(callback){
	$('#step2').hide(500,callback);
	$('#stepMsg').html('第三步,选择模板');
	$('#step3').show(500);
}

// 转向第三步
function goStep3(){
	
	var packageName = $.trim($('#packageName').val());
	if(!validatePackage(packageName)){
		MsgUtil.topMsg('包名不正确');
		return false;
	}
	
	var rows = $('#dgTable').datagrid('getSelections');
	if(!validateTableSelect(rows)){
		MsgUtil.topMsg('请选择表');
		return false;
	}
	
	GeneratorParam.packageName = packageName;
	GeneratorParam.tableNames = [];
	
	for(var i=0,len=rows.length;i<len;i++){
		GeneratorParam.tableNames.push(rows[i].tableName);
	}
	showStep3(listTemplate);
}

function validateTableSelect(rows){
	return rows && rows.length > 0;
}

var regexPackage = /^([a-zA-Z_\$]{1}[\w\$]*)(\.[a-zA-Z_\$]{1}[\w\$]*)*$/;
function validatePackage(packageName){
	if(packageName == ''){
		return true;
	}
	
	return regexPackage.test(packageName);
}

// 查询模板
function listTemplate(){
	$('#dgTemplate').datagrid({    
		title:'模板列表',
	    url:ctx + 'listUserTepmlate.do',
	    toolbar: '#templateTb',
	    columns:[[    
	        {field:'ck',title:'',checkbox:true}  
	        ,{field:'name',title:'模板名'}  
	        ,{field:'content',title:'内容',formatter: function(value,row,index){
	        		return '<a href="javascript:void(0)" onclick="'+FunUtil.createFun(that,'showContent',row)+'">查看</a>';
	        	}
			}  
	    ]]
	    ,pagination:true
	    ,width:500
	    ,striped:true
	    ,checkOnSelect:true
	    ,onLoadSuccess:function(e){
	    	if(e.errorMsg){
				MsgUtil.error(e.errorMsg);
			}
	    }
	});
}

function searchTemplate(){
	var value = $('#tempSch').val();
	$('#dgTemplate').datagrid('load',{
		nameSch: value
	});
}

// 展示内容
function showContent(row){
	$('#viewWin').window('open');
	
	getViewEditor().setValue(row.content);
}

// 完成
function finish(){
	reset();
	var rows = $('#dgTemplate').datagrid('getSelections');
	
	if(rows && rows.length > 0){
		GeneratorParam.tcIds = [];
		for(var i=0,len=rows.length;i<len;i++){
			GeneratorParam.tcIds.push(rows[i].tcId);
		}
		generate();
	}else{
		MsgUtil.topMsg('请选择模板');
	}
}

function reset(){
	$("#copyCode").hide();
	$('#codeContent').html('点击树菜单查看代码');
}

// 生成代码
function generate(){
	MaskUtil.mask('代码生成中,请稍后...');
	Action.jsonAsyncActByData(ctx + 'generatFile.do',GeneratorParam,function(rows){
		MaskUtil.unmask();
		if(rows){
			showGeneratCode(rows);
		}else{
			MsgUtil.error(e.errorMsg);
		}
	});
}

// 显示结果
function showGeneratCode(rows){
	var treeData = buildTreeData(rows);
	$('#tree').tree({
		data:treeData
		// 点击树节点显示代码
		,onClick: function(node){
			var attributes = node.attributes;
			if(attributes){
				$("#copyCode").show();
				
				finishEditor.setValue(attributes.content);
				var suffix = getSuffix({fileName:node.text});
				changeMode(finishEditor,getMode(suffix));
				
				if(!bindCopyEvent.binded){
					bindCopyEvent();
					bindCopyEvent.binded = true;
				}
			}
		}
	});
	
	$('#win').window('open');
}

// 绑定复制代码事件
function bindCopyEvent(){
	$('#copyCode').show().zclip({ 
		path:ctx + 'easyui/res/js/jquery.zclip/ZeroClipboard.swf', 
		copy:function(){
			return getViewEditor().getValue()
		},
		afterCopy:function(){ 
			MsgUtil.topMsg('复制成功');
		} 
	});
}

// 构建树菜单数据
function buildTreeData(rows){
	var treeData = [];
	var codeMap = {};
	// 把列表数据转换到map中,key为表名
	// value是个List
	for(var i=0,len=rows.length;i<len;i++){
 		var row = rows[i];
 		var list = codeMap[row.tableName];
 		if(!list){
 			list = [];
	 		codeMap[row.tableName] = list;
 		}
 		
 		list.push({templateName:row.templateName,content:row.content});
	}
	// 把这个map对象转成tree格式数据
	for(var tableName in codeMap){
		var codeFileArr = codeMap[tableName];
		var treeElement = {
			text:tableName
			//,state:'closed' // 默认关闭
			,children:buildChildren(codeFileArr)
		};
	
		treeData.push(treeElement);
	}
	
	return treeData;
}

function buildChildren(codeFileArr){
	var children = [];
	for(var i=0,len=codeFileArr.length;i<len;i++){
		var codeFile = codeFileArr[i];
		var child = {
			text:codeFile.templateName
			,attributes:{
				content:codeFile.content
			}
		};
		
		children.push(child);
	}
	
	return children;
}

function testConnection(row,callback){
	Action.jsonAsyncActByData(ctx + 'connectionTest.do',row,function(e){
		if(e.success){
			callback(row);
		}else{
			MsgUtil.error(e.errorMsg);
		}
		
	})
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

var finishEditor = CodeMirror.fromTextArea(document.getElementById("codeContent"), {
    tabMode: "indent",
    lineNumbers: true,
    indentUnit: 4,
    readOnly:true,
});

finishEditor.setSize(700,400);

var mode_map = {
	'js':{folder:'javascript',mode:'text/x-java'}
	,'java':{folder:'clike',mode:'text/x-java'}
	,'jsp':{folder:'htmlembedded',mode:'application/x-jsp'}
	,'html':{folder:'htmlmixed',mode:'text/html'}
	,'aspx':{folder:'htmlembedded',mode:'application/x-aspx'}
	,'xml':{folder:'xml',mode:'xml'}
};

function changeMode(editor,modelConfig) {
   editor.setOption("mode", modelConfig.mode);
}

function getMode(suffix) {
	var mode = mode_map[suffix] || 'javascript';
	return mode;
}

function getSuffix(row) {
	var fileName = row.fileName;
	var index = fileName.lastIndexOf('.');
	if(index == -1) {
		return 'js';
	}
	return fileName.substring(index+1,fileName.length);
}
</script>
</body>
</html>