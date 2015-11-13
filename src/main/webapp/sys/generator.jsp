<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>生成代码</title>
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
.step{margin-bottom: 20px;padding:5px;border-bottom: 1px solid #ccc;}
</style>
</head>
<body>
	<div id="stepMsg" class="step">第一步,选择数据源</div>
	
	<div id="step1">
		<div id="gridDS"></div>
		<div id="step1Panel">
			<div id="txt-dcId"></div>
		</div>
	</div>
	
	<div id="step2" style="display: none;">
		<table width="100%">
			<tr>
				<td>
					<div id="step2Panel">
						<fieldset style="border: 1px solid #ccc;font-size: 12px;">
						    <legend>配置项</legend>
						    <table>
						    	<tr>
						    		<td>package: </td><td id="txt-packageName"></td>
						    		<td>文件编码: </td><td id="txt-charset"></td>	
						    	</tr>
						    </table>
						</fieldset>
					</div>
				</td>
			</tr>
			<tr>
				<td><div id="gridTable"></div></td>
			</tr>
		</table>
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

	<div id="viewWin" style="height: 430px;overflow: auto;">   
   		<textarea name="code" readonly="readonly" id="viewCode" style="height: 400px;width: 950px;"></textarea>
	</div> 
	
	<div id="finishWin" style="display: none;">   
		<a id="dlBtn" target="_blank" href="${ctx}downloadZip.do">下载ZIP</a>
		<a id="copyCode" href="javascript:void(0)" style="display: none;">复制代码</a>
		<table width="100%">
			<tr>
				<td valign="top" width="200"><div id="tree"></div></td>
				<td valign="top">
					<textarea id="codeContent" name="code">点击树菜单查看代码</textarea>
				</td>
			</tr>
		</table>
	</div>
	
	

<script type="text/javascript" src="${ctx}resources/js/plugin/jquery.zclip/jquery.zclip.min.js"></script>
<script type="text/javascript" src="generator.js"></script>
<script type="text/javascript">
viewEditor = CodeMirror.fromTextArea(document.getElementById("viewCode"), {
    tabMode: "indent",
    theme: "neat",
    lineNumbers: true,
    indentUnit: 4,
    readOnly:true,
    mode: "text/velocity"
});

viewEditor.setSize(950,400);

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
</script>
</body>
</html>