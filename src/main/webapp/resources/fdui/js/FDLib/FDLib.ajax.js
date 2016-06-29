/**
 * Ajax工具类
 * @class
 */
FDLib.ajax = {
	/**
	 * 提交请求
	 * @param options
	 * { url:'',params:{},success:function(){},error:function(){} }
	 */
	request:function(options) {
		var url = options.url;
		var params = options.params || {};
		var callback = options.success || function(e){alert(e)};
		var error = options.error || function(e){alert('数据请求失败')};
		var xhr = this.createXhrObject();
		
		xhr.onreadystatechange = function() {
			if(xhr.readyState !== 4) {
				return;
			}
			var status = xhr.status;
			var jsonData = '';
			try{
				jsonData = JSON.parse(xhr.responseText);
			}catch(e){
				jsonData = JSON.parse('{"message":"后台请求错误(status:' + status + ')"}');
			}
			if(status === 200 || status === 0) {
				callback(jsonData);
			} else {
				error(jsonData);
			}
		};
		
		xhr.open('POST',url,false);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
		xhr.send(this.formatParam(params) || null);
	}
	,formatParam:function(params) {
		var retArr = [];
		for(var key in params) {
			var val = params[key];
			var para = key + "=" + encodeURIComponent(val);
			if(this._isArray(val)) {
				para = this._formatArrParam(key,val);
			}
			if(para) {
				retArr.push(para);
			}
		}
		if(retArr.length == 0) {
			return '';
		}
		
		return retArr.join('&');
	}
	// 将数组转换成键值格式
	//  id:[1,2,3] --> id=1&id=2&id=3
	,_formatArrParam:function(key,vals) {
		if(vals.length == 0) {
			return '';
		}
		var ret = [];
		for(var i=0,len=vals.length; i<len; i++) {
			ret.push(key + "=" + encodeURIComponent(vals[i]));
		}
		return ret.join('&');
	}
	,_isArray:function(o) {
		return Object.prototype.toString.apply(o)
			=== '[object Array]';
	}
	/**
	 * 创建XHR对象
	 * @private
	 */
	,createXhrObject:function() {
		var methods = [
			function(){ return new XMLHttpRequest();}
			,function(){ return new ActiveXObject('Msxml2.XMLHTTP');}
			,function(){ return new ActiveXObject('Microsoft.XMLHTTP');}
		];
		
		for(var i=0,len=methods.length; i<len; i++) {
			try {
				methods[i]();
			} catch (e) {
				continue;
			}
			
			this.createXhrObject = methods[i];
			return methods[i]();
		}
		
		throw new Error("创建XHR对象失败");
	}
};

