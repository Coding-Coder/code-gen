<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>添加模板</title>
</head>
<body>
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
			<tr>
				<td></td>
				<td>
	                 <input id="updatePswdBtn" class="btn btn-primary btn6 mr10" value="保存" type="button">
	                 <input class="btn btn6" onclick="history.go(-1)" value="返回" type="button">
            	 </td>
			</tr>            
     	</tbody>
     </table>

<script type="text/javascript">
(function(){
var formPanel;
var that = this;

var addUrl = ctx + 'addTemplate.do'; // 添加

formPanel = new FDFormPanel({
	// 服务器端的请求
	crudUrl:{
		add: addUrl
	}
	,controls:[
	    new FDHidden({name:'tcId',defaultValue:0})
		,new FDTextBox({domId:'txt-name',name:'name',msgId:'formMsg',width:300
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'模版名不能为空'}
		     ,{rule:{maxLength:20},successClass:'green',errorClass:'require-red',errorMsg:'模版名长度不能大于20'}
		     ]
		})
		,new FDTextArea({domId:'txt-content',name:'content',msgId:'formMsg',width:900,height:400
			,validates:[
		     {rule:{notNull:true},successClass:'green',errorClass:'require-red',errorMsg:'模板内容不能为空'}
		     ]
		})
	]
});

formPanel.setUrl(addUrl);

$('#updatePswdBtn').click(function(){
	save();
});

function save() {
	var result = formPanel.validate();
	if(!result) {
		return false;
	}
	formPanel.submit(function() {
		history.go(-1);
	});
}
	
})();
</script>
<!-- 保持session -->
<iframe src="${ctx}keepSession.jsp" frameborder="0" height="0" width="0" style="height: 0px;width: 0px;"></iframe>

</body>
</html>