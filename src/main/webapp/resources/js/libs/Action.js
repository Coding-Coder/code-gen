var Action = {
	ajsxSucc:function(e,succFun){
		if(succFun){
			succFun(e);
		}
	},
	/**
	 * 异步请求
	 */
	jsonAsyncActByData:function(url,data,succFun){
		$.ajax({
			type: "POST",
			url: url,
			async:true,
			traditional:true,
			dataType: "json",
			data:data,
			success: function(e){
				Action.ajsxSucc(e,succFun);
			},
			error:function(hxr,type,error){
				Action._showError('后台出错，请查看日志');
			}
		});
	},
	post:function(url,data,succFun){
		this.jsonAsyncActByData(url,data,succFun);
	},
	/**
	 * 同步请求
	 */
	jsonSyncActByData:function(url,data,succFun){
		$.ajax({
			type: "POST",
			url: url,
			async:false,
			traditional:true,
			dataType: "json",
			data:data,
			success: function(e){
				Action.ajsxSucc(e,succFun);
			},
			error:function(hxr,type,error){
				Action._showError('后台出错，请查看日志');
			}
		});
	}
	,postSync:function(url,data,succFun){
		this.jsonSyncActByData(url,data,succFun);
	}
	/**
	 * 获取url后面的参数
	 */
	,getQueryString:function (key){ 
		var url=location.href; 
		url = url.toLowerCase();
		key = key.toLowerCase();
		if(url.indexOf('?')==-1)return "";	
		var urlarr = url.split("?");
		urlarr = urlarr[urlarr.length-1];
		urlarr = urlarr.split("&");	
		for(var i=0;i<urlarr.length;i++){
			var s=urlarr[i].split("=");
			if(s[0]==key){
				return s[1];
			}
		}
		return "";
	}
	,execResult:function(result,successFun){
		if(result && result.success){
			successFun && successFun(result);
		}else{
			var errorMsg = result.message;
			errorMsg = errorMsg + '<br>' + this.buildValidateError(result);
			FDWindow.alert(errorMsg);
		}
	}
	,buildValidateError:function(result){
		if(result.messages && result.messages.length > 0) {
			var validateErrors = result.messages;
			return '<span style="color:red;">' + validateErrors.join('<br>') + '</span>';
		}else{
			return "";
		}
	}
	,_showError:function(msg,title){
		FDWindow.alert(msg);
	}
}
