<%@page import="org.durcframework.autocode.common.AutoCodeContext"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="../taglib.jsp"%>
<div class="sidebar-wrap">
	<div class="sidebar-title">
		<h1>菜单</h1>
	</div>
	<div class="sidebar-content">
		<ul class="sidebar-list">
			<li><a href="#"><i class="icon-font">&#xe003;</i>常用操作</a>
				<ul class="sub-menu">
					<li><a href="${ctx}sys/generator.jsp"><i class="icon-font">&#xe008;</i>生成代码</a></li>
					<li><a href="${ctx}sys/dataSource.jsp"><i class="icon-font">&#xe052;</i>配置数据源</a></li>
					<li><a href="${ctx}sys/template.jsp"><i class="icon-font">&#xe005;</i>配置模板</a></li>
					<c:if test="<%=AutoCodeContext.getInstance().isAdmin() %>">
						<li><a href="${ctx}sys/backUser.jsp"><i class="icon-font">&#xe014;</i>用户管理</a></li>
					</c:if>
				</ul>
			</li>
		</ul>
	</div>
</div>