<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户管理</title>
</head>
<body>
   <div class="result-wrap">
		<div class="result-title">
             <div class="result-list">
                 <a id="addNew" href="javascript:void(0)"><i class="icon-font"></i>新增</a>
             </div>
		</div>
		<div class="result-content">
			<div id="grid"></div>
		</div>
   </div>
   
   <div id="crudWin" style="display: none;">
   		<table class="insert-tab" width="100%">
   			<caption id="formMsg"></caption>
        	<tbody>
                <tr>
                    <th width="100"><i class="require-red">*</i>用户名：</th>
                    <td id="txt-username"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>密码：</th>
                    <td id="txt-password"></td>
                </tr>
         	</tbody>
         </table>
   </div>

<script type="text/javascript">
(function(){
	
var grid;
var formPanel;
var crudWin;

var listUrl = ctx + 'listBackUser.do'; // 查询
var addUrl = ctx + 'addBackUser.do'; // 添加
var updateUrl = ctx + 'updateBackUser.do'; // 修改
var delUrl = ctx + 'delBackUser.do'; // 删除
	
grid = new FDGrid({
	domId:'grid'
	,url:listUrl
	,columns:[
		{text:'用户名',name:'username'}
		,{text:'密码',name:'password'}
		,{text:'添加时间',name:'addTime'}
	]
	,actionButtons:[
		{text:'修改',onclick:update}
		,{text:'删除',onclick:del}
	]
});

crudWin = new FDWindow({
	contentId:'crudWin'
	,buttons:[
		{text:'保存',onclick:function(){
			formPanel.save();
		}}
		,{text:'取消',onclick:function(){
			crudWin.hide();
		}}
	]
});

formPanel = new FDFormPanel({
	grid:grid
	,win:crudWin
	// 服务器端的请求
	,crudUrl:{
		add: addUrl
		,update: updateUrl
		,del: delUrl
	}
	,controls:[
		new FDTextBox({domId:'txt-username',name:'username',msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'用户名不能为空'}
		     ,{rule:{maxLength:20},successClass:'green',errorClass:'require-red',errorMsg:'用户名长度不能大于20'}
		     ]
		})
		,new FDTextBox({domId:'txt-password',name:'password',msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'密码不能为空'}
		     ]
		})
	]
});

$('#addNew').click(function(){
	add();
});

function add() {
	formPanel.getControl('username').enable();
	formPanel.add();
}

function update(rowData,rowIndex) {
	formPanel.getControl('username').disable();
	formPanel.update(rowData);
}


function del(row,rowIndex) {
	formPanel.del(row);
}

})();
</script>
</body>
</html>