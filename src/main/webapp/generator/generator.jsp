<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>文件生成</title>
<style type="text/css">
	.step{margin-bottom: 10px;}
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
				<th data-options="field:'name',align:'center'">名称</th>
				<th data-options="field:'jdbcUrl',align:'center'">连接</th>
				<th data-options="field:'_operate',align:'center',align:'center',formatter:formatOper">操作</th>
			</tr>
		</thead>
	</table>
</div>

<div id="step2" style="display: none;">
	<table id="dgTable"></table>
	<br>
	<a href="#" class="easyui-linkbutton" iconCls="icon-next" onclick="goStep3(); return false;">下一步</a>
</div>

<div id="step3" style="display: none;">
	<div id="templateTb">
		模板名:&nbsp;<input class="easyui-searchbox"data-options="prompt:'输入模板名,支持模糊',searcher:searchTemplate"></input>
	</div>
	<table id="dgTemplate"></table>
	<br>
	<a href="#" class="easyui-linkbutton" iconCls="icon-ok" onclick="finish(); return false;">生成</a>
</div>

<div id="win"
	class="easyui-window" 
	title="代码生成结果" 
	style="width:800px;height:450px;padding:5px;"   
    data-options="modal:true,closed:true,minimizable:false,collapsible:false">   
	    
	<div class="easyui-layout" data-options="fit:true">
		<div data-options="region:'west',split:true" style="width:150px">
			<div id="tree"></div>
		</div>
		<div data-options="region:'center'" style="padding:10px;">
			<a id="copyCode" href="javascript:void(0)" style="cursor:default;display: none;">复制代码</a>
			<div id="codeContent" class="codeArea">点击树菜单查看代码</div>
		</div>
		<div data-options="region:'south',border:false" style="text-align:right;padding:5px 0 0;">
			<a class="easyui-linkbutton" data-options="iconCls:'icon-ok'" href="javascript:void(0)" onclick="$('#win').window('close');">确定</a>
		</div>
	</div>
</div>  

<div id="viewWin"
	class="easyui-window" 
	title="模板内容" 
	style="width:800px;height:450px;padding:5px;"   
    data-options="modal:true,maximizable:true,closed:true,minimizable:false">   
	    
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
<script type="text/javascript" src="${ctx}js/Action.js"></script>
<script type="text/javascript" src="${ctx}js/MsgUtil.js"></script>
<script type="text/javascript" src="${ctx}js/MaskUtil.js"></script>
<script type="text/javascript" src="${ctx}js/HtmlUtil.js"></script>
<script type="text/javascript" src="${ctx}js/EventUtil.js"></script>
<script type="text/javascript" src="${ctx}js/jquery.zclip/jquery.zclip.min.js"></script>
<script type="text/javascript">
var that = this;
// 请求参数
var GeneratorParam = {
	dcId:0
	,tableNames:[]
	,tcIds:[]
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
				title:'数据源['+row.jdbcUrl+']',
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
	var rows = $('#dgTable').datagrid('getSelections');
	
	if(rows && rows.length > 0){
		GeneratorParam.tableNames = [];
		for(var i=0,len=rows.length;i<len;i++){
			GeneratorParam.tableNames.push(rows[i].tableName);
		}
		showStep3(listTemplate);
	}else{
		MsgUtil.topMsg('请选择表');
	}
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

function searchTemplate(value){
	$('#dgTemplate').datagrid('load',{
		nameSch: value
	});
}

// 展示内容
function showContent(row){
	$('#viewCode').html(HtmlUtil.parseToHtml(row.content));
	$('#viewWin').window('open');
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
				$('#codeContent').html(attributes.content);
				
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
		path:ctx + 'js/jquery.zclip/ZeroClipboard.swf', 
		copy:function(){
			return HtmlUtil.parseToText($('#codeContent').html());
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
				content:HtmlUtil.parseToHtml(codeFile.content)
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
</script>
</body>
</html>