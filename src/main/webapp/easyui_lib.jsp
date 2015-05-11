<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="taglib.jsp" %>
<link href="${ctx}favicon.ico" rel="SHORTCUT ICON">
<link rel="stylesheet" type="text/css" id="easyuiCssId" href="${easyui}themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${easyui}themes/icon.css">
<script type="text/javascript" src="${easyui}jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="${easyui}jquery.easyui.min.js"></script>
<script type="text/javascript" src="${easyui}locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="${ctx}js/common.min.js"></script>
<script type="text/javascript">
var ctx = '${ctx}';
if (typeof(jQuery) != 'undefined') {
    $(document).ajaxError(function (event, request, settings) {
        if (request.getResponseHeader("X-timeout") && request.status == 401) {
            // 页面跳转
        	top.location.href = ctx;
        }else{
        	alert("系统异常");
        }
    });
}
</script>
