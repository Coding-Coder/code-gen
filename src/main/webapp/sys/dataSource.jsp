<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>配置数据源</title>
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
                    <th>数据库类型：</th>
                    <td id="txt-driverClass"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>数据库名(Database Name)：</th>
                    <td id="txt-dbName"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>数据库地址(Host/IP)：</th>
                    <td id="txt-ip"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>端口(Port)：</th>
                    <td id="txt-port"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>用户名(Username)：</th>
                    <td id="txt-username"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>密码(Password)：</th>
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

var listUrl = ctx + 'listDataSource.do'; // 查询
var addUrl = ctx + 'addDataSource.do'; // 添加
var updateUrl = ctx + 'updateDataSource.do'; // 修改
var delUrl = ctx + 'delDataSource.do'; // 删除

var DB_ITEMS =[
   	{text:'MySql',value:'com.mysql.jdbc.Driver'}
	,{text:'SqlServer',value:'net.sourceforge.jtds.jdbc.Driver'}
];

var portMap = {
	'com.mysql.jdbc.Driver':3306
	,'net.sourceforge.jtds.jdbc.Driver':1433
}

grid = new FDGrid({
	domId:'grid'
	,url:listUrl
	,columns:[
		{text:'数据库名',name:'dbName',style:{width:'100px'}}
		,{text:'IP',name:'ip',style:{width:'200px'}}
		,{text:'端口',name:'port',style:{width:'80px'}}
		,{text:'驱动',name:'driverClass',style:{width:'200px'}}
		,{text:'账号/密码',style:{width:'80px'},name:'_account',render:function(row){
			return row.username + "/" + row.password;
		}}
	]
	,actionColumnConfig:{text:'操作',style:{'textAlign':'center',width:'200px'}}
	,actionButtons:[
		{text:'测试连接',onclick:testConnection}
		,{text:'修改',onclick:update}
		,{text:'删除',onclick:del}
	]
});

function testConnection(row){
	MaskUtil.mask('测试连接中...');
	Action.post(ctx + 'connectionTest.do',row,function(e){
		MaskUtil.unmask();
		if(e.success){
			FDWindow.alert('连接成功');
		}else{
			FDWindow.alert(e.message);
		}
	});
}

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
	    new FDHidden({name:'dcId',defaultValue:0})
	    ,new FDSelectBox({domId:'txt-driverClass',defaultValue:'com.mysql.jdbc.Driver',name:'driverClass',items:DB_ITEMS,showDefault:false})
		,new FDTextBox({domId:'txt-dbName',name:'dbName',msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'数据库名不能为空'}
		     ,{rule:{maxLength:20},successClass:'green',errorClass:'require-red',errorMsg:'数据库名不能大于20'}
		     ]
		})
	    ,new FDTextBox({domId:'txt-ip',name:'ip',msgId:'formMsg',width:200
	    	,nativeAttr:{'placeholder':'如:127.0.0.1'}
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'IP不能为空'}
		     ,{rule:{maxLength:20},successClass:'green',errorClass:'require-red',errorMsg:'IP不能大于20'}
		     ]
		})
	    ,new FDTextBox({domId:'txt-port',name:'port',defaultValue:3306,msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'端口不能为空'}
		     ,{rule:{positiveInt:true},successClass:'green',errorClass:'require-red',errorMsg:'请输入正确端口'}
		     ]
		})
		,new FDTextBox({domId:'txt-username',name:'username',msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'用户名不能为空'}
		     ,{rule:{maxLength:20},successClass:'green',errorClass:'require-red',errorMsg:'用户名长度不能大于20'}
		     ]
		})
		,new FDTextBox({domId:'txt-password',name:'password',msgId:'formMsg',width:200
			,validates:[
				{rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'密码不能为空'}
				,{rule:{maxLength:20},successClass:'green',errorClass:'require-red',errorMsg:'密码长度不能大于20'}
			]
		})
	]
});

formPanel.getControl('driverClass').addEvent('change',function(){
	var port = portMap[formPanel.getControl('driverClass').getValue()];
	formPanel.getControl('port').setValue(port);
});


$('#addNew').click(function(){
	add();
});

function add() {
	formPanel.add();
}

function update(rowData,rowIndex) {
	formPanel.update(rowData);
}


function del(row,rowIndex) {
	formPanel.del(row);
}

	
})();
</script>
</body>
</html>