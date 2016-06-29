/**
 * 工具类
 * @class
 */
;FDLib.util = (function(){
	var 
    OP = Object.prototype,
    ARRAY_TOSTRING = '[object Array]',
    FUNCTION_TOSTRING = '[object Function]',
    doc = document,
   
    HTML_CHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;'
    };
    
    var paramMap = null;
    
    function getParamMap() {
		if(!paramMap) {
			var map = {};
			var query = location.search; 
			
			if(query && query.length>=1) {
				query = query.substring(1);
				var pairs = query.split("&");
				for(var i = 0; i < pairs.length; i++) { 
					var pos = pairs[i].indexOf('='); 
					if (pos == -1) continue; 
					var argname = pairs[i].substring(0,pos); 
					var value = pairs[i].substring(pos+1); 
					value = decodeURIComponent(value);
					map[argname] = value;
				}
			}
			
			paramMap = map;
		}
		return paramMap;
	}
    
	return {
		/**
		 * 是否为数组
		 * @return 是返回true
		 */
		isArray: function(o) {
			return OP.toString.apply(o) === ARRAY_TOSTRING;
		},
		/**
		 * 是否为布尔类型
		 * @return 是返回true
		 */
		isBoolean: function(o) {
			return typeof o === 'boolean';
		},
		/**
		 * 是否为函数类型
		 * @return 是返回true
		 */
		isFunction: function(o) {
			return (typeof o === 'function') || OP.toString.apply(o) === FUNCTION_TOSTRING;
		},
		/**
		 * 是否为空
		 * @return 是返回true
		 */
		isNull: function(o) {
			return o === null;
		},
		/**
		 * 是否为数字类型
		 * @return 是返回true
		 */
		isNumber: function(o) {
			return typeof o === 'number' && isFinite(o);
		},
		/**
		 * 是否为对象
		 * @return 是返回true
		 */
		isObject: function(o) {
			return (o && (typeof o === 'object' || this.isFunction(o))) || false;
		},
		/**
		 * 是否为字符串
		 * @return 是返回true
		 */
		isString: function(o) {
			return typeof o === 'string';
		},
		/**
		 * 是否为undefined
		 * @return 是返回true
		 */
		isUndefined: function(o) {
			return typeof o === 'undefined';
		},
		/**
		 * 转换HTML码,即&gt;转成'&gt;'
		 */
		escapeHTML: function (html) {
			return html.replace(/[&<>"'\/`]/g, 
				function (match) {
					return HTML_CHARS[match];
				});
		}
		/**
		 * 拷贝数据,c拷贝到o
		 * @param o 原数据
		 * @param c 拷贝的数据
		 * @return 返回o
		 */
		,apply:function(o, c) {		 
		    if(o && c && typeof c == 'object') {
		        for(var p in c) {
		            o[p] = c[p];
		        }
		    }
		    return o;
		}
		/**
		 * 克隆一个对象
		 * @param obj 可以是json数据,也可以是array
		 */
		,clone:function(obj) {
			var buf;
		    if(this.isObject(obj)) {   
		        buf = {};   
		        for(var key in obj) {   
		            buf[key] = this.clone(obj[key]);   
		        }   
		    }else if(this.isArray(obj)) {   
		        buf = [];
		        for(var i=0,len = obj.length; i<len; i++) {
		        	var item = obj[i];
		        	buf[i] = this.clone(item);
		        }
		    }else{   
		       buf = obj;  
		    }
		    
		    return buf;
		}
		/**
		 * 遍历数组,执行操作
		 * @param arr 数组
		 * @param callback 回调函数,第一个参数为数组中的元素,第二个是数组索引<br>
		 * 如果callback函数返回一个不是undefined类型的数据那么整个循环就结束,如:return false,return "111".
		 * 
		 * @return 如果callback有返回确切的值,则该each返回那个值,否则返回undefined
		 */
		,each:function(arr,callback) {
			for(var i=0,len=arr.length; i<len; i++) {
				var ret = callback(arr[i],i);
				if(!FDLib.util.isUndefined(ret)) {
					return ret;
				}
			}
		}
		/**
		 * 数组arr中是否包含o
		 * @param arr 数组
		 * @param o 
		 * @return 包含返回true
		 */
		,contains:function(arr,o) {
			return this.indexOf(arr,o) >= 0;
		}
		/**
		 * o在数组elementData中的位置,从0开始,没有则返回-1
		 * @param elementData 数组
		 * @param o 
		 */
		,indexOf:function(elementData,o) {
			if (o && this.isArray(elementData)) {
				for (var i = 0,size=elementData.length; i < size; i++){
	            	if (o == elementData[i]){
	                	return i;
	                }
				}
	        } 
	        return -1;
		}
		/**
		 * 格式化长度值,如'100px'变为100
		 * @return 返回int型的值
		 */
		,formatSize:function(size) {
			return parseInt(size.toString().replace(/\D*/g,''));
		}
		/**
		 * 返回长度值,如100px
		 */
		,getPX:function(size){
			size = this.formatSize(size);
			if(size && size > 0){
				return size + 'px';
			}
			return '';
		}
		/**
		 * 读cookie
		 * var name = FDLib.util.readCookie("myCookie")
		 * @param name cookie名
		 */
		,readCookie: function(name) {
		    var cookieValue = "";
		    var search = name + "=";
		    if (document.cookie.length > 0) {
		        offset = document.cookie.indexOf(search);
		        if (offset != -1) {
		            offset += search.length;
		            end = document.cookie.indexOf(";", offset);
		            if (end == -1) end = document.cookie.length;
		            cookieValue = unescape(document.cookie.substring(offset, end))
		        }
		    }
		    return cookieValue;
		}
		/**
		 * 写cookie
		 * FDLib.util.writeCookie("myCookie", "my name", 24);
		 * @param name cookie名
		 * @param value cookie值
		 * @param hours 有效时间,小时
		 */
		,writeCookie: function(name, value, hours) {
		    var expire = "";
		    if (hours != null) {
		        expire = new Date((new Date()).getTime() + hours * 3600000);
		        expire = "; expires=" + expire.toGMTString();
		    }
		    document.cookie = name + "=" + escape(value) + expire;
		}
		/**
		 * 获取网址参数,http://www.xx.com/p-javascript_location.shtml?part=1
		 * FDLib.util.getParam('part'); // 1
		 */
		,getParam:function(key) {
			return getParamMap()[key];
		}
	};
})();
