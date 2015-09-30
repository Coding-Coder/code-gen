var HtmlUtil = (function(){
	
	var parseHtmlMap = {
		"<":"&lt;"
		,">":"&gt;"
		,"\r\n":"<br>"
		,"\r":"<br>"
		,"\n":"<br>"
		," ":"&nbsp;"
		,"\t":"&nbsp;&nbsp;&nbsp;&nbsp;"
	}
	
	var parseTextMap = {
		"\&nbsp;":' '
		,"\<br ?\/?\>":'\r\n'
		,"\&lt;":"<"
		,"\&gt;":">"
	}
	
	function parse(content,map){
		for(var key in map){
			content = content.replace(new RegExp(key, "g"),map[key]);
		}
		return content;
	}
	
	return {
		parseToHtml:function(text){
			return parse(text,parseHtmlMap);
		}
		,parseToText:function(html){
			return parse(html,parseTextMap);
		}
	}
	
}());