<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>后台管理</title>
<%@ include file="../easyui_lib.jsp" %>
</head>
<body>

	<div id="toolbar">
	    <a id="addBtn" class="easyui-linkbutton" iconCls="icon-add" plain="true">添加</a>
	</div>
    
    <table id="dg"></table>
    
    <div id="dlg" class="easyui-dialog" style="width:520px;padding:10px 20px"
            closed="true" modal="true" buttons="#dlg-buttons">
        <form id="fm" method="post">
            <table class="insert-tab">
                <tr>
		            <td class="fm_lab">数据库类型:</td><td>
		            	<select name="driverClass">
		            		<option value="com.mysql.jdbc.Driver">MySql</option>
		            		<option value="'net.sourceforge.jtds.jdbc.Driver">SqlServer</option>
		            	</select>
		        </tr>
                <tr>
		            <td class="fm_lab"><s>*</s>数据库名(Database Name):</td><td><input name="dbName" type="text" class="easyui-validatebox" required="true"></td>
		        </tr>
                <tr>
		            <td class="fm_lab"><s>*</s>数据库地址(Host/IP):</td><td><input name="ip" type="text" class="easyui-validatebox" required="true"></td>
		        </tr>
                <tr>
		            <td class="fm_lab"><s>*</s>端口(Port):</td><td><input name="port" type="text" class="easyui-validatebox" required="true"></td>
		        </tr>
                <tr>
		            <td class="fm_lab"><s>*</s>用户名(Username):</td><td><input name="username" type="text" class="easyui-validatebox" required="true"></td>
		        </tr>
                <tr>
		            <td class="fm_lab"><s>*</s>密码(Password):</td><td><input name="password" type="text" class="easyui-validatebox" required="true"></td>
		        </tr>
                </table>
        </form>
    </div>
    <div id="dlg-buttons">
        <a id="saveBtn" class="easyui-linkbutton" iconCls="icon-ok">保存</a>
        <a id="cancelBtn" class="easyui-linkbutton" iconCls="icon-cancel">取消</a>
    </div>
    
<script type="text/javascript">
(function(){
var that = this;

var pk = 'dcId'; // java类中的主键字段
var listUrl = ctx + 'listDataSource.do'; // 查询
var addUrl = ctx + 'addDataSource.do'; // 添加
var updateUrl = ctx + 'updateDataSource.do'; // 修改
var delUrl = ctx + 'delDataSource.do'; // 删除
var submitUrl = ''; // 提交URL

var toolbarId = 'toolbar'; // 工具条ID

var $dialog = $('#dlg'); // 窗口
var $form = $('#fm'); // 表单
var $grid = $('#dg'); // 表格

var $saveBtn = $('#saveBtn'); // 保存按钮
var $cancelBtn = $('#cancelBtn'); // 取消按钮
var $addBtn = $('#addBtn'); // 添加按钮

var DB_ITEMS =[
   	{text:'MySql',value:'com.mysql.jdbc.Driver'}
	,{text:'SqlServer',value:'net.sourceforge.jtds.jdbc.Driver'}
];

var portMap = {
	'com.mysql.jdbc.Driver':3306
	,'net.sourceforge.jtds.jdbc.Driver':1433
}

// 初始化表格
$grid.datagrid({    
	url:listUrl
   	,columns:[[
		 {title:'数据库名',field:'dbName'}
		 ,{title:'IP',field:'ip'}
		 ,{title:'端口',field:'port'}
         ,{title:'驱动',field:'driverClass'}
		 ,{title:'账号/密码',field:'_account',formatter:function(val,row){
			 return row.username + "/" + row.password;
		 }}
         ,{field:'_operate',title:'操作',align:'center',formatter:function(val,row){
   	    	 return '<a href="#" onclick="'+FunUtil.createFun(that,'testConnection',row)+'">连接测试</a>'
   	    	 +'<a href="#" onclick="'+FunUtil.createFun(that,'edit',row)+' return false;">修改</a>'
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

window.testConnection = function(row){
	MaskUtil.mask('测试连接中...');
	
	Action.jsonAsyncActByData(ctx + 'connectionTest.do',row,function(e){
		MaskUtil.unmask();
		if(e.success){
			MsgUtil.alert('连接成功');
		}else{
			MsgUtil.error(e.message);
		}
	});
}

})();
</script>
</body>
</html>