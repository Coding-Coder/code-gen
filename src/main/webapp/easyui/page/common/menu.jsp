<%@page import="org.durcframework.autocode.common.AutoCodeContext"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../../taglib.jsp" %>
<div id="menu"></div>

<script type="text/javascript">
(function(){
	var treeData = [
	    {
		    text : "生成代码",
		    attributes : {
	            url : "page/generator.jsp"
	        }
		}
	    ,{
		    text : "配置数据源",
		    attributes : {
	            url : "page/dataSource.jsp"
	        }
		}
	    ,{
		    text : "配置模板",
		    attributes : {
	            url : "page/template.jsp"
	        }
		}
	    <%if(AutoCodeContext.getInstance().isAdmin()){%>
	    ,{
		    text : "用户管理",
		    attributes : {
	            url : "page/backUser.jsp"
	        }
		}
	    <%}%>
	    
	];
	$("#menu").tree({
	    data : treeData,
	    lines : true,
	    onClick : function (node) {
	        if (node.attributes) {
	        	openTab(node.text, node.attributes.url);
	        }
	    }
	});

	//在右边center区域打开菜单，新增tab
	function openTab(text, url) {
	    if ($("#mainTab").tabs('exists', text)) {
	        $('#mainTab').tabs('select', text);
	    } else {
	        $('#mainTab').tabs('add', {
	            title : text,
	            closable : true,
	           // href : ctx + url
	            content : '<iframe src="${easyuiCtx}'+ url+'" scrolling="yes" frameborder="0" style="width:100%;height:100%;"></iframe>'
	        });
	    }
	}

})();

</script>
