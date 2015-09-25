<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>配置模板</title>
</head>
<body>
	<div class="search-wrap">
		<div class="search-content">
        	<table class="search-tab">
				<tr>
					<th>模板名:</th><td id="txt-nameSch"></td>
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
                 <a id="addNew" href="#"><i class="icon-font"></i>新增</a>
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
                    <th width="100"><i class="require-red">*</i>模板名：</th>
                    <td id="txt-name"></td>
                </tr>
                <tr>
                    <th><i class="require-red">*</i>内容：</th>
                    <td id="txt-content"></td>
                </tr>
         	</tbody>
         </table>
   </div>
   
	<div id="viewWin" style="height: 400px;overflow: auto;">   
   		<div id="viewCode"></div>
	</div> 

<script type="text/javascript">
(function(){
	
var schPanel;
var grid;
var formPanel;
var crudWin;
var viewWin;
var that = this;

var listUrl = ctx + 'listTemplate.do'; // 查询
var addUrl = ctx + 'addTemplate.do'; // 添加
var updateUrl = ctx + 'updateTemplate.do'; // 修改
var delUrl = ctx + 'delTemplate.do'; // 删除
	
schPanel = new FDFormPanel({
	controls:[
		new FDTextBox({domId:'txt-nameSch',name:'nameSch'})
	]
});

new FDButton({domId:'btnSch',text:'查询',onclick:function(){
	search();
}});

$('#addNew').click(function(){
	add();
	return false;
});

grid = new FDGrid({
	domId:'grid'
	,url:listUrl
	,width:'800px'
	,columns:[
		{text:'模版名',name:'name'}
		,{text:'内容',name:'content',style:{'textAlign':'center'},render:formatContent}
	]
	,actionButtons:[
		{text:'修改',onclick:update}
		,{text:'删除',onclick:del}
	]
});

function formatContent(row){
	return '<a href="#" onclick="'+FunUtil.createFun(that,'showContent',row)+'">查看</a>';
}

//展示内容
this.showContent = function(row){
	$('#viewCode').html(HtmlUtil.parseToHtml(row.content));
	viewWin.show();
}

crudWin = new FDWindow({
	contentId:'crudWin'
	,height:'450px'
	,width:'960px'
	,modal:false
	,buttons:[
		{text:'保存',onclick:function(){
			formPanel.save();
		}}
		,{text:'取消',onclick:function(){
			crudWin.hide();
		}}
	]
});

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
	    new FDHidden({name:'tcId',defaultValue:0})
		,new FDTextBox({domId:'txt-name',name:'name',msgId:'formMsg',width:200
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'模版名不能为空'}
		     ,{rule:{maxLength:20},successClass:'green',errorClass:'require-red',errorMsg:'模版名长度不能大于20'}
		     ]
		})
		,new FDTextArea({domId:'txt-content',name:'content',msgId:'formMsg',width:800,height:360
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'模板内容不能为空'}
		     ]
		})
	]
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
<!-- 保持session -->
<iframe src="${ctx}keepSession.jsp" frameborder="0" height="0" width="0" style="height: 0px;width: 0px;"></iframe>

</body>
</html>