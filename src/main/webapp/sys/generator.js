var that = this;
var gridDS;
var gridTable;
var gridTemplate;
var viewWin;
var finishWin;
var finishTree;
var schPanelTemplate
var step1Panel;
var step2Panel;

var listUrlDS = ctx + 'listDataSource.do'; // 查询
var listUrlTable = ctx + 'listTable.do'; // 查询
var listUrlTemplate = ctx + 'listUserTepmlate.do'; // 查询

step1Panel = new FDFormPanel({
	domId:'step1Panel'
	,controls:[
		new FDHidden({domId:'txt-dcId',name:'dcId',defaultValue:0}) 
	]
});

step2Panel = new FDFormPanel({
	domId:'step2Panel'
	,controls:[
		new FDTextBox({domId:'txt-packageName',name:'packageName',nativeAttr:{placeholder:'com.aa.bb'},width:'300px'}) 
		,new FDTextBox({domId:'txt-charset',name:'charset',defaultValue:'UTF-8',nativeAttr:{placeholder:'输入文件编码,如:UTF-8'}}) 
	]
});


gridDS = new FDGrid({
	domId:'gridDS'
	,url:listUrlDS
	,columns:[
 		{text:'操作',name:'name',style:{width:'50px'},render:function(row){
 			return '<a href="#" onclick="'+FunUtil.createFun(window,'selectDataSource',row)+'">选择</a>';
 		}}
 		,{text:'名称',name:'dbName',style:{width:'200px'}}
 		,{text:'链接',name:'jdbcUrl'}
 	]
});

gridTable = new FDGrid({
	domId:'gridTable'
	,selectOption:{multiSelect:true}
	,url:listUrlTable
	,loadSearch:false
	,showPaging:false
	,showSetting:false
	,width:'800px'
	,height:'500px'
	,columns:[
 		{text:'表名',name:'tableName'}
 		,{text:'备注',name:'comment'}
 	]
});

gridTemplate = new FDGrid({
	domId:'gridTemplate'
	,selectOption:{multiSelect:true}
	,url:listUrlTemplate
	,loadSearch:false
		,columns:[
		{text:'模版名',name:'name'}
		,{text:'文件名',name:'fileName'}
		,{text:'保存路径',name:'savePath',style:{width:'120px','textAlign':'center'}}
		,{text:'内容',name:'content',style:{width:'50px','textAlign':'center'},render:formatContent}
	]
});

finishTree = new FDTree({
	domId:'tree'
	,childrenFieldName:'children'
	,clickToggle:true
	,onclick:function(node) {
		var attributes = node.attributes;
		if(attributes){
			$("#copyCode").show();
			//$('#codeContent').html(attributes.content);
			finishEditor.setValue(attributes.content);
			var suffix = getSuffix({fileName:node.text});
			changeMode(finishEditor,getMode(suffix));
			
			if(!bindCopyEvent.binded){
				bindCopyEvent();
				bindCopyEvent.binded = true;
			}
		}
	}
	,highlightHandler:function(node){
		if(node.children && node.children.length > 0){
			return false;
		}
		return true;
	}
});

schPanelTemplate = new FDFormPanel({
	controls:[
  		new FDTextBox({domId:'txt-templateName',name:'nameSch'})
	]
});

new FDButton({domId:'btnSch',text:'查询',onclick:function(){
	searchTemplate();
}});

function searchTemplate() {
	gridTemplate.search(schPanelTemplate.getData());
}

viewWin = new FDWindow({
	contentId:'viewWin'
	,title:'模板内容'
	,height:'450px'
	,width:'960px'
	,modal:false
	,buttons:[
		{text:'关闭',onclick:function(){
			viewWin.hide();
		}}
	]
});

finishWin = new FDWindow({
	contentId:'finishWin'
	,title:'代码生成'
	,height:'450px'
	,width:'960px'
	,modal:false
	,buttons:[
		{text:'关闭',onclick:function(){
			finishWin.hide();
		}}
	]
});

//选择数据源
function selectDataSource(row){
	
	MaskUtil.mask();
	
	testConnection(row,function(row){
		MaskUtil.unmask();
		
		step1Panel.getControl('dcId').setValue(row.dcId);
		
		showStep2(function(){		
			gridTable.search({dcId:row.dcId})
		})
	})
}

function testConnection(row,callback){
	MaskUtil.mask('测试连接中...');
	Action.post(ctx + 'connectionTest.do',row,function(e){
		MaskUtil.unmask();
		if(e.success){
			callback(row);
		}else{
			FDWindow.alert(e.message);
		}
	});
}

function formatContent(row){
	return '<a href="#" onclick="'+FunUtil.createFun(that,'showContent',row)+'">查看</a>';
}

//展示内容
this.showContent = function(row){
	viewWin.setTitle(row.name);
	viewWin.show();
	
	viewEditor.setValue(row.content);
}

function getSuffix(row) {
	var fileName = row.fileName;
	var index = fileName.lastIndexOf('.');
	if(index == -1) {
		return 'js';
	}
	return fileName.substring(index+1,fileName.length);
}

//显示第二步
function showStep1(){
	$('#step3').hide();
	$('#step2').hide();
	$('#stepMsg').html('第一步,选数据源');
	$('#step1').show(500);
}

//显示第二步
function showStep2(callback){
	$('#step3').hide();
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

//转向第三步
function goStep3(){
	
	var packageName = $.trim($('#packageName').val());
	if(!validatePackage(packageName)){
		FDWindow.alert('包名不正确');
		return false;
	}
	
	var rows = gridTable.getChecked();
	if(!validateTableSelect(rows)){
		FDWindow.alert('请选择表');
		return false;
	}
	
	showStep3(listTemplate);
}

//查询模板
function listTemplate(){
	gridTemplate.reload();
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

//完成
function finish(){
	var rows = gridTemplate.getChecked();
	
	if(rows && rows.length > 0){
		generate();
	}else{
		FDWindow.alert('请选择模板');
	}
}

//生成代码
function generate(){
	MaskUtil.mask('代码生成中,请稍后...');
	
	var data = getPostData();
	
	Action.jsonAsyncActByData(ctx + 'generatFile.do',data,function(rows){
		MaskUtil.unmask();
		if(FDLib.util.isArray(rows)){
			showGeneratCode(rows);
		}else{
			FDWindow.alert(rows.message);
		}
	});
}

function getPostData() {
	var data1 = step1Panel.getData();
	var data2 = step2Panel.getData();
	var data = $.extend({},data1,data2);
	var tcIds = [];
	var tableNames = [];
	
	var templateRows = gridTemplate.getChecked();
	
	for(var i=0,len=templateRows.length;i<len;i++){
		tcIds.push(templateRows[i].tcId);
	}
	
	data.tcIds = tcIds;
	
	var tableRows = gridTable.getChecked();
	for(var i=0,len=tableRows.length;i<len;i++){
		tableNames.push(tableRows[i].tableName);
	}
	
	data.tableNames = tableNames;
	
	return data;
}

//显示结果
function showGeneratCode(rows){
	var treeData = buildTreeData(rows);
	finishTree.setData(treeData);
	finishWin.show();
	reset();
}

//构建树菜单数据
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
	
function reset(){
	finishEditor.setValue('点击树菜单查看代码');
	$("#copyCode").hide();
}

// 绑定复制代码事件
function bindCopyEvent(){
	$('#copyCode').show().zclip({ 
		path:ctx + 'resources/js/plugin/jquery.zclip/ZeroClipboard.swf', 
		copy:function(){
			return finishEditor.getValue();
		},
		afterCopy:function(){ 
			FDWindow.alert('复制成功');
		} 
	});
}

