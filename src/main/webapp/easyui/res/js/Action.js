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
	},
	post:function(url,data,succFun){
		this.jsonAsyncActByData(url,data,succFun);
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
			this._showError(errorMsg);
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
		title = title || "提示";
		var $ = parent.$ || $;
		$.messager.show({
			title: title,
			msg: msg,
			style:{
				right:'',
				top:document.body.scrollTop+document.documentElement.scrollTop,
				bottom:''
			}
		});
	}
}

function getFormData($form) {
	var data = {};
	var dataArr = $form.serializeArray();
	for(var i=0, len=dataArr.length;i<len; i++) {
		var item = dataArr[i];
		var name = item.name;
		var itemValue = item.value;
		var dataValue = data[name];
		
		if(dataValue) {
			if($.isArray(dataValue)) {
				value.push(itemValue);
			}else{
				data[name] = [dataValue,itemValue];
			}
		}else{
			data[name] = itemValue;
		}
		
	}

	return data;
}
