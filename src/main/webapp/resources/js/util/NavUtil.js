var NavUtil = {
	// 生成面包屑
	// <div class="crumb-list">
	// 	<i class="icon-font"></i>
	// 	<a href="${ctx}sys/home.jsp">首页</a>
	// <span class="crumb-step">&gt;</span>
	// 	<span class="crumb-name"><sitemesh:write property="title" /></span>
	// </div>
	// fromName,url
	make:function(fromName,url){
		url = url || document.location;
		fromName = fromName || document.title;
		var html = [
			'<div id="crumbId" class="crumb-list"><i class="icon-font"></i>'
				,'<a href="' + url + '">' + fromName + '</a>'
			,'</div>'
		];
		document.getElementById('nav-content').innerHTML = html.join('');
	}
}