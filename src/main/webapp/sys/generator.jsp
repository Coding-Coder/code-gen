<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>生成代码</title>
<style type="text/css">
	.step{margin-bottom: 20px;padding:5px;border-bottom: 1px solid #ccc;}
	.codeArea{height:400px;overflow:auto;width:100%;font-size:13px;border: dotted #ccc 1px;padding: 3px;font-family: 宋体,Consolas,sans-serif ;}
	.code-right{margin-left: 20px;}
</style>
</head>
<body>
	<div id="stepMsg" class="step">第一步,选择数据源</div>
	
	<div id="step1">
		<div id="gridDS"></div>
	</div>
	
	<div id="step2" style="display: none;width: 600px;">
		<fieldset style="border: 1px solid #ccc;font-size: 12px;">
		    <legend>输入包名</legend>
		    package: <input id="packageName" type="text" style="width:260px; "/> (不填则表名作为包名)
		</fieldset>
		<br>
		<div id="gridTable"></div>
		<br>
		<button onclick="showStep1();">上一步</button>
		<button onclick="goStep3();">下一步</button>
	</div>
	
	<div id="step3" style="display: none;">
		<div class="search-wrap">
			<div class="search-content">
	        	<table class="search-tab">
					<tr>
						<th>模版名:</th><td id="txt-templateName"></td>
						<td>
							<div id="btnSch"></div>
						</td>
					</tr>
	       		</table>
	       </div>
	   </div>
	   <div class="result-wrap">
			<div class="result-content">
				<div id="gridTemplate"></div>
			</div>
	   </div>
		<br>
		<button onclick="showStep2();">上一步</button>
		<button onclick="finish();">生成代码</button>
	</div>
	

	<div id="viewWin" style="height: 400px;overflow: auto;">   
   		<div id="viewCode"></div>
	</div> 
	
	<div id="finishWin" style="padding:5px;display: none;">   
					<a id="copyCode" href="javascript:void(0)" style="display: none;">复制代码</a>
		<table width="100%">
			<tr>
				<td valign="top" width="200"><div id="tree"></div></td>
				<td valign="top">
					<div id="codeContent" class="codeArea">点击树菜单查看代码</div>
				</td>
			</tr>
		</table>
	</div>
	
	

<script type="text/javascript" src="${ctx}resources/js/plugin/jquery.zclip/jquery.zclip.min.js"></script>
<script type="text/javascript" src="generator.js"></script>
</body>
</html>