<%@page import="org.durcframework.entity.ResultHolder"%>
<%@page import="java.util.Map"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../../taglib.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>学生列表</title>
<script type="text/javascript">
function goPage(index){
	document.getElementById('pageIndex').value = index;
	document.getElementById('frm').submit();
}

function searchStu(){
	goPage(1);
}

</script>
</head>
<body>

<form id="frm" action="${ctx}jspList.do" method="post">
	姓名(模糊查询):<input name="schName" type="text" value="${searchData.schName}">
	学号(全查询):<input name="schStuNo" type="text" value="${searchData.schStuNo}">
	<input id="pageIndex" name="pageIndex" type="hidden" value="${resultHolder.currentPageIndex}">
	<input type="button" onclick="searchStu()" value="查询">
</form>
<hr>
<table>
	<thead>
		<tr>
			<th></th>
			<th>学号</th>
			<th>姓名</th>
			<th>性别</th>
			<th>名族</th>
			<th>家庭地址</th>
			<th>手机号</th>
			<th>出生日期</th>
			<th>入学时间</th>
		</tr>
	</thead>
	<tbody>
	<!-- 
	查看durcframework.test.student.controller.StudentJspController类
	 -->
		<c:forEach items="${resultHolder.list}" var="stu" varStatus="stat">
			<tr>
				<td>${stat.index+1}</td>
				<td>${stu.stuNo}</td>
				<td>${stu.name}</td>
				<td>${stu.gender}</td>
				<td>${stu.nationality}</td>
				<td>${stu.address}</td>
				<td>${stu.mobile}</td>
				<td>${stu.birthday}</td>
				<td>${stu.registDate}</td>
			</tr>
		</c:forEach>
	</tbody>
	</table>

<a href="javascript:void(0)" onclick="goPage(${resultHolder.firstPageIndex})">首页</a>
<a href="javascript:void(0)" onclick="goPage(${resultHolder.prePageIndex})">上一页</a>
<a href="javascript:void(0)" onclick="goPage(${resultHolder.nextPageIndex})">下一页</a>
<a href="javascript:void(0)" onclick="goPage(${resultHolder.lastPageIndex})">尾页</a>
|
第 <c:out value="${resultHolder.currentPageIndex}"/>/<c:out value="${resultHolder.pageCount}"/> 页 | 
共<c:out value="${resultHolder.total}"/>条记录 

</body>
</html>