<%@page import="org.durcframework.autocode.common.UserContext"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div id="menu"></div>

<script type="text/javascript">
(function(){
	var treeData = [
	    {
		    text : "生成代码",
		    attributes : {
	            url : "generator/generator.jsp"
	        }
		}
	    ,{
		    text : "配置数据源",
		    attributes : {
	            url : "config/dataSource.jsp"
	        }
		}
	    ,{
		    text : "配置模板",
		    attributes : {
	            url : "config/template.jsp"
	        }
		}
	    <%if(UserContext.getInstance().isAdmin()){%>
	    ,{
		    text : "用户管理",
		    attributes : {
	            url : "config/backUser.jsp"
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
	            content : '<iframe src="'+ ctx + url+'" scrolling="yes" frameborder="0" style="width:100%;height:100%;"></iframe>'
	        });
	    }
	}

})();

</script>
