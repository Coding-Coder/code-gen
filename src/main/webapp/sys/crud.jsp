<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>增删改查</title>
</head>
<body>
<div class="search-wrap">
		<div class="search-content">
        	<table class="search-tab">
				<tr>
					<th>订单ID:</th><td id="txt-orderIdSch"></td>
					<th>城市:</th><td id="txt-cityNameSch"></td>
					<td>
						<div id="btnSch"></div>
					</td>
				</tr>
       		</table>
       </div>
   </div>
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
                    <th width="100"><i class="require-red">*</i>城市:：</th>
                    <td id="txt-cityName"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>手机号：</th>
                    <td id="txt-mobile"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>地址：</th>
                    <td id="txt-address"></td>
                </tr>
         	</tbody>
         </table>
   </div>

<script type="text/javascript">
(function(){
	
var schPanel;
var grid;
var formPanel;
var crudWin;

var listUrl = ctx + 'listOrderInfo.do'; // 查询
var addUrl = ctx + 'addOrderInfo.do'; // 添加
var updateUrl = ctx + 'updateOrderInfo.do'; // 修改
var delUrl = ctx + 'delOrderInfo.do'; // 删除
	
schPanel = new FDFormPanel({
	controls:[
		new FDTextBox({domId:'txt-orderIdSch',name:'orderIdSch'})
		,new FDTextBox({domId:'txt-cityNameSch',name:'cityNameSch'})
	]
});

new FDButton({domId:'btnSch',text:'查询',onclick:function(){
	search();
}});

grid = new FDGrid({
	domId:'grid'
	,url:listUrl
	,columns:[
		{text:'订单ID',name:'orderId'}
		,{text:'城市',name:'cityName'}
		,{text:'地址',name:'address'}
		,{text:'手机号',name:'mobile'}
		,{text:'创建时间',name:'createDate'}
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
	    new FDHidden({name:'orderId',defaultValue:0})
		,new FDTextBox({domId:'txt-cityName',name:'cityName',msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'城市不能为空'}
		     ,{rule:{maxLength:20},successClass:'green',errorClass:'require-red',errorMsg:'城市长度不能大于20'}
		     ]
		})
		,new FDTextBox({domId:'txt-mobile',name:'mobile',msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'手机号不能为空'}
		     ,{rule:{mobile:true},successClass:'green',errorClass:'require-red',errorMsg:'请输入正确的手机号码'}
		     ]
		})
		,new FDTextBox({domId:'txt-address',name:'address',msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'地址不能为空'}
		     ,{rule:{maxLength:100},successClass:'green',errorClass:'require-red',errorMsg:'地址长度不能大于100'}
		     ]
		})
	]
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

function search() {
	grid.search(schPanel.getData());
}
	
})();
</script>
</body>
</html>