
var MsgUtil = {
	topMsg:function(msg,title){
		title = title || "提示";
		var $ = parent.$ || $;
		$.messager.show({
			title: title,
			msg: msg,
			showSpeed:300,
			style:{
				right:'',
				top:document.body.scrollTop+document.documentElement.scrollTop,
				bottom:''
			}
		});
	}
	,alert:function(msg,title,type){
		title = title || "提示";
		type = type || 'info'
		var $ = parent.$ || $;
		
		if(msg && msg.length > 1000){
			$.messager.show({
				title: title,
				msg: '<div style="height:300px;overflow-y: auto; overflow-x:hidden;">'+msg+'</div>',
				width:600,
				height:350,
				showType:null,
				timeout:0,
				style:{
					right:'',
					bottom:''
				}
			});
		}else{
			$.messager.alert(title,msg,type);    
		}
		
	}
	,error:function(msg,title){
		title = title || "错误";
		this.alert(msg,title,'error')
	}
	,confirm:function(msg,callback,title){
		title = title || "确认";
		var $ = parent.$ || $;
		$.messager.confirm(title,msg,function(r){    
		    if (r){    
		        callback();
		    } 
		});
	}
}  

	

