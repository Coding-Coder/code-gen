/**
 * 提供类的接口创建,类的继承操作
 * @example 示例:
 * var Book = createInterface(["getBookName","getPunishDate"]);
 * FDLib.extend(subClass,supClass);
 * @class
 */
var FDLib = (function(){
	var doc = document;
	/** @private */
	var Interface = function(_methods) {
		if (arguments.length != 1) {
			throw new Error("创建接口参数只能有一个,并且为数组类型");
		}
		this.methods = [];
		this._isInterfaceType = true;

		for (var i = 0, len = _methods.length; i < len; i++) {
			if (typeof _methods[i] !== "string") {
				throw new Error("定义接口中的方法必须为字符串类型");
			}
			this.methods.push(_methods[i]);
		}
	}
	
	// 是否调试模式
	/** @private */
	var isDebug = false;
	// JS目录
	/** @private */
	var dir = '/';
	// 初始化函数
	/** @private */
	var initFun = null;
	// 给已经加载过的js做个标记
	/** @private */
	var js_store = {};
	// 存放JS的DOM节点
	/** @private */
	var des_dom = null;
	// 存放JS路径
	/** @private */
	var jsPaths = [];
		
	// 是否需要导入
	/** @private */
	function isNeedImport(jsName) {
		if(!js_store[jsName]){
			js_store[jsName] = true;
			return true;
		}else{
			return false;
		}
	}
	
	// 获取JS的路径
	/** @private */
	function getJsSrc(jsName) {
		var jsInfo = FDLib.JsMap[jsName];
		var path = jsInfo.path;
		if(!path) {
			throw new Error('没有找到[' + jsName + ']JS文件路径');
		}
		if(!isDebug){
			var index = path.lastIndexOf('.');
			path = path.substring(0,index) + '.min.js';
		}
		return dir + path;
	}
	
	// 加载JS文件
	/** @private */
	function doLoadJS(url, success) {
		var script = document.createElement('script');
		script.type = "text/javascript";
		script.src = url;
		if(script.readyState){
		    script.onreadystatechange = function(){
		        if (script.readyState == "loaded" || script.readyState == "complete"){
		            success();
		        }
		    };
		}else{
		    script.onload = function(){
				success(); 
			};
		}
		des_dom.appendChild(script);
	}
	
	/** @private */
	function loadJS() {
		// 取第一个元素,并从数组中删除
		var jsPath = jsPaths.shift();
		
		if(jsPath){
			doLoadJS(jsPath,function(){
				loadJS(); // 加载下一个JS
			});
		}else{ // jsPaths中没有元素,表示JS全部加载完毕,执行初始化函数
			runInit();
		}
	}
	
	/** @private */
	function startLoadJS() {
		des_dom = (doc.body || doc.getElementsByTagName('body')[0])
				|| doc.getElementsByTagName('HEAD')[0];
				
		loadJS();
	}
	
	/** @private */
	function runInit() {
		if(initFun){
			initFun();
		}
	}
	
	/** @private */
	// 保存JS路径
	function saveJsPath(jsName) {
		if(isNeedImport(jsName)) {
			var jsInfo = FDLib.JsMap[jsName];
			if(!jsInfo) {
				throw new Error('没有找到名为[' + jsName + ']的JS文件');
			}
			// 获取其依赖的JS
			var requireJS = FDLib.JsMap[jsName].require || [];
			// 先导入依赖的JS
			for(var i=0,len=requireJS.length; i<len; i++) {
				saveJsPath(requireJS[i]);
			}
			
			var src = getJsSrc(jsName);
			jsPaths.push(src);
		}
	}
	
	var lib = {
		/**
		 * 创建接口
		 * 如:var Book = createInterface(["getBookName","getPunishDate"]);
		 * @param:methods:接口中的方法数组类型 
		 * 
		 */
		createInterface : function(methods) {
			return new Interface(methods);
		}
		/**
		 * 继承原型
		 * <pre>
		 * 子类中调用父类的函数:
		 * Man.superclass.sayName.call(this);
		 * 子类中调用父类构造函数:
		 * Man.superclass.constructor.call(this,param);
		 * </pre>
		 * @param subClass 子类函数名
		 * @param superClass 父类函数名
		 */
		,extend:function(subClass,superClass){
			var F = function(){};
			F.prototype = superClass.prototype;
			subClass.prototype = new F();			
			subClass.prototype.constructor = subClass;
			
			subClass.superclass = superClass.prototype;
			if(superClass.prototype.constructor == Object.prototype.constructor) {
				superClass.prototype.constructor = superClass;
			}
		}
		/**
		 * 实现接口
		 * implement(subClassInstance,interface1,interface2,...);
		 * @param subClassInstance 子类对象实例
		 */
		,implement:function(subClassInstance){			
			for(var i=1,len = arguments.length; i<len; i++) {
				var interfac = arguments[i];
				if(!interfac._isInterfaceType) {
					throw new Error("类必须实现接口类型");
				}
				for(var j=0,methodLen = interfac.methods.length; j<methodLen; j++) {
					var method = interfac.methods[j];
					if(!subClassInstance[method] 
						|| typeof subClassInstance[method] !== "function") {
						throw new Error("类没有实现接口中的[ " + method + " ]方法");
					}
				}
			}
		}
		/**
		 * 根据id获取dom节点
		 * @return 返回dom对象
		 */
		,getEl:function(id) {
			return doc.getElementById(id);
		}
		/**
		 * 火狐的日志输出
		 */
		,log:function(s) {
			window.console && window.console.log(s);
		}
		/**
		 * 设置FDUI的存放路径
		 * @param _dir 路径
		 */
		,setDir:function(_dir) {
			dir = _dir;
			return this;
		}
		/**
		 * 开启调试状态.
		 * 当调试状态开启时,加载未压缩的js文件,反之加载压缩后的.
		 */
		,openDebug:function() {
			isDebug = true;
			return this;
		}
		/**
		 * 导入JS,可以单个导入,也可以批量导入<br>
		 * 单个导入传入一个字符串,批量导入传入一个数组,数组中存放字符串
		 * @param jsName JS文件名称,无.js后缀.可以传入字符串或数组
		 */
		,importJS:function(jsNames) {
			
			if(typeof jsNames === 'string') {
				saveJsPath(jsNames);
			}else{
				for(var i=0,len=jsNames.length; i<len; i++) {
					saveJsPath(jsNames[i]);
				}
			}
			// 设置JS的数量
			scriptCount = jsPaths.length;
			
			return this;
		}
		/**
		 * 导入JS,可以单个导入,也可以批量导入<br>
		 * FDLib.loadJs(['FDGrid,FDTree'],function(){
		 *     alert(1)
		 * });
		 * @param jsName JS文件名称,无.js后缀.可以传入字符串或数组
		 * @param initHandler 初始化函数
		 */
		,loadJs:function(jsNames,initHandler){
			this.importJS(jsNames);
			
			initFun = initHandler;
			startLoadJS();
		}
		/**
		 * 初始化函数
		 * @example 实例:
		 * FDLib.init(function(){
		 *     alert('hello world');
		 * });
		 */
		,init:function(callback){
			initFun = callback;
			startLoadJS();
		}
		/**
		 * 添加hover效果,FDLib.addHoverEffect(dom);
		 */
		,addHoverEffect:function(dom,hoverClassName) {
			hoverClassName = hoverClassName || 'ui-state-hover';
			FDLib.event.addEvent(dom,'mouseover',function(e){
				// 这里的this等同于dom
				// alert(dom === this)
				FDLib.dom.addClass(this,hoverClassName);
			});
			FDLib.event.addEvent(dom,'mouseout',function(e){
				FDLib.dom.removeClass(this,hoverClassName);
			});
		}
	};

	return lib;
	
})();

/**
 * 值域控件的接口,只提供方法<br>
 * 方法列表:<br>
 * <pre>
getValue
setValue
getData
validate
disable
enable
renderTo
addEvent
reset
 * </pre>
 * @class
 */
var FDField = FDLib.createInterface([
	'getValue'
	,'setValue'
	,'getData'
	,'validate'
	,'disable'
	,'enable'
	,'render'
	,'addEvent'
	,'reset'
]);

/**
 * 所有组件的接口,后面的组件都要实现这个类
 * 提供hide(),show()两个方法
 * @class
 */
var FDControl = FDLib.createInterface([
	'hide'
	,'show'
]);

/**
 * @private
 */
FDControl.controlCount = 0;

/**
 * 生成组件唯一标识
 * @return 返回唯一标识
 */
FDControl.generateCount = function() {
	return FDControl.controlCount++;
}

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

/**
 * HTML节点工具类
 * @class
 */
FDLib.dom = {
	/**
	 * 包裹节点,相当于jquery的warp
	 * @param target dom对象
	 * @param html 可以是dom对象也可以是string
	 */
	wrap:function(target,html) {
		var wrap = html;
		if(FDLib.util.isString(html)) {
			if(document.createRange) {
				var range = document.createRange();
	      		range.selectNodeContents(target);
	      		wrap = range.createContextualFragment(html).firstChild;
			} else {
		    	wrap = document.createElement(html);
		    }
		}
		target.parentNode.replaceChild(wrap,target);
		wrap.appendChild(target);
		
		return wrap;
	}
	/**
	 * 隐藏节点
	 * @param dom DOM对象
	 */
	,hideDom:function(dom) {
		if(dom) {
			dom.style.display = "none";
		}
	}
	/**
	 * 显示节点
	 * @param dom DOM对象
	 */
	,showDom:function(dom) {
		if(dom) {
			dom.style.display = "";
		}
	}
	/**
	 * 添加元素的class属性
	 * @param dom DOM对象,如input,div等
	 * @param classNames class名,字符串格式,多个用空格隔开.如:"enable","enable selected"
	 */
	,addClass:function(dom,classNames) {
		if(typeof classNames == 'string'){
			var classNameArr = (classNames || "").split(/\s+/);
			var domClasses = (dom.className).toString().split(/\s+/);
			
			for(var i=0,len=classNameArr.length; i<len; i++) {
				var className = classNameArr[i];
				if(this.hasClass(dom,className)){
					continue;
				}
				if(dom.nodeType == 1) {
					domClasses.push(className);
				}
			}
			dom.className = domClasses.join(' ');
		}
	}
	/**
	 * 移除元素的class属性
	 * @param dom DOM对象,如input,div等
	 * @param className class名,字符串格式,多个用空格隔开.如:"enable","enable selected"
	 */
	,removeClass:function(dom,classNames) {
		if(dom.nodeType == 1) {
			var classNameArr = (classNames || "").split(/\s+/);
			var domClasses = (dom.className).toString().split(/\s+/);
			
			for(var i=0,len=classNameArr.length; i<len; i++) {
				var className = classNameArr[i];
				
				for(var j=domClasses.length-1; j>=0; j--) {
					if(domClasses[j] == className) {
						domClasses[j] = '';
						break;
					}
				}
			}
			dom.className = domClasses.join(' ');
		}
	}
	/**
	 * 判断DOM是否含有className
	 * @param dom DOM 对象
	 * @param className 字符串格式
	 */
	,hasClass:function(dom,className) {
		var classNameArr = (dom.className).toString().split(/\s+/);
		for(var i=classNameArr.length-1; i>=0; i--) {
			if(classNameArr[i] == className) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 给DOM对象绑定style
	 * @param dom DOM对象
	 * @param styleJson 存放样式,如:{'backgroundColor':'red','border':'1px'};采用驼峰式写法
	 */
	,bindDomStyle:function(dom,styleJson) {
		for(var styleName in styleJson) {
			dom.style[styleName] = styleJson[styleName];
		}
	}
	/**
	 * 获取元素距离页面左边的值,相当于jquery中的offset().left
	 * @return 返回int类型的值
	 */
	,getOffsetX:function(element) {
		var actualLeft = element.offsetLeft;
		var current = element.offsetParent;
	
		while (current !== null){
			actualLeft += current.offsetLeft;
			current = current.offsetParent;
		}
	
		if (document.compatMode == "BackCompat"){
			var elementScrollLeft = document.body.scrollLeft;
		} else {
			var elementScrollLeft = document.documentElement.scrollLeft; 
		}
	
		return actualLeft - elementScrollLeft;
	}
	/**
	 * 获取元素距离页面顶部的值,相当于jquery中的offset().top
	 * @return 返回int类型的值
	 */
	,getOffsetY:function(element) {
		var actualTop = element.offsetTop;
		var current = element.offsetParent;

		while (current !== null){
			actualTop += current. offsetTop;
			current = current.offsetParent;
		}

		if (document.compatMode == "BackCompat"){
			var elementScrollTop = document.body.scrollTop;
		} else {
			var elementScrollTop = document.documentElement.scrollTop; 
		}

		return actualTop - elementScrollTop;
	}
	/**
	 * 等同于jquery.offset()
	 * @return 返回 {letf:int,top:int}
	 */
	,getOffset:function(dom) {
		return {left:this.getOffsetX(dom),top:this.getOffsetY(dom)};
	}
	/**
	 * 获取子节点
	 * @param dom 当前dom
	 * @param childTag 字符串,子节点类型,如'a','div'
	 * @return 返回子节点数组
	 */
	,getChildNodes:function(dom,childTag) {
		return dom.getElementsByTagName(childTag)
	}
	/**
	 * 移除DOM对象
	 * @param dom 被移除的DOM
	 */
	,removeDom:function(dom){
		if(dom && dom.parentNode){
			dom.parentNode.removeChild(dom);
		}
	}
};

/**
 * form组件的父类,提供默认的属性,和方法
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDComponent = function(options) {
	FDLib.implement(this,FDControl);
	
	this.options = FDLib.util.apply(this.getOptions(),options);

	this.contentDoms = this.refreshContent();	
	
	this.render();
	
	this.initEvent();
	
	this.setBounds(this.options.width,this.options.height);
}

FDComponent.prototype = {
/**
 * 获取组件的默认属性
   @return <pre><code>返回json数据类型
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,renderable:true // 是否画出控件,false则不画出,这样在HTML中就不显示
}</code></pre>
 */
	getOptions:function() {
		return {
			domId:null
			,label:""
			,labelAlign:'right'
			,labelValign:'middle'
			,name:""
			,width:""
			,height:""
			,validates:[]
			,renderable:true
			,nativeAttr:null
		};
	}
	/**
	 * 初始化事件
	 */
	,initEvent:function(){}
	/**
	 * 初始化DOM原生属性
	 * @private
	 */
	,initAttr:function(){
		var nativeAttr = this.options.nativeAttr;
		FDLib.util.each(this.contentDoms,function(dom){
			for(var attrName in nativeAttr) {
				dom.setAttribute(attrName,nativeAttr[attrName]);
			}
		});
	}
	/**
	 * 将控件渲染到页面上,如果指定domId,则渲染到对应的domId中
	 * 否则渲染到body中
	 * @param domId
	 */
	,render:function(domId){
		if(domId && FDLib.util.isString(domId)){
			this.options.domId = domId;
		}
		
		var desDom = FDLib.getEl(this.options.domId);
		this.renderToDom(desDom);
	}
	/**
	 * 将控件渲染到指定dom对象中
	 * @param dom DOM对象
	 */
	,renderToDom:function(desDom){
		if(desDom && FDRight.checkByCode(this.options.operateCode)) {
			FDLib.util.each(this.contentDoms,function(dom){
				desDom.appendChild(dom);
			});
		}
	}
	/**
	 * 初始化控件内容
	 */
	,initContent:function() {
		var contentDom = this.buildContent();
		
		if(FDLib.util.isArray(contentDom)){
			FDLib.util.each(contentDom,function(dom){
				this.outerDiv.appendChild(dom);
			});
		}else{
			this.outerDiv.appendChild(contentDom);
		}
	}
	/**
	 * 刷新控件内容
	 */
	,refreshContent:function() {
		this.contentDoms = this.buildContent();	
	
		if(!FDLib.util.isArray(this.contentDoms)){
			this.contentDoms = [this.contentDoms];
		}
		
		this.initAttr();
		
		return this.contentDoms;
	}
	/**
	 * 构建内容
	 * @param 返回DOM对象
	 */
	,buildContent:function(){
		throw new Error('必须重写FDComponent.buildContent()方法');	
	}
	/**
	 * 显示控件
	 */
	,show:function() {
		FDLib.util.each(this.contentDoms,function(dom){
			dom.style.display = "block";
		});
	}
	/**
	 * 隐藏控件
	 */
	,hide:function() {
		FDLib.util.each(this.contentDoms,function(dom){
			dom.style.display = "none";
		});
	}
};


/**
 * 浏览器工具类
 * @class
 */
FDLib.browser = (function(){
	var ua = navigator.userAgent.toLowerCase();
	/**
	 * @private
	 */
	var check = function(r){
		return r.test(ua);
	}
	
	return  {
		/**
		 * 是否为Opera浏览器
		 * @return true,是
		 */
		isOpera : function(){return check(/opera/) }
		/**
		 * 是否为IE浏览器
		 * @return true,是
		 */
		,isIE : function(){return !this.isOpera() && check(/msie/) }
		/**
		 * 是否为windows操作系统
		 * @return true,是
		 */
		,isWin : function(){return check(/windows|win32/) }
		/**
		 * 是否为Mac操作系统
		 * @return true,是
		 */
		,isMac : function(){return check(/macintosh|mac os x/) }
		/**
		 * 是否基于KHTML,即webkit核心
		 */
		,isKHTML : function() {
			return ua.indexOf('khtml') > -1 
				|| ua.indexOf('konqueror') > -1
				|| ua.indexOf('applewebkit') > -1; 
					
		}
		/**
		 * 是否为mozilla浏览器
		 * @return true,是
		 */
		,isMoz : function() {
			return ua.indexOf('gecko') > -1 && !this.isKHTML();
		}
	};
	
})();


/**
 * 事件工具类,需要加载FDLib.browser.js
 * @class
 */
FDLib.event = {
	/**
	 * 添加事件
	 * @param oTarget: DOM对象
	 * @param sEventType:事件类型
	 * @param fn:函数名
	 */
	addEvent : function(oTarget,sEventType,fn){
		var that = this;
		var handler = function(fn,target){
			return function(){
				var e = that.getEvent();
				fn.call(target,e);
			};
		};
		if(oTarget.addEventListener){
			this.addEvent = function(oTarget,sEventType,fn) {
				oTarget.addEventListener(sEventType,handler(fn,oTarget),false);
			}
		}else if(oTarget.attachEvent){
			this.addEvent = function(oTarget,sEventType,fn) {
				oTarget.attachEvent("on" + sEventType,handler(fn,oTarget));
			}
		}else{
			this.addEvent = function(oTarget,sEventType,fn) {
				oTarget["on" + sEventType] = handler(fn,oTarget);
			}
		}
		// 调用新函数
		this.addEvent(oTarget,sEventType,fn);
	}
	/**
	 * 对一个父节点下面所有的子节点添加相同的事件
	 * @param options <pre><code>
{
	superDom:menu // 父节点DOM对象
	,tagName:'A'  // 子节点的类型
	,eventName:'click' // 事件名
	,handler:function(target) {  // 执行方法,target是子节点的DOM对象
		iframe.src = target.href;
		mainTitle.innerHTML = target.innerHTML;
	}
}</code></pre>
	 */
	,addBatchEvent:function(options) {
		var self = this;
		var superDom = options.superDom
			,tagName = options.tagName
			,eventName = options.eventName
			,fn = options.handler;
		this.addEvent(superDom,eventName,function(){
			var e = self.getEvent();
			var target = e.target;
			
			if(target.tagName !== tagName) {
				return;
			}
			
			fn(target);
			
			e.preventDefault();
			e.stopPropagation();
		})
	}
	/**
	 * 移除事件
	 * @param oTarget: DOM对象
	 * @param sEventType:事件类型
	 * @param fn:函数名,如果DOM对象上有多个click事件的话,可以指定移除哪一个函数
	 */
	,removeEvent : function(oTarget,sEventType,fn){
		if(oTarget.removeEventListener){
			this.removeEvent = function(oTarget,sEventType,fn) {
				oTarget.removeEventListener(sEventType,fn,false);
			}
		}else if(oTarget.detachEvent){
			this.removeEvent = function(oTarget,sEventType,fn) {
				oTarget.detachEvent("on"+sEventType,fn);
			}
		}else {
			this.removeEvent = function(oTarget,sEventType,fn) {
				oTarget["on"+sEventType] = null;
			}
		}
		
		this.removeEvent(oTarget,sEventType,fn);
	}
	/**
	 * 格式化事件对象,做到IE与DOM的统一
	 * @param oEvent:事件对象
	 */
	,formatEvent : function(oEvent){
		if(FDLib.browser.isIE()){
			oEvent.charCode = (oEvent.type == "keypress")?oEvent.charCode:0;
			oEvent.eventPhase = 2;
			oEvent.isChar = (oEvent.charCode > 0);
			oEvent.pageX = oEvent.clientX + document.body.scrollLeft;
			oEvent.pageY = oEvent.clientY + document.body.scrollTop;
			// 阻止某个事件的默认行为
			oEvent.preventDefault = function(){
				this.returnValue = false;
			}
			
			if(oEvent.type == "mouseout"){
				oEvent.relateTarget = oEvent.toElement;
			} else if(oEvent.type == "mouseover"){
				oEvent.relateTarget = oEvent.fromElement;
			}
			
			// 阻止冒泡
			oEvent.stopPropagation = function(){
				this.cancelBubble = true;
			}
			
			oEvent.target = oEvent.srcElement;
			oEvent.timestamp = (new Date()).getTime();
		}
		return oEvent;
	}
	/**
	 * 格式化事件对象
	 */
	,getEvent : function(){
		if(window.event){
			return this.formatEvent(window.event);
		}else {
			return this.getEvent.caller.arguments[0];
		}
	}
	/**
	 * 点击div之外任何地方，隐藏div 
	 * @param showDom 点击showDom显示targtDom,点击页面其它地方隐藏targetDom
	 * @param targetDom 目标元素
	 */
	,registClickOtherHide:function(showDom,targetDom) {
		var self = this;
		this.addEvent(document,'click',function(){
			var e = self.getEvent();
		    var elem = e.target
		    while (elem) {  
		        if (elem != document) {  
		            if (elem === targetDom || elem === showDom) {  
		                targetDom.style.display = "block";
		                return;  
		            }  
		            elem = elem.parentNode;  
		        } else {  
		            targetDom.style.display = "none";
		            return;  
		        }  
		    }  
			
		})
	}
};


/**
 * @private
 */
var FDTag = {
	DIV:"div"
	,EM:"em"
	,A:"a"
	,INPUT:"input"
	,TEXTAREA:"textarea"
	,SPAN:"span"
	,UL:"ul"
	,LI:"li"
	,TABLE:"table"
	,TBODY:"tbody"
	,IFRAME:"iframe"
	,TH:"th"
	,LABEL:"label"
	,SELECT:"select"
	,BUTTON:"button"
};

/**
 * @private
 */
var FDValidateStore = (function(){
	var reg_positiveInt = /^[1-9]\d*$/
		,reg_naturalNum = /^(0|([1-9]\d*))$/
		,reg_positiveNum = /^(((0|([1-9]\d*))[\.]?[0-9]+)|[1-9])$/
		,reg_floatNum = /^-?[0-9]{1,4}([.]{1}[0-9]{1,})?$/
		,reg_positiveFloatNum = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
		,reg_notNegativeFloatNum = /^[0-9]{1,4}([.]{1}[0-9]{1,})?$/
		,reg_email = /^\s*[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]*)*@[a-zA-Z0-9\-]+([\.][a-zA-Z0-9\-]+)+\s*$/
		,reg_mobile = /^\s*(\+86)*0*1(3|5|8)\d{9}\s*$/
		,reg_tel = /\(?0\d{2}[) -]?\d{8}/
	
	return {
		/**
		 * 匹配正整数
		 */
		positiveInt:function(val) {
			return reg_positiveInt.test(val);
		}
		/**
		 * 匹配自然数,0,1,2,3...
		 */
		,naturalNum:function(val) {
			return reg_naturalNum.test(val);
		}
		/**
		 * 匹配正数
		 */ 
		,positiveNum:function(val) {
			return reg_positiveNum.test(val);
		}
		/**
		 * 匹配浮点数
		 */
		,floatNum:function(val) {
			return reg_floatNum.test(val);
		}
		/**
		 * 匹配正浮点数
		 */
		,positiveFloatNum:function(val) {
			return reg_positiveFloatNum.test(val);
		}
		/**
		 * 匹配非负浮点数（正浮点数 + 0） 
		 */
		,notNegativeFloatNum:function(val) {
			if(val === 0) {
				return true;
			}
			return reg_notNegativeFloatNum.test(val);
		}
		/**
		 * 匹配邮箱
		 */
		,email:function(val) {
			return reg_email.test(val);
		}
		/**
		 * 匹配手机号
		 */
		,mobile:function(val) {
			return reg_mobile.test(val);
		}
		/**
		 * 匹配联系电话
		 * (010)88886666，或022-22334455，或02912345678
		 */
		,tel:function(val) {
			return reg_tel.test(val);
		}
	};
})();

/**
 * 验证数字的validate,继承自<a href="FDBaseValidate.html">FDBaseValidate</a><br>
 * @example 示例:
var controls
FDLib.init(function() {
	controls = [
		new FDTextBox({domId:'t1',label:'验证正整数:',validates:[{rule:{positiveInt:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'X 请输入整整数'}]})
		,new FDTextBox({domId:'t2',label:'验证自然数(长度4~10):',validates:
				[
				{rule:{naturalNum:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入自然数'}
				,{rule:{minLength:4,maxLength:10},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'长度必须为4~10'}
				]})
		,new FDTextBox({domId:'t3',label:'验证正数:',validates:[{rule:{positiveNum:true,notNull:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入大于零的数'}]})
		,new FDTextBox({domId:'t4',label:'验证浮点数:',validates:[{rule:{floatNum:true,notNull:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入浮点数'}]})
		,new FDTextBox({domId:'t5',label:'验证正浮点数:',validates:[{rule:{positiveFloatNum:true,notNull:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入正浮点数'}]})
		,new FDTextBox({domId:'t6',label:'验证非负浮点数:',validates:[{rule:{notNegativeFloatNum:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入非负浮点数'}]})
		,new FDTextBox({domId:'t7',label:'验证邮箱:',validates:[{rule:{email:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入正确的邮箱'}]})
		,new FDTextBox({domId:'t8',label:'验证手机号:',validates:[{rule:{mobile:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入正确的手机号'}]})
		,new FDTextBox({domId:'t9',label:'验证电话:',validates:[{rule:{tel:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入正确的电话号'}]})
	]
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-7-31
 */
var FDValidate = function(options) {
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.msgDom = FDLib.getEl(this.options.msgId);
}

FDValidate.prototype = {

	getOptions:function() {
		return {
			rule:{}
			,msgId:''
			,errorMsg:''
			,successMsg:''
			,errorClass:''
			,successClass:''
			// 自定义校验方法
			,validateHandler:null
		};
	}
	/**
	 * 设置提示信息的id
	 */
	,setMsgId:function(id){
		this.options.msgId = id;
		this.msgDom = FDLib.getEl(this.options.msgId);
	}
	,showErrorMsg:function(msg) {
		if(this.options.errorClass) {
			this.msgDom.className = '';
			FDLib.dom.addClass(this.msgDom,this.options.errorClass);
		}
		if(this.msgDom) {
			this.msgDom.innerHTML = msg || this.options.errorMsg;
		}
	}
	,showSuccessMsg:function(msg) {
		if(this.options.successClass) {
			this.msgDom.className = '';
			FDLib.dom.addClass(this.msgDom,this.options.successClass);
		}
		if(this.msgDom) {
			this.msgDom.innerHTML = msg || this.options.successMsg;
		}
	}
	/**
	 * 验证操作
	 */
	,validate:function(val){
		if(typeof this.options.validateHandler === 'function') {
			var succ =  this.options.validateHandler(val);
			if(!succ){
				this.showErrorMsg();
			}
			return succ;
		}
		var rule = this.options.rule;
		for(var key in rule) {
			// 检测空值
			var len = this.getValueLength(val);
			if(len === 0) {
				if(this.options.rule.notNull) {
					this.showErrorMsg();
					return false;
				}
				return true;
			}
			
			// 检测长度
			if(!this.validateLength(val)) {
				return false;
			}
			
			var shouldValidate = rule[key];
			if(shouldValidate && !this.validateItem(val,key)) {
				return false;
			}
		}
		// 验证成功
		this.showSuccessMsg();
		return true;
	}
	/**
	 * 验证长度
	 */
	,validateLength:function(val) {
		var len = this.getValueLength(val);
		var mixLen = this.options.rule.minLength || -1;
		var maxLen = this.options.rule.maxLength || -1;
		if(mixLen !== -1) {
			if(len < mixLen) {
				this.showErrorMsg();
				return false;
			}
		}
		
		if(maxLen !== -1) {
			if(len > maxLen) {
				this.showErrorMsg();
				return false;
			}
		}
		
		return true;
	}
	/**
	 * 验证单个项
	 */
	,validateItem:function(val,item) {
		var validateMap = FDValidateStore;
		var validateHandler = validateMap[item];
		if(FDLib.util.isFunction(validateHandler)) {
			// 验证不通过
			if(!validateHandler(val)) {
				this.showErrorMsg();
				return false;
			}
		}
		return true;
	}
	/**
	 * 返回字节长度,一个汉字返回2个长度
	 */
	,getValueLength:function(value) {
		if(typeof value === 'undefined') {
			return 0;
		}
		// 如果是数组
		if(FDLib.util.isArray(value)) {
			return value.length;
		}
		return (value + '').replace(/[^\x00-\xff]/g, "**").length;
	}
}

/**
 * 具有值域的控件,继承自<a href="FDComponent.html">FDComponent</a><br>
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDFieldComponent = function(optoins) {
	FDFieldComponent.superclass.constructor.call(this,optoins);
	FDLib.implement(this,FDField);
	// 确保name完整性
	this.options.name = this.options.name || "name_" + FDControl.generateCount();
	this.msgId = this.options.msgId;
	
	this.controlDom;
	
	this.reset();
}

FDLib.extend(FDFieldComponent,FDComponent);

// abstract 需要子类重写
FDFieldComponent.prototype.buildControlDom = function(){
	throw new Error('必须重写FDFieldComponent.getControlDom()方法');	
};

/**
 * 覆盖父类方法,获取组件的默认属性
   @return 返回json数据类型<pre><code>
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,defaultValue:'' // 默认值
}</code></pre>
 */
//@override
FDFieldComponent.prototype.getOptions = function() {
	var options = FDFieldComponent.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		// 默认值
		defaultValue:''
	});
}

/**
 * 添加事件
 * @param eventType 事件类型,如:click,change,mouseover
 * @param eventHandler 事件函数
 */
FDFieldComponent.prototype.addEvent = function(eventType,eventHandler) {
	var event = FDLib.event;
	FDLib.util.each(this.getControlItems(),function(control){
		event.addEvent(control,eventType,eventHandler);
	});
}

/**
 * 设置事件
 * @param eventType 事件类型,如:click,change,mouseover
 * @param eventHandler 事件函数
 */
FDFieldComponent.prototype.setEvent = function(eventType,eventHandler) {
	var event = FDLib.event;
	FDLib.util.each(this.getControlItems(),function(control){
		event.setEvent(control,eventType,eventHandler);
	});
}

/**
 * 移除事件
 * @param eventType 事件类型,如:click,change,mouseover
 * @param eventHandler 事件函数
 */
FDFieldComponent.prototype.removeEvent = function(eventType,eventHandler) {
	var event = FDLib.event;
	FDLib.util.each(this.getControlItems(),function(control){
		event.removeEvent(control,eventType,eventHandler);
	});
}

/**
 * 禁用控件
 */
FDFieldComponent.prototype.disable = function() {
	FDLib.util.each(this.getControlItems(),function(control){
		control.disabled = "disabled";
		FDLib.dom.addClass(control,'ui-state-disabled');
	});
}

/**
 * 启用控件
 */
FDFieldComponent.prototype.enable = function() {
	FDLib.util.each(this.getControlItems(),function(control){
		control.disabled = "";
		FDLib.dom.removeClass(control,'ui-state-disabled');
	});
}


/**
 * 获取所有的input控件,如果要获取其它控件需要重写该方法
 */
FDFieldComponent.prototype.getControlItems = function() {
	if(FDLib.util.isArray(this.getControlDom())){
		return this.getControlDom();
	}else{
		return [this.getControlDom()];
	}
}

/**
 * 获取控件的值
 * 注:这里默认获取单个值,如:radio,selectbox,textbox
 * 获取多个值需要在子类中重写
 */
FDFieldComponent.prototype.getValue = function() {
	return this.getControlItems()[0].value;
}

/**
 * 设置控件的值
 * 注:这里默认设置单个值,如:radio,selectbox,textbox
 * 设置多个值需要在子类中重写
 */
FDFieldComponent.prototype.setValue = function(val) {
	if(val !== undefined) {
		this.getControlItems()[0].value = val;
	}
}

/**
 * 返回控件json数据
 * @return 单个值返回name/value键值对,多个值返回name/[]键值对
 */
FDFieldComponent.prototype.getData = function() {
	var name = this.options.name;
	var data = {};
	data[name] = this.getValue();
	return data;
}

/**
 * 设置控件的name
 */
FDFieldComponent.prototype.setName = function(name) {
	if(FDLib.util.isString(name)) {
		this.options.name = name;
	}
}

/**
 * 返回控件的name
 * @param 返回name属性,字符串类型
 */
FDFieldComponent.prototype.getName = function() {
	return this.options.name;
}

/**
 * 重置控件的值
 */
FDFieldComponent.prototype.reset = function() {
	var defaultValue = this.options.defaultValue;
	if(FDLib.util.isNull(defaultValue)) {
		return;
	}
	this.setValue(defaultValue);
}


/**
 * 设置宽
 */
FDFieldComponent.prototype.setWidth = function(width) {
	width = FDLib.util.formatSize(width || '');
	if(width) {
		FDLib.util.each(this.getControlItems(),function(control){
			control.style.width = width + 'px';
		});
	}
}

/**
 * 设置高
 */
FDFieldComponent.prototype.setHeight = function(height) {
	height = FDLib.util.formatSize(height || '');
	if(height) {
		FDLib.util.each(this.getControlItems(),function(control){
			control.style.height = height + 'px';
		});
	}
}

/**
 * 设置宽和高
 */
FDFieldComponent.prototype.setBounds = function(width,height) {
	this.setWidth(width);
	this.setHeight(height);
}

/**
 * 构建控件内容
 * @override
 */
// @override
FDFieldComponent.prototype.buildContent = function() {
	return this.getControlDom();
}

FDFieldComponent.prototype.getControlDom = function(){
	if(!this.controlDom){
		this.controlDom = this.buildControlDom();
	}
	return this.controlDom;
}

/**
 * 验证
 */
FDFieldComponent.prototype.validate = function() {
	var value = this.getValue();
	var validates = this.options.validates || [];
	
	for(var i=0,len=validates.length; i<len; i++) {
		var opt = validates[i];
		var validate = new FDValidate(opt);
		validate.setMsgId(this.msgId);
		var val = validate.validate(value);
		if(!val) {
			return false;
		}
	}
	return true;
}



/**
 * 权限检查<br>
 * 使用方法:FDRight.setData(datas);
 * var hasPermission = FDRight.check(1,'view');
 * @class
 */
var FDRight = (function() {
	
	var config = {
		// 系统资源ID名称
		systemResourceIdName:'srId'
		// 操作代码名称
		,operateCodeName:'operateCode'
		// 强行检查,如果没有定义operateCode属性则没有权限
		,forceCheck:false
	};
	
	/**
	 * 结构:
	 * //key/value -> srId/operateCodes
	 * var permissionData = {
			{"1":["view","update"],"2":["del"]}
			,{"2":["view","del"]}
		}
	* */
	var permissionData = [];
	
	return {
		config:function(configParam){
			FDLib.util.apply(config,configParam);
		}
		,setData:function(data) {
			permissionData = data;
			return this;
		}
		,setForceCheck:function(b){
			config.forceCheck = !!b;
			return this;
		}
		/**
		 * 检查权限
		 */
		,check:function(srId,operateCode){
			// 非强制检查,如果operateCode属性没有定义则显示
			if(!config.forceCheck && FDLib.util.isUndefined(operateCode)) {
				return true;
			}
			
			if(!srId || !operateCode) {
				return false;
			}
			
			var operateCodeArr = permissionData[srId];
			
			return FDLib.util.contains(operateCodeArr,operateCode);
		}
		,checkByCode:function(operateCode,callback){
			var srId = FDLib.util.getParam(config.systemResourceIdName);
			var hasPerm = this.check(srId,operateCode);
			if(hasPerm && callback) {
				return callback();
			}else{
				return hasPerm;
			}
		}
	};
	
})();

/**
 * 文本框控件FDButton,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:<br>
 * <pre><code>
// 设置JS路径
FDLib.setDir('../../src/');

FDLib.loadJs('FDButton',function() {
	btn1 = new FDButton({domId:'btn1',text:'按钮文本',onclick:function(){
		alert(1)
	}});
	
	new FDButton({
		text:'左边'
		,iconConfig:{showIcon:true,iconClass:'ui-icon-check'}	
	}).render();
	new FDButton({
		text:'右边'
		,iconConfig:{showIcon:true,iconClass:'ui-icon-check',rightIcon:true}	
	}).render();
	new FDButton({
		text:'只有图标'
		,iconConfig:{showIcon:true,iconClass:'ui-icon-disk',iconOnly:true}	
	}).render();
});</code></pre>
* @param options 参见<a href="#getOptions">getOptions()</a><br>
* @constructor
 */
var FDButton = function(options) {
	FDButton.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.options.onclick = this.options.onclick || function(){};
	var that = this;
	this.addEvent('click',function(e){
		that.options.onclick.call(this,e);
	});
	
	this.setText(this.options.text);
}

FDLib.extend(FDButton,FDFieldComponent);

/**
 * 返回默认属性
 * @return <pre><code>
{
	// 按钮文本
	text:''
	// 事件函数
	,onclick:null
	// 是否显示图标
	,showIcon:false
	// 图标是否在右边,默认在左边
	,rightIcon:true
	// 图标className
	,iconClass:''
}</code></pre>
 */
FDButton.prototype.getOptions = function() {
	var options = FDButton.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		text:''
		,onclick:null
		,iconConfig:{
			showIcon:false
			,rightIcon:true
			,iconOnly:false
			,iconClass:''
		}
	});
}

/**
 * 设置onclick事件
 * @param onclick 事件函数
 */
FDButton.prototype.setOnclick = function(onclick) {
	if(FDLib.util.isFunction(onclick)){
		this.options.onclick = onclick;
	}
}

/**
 * 设置按钮文本
 * @param text 按钮文本
 */
FDButton.prototype.setText= function(text) {
	this.textSpan.innerHTML = text;
}

/**
 * @private
 */
//@override
FDButton.prototype.buildControlDom = function() {
	var iconConfig = this.options.iconConfig;
	var button = document.createElement(FDTag.BUTTON);
	button.className = this._buildButtonClassName();
	
	if(iconConfig.showIcon){
		var iconSpan = document.createElement(FDTag.SPAN);
		var iconSpanClass = iconConfig.rightIcon ? 'pui-button-icon-right ui-icon ' : 'pui-button-icon-left ui-icon ';
		iconSpanClass += iconConfig.iconClass;
		iconSpan.className = iconSpanClass;
		button.appendChild(iconSpan);
	}
	
	var textSpan = this._createTextSpan();
	
	button.appendChild(textSpan);
	
	return button;
}

FDButton.prototype._createTextSpan = function() {
	this.textSpan = document.createElement(FDTag.SPAN);
	this.textSpan.className = 'pui-button-text';
	return this.textSpan;
}

FDButton.prototype._buildButtonClassName = function() {
	var defaultClass = 'pui-button ui-widget ui-state-default ui-corner-all ';
	var iconConfig = this.options.iconConfig;
	if(iconConfig.showIcon){
		var iconOnlyClass = 'pui-button-icon-only';
		var leftIconClass = 'pui-button-text-icon-left';
		var rightIconClass = 'pui-button-text-icon-right';
		
		if(iconConfig.iconOnly){
			defaultClass += iconOnlyClass;
		}else if(iconConfig.rightIcon){
			defaultClass += rightIconClass;
		}else{
			defaultClass += leftIconClass;
		}
	}else{
		var textOnlyClass = 'pui-button-text-only';
		defaultClass += textOnlyClass;
	}
	
	return defaultClass;
}
	


FDButton.prototype.initEvent = function() {
	
	FDLib.addHoverEffect(this.getControlDom());
}

/**
 * JString对象,功能类似于Java中的StringBuilder
 * @example 示例:
var str = new JString();
str.append('Hello').append(' World');
alert(str.toString()); // Hello World
 * @class
 */
function JString(s){
	this._strings = new Array;
	if(s && typeof s === 'string') {
		this._strings.push(s);
	}
}

/**
 * 追加字符串
 * @return 返回JString对象
 */
JString.prototype.append = function(s){
	this._strings.push(s);
	return this;
}

/**
 * 返回字符串
 */
JString.prototype.toString = function(){
	return this._strings.join("");
}

/**
 * 日期工具类
 * @class
 */
FDLib.date = {
	/**
	 * 判断是否是闰年
	 * @param year 年份
	 * @return 闰年为true
	 */
	isLeapYear:function(year) {
		return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
	}
	/**
	 * 是否是日期类型
	 * @param dateStr 字符串日期
	 * @return 是,true
	 */
	,isDateStr:function(dateStr) {
		return !!this._parseDateStrToNum(dateStr);
	}
	/**
	 * 根据年份获取每月的天数
	 * @param year 年份
	 * @return 返回每个月的天数,数组形式
	 */
	,getMonthDaysArr:function(year) {
		// 存放每月天数
		var month_days_arr = [31,28,31,30,31,30,31,31,30,31,30,31];
		// 二月份天数
		month_days_arr[1] = this.isLeapYear(year) ? 29 : 28;
		
		return month_days_arr;
	}
	/**
	 * 根据年月得到该月的最后一天
	 * @param year 年份
	 * @param month 月份
	 * @return 返回该月最后一天
	 */
	,getEndDate:function(year,month) {
		// 存放每月天数
		var month_days_arr = this.getMonthDaysArr(year);
		return month_days_arr[month - 1];
	}
	/**
	 * 将字符串日期转换成Date类型
	 * 	
	 * @param dateStr 字符串日期,如:
	 *  var s = "2012-9-3 09:41:30";
	 *  var s2 = "2012-09-03 09:41:30";
	 *  var s3 = "9/3/2012 09:41:30";
	 *  var s4 = "2012-9-3";
	 * @return Date类型日期
	 */
	,parse:function(dateStr) {
		return new Date(this._parseDateStrToNum(dateStr)); 
	}
	,_parseDateStrToNum:function(dateStr) {
		return Date.parse(dateStr.replace(/-/g,"/"));
	}
	/**
	 * 格式化日期<br>
	 * 使用方法:
	 * <code>
	 * var dateStr = FDLib.date.format(new Date(),'yyyy-MM-dd hh:mm:ss.S');
	 * </code>
	 * 
	 * @param dateInstance Date实例
	 * @param 格式化字符串,如"yyyy-MM-dd","yyyy-MM-dd hh:mm:ss.S"
	 * 
	 * @return 返回格式化后的字符串
	 */
	,format:function(dateInstance,pattern) {
		var o = {   
			"M+" : dateInstance.getMonth()+1,                 //月份    
			"d+" : dateInstance.getDate(),                    //日    
			"h+" : dateInstance.getHours(),                   //小时    
			"m+" : dateInstance.getMinutes(),                 //分    
			"s+" : dateInstance.getSeconds(),                 //秒    
			"q+" : Math.floor((dateInstance.getMonth()+3)/3), //季度    
			"S"  : dateInstance.getMilliseconds()             //毫秒    
		};   
		if(/(y+)/.test(pattern)) {
			pattern = pattern.replace(RegExp.$1, (dateInstance.getFullYear()+"").substring(4 - RegExp.$1.length));   
		}
			
		for(var k in o) {
			if(new RegExp("("+ k +")").test(pattern)) {
				pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) 
					? (o[k]) 
					: (("00"+ o[k]).substring((""+ o[k]).length))); 
			}
		}
			
		return pattern; 
	}
};

/**
 * 具有item属性控件的接口,只提供方法<br>
 * 方法列表:<br>
 * <pre>
setItems
getItems
 * </pre>
 * @class
 */
var FDItem = FDLib.createInterface([
	'setItems'
	,'getItems'
]);

/**
 * 字符串工具类
 * @class
 */
FDLib.string = {
	/**
	 * 格式化字符串
	 * @example 用法:
	 * FDLib.string.formatStr('{y}年{m}月{d}日',{y:'2010',m:'09',d:'15'});
	 * 返回:2010年09月15日
	 * 
	 * @param str 需要格式化的字符串
	 * @param obj json数据
	 * @return 返回格式化后的字符串
	 */
	format:function(str,obj){
		for(var key in obj){
			str = str.replace(new RegExp("\\{\\s*" + key + "\\s*\\}", "g"), obj[key]);
		}
		return str;
	}
	/**
	 * 是否是一个空字符串. ''或""
	 * @return 是,true
	 */
	,isEmptyStr:function(value) {
		return (typeof value === 'string' && !value);
	}
};

/**
 * 拥有item属性的类,如radio,checkbox,select<br>
 * 继承自<a href="FDFieldComponent.html">FDFieldComponent</a>
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDItemComponent = function(options) {
	FDItemComponent.superclass.constructor.call(this,options);
	FDLib.implement(this,FDItem);
	
	this.selectItemCache = {};
	
	this.domCont;
}

FDLib.extend(FDItemComponent,FDFieldComponent);


/**
 * 覆盖父类方法,获取组件的默认属性
   @return <pre><code>返回json数据类型
 * {
 *  domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,items:[] 
	,defaultValue:null // 默认值,需要子类去实现
 * }</code></pre>
 */
//@override
FDItemComponent.prototype.getOptions = function() {
	var options = FDItemComponent.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		items:[]
		,defaultValue:null
	});
}

/**
 * 设置items
 * @param items 数组形式,如:[{value:1,text:'足球'},{value:2,text:'篮球'}]
 */
FDItemComponent.prototype.setItems = function(items) {
	if(FDLib.util.isArray(items)) {
		this.options.items = items;
		// 移除原来的
		this._removeOldControlDom();
		
		this.refreshContent();
		
		this.render();
	}
}


/**
 * 获取items
 * @return 返回数组
 */
FDItemComponent.prototype.getItems = function() {
	return this.options.items || [];
}

/**
 * 获取选中状态下对应的json数据
 * @return 返回json对象
 */
FDItemComponent.prototype.getSelectItem = function() {
	var value = this.getValue(); // getValue需要在子类中实现
	var util = FDLib.util;
	var retItem = {};
	// 如果是空字符串
	if(FDLib.string.isEmptyStr(value)) {
		return retItem;
	}
	
	if(util.isNumber(value) || util.isBoolean(value) || util.isString(value)) {
		retItem = this._getNormalValueItem(value);
	}
	
	if(FDLib.util.isArray(value)) {
		retItem = this._getArrayValueItem(value);
	}
	
	return retItem;
}

FDItemComponent.prototype._getNormalValueItem = function(value) {
	var util = FDLib.util;
	var items = this.getItems();
	var mapValue = this.selectItemCache[value];
	if(mapValue) {
		return mapValue;
	}
	var self = this;
	return util.each(items,function(item){
		if(item.value == value) {
			self.selectItemCache[value] = item;
			return item;
		}
	});
}

FDItemComponent.prototype._getArrayValueItem = function(valueArr) {
	var key = valueArr.join('-');
	var mapValue = this.selectItemCache[key];
	if(mapValue) {
		return mapValue;
	}
	
	var items = this.getItems();
	var outItems = [];
	
	var each = FDLib.util.each;
	each(valueArr,function(value){
		each(items,function(item){
			if(value == item.value) {
				outItems.push(item);
			}
		});
	});
	
	this.selectItemCache[key] = outItems;
	return outItems;
}


// 移除原来的DOM
FDItemComponent.prototype._removeOldControlDom = function() {
	FDLib.dom.removeDom(this.domCont);
	this.controlDom = null;
}

// override
FDItemComponent.prototype.buildContent = function(){
	var that = this;
	var domArr = this.getControlDom();
	that.domCont = document.createElement(FDTag.DIV);
	var id = null;
	
	FDLib.util.each(domArr,function(radioDom){
		id = 'radio_' + FDControl.generateCount();
		var lab = document.createElement(FDTag.LABEL);
		radioDom.id = id;
		lab.setAttribute('for',id);
		
		radioDom.style.cursor = 'pointer';
		lab.style.cursor = 'pointer';
		
		lab.innerHTML = radioDom.text;
		
		that.domCont.appendChild(radioDom);
		that.domCont.appendChild(lab);
	});
	
	return that.domCont;
}

/**
 * 选择框类FDSelectBox,继承自<a href="FDItemComponent.html">FDItemComponent</a><br>
 * @example 示例:
 * <pre></code>
// 设置JS路径
FDLib.setDir('../../src/');

var select1;
var select2;

var genderItems = [{value:1,text:"男"},{value:0,text:"女"}];
var constellationItems = [{value:0,text:"金牛座",date:'03-01'},{value:1,text:"天枰座",date:'04-01'}
,{value:2,text:"巨蟹座",date:'05-01'},{value:3,text:"双子座",date:'06-01'}];

var newItems = [
{value:10,text:'北京'},{value:11,text:'上海'},{value:12,text:'天津'}
,{value:13,text:'重庆'}
                ];
                
FDLib.loadJs('FDSelectBox',function() {
	select1 = new FDSelectBox({name:"gender",defaultValue:0,items:genderItems,showDefault:false});
	
	select2 = new FDSelectBox({domId:'constellation',name:'constellation',items:constellationItems,label:'星坐:'});
	select2.addEvent('change',function(){
		FDLib.getEl('msg').innerHTML = 'value:' + this.value 
			+ ' text:' + select2.getSelectItem().text;
	});
});</code></pre>
 * 2012-8-1
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDSelectBox = function(options) {
	FDSelectBox.superclass.constructor.call(this,options);
}

FDLib.extend(FDSelectBox,FDItemComponent);

/**
 * 覆盖父类方法,获取组件的默认属性
   @return <pre><code>返回json数据类型
 * {
 *  domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,items:[] 
	// 是否显示默认选项
	,showDefault:true
	// 默认选项的文本
	,defaultItemText:'-请选择-'
	// 默认选项的值
	,defaultItemValue:''
	,defaultValue:''
 * }</code></pre>
 */
//@override
FDSelectBox.prototype.getOptions = function() {
	var options = FDSelectBox.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		// 是否显示默认选项
		showDefault:true
		// 默认选项的文本
		,defaultItemText:'-请选择-'
		// 默认选项的值
		,defaultItemValue:''
		,defaultValue:null
	});
}


/**
 * @private
 */
//@override
FDSelectBox.prototype.buildControlDom = function() {
	var select = document.createElement(FDTag.SELECT);
	select.setAttribute('name',this.options.name);
	
	this._initOptions(select);
	
	return select;
}

// 初始化下拉框选项
FDSelectBox.prototype._initOptions = function(select) {
	var selOptions = select.options;
	var items = this.getItems();
	
	if(items.length === 0) {
		items.push({text:this.options.defaultItemText,value:this.options.defaultItemValue});
	}
	
	// 如果不显示默认项,则取第一项做默认项
	if(!this.options.showDefault) {
		var firstItem = items.shift();
		this.options.defaultItemText = firstItem.text;
		this.options.defaultItemValue = firstItem.value;
	}
	// 添加第一项
	selOptions.add(new Option(this.options.defaultItemText,this.options.defaultItemValue));
	// 添加剩下的项
	FDLib.util.each(items,function(item){
		selOptions.add(new Option(item.text,item.value));
	});
	
	// 设置默认值
	if(FDLib.util.isNull(this.options.defaultValue)) {
		this.options.defaultValue = this.options.defaultItemValue;
	}
}

/**
 * 构建控件内容
 */
// @override
FDSelectBox.prototype.buildContent = function() {
	this.controlDom = this.buildControlDom();
	return this.getControlDom();
}

/**
 * 日历控件
 * @private
 * 2012-8-30
 */
var FDCalendar = function(options) {
	FDLib.implement(this,FDControl);
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.dateUtil = FDLib.date;
	this.today = new Date();
	// 年月日
	this.date = new Date();	
	
	this.calendarDiv = this.buildCalandarPanel();
	
	this.table = this.buildCalendarTable();
	this.thead = this.table.createTHead();
	this.tbody = document.createElement(FDTag.TBODY);
	this.tfoot = this.table.createTFoot();
	this.table.appendChild(this.tbody);
	
	this.yearSelect = null;
	this.monthSelect = null;
	
	this.selectedTD;
	
	this._buildCalendarBody();
	
	this.render();
}

FDCalendar.FORMAT_YMD = "yyyy-MM-dd";
FDCalendar.FORMAT_YMDHMS = "yyyy-MM-dd hh:mm:ss";
FDCalendar.MONTH_ITEMS = [
{text:'一月',value:'1'},{text:'二月',value:'2'},{text:'三月',value:'3'},{text:'四月',value:'4'},{text:'五月',value:'5'},{text:'六月',value:'6'}
,{text:'七月',value:'7'},{text:'八月',value:'8'},{text:'九月',value:'9'},{text:'十月',value:'10'},{text:'十一月',value:'11'},{text:'十二月',value:'12'}
];

FDCalendar.prototype = {
	getOptions:function() {
		return {
			domId:null
			,weekTextArr:['日','一','二','三','四','五','六']
			,format:FDCalendar.FORMAT_YMD
			// 方法参数:self.getValue(),self
			,onclick:null
			,onclear:null
			,dayRender:function(td,date) {return date;}
		};
	}
	,buildCalandarPanel:function(){
		var panel = document.createElement(FDTag.DIV);
		panel.className = 'ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-shadow';
		panel.style.display = "none";
		return panel;
	}
	/**
	 * 显示日历
	 * @param dom 点击dom显示日历
	 * @param value 日期值
	 */
	,show:function(value) {
		this.setValue(value);
		this.calendarDiv.style.display = "block";
	}
	/**
	 * 获取日历的div
	 */
	,getCalendarDom:function() {
		return this.calendarDiv;
	}

	/**
	 * 隐藏日历控件
	 */
	,hide:function() {
		this.calendarDiv.style.display = "none";
	}
	/**
	 * 设置时间
	 * @param dateStr 字符串日期
	 */
	,setValue:function(dateStr) {
		var date;
		if(dateStr) {
			date = this.dateUtil.parse(dateStr);
		}else{
			date = new Date();
		}
		this.setValueDate(date);
	}
	/**
	 * 设置时间
	 * @param date Date类型日期
	 */
	,setValueDate:function(date) {
		this.date = date;
		this.refresh();
	}
	,setYearRefresh:function(year){
		this.setYear(year);
		this.refresh();
	}
	,setMonthRefresh:function(month){
		this.setMonth(month);
		this.refresh();
	}
	/**
	 * 获取日期值
	 */
	,getValue:function() {
		return this.dateUtil.format(this.date,this.options.format);
	}
	/**
	 * 获取年
	 */
	,getYear:function() {
		return this.date.getFullYear();
	}
	/**
	 * 获取月
	 */
	,getMonth:function() {
		return this.date.getMonth() + 1;
	}
	/**
	 * 获取日
	 */
	,getDate:function() {
		return this.date.getDate();
	}
	/**
	 * 获取小时
	 */
	,getHours:function() {
		return this.date.getHours();
	}
	/**
	 * 获取分钟
	 */
	,getMinutes:function() {
		return this.date.getMinutes();
	}
	/**
	 * 设置年
	 * @param year 年份,int型
	 */
	,setYear:function(year) {
		this.date.setYear(year);
	}
	/**
	 * 设置月
	 * @param month 月份1~12,int型
	 */
	,setMonth:function(month) {
		this.date.setMonth(month - 1);
	}
	/**
	 * 设置天
	 * @param date 天,int型
	 */
	,setDate:function(date) {
		this.date.setDate(date);
	}
	/**
	 * 设置小时
	 * @param hours 小时数,int型
	 */
	,setHours:function(hours) {
		this.date.setHours(hours);
	}
	/**
	 * 设置分钟
	 * @param hours 分钟数,int型
	 */
	,setMinutes:function(minutes) {
		this.date.setMinutes(minutes);
	}
	/**
	 * 设置秒
	 * @param second 秒,int型
	 */
	,setSeconds:function(second) {
		this.date.setSeconds(second);
	}
	/**
	 * 刷新
	 */
	,refresh:function() {
		this._refreshBody();
		this._buildCalendar();
	}
	/**
	 * 定位到dom节点
	 */
	,render:function() {
		if(FDRight.checkByCode(this.options.operateCode)) {
			var dom = FDLib.getEl(this.options.domId) || document.body;
			dom.appendChild(this.calendarDiv);
		}
	}
	/**
	 * 获取年月日对象
	 */
	,getYMDData:function() {
		return {year:this.getYear(),month:this.getMonth(),date:this.getDate()};
	}
	,_buildCalendarBody:function() {
		var yearMonthSelector = this.buildYearMonthSelector();
		this.calendarDiv.appendChild(yearMonthSelector);
		
		this.appendWeekTextRow(this.thead);
		
		this.calendarDiv.appendChild(this.table);
		
		var buttonsDiv = this.buildButtonsDiv();
		
		this.calendarDiv.appendChild(buttonsDiv);
	}
	,_refreshBody:function() {
		FDLib.dom.removeDom(this.tbody);
		this.tbody = document.createElement(FDTag.TBODY);
		this.table.appendChild(this.tbody);
		this._initOnclickEvent();
		this._initMouseEvent();
	}
	,buildCalendarTable:function() {
		var table = document.createElement(FDTag.TABLE);
		table.className = 'ui-datepicker-calendar';
		return table;
	}
	,buildButtonsDiv:function() {
		var btnDiv = document.createElement(FDTag.DIV);
		btnDiv.className = 'ui-datepicker-header';
		btnDiv.style.textAlign = 'center';
		var that = this;
		
		var todayBtn = new FDButton({text:'今天',onclick:function(){
			that.setToday();
		}});
		var clearBtn = new FDButton({text:'清空',onclick:function(){
			that._runOnclearHandler();
		}});
		
		todayBtn.renderToDom(btnDiv);
		clearBtn.renderToDom(btnDiv);
		
		return btnDiv;
	}
	,setToday:function(){
		this.setValueDate(new Date());
		this._runOnclickHandler();
	}
	,_initOnclickEvent:function() {
		var self = this;
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'SPAN'  // 子节点的类型
			,eventName:'click' // 事件名
			,handler:function(span) {  // 执行方法,target是子节点的DOM对象
				if(span && span.innerHTML) {
					var date = parseInt(span.innerHTML);
					self.onClickDate(date,span);
					self._runOnclickHandler();
				}
			}
		});
	}
	,_highlightTD:function(span){
		FDLib.dom.addClass(span,'ui-state-hover');
	}
	,_unhighlightTD:function(span){
		FDLib.dom.removeClass(span,'ui-state-hover');
	}
	,_initMouseEvent:function() {
		var self = this;
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'SPAN'  // 子节点的类型
			,eventName:'mouseover' // 事件名
			,handler:function(target) {  // 执行方法,target是子节点的DOM对象
				self._highlightTD(target);
			}
		});
		FDLib.event.addBatchEvent({
			superDom:this.tbody // 父节点DOM对象
			,tagName:'SPAN'  // 子节点的类型
			,eventName:'mouseout' // 事件名
			,handler:function(target) {  // 执行方法,target是子节点的DOM对象
				self._unhighlightTD(target);
			}
		});
	}
	,onClickDate:function(date,span){
		this.setDate(date);
		this.activeTD(span.outer);
	}
	// 执行用户自定义事件
	,_runOnclickHandler:function() {
		var clickHandler = this.options.onclick;
		if(FDLib.util.isFunction(clickHandler)) {
			clickHandler(this.getValue(),this);
		}
	}
	,_runOnclearHandler:function() {
		var clickHandler = this.options.onclear;
		if(FDLib.util.isFunction(clickHandler)) {
			clickHandler(this.getValue(),this);
		}
	}
	// 改变td背景色
	,activeTD:function(nextTD) {
		var inner = null;
		if(this.selectedTD) {
			this.selectedTD.className = "";
			inner = this.selectedTD.inner;
			FDLib.dom.removeClass(inner,'ui-state-highlight ui-state-active');
		}
		FDLib.dom.addClass(nextTD,'ui-datepicker-days-cell-over  ui-datepicker-current-day ui-datepicker-today')
		
		inner = nextTD.inner;
		FDLib.dom.addClass(inner,'ui-state-highlight ui-state-active');
		
		this.selectedTD = nextTD;
	}
	,_buildCalendar:function() {
		var self = this;
		// 当月天数
		var daysInMonth = this.dateUtil.getEndDate(this.getYear(),this.getMonth());
		// 每月1号
		var firstDayOfMonth = new Date(this.getYear(),this.getMonth() - 1,1);
		// 每月1号星期几
		var firstDay = firstDayOfMonth.getUTCDay();
		// 今天
		var today = new Date();
		// 日期
		var dayIndex = 1;
		// 日期行的索引
		var rowIndex = 0;
		
		var thirdRow = this.tbody.insertRow(rowIndex++);
		
		// 填充空白天数
		for(var i=0;i<=firstDay;i++){
			thirdRow.insertCell(i);
		}
		// 填充第一个星期
		for (var i=firstDay + 1;i<=6;i++){
			this._buildTD(thirdRow,i,dayIndex++);
		}
		// 填充剩下的天数
		while (dayIndex <= daysInMonth) {
			
			var row = this.tbody.insertRow(rowIndex++)
			for (var i=0;i<=6 && dayIndex <= daysInMonth;i++){
				this._buildTD(row,i,dayIndex++);
			}
		}
		
		this.initYearMonthSelect();
	}
	,_buildTD:function(row,cellIndex,date) {
		var td = row.insertCell(cellIndex);
		var span = document.createElement(FDTag.SPAN);
		
		span.innerHTML = this.options.dayRender(span,date);
		span.className = 'ui-state-default';
		span.style.textAlign = 'center';
		// 相互关联
		span.outer = td;
		td.inner = span;
		
		td.appendChild(span);
		
		td.style.cursor = 'pointer';
		td.style.textAlign = 'center';
		
		// 如果是今天
		if(this._isReachToToday(date)) {
			td.title = "今天";
		}
		if(this._isSelectedDay(td)) {
			this.activeTD(td);
		}
		
	}
	,_isReachToToday:function(date) {
		return this.today.getDate() == date 
				&& this.getMonth() == this.today.getMonth() + 1
				&& this.today.getFullYear() == this.getYear();
	}
	,_isSelectedDay:function(td) {
		var date = this.getDateByTD(td);
		return this.getDate() == date;
	}
	,getDateByTD:function(td){
		var span = td.inner;
		var date = null;
		if(span){
			date = parseInt(span.innerHTML) || 1;
		}
		return date || 1;
	}

	,buildYearMonthSelector:function(){
		var yearMonthSelector = document.createElement(FDTag.DIV);
		yearMonthSelector.className = 'ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all';
		
		this.appendPrevMonthButton(yearMonthSelector);
		this.appendNextMonthButton(yearMonthSelector);
		this.appendYearMonthSelect(yearMonthSelector);
		
		return yearMonthSelector;
	}
	,appendPrevMonthButton:function(dom) {
		var self = this;
		var a = document.createElement(FDTag.A);
		a.className = 'ui-datepicker-prev ui-corner-all';
		
		var icon = document.createElement(FDTag.SPAN);
		icon.className = 'ui-icon ui-icon-circle-triangle-w';
		icon.title = '上月';
		
		FDLib.event.addEvent(icon,'click',function(){
			var nextMonth = self.getMonth() - 1;
			var nextYear = self.getYear();
			if(nextMonth < 1) {
				nextYear--;
			}
			self.setYearMonth(nextYear,nextMonth);
		});
		
		a.appendChild(icon);
		
		dom.appendChild(a);
	}
	,appendNextMonthButton:function(dom) {
		var self = this;
		var a = document.createElement(FDTag.A);
		a.className = 'ui-datepicker-next ui-corner-all';
		
		var icon = document.createElement(FDTag.SPAN);
		icon.className = 'ui-icon ui-icon-circle-triangle-e';
		icon.title = '下月';
		
		FDLib.event.addEvent(icon,'click',function(){
			var nextMonth = self.getMonth() + 1;
			var nextYear = self.getYear();
			if(nextMonth >12 ) {
				nextYear++;
			}
			nextMonth = nextMonth > 12 ? 1 : nextMonth;
			self.setYearMonth(nextYear,nextMonth);
		});
		
		a.appendChild(icon);
		
		dom.appendChild(a);
	}
	,setYearMonth:function(year,month){
		this._setNextMonthDate(year,month);
		this.setMonth(month);
		this.setYear(year);
		this.refresh();
	}
	,appendYearMonthSelect:function(dom){
		var that = this;
		var div = document.createElement(FDTag.DIV);
		div.className = 'ui-datepicker-title';
		this.yearSelect = new FDSelectBox({showDefault:false,items:this.buildYearItems()});
		this.monthSelect = new FDSelectBox({showDefault:false,items:FDCalendar.MONTH_ITEMS});
		
		this.yearSelect.addEvent('change',function(){
			that.setYearRefresh(this.value);
		});
		this.monthSelect.addEvent('change',function(){
			that.setMonthRefresh(this.value);
		});
		
		this.yearSelect.renderToDom(div);
		this.monthSelect.renderToDom(div);
		
		dom.appendChild(div);
	}

	,buildYearItems:function() {
		var items = this.options.yearItems || [];
		
		var currentYear = this.getYear();
		for(var i=-10;i<=10;i++) {
			var year = currentYear + i;
			items.push({text:year,value:year});
		}
		
		return items;
	}
	,_setNextMonthDate:function(year,nextMonth) {
		if(this.isEndDate()) {
			var endDate = this._getCurrentEndDate();
			var nextMonthEndDate = this.dateUtil.getEndDate(year,nextMonth);
			this.setDate(Math.min(endDate,nextMonthEndDate));
		}
	}
	/**
	 * 是否是当月最后一天
	 */
	,isEndDate:function() {
		var endDate = this._getCurrentEndDate();
		return this.getDate() == endDate;
	}
	,_getCurrentEndDate:function() {
		return this.dateUtil.getEndDate(this.getYear(),this.getMonth());
	}
	,appendWeekTextRow:function(thead) {
		var weekTextArr = this.options.weekTextArr;
		var weekTextRow = thead.insertRow(0);
		FDLib.util.each(weekTextArr,function(text,cellIndex){
			var th = document.createElement(FDTag.TH);
			if(cellIndex == 0 || cellIndex == weekTextArr.length-1){
				th.className = 'ui-datepicker-week-end';
			}
			th.innerHTML = '<span>' + text + '</span>';
			weekTextRow.appendChild(th);
		});
	}
	,initYearMonthSelect:function() {
		this.yearSelect.setValue(this.getYear());
		this.monthSelect.setValue(this.getMonth());
	}
};

/**
 * 单选框FDCheckBox继承自<a href="FDItemComponent.html">FDItemComponent</a><br>
 * @example 示例:
 * <pre><code>
var genderItems = [{value:1,text:"足球"},{value:0,text:"篮球"}];
var constellationItems = [{value:0,text:"金牛座",date:'03-01'},{value:1,text:"天枰座",date:'04-01'}
,{value:2,text:"巨蟹座",date:'05-01'},{value:3,text:"双子座",date:'06-01'}];

var newItems = [
{value:10,text:'北京'},{value:11,text:'上海'},{value:12,text:'天津'}
,{value:13,text:'重庆'}
                ];

// 设置JS路径
FDLib.setDir('../../src/');

FDLib.loadJs('FDCheckBox',function() {
	checkbox1 = new FDCheckBox({name:"gender",items:genderItems
		,validates:[ new FDValidate({notNull:true}) ]	
	});
	
	checkbox2 = new FDCheckBox({domId:'constellation',name:'constellation'
			,defaultValue:[0,2]
			,items:constellationItems,label:'星坐:',vertical:true});
	
	checkbox2.addEvent('click',function(){
		var data = checkbox2.getSelectItem();
		var s = '';
		for(var key in data) {
			s += data[key].value + ":" + data[key].text + ' '
		}
		FDLib.getEl('msg').innerHTML = s;
	});
});
</code></pre>
* @param options 参见{@link #getOptions}返回的对象
 * 2012-8-1
 * @constructor
 */
var FDCheckBox = function(options) {
	FDCheckBox.superclass.constructor.call(this,options);
}

FDLib.extend(FDCheckBox,FDItemComponent);

/**
 * options项
 * @return 返回json数据类型<pre><code>
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,items:[] // checkbox的item项{value:1,text:'足球'}
	,vertical:false // checkbox排练方式,默认为水平排放
	,defaultValue:[] // 默认值
}</code></pre>
 */
//@override
FDCheckBox.prototype.getOptions = function() {
	var options = FDCheckBox.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		items:[]
		// 垂直排放
		,vertical:false
		,defaultValue:[]
	});
}

/**
 * 重写父类方法,返回checkbox数组
 */
// override
FDCheckBox.prototype.buildControlDom = function() {
	var that = this;
	var items = this.getItems();
	var doms = [];
	FDLib.util.each(items,function(item){
		doms.push(that._createCheckboxInput(item));
	});
	return doms;
}

FDCheckBox.prototype._createCheckboxInput = function(item) {
	var input = document.createElement(FDTag.INPUT);
	input.setAttribute('type','checkbox');
	input.setAttribute('name',this.options.name);
	input.value = item.value;
	input.text = item.text;
	return input;
}

/**
 * 重写setValue,这里参数传入数组类型
 * @param valArr 如:[1,2,3]
 */
//@override
FDCheckBox.prototype.setValue = function(valArr) {
	var util = FDLib.util;
	if(!util.isArray(valArr)) {
		throw new Error('方法FDCheckBox.setValue参数必须为数组类型');
	}
	var controls = this.getControlItems();
	
	util.each(controls,function(ctrl){
		ctrl.checked = null;
		util.each(valArr,function(val){
			if(ctrl.value == val) {
				ctrl.checked = "checked";
				return true;
			}
		});
	});
	
}

/**
 * 重写getValue,没有选中则返回空的数组
 * @return 返回数组
 */
//@override
FDCheckBox.prototype.getValue = function() {
	var controls = this.getControlItems();
	var valArr = [];
	FDLib.util.each(controls,function(ctrl){
		if(ctrl.checked) {
			valArr.push(ctrl.value);
		}
	});
	return valArr;
}


/**
 * 文本框控件FDTextBox,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:<br>
 * <pre><code>
// 设置JS路径
FDLib.setDir('../../src/');

var txtUsername;
var txtPassword

FDLib.loadJs(['FDTextBox','FDPasswordBox'],function() {
	txtUsername = new FDTextBox({name:"username",defaultValue:'请输入姓名'
		,validates:[new FDValidate({errorMsg:'请输入正整数',items:['positiveInt']})]});
	
	
	txtUsername.addEvent('blur',function(e){
		//alert(e.target.value);
	})
	
	txtPassword = new FDPasswordBox({domId:'password',name:'password',label:'密码:'});
	
	var text2 = new FDTextBox({domId:'addr',width:200,height:40,name:'addr',label:'地址:',labelValign:'top'});
	text2.addEvent('change',function(e){
		alert(e.target.value);
	})
});</code></pre>
* @param options 参见<a href="FDFieldComponent.html#getOptions">FDFieldComponent.getOptions()</a><br>
* @constructor
 */
var FDTextBox = function(options) {
	FDTextBox.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
}

FDLib.extend(FDTextBox,FDFieldComponent);

//@override
FDTextBox.prototype.getOptions = function() {
	var options = FDTextBox.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		defaultClassName : 'pui-inputtext ui-widget ui-state-default ui-corner-all'
	});
}

/**
 * @private
 */
//@override
FDTextBox.prototype.buildControlDom = function() {
	var input = document.createElement(FDTag.INPUT);
	input.setAttribute('type','text');
	input.setAttribute('name',this.options.name);
	input.className = this.options.defaultClassName;
	return input;
}

FDTextBox.prototype.initEvent = function(){
	
	FDLib.addHoverEffect(this.getControlDom());
	
	this.addEvent('click',function(e){
		FDLib.dom.addClass(e.target,'ui-state-focus');
		e.stopPropagation();
	});
	this.addEvent('blur',function(e){
		FDLib.dom.removeClass(e.target,'ui-state-focus');
		e.stopPropagation();
	});
}

/**
 * 日历控件FDDatePick继承自<a href="FDTextBox.html">FDTextBox</a><br>
 * @example 示例:
 * <pre><code>
// 设置JS路径
FDLib.setDir('../../src/');

var datepick1;

FDLib.loadJs('FDDatePick',function() {
	datepick1 = new FDDatePick({domId:'datepick1',msgId:'msgId',name:"datepick1"
		,validates:[{rule:{notNull:true}}]});
});
 * </code></pre>
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDDatePick = function(options) {
	FDDatePick.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
	FDDatePick.instance = this;
	if(!FDDatePick.calendar){ // 单例,即多个input共用一个Calendar
		FDDatePick.calendar = new FDCalendar({onclick:this.options.onclick,onclear:this.options.onclear});
		FDDatePick.calendar.calendarDiv.style.position = 'absolute';
		FDDatePick.calendar.calendarDiv.style.zIndex = 9999;
		FDDatePick.calendar.hide();
	}
	// 点击显示控件的对象
	this.clickTarget = FDLib.getEl('clickId') || this.getControlDom();
	this._registCalendar();
	FDDatePick.calendar._runOnclearHandler();
}

FDLib.extend(FDDatePick, FDTextBox);

/**
 * 返回日历的默认属性
 * @return <pre><code>
{
	value:''
	// 点击日期触发的事件
	,onclick:function(value,target,cal){
		self.setValue(value);
		self.getControlItems()[0].className = '';
		cal.hide();
	}
	// 清空操作时触发的事件 
	,onclear:function(value,target,cal) {
		self.setValue(self.options.defaultValue);
		self.getControlItems()[0].className = 'default';
		cal.hide();
	}
	// 是否显示时间选择器
	,isShowTime:false
	// 日期格式
	,format:FDCalendar.FORMAT_YMD
	,defaultValue:'- 点击选择时间 -'
}</code></pre>
 */
//@override
FDDatePick.prototype.getOptions = function() {
	var options = FDDatePick.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		value:''
		,clickId:''
		,onclick:function(value,calendar){
			FDDatePick.instance.setValue(value);
			calendar.hide();
		}
		,onclear:function(value,calendar) {
			FDDatePick.instance.setValue(FDDatePick.instance.options.defaultValue);
			calendar.hide();
		}
		,isShowTime:false
		,offsetX:0
		,offsetY:26
		,format:FDCalendar.FORMAT_YMD
		,defaultValue:''
	});
}

FDDatePick.prototype._registCalendar = function() {
	var that = this;
	var calObj = FDDatePick.calendar;
	var calendarBody = calObj.getCalendarDom();
	var clickDom = this.clickTarget;
	var event = FDLib.event;
	
	clickDom.style.cursor = 'pointer';
	
	FDLib.event.addEvent(clickDom,'click',function(){
		FDDatePick.instance = that;
		that.showCalendar();
	});
	
	// 点击其它地方隐藏
	event.addEvent(document,'click',function(e){
	    var elem = e.target;
	    if(clickDom.disabled) {
	    	return;
	    }
	    while (elem) {  
	        if (elem != document) {  
	            if (elem === calendarBody || elem === clickDom) { 
	                break;  
	            }  
	            elem = elem.parentNode;  
	        } else {  
	            calObj.hide();
	            break;
	        }  
	    }  
	});
}

FDDatePick.prototype._setPosition = function(dom) {
	var offset = FDLib.dom.getOffset(dom);
    var options = this.options;
    var calendarDiv = FDDatePick.calendar.getCalendarDom();
    
    calendarDiv.style.left = offset.left + options.offsetX + 'px';
    calendarDiv.style.top = offset.top + options.offsetY + 'px';
}

/**
 * 显示日期面板
 */
FDDatePick.prototype.showCalendar = function() {
	this._setPosition(this.clickTarget);
	FDDatePick.calendar.show(this.getValue());
}

/**
 * 设置日期
 */
FDDatePick.prototype.setValue = function(val) {
	var isDateStr = FDLib.date.isDateStr(val);
	
	if(isDateStr) {
		FDDatePick.superclass.setValue.call(this,val);
	}else{
		FDDatePick.superclass.setValue.call(this,this.options.defaultValue);
	}
}

/**
 * 获取日期
 * @return 返回字符串日期
 */
//@override
FDDatePick.prototype.getValue = function() {
	var value = FDDatePick.superclass.getValue.call(this);
	return FDLib.date.isDateStr(value) ? value : '';
}

/**
 * 禁用控件
 */
// @override
FDDatePick.prototype.disable = function() {
	FDDatePick.superclass.disable.call(this);
	this.clickTarget.title = '';
}

/**
 * 启用控件
 */
// @override
FDDatePick.prototype.enable = function() {
	FDDatePick.superclass.enable.call(this);
	this.clickTarget.title = '点击选择时间';
}


/**
 * 文本框控件FDTextBox,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:<br>
 * <pre><code>
// 设置JS路径
FDLib.setDir('../../src/');

var hidden1;

FDLib.loadJs('FDHidden',function() {
	hidden1 = new FDHidden({name:"username",defaultValue:'请输入姓名'});
	hidden1.render('username');
});

</code></pre>
* @param options 参见<a href="FDFieldComponent.html#getOptions">FDFieldComponent.getOptions()</a><br>
* @constructor
 */
var FDHidden = function(options) {
	FDHidden.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
}

FDLib.extend(FDHidden,FDFieldComponent);

/**
 * @private
 */
//@override
FDHidden.prototype.buildControlDom = function() {
	var input = document.createElement(FDTag.INPUT);
	input.setAttribute('type','hidden');
	input.setAttribute('name',this.options.name);
	return input;
}
// 重写方法
// hidden控件不需要这些方法
FDHidden.prototype.hide = 
FDHidden.prototype.show = 
FDHidden.prototype.enable = 
/** @private */
FDHidden.prototype.disable = function(){};

/**
 * 密码输入框类,继承自<a href="FDTextBox.html">FDTextBox</a><br>
 * @example 示例:
 * <pre><code>
 * var txtPassword = new FDPasswordBox({domId:'password',name:'password',label:'密码:'});
 * txtPassword.render();
 * </code></pre>
 * @constructor
 */
var FDPasswordBox = function(options) {
	FDPasswordBox.superclass.constructor.call(this,options);
}

FDLib.extend(FDPasswordBox,FDTextBox);

/**
 * 返回密码控件的html
 * @private
 */
//@override
FDPasswordBox.prototype.buildControlDom = function() {
	var input = document.createElement(FDTag.INPUT);
	input.setAttribute('type','password');
	input.setAttribute('name',this.options.name);
	input.className = this.options.defaultClassName;
	return input;
}

/**
 * 单选框FDRadio,继承自<a href="FDItemComponent.html">FDItemComponent</a><br>
 * @example 示例:
<pre><code>
// 设置JS路径
FDLib.setDir('../../src/');

var radio1;
var radio2;

var genderItems = [{value:1,text:"男"},{value:0,text:"女"}];
var constellationItems = [{value:0,text:"金牛座",date:'03-01'},{value:1,text:"天枰座",date:'04-01'}
,{value:2,text:"巨蟹座",date:'05-01'},{value:3,text:"双子座",date:'06-01'}];

var newItems = [
{value:10,text:'北京'},{value:11,text:'上海'},{value:12,text:'天津'}
,{value:13,text:'重庆'}
                ];
                
FDLib.loadJs('FDRadio',function() {
	radio1 = new FDRadio({name:"gender",items:genderItems
		,validates:[ new FDValidate({notNull:true}) ]
	});
	
	
	radio2 = new FDRadio({domId:'constellation',name:'constellation'
		,defaultValue:1
		,items:constellationItems,label:'星坐:'});
	
	radio2.addEvent('click',function(){
		FDLib.getEl('msg').innerHTML = 'value:' + this.value 
			+ ' text:' + radio2.getSelectItem().text;
	});
});</code></pre>
 * 2012-8-1
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDRadio = function(options) {
	FDRadio.superclass.constructor.call(this,options);
}

FDLib.extend(FDRadio,FDItemComponent);
/**
 * 覆盖父类方法,获取组件的默认属性
   @return <pre><code>返回json数据类型
 * {
 *  domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,items:[] 
	// 垂直排放
	,vertical:false
	,defaultValue:''
 * }</code></pre>
 */
//@override
FDRadio.prototype.getOptions = function() {
	var options = FDRadio.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		// 垂直排放
		vertical:false
		,defaultValue:''
	});
}


// override
FDRadio.prototype.buildControlDom = function() {
	var that = this;
	var items = this.getItems();
	var doms = [];
	FDLib.util.each(items,function(item){
		doms.push(that._createRadioInput(item));
	});
	return doms;
}

FDRadio.prototype._createRadioInput = function(item) {
	var input = document.createElement(FDTag.INPUT);
	input.setAttribute('type','radio');
	input.setAttribute('name',this.options.name);
	input.value = item.value;
	input.text = item.text;
	return input;
}

/**
 * 重写父类方法
 * @param val,单值
 */
//@override
FDRadio.prototype.setValue = function(val) {
	var controls = this.getControlItems();
	FDLib.util.each(controls,function(ctrl){
		ctrl.checked = '';
		if(ctrl.value == val) {
			ctrl.checked = "checked";
			return false;
		}
	});
}

/**
 * 重写父类方法
 * @return 返回单值
 */
//@override
FDRadio.prototype.getValue = function() {
	var controls = this.getControlItems();
	return FDLib.util.each(controls,function(ctrl){
		if(ctrl.checked) {
			return ctrl.value;
		}
	});
}


/**
 * 文本框控件,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:
 * <pre><code>
// 设置JS路径
FDLib.setDir('../../src/');

var remark;
FDLib.loadJs('FDTextArea',function() {
	remark = new FDTextArea({domId:'remark'
		//,width:300,height:80
		,name:'addr',label:'地址:',labelValign:'top'
		,validates:[new FDValidate({minLength:4,maxLength:10})]});
});
 * </code></pre>
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-7-31
 */
var FDTextArea = function(options) {
	FDTextArea.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
}

FDLib.extend(FDTextArea,FDTextBox);

/**
 * 覆盖父类方法,获取组件的默认属性
   @return <pre><code>返回json数据类型
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'top' // label垂直对齐方式
	,name:"" // 控件的name
	,width:240 // 控件的宽,如'120px'
	,height:80 // 控件的高,如'30px'
	,validates:[] // 验证类
	,defaultValue:'' // 默认值
}</code></pre>
 */
//@override
FDTextArea.prototype.getOptions = function() {
	var options = FDTextArea.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		width:240
		,height:80
		,labelValign:'top'
	});
}

/**
 * @private
 */
//@override
FDTextArea.prototype.buildControlDom = function() {
	var textarea = document.createElement(FDTag.TEXTAREA);
	textarea.setAttribute('name',this.options.name);
	textarea.className = this.options.defaultClassName;
	return textarea;
}

/**
 * 管理form控件的容器
 * @private
 */
var FDFormPanel = function(options) {
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.controls = this.options.controls;
}

FDFormPanel.prototype = {
	getOptions:function() {
		return {
			controls:[]
			,url:''
			,grid:null
			,win:null
			,crudUrl:null
			,onSubmit:null
		};
	}
	,submit:function(callback) {
		var onSubmitHandler = this.options.onSubmit;
		var success = true;
		
		if(onSubmitHandler) {
			success = onSubmitHandler.call(this);
		}
		
		if(success) {
			var data = this.getValues();
			var url = this.getUrl();
			var that = this;
			FDLib.ajax.request({url:url,params:data,success:function(e){
				if(FDLib.util.isFunction(callback)) {
					if(e.success){
						callback(e);
					}else{
						var errorMsg = e.message;
						errorMsg = errorMsg + '<br>' + that.buildValidateError(e);
						FDWindow.alert(errorMsg);
					}
				}
			}});
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
	/**
	 * 添加
	 */
	,add:function() {
		this.setUrl(this.getCrudUrl().add);
		this.reset();
		this.getWin().setTitle('添加');
		this.getWin().show();
	}
	/**
	 * 修改
	 * @param rowIndex 表格行索引
	 */
	,update:function(data) {
		this.getWin().setTitle('修改');
		this.setUrl(this.getCrudUrl().update);
		this.reset();
		this.setValues(data);
		this.getWin().show();
	}
	/**
	 * 删除
	 * @param rowIndex 表格行索引
	 */
	,del:function(data) {
		var self = this;
		FDWindow.confirm('确定删除这条记录?',function(r){
			if(r){
		    	self.setUrl(self.getCrudUrl().del);
				self.setValues(data);
				self.submit(function(){
					self.getWin().close();
					self.getGrid().reload();
				});
			}
		});
	}
	,save:function() {
		var result = this.validate();
		if(!result) {
			return false;
		}
		var self = this;
		this.submit(function(){
			self.getGrid().refresh();
			self.getWin().close();
		});
	}
	/**
	 * 验证panel中所有的控件
	 * @return 如果有一个控件为false,则返回false;全部为true时返回true
	 */
	,validate:function() {
		for(var i=0,len=this.controls.length; i<len; i++) {
			if(!this.controls[i].validate()) {
				return false;
			}
		}
		return true;
	}
	/**
	 * 设置提交的url
	 * @param url url
	 */
	,setUrl:function(url) {
		this.options.url = url;
	}
	/**
	 * 返回提交的url
	 * @return 提交的url
	 */
	,getUrl:function() {
		return this.options.url;
	}
	/**
	 * 获取增删改查的url
	 * @return 返回一个json对象,如:
	 * {
		add:ctx + '/addStudent.do'
		,update:ctx + '/updateStudent.do'
		,del:ctx + '/delStudent.do'
		}
	 */
	,getCrudUrl:function() {
		return this.options.crudUrl;
	}
	,getWin:function() {
		return this.options.win;
	}
	,getGrid:function() {
		return this.options.grid;
	}
	/**
	 * 通过name获取控件
	 * @param name 控件的name属性
	 * @return 返回控件对象
	 */
	,getControl:function(name) {
		return FDLib.util.each(this.controls,function(control){
			if(control.getName() == name) {
				return control;
			}
		});
	}
	/**
	 * 批量设置数据
	 * @param values json数据
	 */
	,setValues:function(values) {
		var util = FDLib.util;
		if(util.isObject(values)) {
			util.each(this.controls,function(control){
				var value = values[control.getName()];
				if(value != undefined){
					control.setValue(value);
				}
			});
		}
	}
	/**
	 * 获取所有控件的数据
	 * 
	 * @param key,如果该参数存在,则返回指定的json数据
	 * 
	 * @return 返回json数据
	 */
	,getValues:function(key) {
		var data = {};
		
		FDLib.util.each(this.controls,function(control){
			data[control.getName()] = control.getValue();
		});
		
		if(key) {
			return data[key];
		}
		return data;
	}
	,setData:function(data) {
		this.setValues(data);
	}
	/**
	 * 功能同getValues一样
	 */
	,getData:function(key) {
		return this.getValues(key);
	}
	/**
	 * 重置panel中的所有控件
	 */
	,reset:function() {
		FDLib.util.each(this.controls,function(control){
			control.reset();
		});
	}
}

/**
 * model层接口
 * @private
 */
var Model = FDLib.createInterface([
	'postData'
]);

/**
 * 视图层的接口
 * 
 * @private
 *
 */
var View = FDLib.createInterface([
	'processData'
]);

/**
 * 表格单元格接口
 * @private
 */
var Cell = FDLib.createInterface([
	'buildCellData'
]);

/**
 * 构建单元格的类
 * 
 * @param options 列的结构
 * { text:"姓名",name:"username",width:100,style:'text-align:100px;'
 * 	,render:function(data){return "aaa";} }
 * @private
 */
var FDCellView = function(column,options) {
	FDLib.implement(this,Cell);
	this.options = options;
	this.column = column;
}

/**
 * 构建表格单元格信息
 * @param rowIndex 当前行索引,从0开始
 * @param rowData 当前行的数据
 * @return 返回单元格信息. 数据格式为:
 * {html:'单元格内容',text:'列名',name:'username',style:{width:'100px'}}
 */
FDCellView.prototype.buildCellData = function(rowData,td,rowIndex,tr) {
	var html = rowData[this.column.name] || '';
	var style =  this.getStyle();
	
	td.innerHTML = html; // 设置TD内容
	
	if(FDLib.util.isFunction(this.column.render)){
		var renderHtml = this.column.render(rowData,td,rowIndex);
		if(renderHtml){
			td.innerHTML = renderHtml;
		}
	}
	
	FDLib.dom.bindDomStyle(td,style);
	// 文本在同一行
	if(this.column.textOneLine) {
		td.style.whiteSpace='nowrap';
	}else{
		td.style.wordWrap='break-word';
		td.style.whiteSpace = 'normal';
	}
	
}

FDCellView.prototype.getStyle = function() {
	var style =  this.column.style;
	// 不是自适应
	if(!this.options.fitColumns) {
		style = FDLib.util.apply(this.getColumnDefaultStyle(),this.column.style);
	}
	
	return style;
}

/**
 * 获取列选项的默认样式
 * @return 返回options.columnDefaultStyle的副本
 */
FDCellView.prototype.getColumnDefaultStyle = function(){
	return FDLib.util.clone(this.options.columnDefaultStyle);
}

/**
 * 构建列按钮
 * @param column 
 * @param options 
 * {
 * 	text:'修改'
 * 	,onclick:function(rowData,rowIndex){}
 * 	,render:function(rowData,td,rowIndex){}
 * 	,showFun:function(data){}
 * }
 * @private
 */
var FDButtonView = function(column,options) {
	FDLib.implement(this,Cell);
	this.options = options;
	this.column = column;
	this.actionButtons = this.options.actionButtons;
}

FDLib.extend(FDButtonView,FDCellView);

// @override
FDButtonView.prototype.buildCellData = function(rowData,td,rowIndex,tr) {
	var self = this;
	var style =  this.getStyle();
	
	FDLib.util.each(this.actionButtons,function(button){
		
		if(FDRight.checkByCode(button.operateCode)) {
			var a = self._buildButton(button,rowData,rowIndex);
		
			if(a) {
				td.appendChild(a);
				FDLib.dom.bindDomStyle(td,style);
			}
		}
		
	});

}

/**
 * 构建一个a标签,如果不显示则返回undefined
 */
FDButtonView.prototype._buildButton = function(button,rowData,rowIndex) {
	if(this._isShowButton(button,rowData,rowIndex)) {
		var a = document.createElement(FDTag.A);
		a.style.marginLeft = '5px';
		a.style.marginRight = '5px';
		a.href = 'javascript:void(0)';
		a.innerHTML = button.text;
		FDLib.event.addEvent(a,'click',function(){
			button.onclick(rowData,rowIndex);
		});
		return a;
	}
}

/**
 * 是否显示按钮
 */
FDButtonView.prototype._isShowButton = function(button,rowData,rowIndex) {
	var isRenderable = this.options.isRenderable || true;
	if(!isRenderable) {
		return false;
	}
	var hasShowFunHandler = FDLib.util.isFunction(button.showFun);
	if(hasShowFunHandler) {
		return button.showFun(rowData,rowIndex);
	}
	return true;
}



/**
 * 构建表格head的view
 * @param column: 
 * { text:"姓名",style:{width:100}
 *  }
 * @private
 */
var FDHeadCellView = function(column,options) {
	this.column = column;
	this.options = options;
	this.upTxt = "▲";
	this.downTxt = "▼";
	this.grid = options.getGrid();
}

FDLib.extend(FDHeadCellView,FDCellView);

FDHeadCellView.prototype.buildCellData = function(td,tr) {
	var style =  this.getStyle();
	td.innerHTML = this.column.text; // 设置TD内容
	this._buildSortButton(td);
	FDLib.dom.bindDomStyle(td,style);
}

// 构建排序按钮
FDHeadCellView.prototype._buildSortButton = function(td) {
	if(this.column.sortName) {
		// 设置当前排序方式
		this.currentSortOrder = this.grid.getSortOrder() || "DESC";
		
		var sortClickBtn = this._buildTagA();
		
		this._initTagAEvent(sortClickBtn);
				
		td.appendChild(sortClickBtn);
	}
}

FDHeadCellView.prototype._buildTagA = function() {
	var sortClickBtn = document.createElement(FDTag.A);
	sortClickBtn.href = "javascript:void(0)";
	sortClickBtn.innerHTML 
		= (this.currentSortOrder == "DESC")	? this.downTxt : this.upTxt;
		
	return sortClickBtn;
}

FDHeadCellView.prototype._initTagAEvent = function(a) {
	var self = this;
	var sortName = this.column.sortName;
	FDLib.event.addEvent(a,"click",function(e){
		var btn = e.target;
		if(self.currentSortOrder == 'ASC') {
			btn.innerHTML = self.downTxt;
			self.currentSortOrder = "DESC";
		}else{
			btn.innerHTML = self.upTxt;
			self.currentSortOrder = "ASC";
		}		
		self.grid.sort(sortName,self.currentSortOrder);
	});
}


/**
 * 构建表格head的select项
 * @param column: 
 * { text:"姓名",width:100,style:'text-align:100px;'
 *  }
 * @private
 */
var FDSelectHeadCellView = function(selectOption,options) {
	this.selectOption = selectOption;
	this.options = options;
	this.grid = options.getGrid();
}

FDLib.extend(FDSelectHeadCellView,FDHeadCellView);

FDSelectHeadCellView.prototype.buildCellData = function(th) {
	if(this.selectOption.multiSelect) {
		var selector = this._buildSelector(th);
		if(this.selectOption.hideCheckAll){
			FDLib.dom.hideDom(selector);
		}
		this.grid.checkAllInput = selector;
		th.appendChild(selector);
	}else{
		th.innerHTML = "&nbsp;";
	}
	th.style.width = '20px';
	th.setAttribute('align','center');
}

FDSelectHeadCellView.prototype._buildSelector = function(th) {
	var self = this;
	var selector = document.createElement(FDTag.INPUT);
	selector.setAttribute('type','checkbox');
	selector.style.cursor = 'pointer';
	
	selector.onclick = function(){
		var selectors = document.getElementsByName(self.selectOption.name);
		var checked = this.checked ? 'checked' : '';
		
		FDLib.util.each(selectors,function(sel,i){
			if(sel.disabled) {
				return;
			}
			if(sel.checked == checked) {
				return;
			}
			sel.checked = checked;
			sel.onclick();
		});
	}
	
	return selector;
}


/**
 * 表格列名的装饰类
 * @private
 */
var FDHeadView = function(options,grid) {
	this.grid = grid;
	this.options = options;
	this.gridDomMap = this.options.gridDomMap;
	
	this.headCellViews = null;
	
	this._initHeadCellViews();
}

/**
 * 构建表头
 */
FDHeadView.prototype.buildHead = function() {
	this.gridDomMap.headThead_0 = this.gridDomMap.table_1.createTHead();
	this._buildHeadHtml(this.gridDomMap.headThead_0);
}

/**
 * 构建head内容
 */
FDHeadView.prototype._buildHeadHtml = function(thead) {
	var cellViews = this.headCellViews;
	FDLib.util.each(cellViews,function(cellView,columnIndex){
		var th = document.createElement(FDTag.TH)
		th.className = "ui-state-default";
		thead.appendChild(th);
		// 单元格数据
		cellView.buildCellData(th,thead);
	});
}

FDHeadView.prototype._initHeadCellViews = function() {
	this.headCellViews = [];
	var options = this.options;
	var columns = options.columns;
	var self = this;
	// 如果有选择列
	this._addSelectView();
	
	FDLib.util.each(columns,function(column){
		self.headCellViews.push(new FDHeadCellView(column,options));
	});
	
	// 如果有操作列
	this._addButtonView(options);
}

FDHeadView.prototype._addSelectView = function() {
	var selectOption = this.options.selectOption;
	if(!selectOption){
		return;
	}
	if(selectOption.multiSelect || selectOption.singleSelect) {
		this.headCellViews.push(new FDSelectHeadCellView(selectOption,this.options));
	}
}

FDHeadView.prototype._addButtonView = function(options) {
	if(options.actionButtons.length > 0) {
		this.headCellViews.push(new FDHeadCellView(this.options.actionColumnConfig,options));
	}
}


/**
 * Panel控件视图层
 * 2015-3-16
 */
var FDPanelDomView = function(options){
	this.options = options;
	// 目标节点
	this.targetDom = this.buildTargetDom();
	
	this.initPanel();
	
	this.render();
}

FDPanelDomView.prototype = {
	initPanel:function() {
		this.panel = this.buildPanel();
		this.titleBar = this.buildTitleBar();
		this.title = this.buildTitle();
		this.content = this.buildContent();
		
		this.titleBar.appendChild(this.title);
		
		if(this.options.closeable){
			this.closeBtn = this.buildCloseBtn();
			this.titleBar.appendChild(this.closeBtn);
		}
		if(this.options.toggleable){
			this.toggleBtn = this.buildToggleBtn();
			this.titleBar.appendChild(this.toggleBtn);
		}
		
		this.panel.appendChild(this.titleBar);
		this.panel.appendChild(this.content);
		
		this._initSize();
	}
	,setTitle:function(title){
		this.title.innerHTML = title;
	}
	,setWidth:function(width) {
		if(FDLib.util.isString(width)) {
			this.content.style.width = width;
		}
	}
	,setHeight:function(height) {
		if(FDLib.util.isString(height)) {
			this.content.style.height = height;
		}
	}
	,setContent:function(content) {
		this.content.innerHTML = content;
	}
	,render:function(domId){
		if(FDRight.checkByCode(this.options.operateCode)) {
			this.content.appendChild(this.targetDom);
			
			if(domId){
				this.options.domId = domId;
			}
			var dom = FDLib.getEl(this.options.domId) || document.body;
			
			dom.appendChild(this.panel);
		}
	}
	,close:function() {
		this.panel.style.display = 'none';
	}
	,hide:function(){
		this.close();
	}
	// 显示窗体
	,show:function() {
		// 显示内容
		this.targetDom.style.display = 'block';
		// 显示整个窗体
		this.panel.style.display = 'block';
	}
	,buildTargetDom:function() {
		if(this.options.contentId){
			var cont =  FDLib.getEl(this.options.contentId);
			if(!cont){
				throw Error('未找到' + this.options.contentId);
			}
			cont.style.display = "none";
			return cont;
		}else{
			throw new Error('没有指定contentId,当前contentId值为:' + this.options.contentId);
		}
	}
	,buildPanel:function() {
		var panel = this.createEl(FDTag.DIV,this.getPanelClassName());
		panel.style.display = "none";
		return panel;
	}
	,buildTitleBar:function() {
		var titleBar = this.createEl(FDTag.DIV,this.getTitleBarClassName());
		titleBar.style.fontSize = '12px';
		return titleBar;
	}
	,buildTitle:function() {
		var title = this.createEl(FDTag.SPAN,this.getTitleClassName());
		// 标题文字不可选中
		title.setAttribute('unselectable','on');
		title.setAttribute('onselectstart','return false;');
		title.style.cssText = '-moz-user-select:none;';
		if(this.options.title){
			title.innerHTML = this.options.title;
		}
		return title;
	}
	,buildCloseBtn:function() {
		var that = this;
		if(this.options.closeable){
			var closeBtn = this.createEl(FDTag.A,this.getTitleBarBtnClassName());
			
			FDLib.event.addEvent(closeBtn,'click',function(e){
				that.close();
				e.preventDefault();
				e.stopPropagation();
			});
			
			var closeIcon = this.createEl(FDTag.SPAN,this.getCloseIconClassName());
			closeBtn.appendChild(closeIcon);
			
			FDLib.addHoverEffect(closeBtn);
			
			return closeBtn;
		}else{
			return this._getEmptySpan();
		}
	}
	,buildToggleBtn:function() {
		var that = this;
		if(this.options.toggleable){
			var toggleBtn = this.createEl(FDTag.A,this.getTitleBarBtnClassName());
			FDLib.event.addEvent(toggleBtn,'click',function(e){
				that.slideToggle();
				e.preventDefault();
				e.stopPropagation();
			});
			var icon = this.getToggleIcon();
			toggleBtn.appendChild(icon);
			
			FDLib.addHoverEffect(toggleBtn);
			
			if(this.options.isExpand) {
				toggleBtn.title = "点击收缩";
			}else{
				toggleBtn.title = "点击展开";
			}
			
			return toggleBtn;
		}else{
			return this._getEmptySpan();
		}
	}
	,getToggleIcon:function(){
		if(!this.toggleIcon){
			this.toggleIcon = this.createEl(FDTag.SPAN,this.getToggleIconClassName());
		}
		return this.toggleIcon;
	}
	,buildContent:function() {
		return this.createEl(FDTag.DIV,this.getContentClassName());;
	}
	,slideToggle:function() {
		if(this.isExpand()) {
			this.collapse();
		}else{
			this.expand();
		}
		return false;
	}
	,expand:function() {
		var target = this.toggleBtn;
		this.content.style.display = 'block';
		this.options.isExpand = true;
		target.title = "点击收缩";
		var icon = this.getToggleIcon();
		FDLib.dom.removeClass(icon,'ui-icon-plusthick');
		FDLib.dom.addClass(icon,'ui-icon-minusthick');
		this.afterExpand();
	}
	,unexpand:function() {
		this.collapse();
	}
	,collapse:function() {
		var target = this.toggleBtn;
		this.content.style.display = 'none';
		this.options.isExpand = false;
		target.title = "点击展开";
		var icon = this.getToggleIcon();
		FDLib.dom.addClass(icon,'ui-icon-plusthick');
		FDLib.dom.removeClass(icon,'ui-icon-minusthick');
		this.afterCollapse();
	}
	,afterExpand:function() {
		
	}
	,afterCollapse:function(){
		
	}
	,isExpand:function() {
		var options = this.options;
		var toggleable = options.toggleable
		return !toggleable || (options.isExpand && toggleable);
	}
	
	,getTitleBarBtnClassName:function() {
		return 'pui-panel-titlebar-icon ui-corner-all ui-state-default';
	}
	,getTitleClassName:function() {
		return 'ui-panel-title';
	}
	,getPanelClassName:function() {
		return 'pui-panel ui-widget ui-widget-content ui-corner-all';
	}
	,getTitleBarClassName:function() {
		return 'pui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all';
	}
	,getContentClassName:function() {
		return 'pui-panel-content ui-widget-content';
	}
	,getCloseIconClassName:function(){
		return 'ui-icon ui-icon-closethick';
	}
	,getToggleIconClassName:function() {
		return 'ui-icon ui-icon-minusthick';
	}
	,createEl:function(elName,className){
		var el = document.createElement(elName);
		el.className = className;
		return el;
	}
	,_getEmptySpan:function() {
		return this.createEl(FDTag.SPAN,'');
	}
	,_initSize:function() {
		var width = this.options.width;
		var height = this.options.height;
		this.setWidth(width);
		this.setHeight(height);
	}
}

/**
 * 面板控件
 * @example 示例:
tip = FDLib.getEl('tip');
win = new FDPanel({
	domId:'win'
	,title:'标题'
	,isSlide:true
	,width:'500px'
	,height:'300px'
});
win3 = new FDPanel({
	domId:'win3'
	,title:'标题3'
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-8-12
 */
var FDPanel = function(options) {
	FDLib.implement(this,FDControl);
	this.options = FDLib.util.apply(this.getOptions(),options);
	var view = this.options.view;
	/** 视图层实例 */
	this.viewInstance = new view(this.options);
	
	if(this.options.isLoadShow) {
		this.show();
	}
}

FDPanel.prototype = {
/**
 * 默认属性
 * <pre></code>
{
	// 节点ID
	domId:''
	// 标题
	,title:''
	//视图层类 
	,view:FDPanelView
	//是否可以展开/关闭 
	,isSlide:false
	// 是否立即展开
	,isExpand:true
	// 立即显示 
	,isLoadShow:true
	,width:null
	,height:null
	// 是否显示关闭按钮 
	,closeable:false
	// 是否可以伸缩
	,toggleable:false
}</code></pre>
 */
	getOptions:function() {
		return {
			domId:''
			/** 标题 */
			,title:''
			/** 视图层类 */
			,view:FDPanelDomView
			/** 是否可以展开/关闭 */
			,isSlide:false
			/** 是否立即展开 */
			,isExpand:true
			/** 立即显示 */
			,isLoadShow:true
			,width:null
			,height:null
			/** 是否显示关闭按钮 */
			,closeable:false
			/** 是否显示折叠按钮 */
			,toggleable:true
		};
	}
	/**
	 * 显示窗体
	 * @param callback 显示后的回调函数,与afterShow不冲突
	 */
	,show:function(callback) {
		this.viewInstance.show();
		if(FDLib.util.isFunction(callback)) {
			callback();
		}
	}
	/**
	 * 关闭窗体
	 * @param callback 关闭后的回调函数,与afterClose不冲突
	 */
	,hide:function(callback) {
		this.viewInstance.close();
		if(FDLib.util.isFunction(callback)) {
			callback();
		}
	}
	/**
	 * 等同hide()
	 */
	,close:function(callback) {
		this.hide(callback);
	}
	/**
	 * 设置面板的width属性
	 * @param width 字符串类型,如:'120px'
	 */
	,setWidth:function(width) {
		this.options.width = width;
		this.viewInstance.setWidth(width);
	}
	/**
	 * 设置面板的height属性
	 * @param height 字符串类型,如:'120px'
	 */
	,setHeight:function(height) {
		this.options.height = height;
		this.viewInstance.setHeight(height);
	}
	/**
	 * 设置标题
	 * @param title 标题
	 */
	,setTitle:function(title) {
		this.viewInstance.setTitle(title);
	}
	/**
	 * 设置窗体内容
	 * @param content 内容,字符串类型
	 */
	,setContent:function(content) {
		this.viewInstance.setContent(content);
	}
}

/**
 * 窗体拖拽工具类
 * @example 示例:
 * // 注册
 * FDDragUtil.regist(winDom,titleDom);
 * // 取消拖拽
 * FDDragUtil.destory(titleDom);
 * @class
 */
var FDDragUtil = (function(){

	var doc = document;
	
	var clickedClientX = 0;
	var clickedClientY = 0;
	var oldTop = 0;
	var oldLeft = 0;
	var moveable = false;
	
	var FUN_TRUE = function(){return true;};
	var FUN_FALSE = function(){return false;};
	
	function disableSelectWords() {
		if(doc.all){
		    doc.onselectstart= FUN_FALSE; //for ie
		}else{
		    doc.onmousedown= FUN_FALSE;
		}
	}
	
	function enableSelectWords() {
		if(doc.all){
		    doc.onselectstart = FUN_TRUE; //for ie
		}else{
		    doc.onmousedown = FUN_TRUE;
		}
	}
	
	return {
		/**
		 * 注册拖拽
		 * 需要传入整个窗体dom和标题部分的dom
		 */
		regist:function(winDom,titleDom) {
			var winStyle = winDom.style;
			var winWidth = parseInt(winStyle.width || 200);
			var winHeight = parseInt(winStyle.height || 30);
			var clientHeight = 0;
			var clientWidth = 0;
			
			titleDom.onmousedown = function(evt) {
				disableSelectWords();
				evt = evt || window.event;
				clientHeight = doc.documentElement.clientHeight || doc.body.clientHeight;
				clientWidth = doc.documentElement.clientWidth || doc.body.clientWidth;
				
				moveable = true; 
				// 鼠标点击title时的位置
				clickedClientX = evt.clientX;
				clickedClientY = evt.clientY;
				
				 // 窗体原始坐标,相对于窗体左上角
				oldTop = parseInt(winStyle.top);
				oldLeft = parseInt(winStyle.left);
				
				doc.onmousemove = function(e) {
					e = e || window.event;
					if (moveable) {
						// 水平拖行距离 = 鼠标滑动时的位置 - 鼠标点击title时的位置
						var dragSizeWidth = e.clientX - clickedClientX; // 水平拖动距离
						var dragSizeHeight = e.clientY - clickedClientY; // 垂直拖动距离
						// 窗体新的坐标 = 鼠标拖动距离 + 窗体老的坐标距离
						var newLeft = dragSizeWidth + oldLeft;							
						var newTop = dragSizeHeight + oldTop;
						
						if (newLeft > 0 && newLeft < clientWidth - winWidth) {
							winStyle.left = newLeft + "px";
						}
						if(newTop > 0 && newTop < clientHeight - winHeight){
							winStyle.top = newTop + "px";
						}
					}
				
				};
			}
			
			titleDom.onmouseup = function () {
				enableSelectWords();
				if (moveable) { 					
					moveable = false; 
					clickedClientX = 0;
					clickedClientY = 0;
					oldTop = 0;
					oldLeft = 0;
				} 
			};
			
		}
		,moveToCenter:function(win,winWidth,winHeight) {
			var body = doc.body
				,docEl = doc.documentElement;
			var clientHeight = docEl.clientHeight || body.clientHeight
				,clientWidth = docEl.clientWidth || body.clientWidth
				,scrollLeft = docEl.scrollLeft || body.scrollLeft 
				,left = clientWidth * 0.35 + scrollLeft
				,top = clientHeight * 0.25;
			
			if(winWidth){
				left = (clientWidth*0.5 - (parseInt(winWidth))*0.5) - 10;
			}
			
			if(winHeight) {
				top = (clientHeight*0.5 - (parseInt(winHeight))*0.5) - 50;
			}
			
			win.style.left = left + 'px';
       	 	win.style.top = top + 'px'; 
		}
		/**
		 * 注销,取消拖拽
		 */
		,destory:function(titleDom) {
			titleDom.style.cursor = 'default';
			titleDom.onmousedown = null;
		}
	}
})();

var FDWindowDomView = function(options) {
	FDWindowDomView.superclass.constructor.call(this,options);
	
	this.buttonPanel = null;
	
	this._createButtons();
	
	this.setDragable();
	
	this.setPanelClick();
}

FDLib.extend(FDWindowDomView,FDPanelDomView);

// zIndex初始值
FDWindowDomView.zIndex = 200;

/**
 * 获取下一个zIndex
 */
FDWindowDomView.getNextZ_Index = function() {
	return ++FDWindowDomView.zIndex;
}

/**
 * 打开窗体
 */
//@override
FDWindowDomView.prototype.show = function(callback) {
	
	if(this.options.modal) {
		this.showBgModal();
	}
	// 放在showBgModal()后面,确保zIndex始终比遮罩层的大
	this.addPanelZ_Index();
	
	FDWindowDomView.superclass.show.call(this);
	
	var afterShow = this.options.afterShow;
	
	if(FDLib.util.isFunction(afterShow)) {
		afterShow();
	}
	if(FDLib.util.isFunction(callback)){
		callback();
	}
}

// 增加z-index
FDWindowDomView.prototype.addPanelZ_Index = function() {
	this.panel.style.zIndex = FDWindowDomView.getNextZ_Index();
}

//@override
FDWindowDomView.prototype.close = function(callback) {
	this.hideBgModal();
	FDWindowDomView.superclass.close.call(this);
	if(FDLib.util.isFunction(callback)){
		callback();
	}
}

//@override
FDWindowDomView.prototype.afterExpand = function() {
	FDLib.dom.showDom(this.buttonPanel);
}

//@override
FDWindowDomView.prototype.afterCollapse = function(){
	FDLib.dom.hideDom(this.buttonPanel);
}


FDWindowDomView.prototype.hideBgModal = function() {
	this.getBgModal().style.display = 'none';
}

// 创建遮罩层
FDWindowDomView._createBgModal = function() {
	var bgModal = document.createElement(FDTag.DIV);
	
	bgModal.className = 'ui-widget-overlay';
	bgModal.style.display = 'none';
	
	return bgModal;
}

/**
 * 获取遮罩层
 */
FDWindowDomView.prototype.getBgModal = function() {
	if(!this.bgModal){
		this.bgModal = FDWindowDomView._createBgModal();
		document.body.appendChild(this.bgModal);
	}
	return this.bgModal;
}

FDWindowDomView.prototype.showBgModal = function() {
	var zIndex = FDWindowDomView.getNextZ_Index();
	var doc = document;
	var body = doc.body;
	var docEl = doc.documentElement;
		
	var clientHeight = docEl.clientHeight || body.clientHeight;
	var scrollHeight = docEl.scrollHeight || body.scrollHeight;
	var height = Math.max(clientHeight,scrollHeight);
	
	var bgModal = this.getBgModal();
	
	bgModal.style.height = height + 'px';
	
	bgModal.style.zIndex = zIndex;
	bgModal.style.display = 'block';
}

FDWindowDomView.prototype.moveTo = function(left,top) {
	this.panel.style.left = left + 'px';
    this.panel.style.top = top + 'px';
}

FDWindowDomView.prototype.setDragable = function() {
	if(this.couldMoveWindow()) {
		FDDragUtil.regist(this.panel,this.titleBar);
		// 移到屏幕中央
		this.moveToCenter();
	}else{
		FDDragUtil.destory(this.titleBar);
	}
}

FDWindowDomView.prototype.setPanelClick = function() {
	var that = this;
	FDLib.event.addEvent(this.panel,'mousedown',function(e){
		that.addPanelZ_Index();
	});
}

// 构建按钮
FDWindowDomView.prototype._createButtons = function() {
	var buttons = this.options.buttons;
	var buttonsInstaces = [];
	if(FDLib.util.isArray(buttons)) {
		FDLib.util.each(buttons,function(button,i){
			if(!(button instanceof FDButton)) {
				button = new FDButton(button);
				buttons[i] = button;
			}
			buttonsInstaces.push(button);
		});
		
		this._appendButtons(buttonsInstaces);
	}
}

FDWindowDomView.prototype._appendButtons = function(buttonInstances) {
	var that = this;
	if(buttonInstances.length > 0) {
		if(!this.buttonPanel){
			this.buttonPanel = this.createEl(FDTag.DIV,this.getButtonPanelClassName());
			this.panel.appendChild(this.buttonPanel);
		}
		this.buttonPanel.innerHTML = '';
		FDLib.util.each(buttonInstances,function(btnInstance){
			btnInstance.renderToDom(that.buttonPanel);
		});
	}
}

FDWindowDomView.prototype.moveToCenter = function() {
	var winWidth = this.options.width;
	var winHeight = this.options.height;
	FDDragUtil.moveToCenter(this.panel,winWidth,winHeight);
}

FDWindowDomView.prototype.couldMoveWindow = function() {
	return this.options.dragable;
}

FDWindowDomView.prototype.getTitleBarBtnClassName = function() {
	return 'pui-dialog-titlebar-icon pui-dialog-titlebar-close ui-corner-all';
}
FDWindowDomView.prototype.getTitleClassName = function() {
	return 'pui-dialog-title';
}
FDWindowDomView.prototype.getPanelClassName = function() {
	var className = 'pui-dialog ui-widget ui-widget-content ui-corner-all pui-shadow';
	if(this.options.dragable){
		className += ' ui-draggable';
	}
	return className;
}
FDWindowDomView.prototype.getTitleBarClassName = function() {
	return 'pui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top';
}
FDWindowDomView.prototype.getContentClassName = function() {
	return 'pui-dialog-content ui-widget-content';
}
FDWindowDomView.prototype.getCloseIconClassName = function(){
	return 'ui-icon ui-icon-close';	
}
FDWindowDomView.prototype.getButtonPanelClassName = function(){
	return 'pui-dialog-buttonpane ui-widget-content ui-helper-clearfix';	
}

/**
 * 窗体控件FDWindow,继承自<a href="FDPanel.html">FDPanel</a><br>
 * @example 示例:
tip = FDLib.getEl('tip');
win = new FDWindow({
	contentId:'win'
	,title:'标题'
	,modal:false
	,afterShow:function(){tip.innerHTML = 'afterShow'}
	,afterClose:function(){tip.innerHTML = 'afterClose'} 
});
win3 = new FDWindow({
	contentId:'win3'
	,title:'标题3'
});

var win2 = new FDWindow({domId:'win2',width:'200px',modal:false,dragable:false,title:'无法拖动,无法关闭的标题',closeable:false});
win2.moveTo(100,100);
win2.show();
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-8-8
 */
var FDWindow = function(options) {
	FDWindow.superclass.constructor.call(this,options);
	FDLib.implement(this,FDControl);
}

FDLib.extend(FDWindow,FDPanel);

/**
 * 默认属性,继承<a href="FDPanel.html">FDPanel</a>的属性并添加自身属性
 * @example <pre><code>
{
	domId:''
	// 标题 
	,title:''
	// 按钮,参考FDButton
	,buttons:[]
	// 视图层类 
	,view:FDWindowView
	// 是否显示右上角关闭按钮 
	,closeable:true
	// 能否拖拽窗体 
	,dragable:true
	// 是否显示遮罩层 
	,modal:true
	// 打开窗体后执行的方法 
	,afterShow:null
	// 关闭窗体后执行的方法 
	,afterClose:null
	// 是否立即显示
	,isLoadShow:false
}</code></pre>
 */
//@override
FDWindow.prototype.getOptions = function() {
	var options = FDWindow.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		domId:''
		/** 标题 */
		,title:''
		/** 按钮 */
		,buttons:[]
		/** 视图层类 */
		,view:FDWindowDomView
		/** 是否显示右上角关闭按钮 */
		,closeable:true
		/** 能否拖拽窗体 */
		,dragable:true
		/** 是否显示遮罩层 */
		,modal:true
		/** 打开窗体后执行的方法 */
		,afterShow:null
		/** 关闭窗体后执行的方法 */
		,afterClose:null
		/** 是否立即显示 */
		,isLoadShow:false
		,toggleable:false
	});
}

/**
 * 返回按钮
 * @return 返回按钮集合,数组形式,每个元素都是FDButton对象
 */
FDWindow.prototype.getButtons = function() {
	return this.options.buttons;
}

/**
 * 移动到中央
 */
FDWindow.prototype.moveToCenter = function() {
	this.viewInstance.moveToCenter();
}

/**
 * 移动窗体
 * @param left 距离页面左边的距离,int类型
 * @param top 距离页面顶部的距离,int类型
 */
FDWindow.prototype.moveTo = function(left,top) {
	this.viewInstance.moveTo(left,top);
}

/*------------------------------------confirm------------------------------------*/
/**
 * 确认框,功能类似于window.confirm()
 * @param content 窗口内容
 * @param callback 回调函数,即点击确定后需要执行的函数
 * @param options FDWindow的options参数
 * @example 示例:
<pre>
FDWindow.confirm('确定关闭吗?',function(r){
	if(r){
		alert('确定')
	}else{
		alert('取消')
	}
}); 
</pre>
 */
FDWindow.confirm = (function(){
	
	var okBtn = null;
	var noBtn = null;
	var confirmWin = null;
	
	var def = {
		title:'提示'
		,width:'220px'
		,yesText:"确定"
		,noText:"取消"
	};
	
	return function(content,callback,options){
		var defOpt = FDLib.util.clone(def);
		
		options = FDLib.util.apply(defOpt,options);
		
		initWindow(content,options,callback);
		
		confirmWin.show();
	};
	
	function initWindow(content,options,callback){
		if(!confirmWin) {
			okBtn = new FDButton();
			noBtn = new FDButton();
			confirmWin = new FDWindow({
				contentId:buildWindowHtml()
				,closeable:false
				,buttons:[okBtn,noBtn]
			});
		}
		
		confirmWin.setTitle(options.title);
		confirmWin.setContent(content || '');
		
		confirmWin.setWidth(options.width);
		confirmWin.setHeight(options.height);
		
		okBtn.setText(options.yesText);
		noBtn.setText(options.noText);
		
		okBtn.setOnclick(function(){
			callback&&callback(true);
			confirmWin.close();
		});
		
		noBtn.setOnclick(function(){
			callback&&callback(false);
			confirmWin.close();
		});
		
	}
	
	function buildWindowHtml() {
		var div = document.createElement(FDTag.DIV);
		var id = "confirmWin_" + FDControl.generateCount();
		div.setAttribute('id',id);
		document.body.appendChild(div);
		return id;
	}
})();

/*------------------------------------alert------------------------------------*/
/**
 * 确认框,功能类似于window.alert()
 * @param content 窗口内容
 * @param callback 回调函数,即点击确定后需要执行的函数
 * @param options FDWindow的options参数
 * @example 示例:
<pre>
FDWindow.alert('成功!',function(r){
	alert('确定')
}); 
</pre>
 */
FDWindow.alert = (function(){
	
	var okBtn = null;
	var alertWin = null;
	
	var def = {
		title:'提示'
		,width:'220px'
		,yesText:"确定"
	};
	
	return function(content,callback,options){
		var defOpt = FDLib.util.clone(def);
		
		options = FDLib.util.apply(defOpt,options);
		
		initWindow(content,options,callback);
		
		alertWin.show();
	};
	
	function initWindow(content,options,callback){
		if(!alertWin) {
			okBtn = new FDButton();
			alertWin = new FDWindow({
				contentId:buildWindowHtml()
				,closeable:false
				,buttons:[okBtn]
			});
		}
		
		alertWin.setTitle(options.title);
		alertWin.setContent(content || '');
		
		alertWin.setWidth(options.width);
		alertWin.setHeight(options.height);
		
		okBtn.setText(options.yesText);
		
		okBtn.setOnclick(function(){
			callback&&callback();
			alertWin.close();
		});
	}
	
	function buildWindowHtml() {
		var div = document.createElement(FDTag.DIV);
		var id = "alertWin_" + FDControl.generateCount();
		div.setAttribute('id',id);
		document.body.appendChild(div);
		return id;
	}
})();


/**
 * @private
 */
var FDTabView = function(options,tab) {
	this.options = options;
	// 保存li,key为value
	this.liStore = {};
	this.tab = tab;

	this.tabDiv = document.createElement(FDTag.DIV);
	this.tabDiv.className = 'pui-tabview ui-widget ui-widget-content ui-corner-all ui-hidden-container pui-tabview-top';
	
	this.ul = document.createElement(FDTag.UL);
	this.ul.className = 'pui-tabview-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all';
	this.ul.style.height = '32px';
	
	this.tabContent = document.createElement(FDTag.DIV);
	this.tabContent.className = 'pui-tabview-panels';
	
	this.tabDiv.appendChild(this.ul);
	this.tabDiv.appendChild(this.tabContent);
	
	this.checkedItem = null;
	
	this._buildTabEvent();
}

FDTabView.prototype = {
	/**
	 * 构建tab
	 * @param items 
	 */
	buildTab:function(items) {
		this._buildTabItem(items);
		
		this._renderToDesDom();
	}
	/**
	 * 显示整个tab
	 */
	,show:function() {
		this.tabDiv.style.display = 'block';
	}
	/**
	 * 隐藏整个tab
	 */
	,hide:function() {
		this.tabDiv.style.display = 'none';
	}
	,disable:function(item) {
		this._selectOtherItem(item);
		item.disable = true;
		var li = this._getLiByValue(item.value);
		li.className = this._getDisabledClassName();
		//li.getElementsByTagName('span')[0].style.cursor = 'default';
	}
	,enable:function(item) {
		item.disable = false;
		var li = this._getLiByValue(item.value);
		li.className = this._getLiClassName();
		//li.getElementsByTagName('span')[0].style.cursor = 'pointer';
	}
	,_getDisabledClassName:function(){
		return 'ui-state-disabled';
	}
	/**
	 * 移除所有的tab项
	 */
	,removeAll:function() {
		this._hideAllItemContent();
		// remove all li
		this.ul.innerHTML = '';
		// clear store
		this.liStore = {};
	}
	/**
	 * 移除某一个item
	 */
	,doRemoveItem:function(item) {
		var value = item.value;
		// hide contentDiv
		// 这里只隐藏div,不做删除
		// 如果删除div的话,会自定义的div删掉
		this._hideItemContent(item);
		// remove li
		var li = this._getLiByValue(value);
		li.parentNode.removeChild(li);
		// clear store
		this._clearLiStore(value);
		
	}
	/**
	 * 根据value移除一个item
	 * @param item 单个item项
	 */
	,removeItem:function(item) {
		if(this._isAbleOperate(item)) {
			this._selectOtherItem(item);
			this.doRemoveItem(item);
		}
	}
	/**
	 * 根据value值显示tab
	 * @param value item中的value
	 */
	,showItemByValue:function(value) {
		var item = this._getItemByValue(value);
		if(item) {
			// 始终执行onclick事件
			if(this._isAbleOperate(item)) {
				this._processClickEvent(item);
			}
			if(this._isAbleOperate(item) && !this.isChecked(item)) {
				this._selectItem(item);
				this._processChangeEvent(item);
			}
			// 刷新iframe
			this._refresh(item);
		}
	}
	// 将所有的items未选中
	,_unselectAllItems:function() {
		var itemStore = this._getItemStore();
		for(var value in itemStore) {
			var item = itemStore[value];
			// 如果不是禁用状态
			if(this._isAbleOperate(item)) {
				this._unselectItem(item);
			}
		}
	}
	,_isAbleOperate:function(item) {
		return item && !item.disable;
	}
	// 选中item
	,_selectItem:function(item) {
		if(item) {
			this._unselectAllItems();
			item.checked = true;
			FDLib.dom.addClass(this._getLiByValue(item.value),this._getSelectClassName());
			this._showItemContent(item);
		}
	}
	// 未选中
	,_unselectItem:function(item) {
		item.checked = false;
		FDLib.dom.removeClass(this._getLiByValue(item.value),this._getSelectClassName());
		this._hideItemContent(item);
	}
	,isChecked:function(item) {
		return item && item.checked;
	}
	,_getSelectClassName:function(){
		return 'pui-tabview-selected ui-state-active';
	}
	,_getLiClassName:function() {
		return 'ui-state-default ui-corner-top';
	}
	// 选择其它的item
	,_selectOtherItem:function(item) {
		var li = this._getLiByValue(item.value);
		// 如果当前的li已经被选中
		if(this.isChecked(item)) {
			// 获取当前LI左边或者右边的一个LI
			var otherLI = li.previousSibling || li.nextSibling;
			if(otherLI) {
				var otherLiValue = otherLI.getAttribute('value');
				this.showItemByValue(otherLiValue);
			}
		}
	}
	// 将tab定位在HTML节点上
	,_renderToDesDom:function() {
		if(FDRight.checkByCode(this.options.operateCode)) {
			var desDom = FDLib.getEl(this.options.domId);
			desDom.appendChild(this.tabDiv);
			this._selectItem(this.checkedItem || this.options.items[0]);
		}
	}
	// 构建选项卡
	,_buildTabItem:function(items) {
		var self = this;
		FDLib.util.each(items,function(item){
			var li = self._buildLI(item);
			self.ul.appendChild(li);
			self._storeLI(li,item.value);
			self._buildItemContent(item);
		});
	}
	// 根据value缓存li
	,_storeLI:function(li,value) {
		this.liStore[value] = li;
	}
	// 构建li
	,_buildLI:function(item) {
		var li = document.createElement(FDTag.LI);
		li.className = this._getLiClassName();
		li.setAttribute("value",item.value);
		li.innerHTML = FDLib.string.format(FDTabView.aTemplate,{text:item.text});
		this._addHoverEffect(li,item);
		if(item.closeable) {
			this._buildCloseButton(li);
		}
		
		if(item.checked){
			this.checkedItem = item;
		}
		
		return li;
	}
	,_addHoverEffect:function(li,item){
		var hoverClassName = 'ui-state-hover';
		var that = this;
		FDLib.event.addEvent(li,'mouseover',function(){
			if(that._isAbleOperate(item)){
				FDLib.dom.addClass(li,hoverClassName);
			}
		});
		FDLib.event.addEvent(li,'mouseout',function(){
			FDLib.dom.removeClass(li,hoverClassName);
		});
	}
	// 构建关闭按钮
	,_buildCloseButton:function(li) {
		var closeBtn = document.createElement(FDTag.SPAN);
		closeBtn.className = 'ui-icon ui-icon-close';
		li.appendChild(closeBtn);
	}
	// 构建item对应的内容
	,_buildItemContent:function(item) {
		var contentDiv = item.contentDiv;
		contentDiv.className = 'pui-tabview-panel ui-widget-content ui-corner-bottom';
		this.tabContent.appendChild(contentDiv);
		
		if(item.checked) {
			this._showItemContent(item);
		} else {
			this._hideItemContent(item);
		}
	}
	// 根据value清除li
	,_clearLiStore:function(value) {
		delete this.liStore[value];
	}
	// 添加Tab事件
	,_buildTabEvent:function() {
		var that = this;
		var toggleStyle = this.options.isHover ? 'mouseover' : 'click';
		// 添加tab的切换事件
		FDLib.event.addBatchEvent({
			// 监听ul下面所有的a
			superDom:this.ul,tagName:'A',eventName:toggleStyle
			,handler:function(target) {
				that._showItemHandler(target);
			}
		});
		// 添加tab的关闭事件
		FDLib.event.addBatchEvent({
			superDom:this.ul,tagName:'SPAN',eventName:'click'
			,handler:function(target) {
				that._closeItemHandler(target);
			}
		});
	}
	,_showItemHandler:function(target) {
		var parentNode = target.parentNode;
		var value = parentNode.getAttribute('value');
		this.showItemByValue(value);
	}
	,_closeItemHandler:function(target) {
		var parentNode = target.parentNode;
		var value = parentNode.getAttribute('value');
		if(this._isAbleOperate(this._getItemByValue(value))) {
			this.tab.removeItemByValue(value);
		}
	}
	,_processClickEvent:function(item) {
		var onclickHandler = item.onclick;
		if(FDLib.util.isFunction(onclickHandler)) {
			onclickHandler(this.tab,item);
		}
	}
	,_processChangeEvent:function(item) {
		var onchangeHandler = item.onchange;
		if(FDLib.util.isFunction(onchangeHandler)) {
			onchangeHandler(this.tab,item);
		}
	}
	// 刷新iframe
	,_refresh:function(item) {
		if(this._hasIframe(item)) {
			var iframe = item.iframe;
			if(this._isNeedRefresh(iframe,item)) {
				this._refreshIFrame(iframe,item);
			}
		}
	}
	// 显示item对应的content
	,_showItemContent:function(item) {
		item.contentDiv.style.display = "block";
	}
	// 隐藏某一个item
	,_hideItemContent:function(item) {
		item.contentDiv.style.display = "none";
	}
	// 隐藏全部内容
	,_hideAllItemContent:function() {
		var itemStore = this._getItemStore();
		for(var value in itemStore) {
			this._hideItemContent(itemStore[value]);
		}
	}
	// 是否有item
	,_hasIframe:function(item) {
		return item.iframe;
	}
	// 是否是第一次加载
	,_isFirstLoad:function(iframe) {
		return !iframe.src;
	}
	// 刷新iframe
	,_refreshIFrame:function(iframe,item) {
		iframe.src = item.url;
	}
	// 是否需要刷新
	,_isNeedRefresh:function(iframe,item) {
		if(this._isFirstLoad(iframe)) {
			return true;
		}
		return (FDLib.util.isString(item.url) && item.url && item.isRefresh);
	}
	// 获取itemStore
	,_getItemStore:function() {
		return this.options.itemStore;
	}
	// 通过value获取Item
	,_getItemByValue:function(value) {
		return this._getItemStore()[value];
	}
	// 通过value获取LI
	,_getLiByValue:function(value) {
		return this.liStore[value];
	}
}
// 关闭按钮模板
FDTabView.aTemplate = '<a href="javascript:void(0);">{text}</a>';


/**
 * tab控件
 * @example 示例:
var tab1;
var tab2;
FDLib.loadJs('FDTab',function() {
	tab1 = new FDTab({domId:'tab1'
		,isHover:true
		,items:[
		{text:'英文',value:1,contentId:'tab1-cont1',closeable:true,checked:false}
		,{text:'中文',value:2,contentId:'tab1-cont2',checked:true}
	]});
	
	
	var en = 'After viewing the metamorphosis at sunrise, '
		+ 'I would walk downhill along the steep mountain-path, '
		+ 'towards the rocky beach, for a brief swim. Each time, '
		+ 'I noticed a flurry of activity in a distant compound with a single decrepit building.';
	
	var zh = '在观看了日出时奇妙的变化以后，我会沿着陡峭的山路下行，走到一个遍布岩石的海滩，游一会儿泳。'
	tab2 = new FDTab({domId:'tab2'
		,items:[
		{text:'英文2',value:3,content:'<i>'+en+'</i>',closeable:true,checked:false,onchange:changeHandler}
		,{text:'中文2',value:4,content:'<b>'+zh+'</b>',closeable:true,checked:true,onchange:changeHandler}
		,{text:"百度",closeable:true,url:'http://www.baidu.com',isRefresh:true,onclick:function(){alert('show baidu')},checked:false}
	]});
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDTab = function(options) {
	FDLib.implement(this,FDControl);
	this.options = FDLib.util.apply(this.getOptions(),options);
	// 根据value储存item
	this.options.itemStore = {};
	
	this.tabInstance = new this.options.view(this.options,this);
	
	this._buildTab(this.options.items);
}

FDTab.prototype = {
/**
 * 返回默认的属性
 *<pre><code>
{
	domId:''

	// item项:
	// {text:'tab名'
	//  ,value:'tab值'
	// 	,contentId:'',html:''
	// 	,url:null
	// 	,isRefresh:false // 设置了url,每次点击tab是否刷新
	// 	,onchange:function(item){}
	// 	,checked:false
	//  ,closeable:false
	// }
	,items:[]
	//鼠标滑过切换tab,默认以click方式切换 
	,isHover:false
	,view:FDTabView
}</code></pre>
 */
	getOptions:function() {
		return {
			domId:''
			,items:[]
			,isHover:false
			,view:FDTabView
		}
	}
	/**
	 * 显示控件
	 */
	,show:function() {
		this.tabInstance.show();
	}
	/**
	 * 隐藏
	 */
	,hide:function() {
		this.tabInstance.hide();
	}
	/**
	 * 根据value选择某一个tab
	 * @param val item的value
	 */
	,setValue:function(val) {
		this.tabInstance.showItem(val);
	}
	/**
	 * 设置items
	 * @param items item属性
	 */
	,setItems:function(items) {
		this.removeAll();
		this.options.items = items;
		this._buildTab(items);
	}
	/**
	 * 移除所有项
	 */
	,removeAll:function() {
		this.tabInstance.removeAll();
		this._resetData();
	}
	/**
	 * 根据value值移除某一项
	 * @param value item的value
	 */
	,removeItemByValue:function(value) {
		var item = this.getItemByValue(value);
		this.removeItem(item);
	}
	/**
	 * 根据index移除某一项
	 * @param tab的索引,从0开始
	 */
	,removeItemByIndex:function(index) {
		var item = this.getItemByIndex(index);
		this.removeItem(item);
	}
	/**
	 * 根据item项来移除
	 * @param item item对象
	 */
	,removeItem:function(item) {
		if(item) {
			this.tabInstance.removeItem(item);
			
			this._delItemDataByValue(item.value);
		}
	}
	/**
	 * 添加一个item
	 * @param item item对象
	 */
	,addItem:function(item) {
		this.addItems([item]);
	}
	/**
	 * 添加多个item
	 * @param items item数组
	 */
	,addItems:function(items) {
		if(FDLib.util.isArray(items)) {
			this.options.items = this.options.items.concat(items);
			this._buildTab(items);
		}
	}
	/**
	 * 根据value获取item对象
	 * @param value item的value
	 */
	,getItemByValue:function(value) {
		return this.options.itemStore[value];
	}
	/**
	 * 根据value值选择tab项
	 * @param value item的value
	 */
	,selectItemByValue:function(value) {
		this.tabInstance.showItemByValue(value);
	}
	/**
	 * 根据index值选择tab项
	 * @param tab的索引,从0开始
	 */
	,selectItemByIndex:function(index) {
		var item = this.getItemByIndex(index);
		if(item) {
			this.selectItemByValue(item.value);
		}
	}
	/**
	 * 根据value禁用tab项
	 * @param value item的value
	 */
	,disableByValue:function(value) {
		var item = this.getItemByValue(value);
		this.disable(item);
	}
	/**
	 * 根据index禁用tab项
	 * @param tab的索引,从0开始
	 */
	,disableByIndex:function(index) {
		var item = this.getItemByIndex(index);
		this.disable(item);
	}
	/**
	 * 根据value值启用tab项
	 * @param value item的value
	 */
	,enableByValue:function(value) {
		var item = this.getItemByValue(value);
		this.enable(item);
	}
	/**
	 * 根据index值启用tab项
	 * @param tab的索引,从0开始
	 */
	,enableByIndex:function(index) {
		var item = this.getItemByIndex(index);
		this.enable(item);
	}
	/**
	 * @private
	 */
	,disable:function(item) {
		if(item) {
			this.tabInstance.disable(item);
		}
	}
	/**
	 * @private
	 */
	,enable:function(item) {
		if(item) {
			this.tabInstance.enable(item);
		}
	}
	/**
	 * 根据index获取item对象
	 * @param tab的索引,从0开始
	 */
	,getItemByIndex:function(index) {
		return this.options.items[index];
	}
	// private
	// 初始化items项
	,_initItems:function(items) {
		var self = this;
		var newItems = this._refreshPermissionItems(items);
		FDLib.util.each(newItems,function(item){
			item = self._checkValueAndContentId(item);
			item = self._checkContentDiv(item);
			
			self._storeItem(item);
		});
		
		return newItems;
	}
	,_refreshPermissionItems:function(items) {
		var newItems = [];
		FDLib.util.each(items,function(item){
			FDRight.checkByCode(item.operateCode,function(){
				newItems.push(item);
			});
		});
		
		this.options.items = newItems;
		
		return newItems;
	}
	,_buildTab:function(items) {
		var newItems = this._initItems(items);
		this.tabInstance.buildTab(newItems);
	}
	,_resetData:function() {
		this.options.itemStore = {};
		this.options.item = [];
	}
	,_delItemDataByValue:function(value) {
		var itemIndex = 0;
		var items = this.options.items;
		
		FDLib.util.each(items,function(item,i){
			if(item.value == value) {
				itemIndex = i;
				return false;
			}
		});
		
		this._delItemData(itemIndex);
		this._delItemStoreByValue(value);
	}
	,_delItemData:function(itemIndex) {
		var items = this.options.items;
		if(items.length > itemIndex){
		 	items.splice(itemIndex,1);
		}
	}
	,_delItemStoreByValue:function(value) {
		delete this.options.itemStore[value];
	}
	,_storeItem:function(item) {
		this.options.itemStore[item.value] = item;
	}
	// 确保value和contentId存在
	,_checkValueAndContentId:function(item) {
		var util = FDLib.util;
		var count = FDControl.generateCount();
		// 确保value存在
		if(util.isUndefined(item.value)) {
			item.value = 'tabValue_' + count;
		}
		if(util.isUndefined(item.contentId)) {
			item.contentId = 'tabContId_' + count;
		}
		return item;
	}
	// 确保content对应的div存在
	,_checkContentDiv:function(item) {
		// 保content存在
		if(FDLib.util.isUndefined(item.content)) {
			item.content = '';
		}
		var contentId = item.contentId,
			content = item.content;
		var contentDiv = null;
			
		if(contentId && FDLib.util.isString(contentId)) {
			contentDiv = FDLib.getEl(contentId);
		}
		// 如果contentDiv找不到,则创建一个空的div
		if(!contentDiv) {
			contentDiv = this._buildContentDiv(item);
		}
		item.contentDiv = contentDiv;
		
		return item;
	}
	,_buildContentDiv:function(item) {
		var contentId = item.contentId;
		var contentDiv = document.createElement(FDTag.DIV);
		contentDiv.setAttribute('id',contentId);
		contentDiv.innerHTML = item.content;
		
		this._buildIFrame(contentDiv,item);
		
		return contentDiv;
	}
	,_buildIFrame:function(contentDiv,item) {
		var url = item.url;
		if(FDLib.util.isString(url) && url) {
			var iframe = document.createElement(FDTag.IFRAME);
			//iframe.src = url; // 延迟加载
			iframe.style.cssText = "width:100%;height:100%;border:0px;";
			item.iframe = iframe;
			contentDiv.style.height = "100%";
			contentDiv.appendChild(iframe);
		}
	}
}

/**
 * 设置项
 * @private
 */
var FDSettingView = function(options){
	this.options = options;
	
	this.settingDiv = document.createElement(FDTag.DIV);
	this.settingDiv.id = this.options.domId + '_setting';
	document.body.appendChild(this.settingDiv);
	this.gridDom = FDLib.getEl(this.options.domId);
	
	this.grid = options.getGrid();
	
	this.settingWin = this._createSettingWin();
	
	this.tab = this._createTab();
	
	this.checkbox;
	
	var afterSearch = this.options.afterSearch || function(){};
	
	var that = this;
	this.options.afterSearch = function() {
		afterSearch(options.getGrid(),options);
		that.init();
	}
}

FDSettingView.prototype = {
	
	_createSettingWin:function() {
		var win = new FDWindow({
			contentId:this.settingDiv.id
			,title:'设置项'
			,modal:true
			,buttons:[
				new FDButton({text:'关闭',onclick:function(){
					win.close();
				}})
			]
		});
		
		return win;
	}
	,_createTab:function() {
		var tabDiv = document.createElement(FDTag.DIV);
		tabDiv.id = this.options.domId + "_tab";
		this.settingDiv.appendChild(tabDiv);
		
		var tab = new FDTab({domId:tabDiv.id,items:this._getTabItems()});
		
		return tab;
	}
	,_getTabItems:function() {
		var id = this._createColumnSelect();
		return [
			{text:'列显示',value:1,contentId:id,checked:true}
		]
	}
	,_createColumnSelect:function() {
		var colSelectDiv = document.createElement(FDTag.DIV);
		var id = this.options.domId + '_colSelectId';
		colSelectDiv.id = id;
		document.body.appendChild(colSelectDiv);
		
		this._createCheckboxes(colSelectDiv);
		
		return id;
	}
	,_createCheckboxes:function(colSelectDiv) {
		var columns = this.options.columns;
		var isSelected = this._isHasSelectRowAbility();
		
		// item is {text:"姓名",name:"username"}
		var checkboxItems = [];
		var defVal = [];
		FDLib.util.each(columns,function(item,i){
			var index = isSelected ? (i + 1) : i;
			checkboxItems.push({text:item.text || '#',value:index});
			
			defVal.push(index);
		});
		
		this.checkbox = new FDCheckBox({items:checkboxItems,defaultValue:defVal});
		this.checkbox.renderToDom(colSelectDiv);
		
		var that = this;
		this.checkbox.addEvent('click',function(){
			var index = this.value;
			var isCheck = this.checked;
			
			that.columnSelectorHandler(index,isCheck);
		});
	}
	,_isHasSelectRowAbility:function() {
		return this.grid.isSelectStatus();
	}
	,init:function() {
		var controls = this.checkbox.getControlItems();
		var that = this;
		
		FDLib.util.each(controls,function(checkbox){
			var index = checkbox.value;
			var isCheck = checkbox.checked;
			
			that.columnSelectorHandler(index,isCheck);
		});
	}
	// 隐藏列勾选事件
	,columnSelectorHandler:function(index,checked) {
		var thead = this.grid.getThead();
		
		var theadThs = thead.getElementsByTagName('th');
		var tbodyTrs = this.grid.getTableTR();
		
		this.toggleHeadColumn(theadThs,index,checked);
		this.toggleBodyColumn(tbodyTrs,index,checked);
	}
	,toggleHeadColumn:function(theadThs,index,isCheck) {
		var th = theadThs[index];
		if(isCheck) {
				FDLib.dom.showDom(th);	
		}else{
			FDLib.dom.hideDom(th);
		}
	}
	,toggleBodyColumn:function(trs,index,isCheck) {
		FDLib.util.each(trs,function(tr){
			var td = tr.cells[index];
			if(isCheck) {
					FDLib.dom.showDom(td);	
			}else{
				FDLib.dom.hideDom(td);
			}
		});
	}
	,showWin:function() {
		this.settingWin.show();
	}
};

/**
 * 分页视图,负责显示分页按钮,分页信息
 * @private
 */
var FDPaginationView = function(options,grid) {
	this.grid = grid;
	this.options = options;
	this.gridDomMap = this.options.gridDomMap;
	this.settingView = new FDSettingView(this.options);
	this.paginInfoDiv;
	
	this.firstBtn = null;
	this.prevBtn = null;
	this.nextBtn = null;
	this.lastBtn = null;
}

FDPaginationView.prototype.refreshPaginationInfo = function(data) {
	if(this.options.showPaging){
		this.options.total = parseInt(data[GlobalParams.serverTotalName] || 0);
		this.options.pageIndex = parseInt(data[GlobalParams.serverPageIndexName] || 1);
		this.options.pageSize =  parseInt(data[GlobalParams.serverPageSizeName] || 10);
		this.options.pageCount = FDPaginationView.calcPageCount(this.options.pageSize,this.options.total);
		this.paginInfoDiv.innerHTML = '&nbsp;&nbsp;第'+this.options.pageIndex+'/'+this.options.pageCount+'页，共'+this.options.total+'条数据&nbsp;&nbsp;';
		this.pageSizeSelect.setValue(this.options.pageSize);
		this._initBtnState();
	}
}
//分页数算法:页数 = (总记录数  +  每页记录数  - 1) / 每页记录数
FDPaginationView.calcPageCount = function(pageSize,total) {
	return pageSize == 0 ? 1 : parseInt( (total  +  pageSize - 1) / pageSize );
}

FDPaginationView.prototype._initBtnState = function(data) {
	if(this.options.pageIndex == 1){
		FDLib.dom.addClass(this.firstBtn,'ui-state-disabled');
		FDLib.dom.addClass(this.prevBtn,'ui-state-disabled');
	}else{
		FDLib.dom.removeClass(this.firstBtn,'ui-state-disabled');
		FDLib.dom.removeClass(this.prevBtn,'ui-state-disabled');
	}
	
	if(this.options.pageIndex == this.options.pageCount){
		FDLib.dom.addClass(this.nextBtn,'ui-state-disabled');
		FDLib.dom.addClass(this.lastBtn,'ui-state-disabled');
	}else{
		FDLib.dom.removeClass(this.nextBtn,'ui-state-disabled');
		FDLib.dom.removeClass(this.lastBtn,'ui-state-disabled');
	}
}

FDPaginationView.prototype.hide = function() {
	if(this.gridDomMap.pageDiv_3){
		FDLib.dom.hideDom(this.gridDomMap.pageDiv_3);
	}
}

FDPaginationView.prototype.show = function() {
	if(this.gridDomMap.pageDiv_3){
		FDLib.dom.showDom(this.gridDomMap.pageDiv_3);
	}
}

/**
 * 构建分页
 */
FDPaginationView.prototype.buildPagination = function() {
	if(!this.gridDomMap.pageDiv_3) {
		
		this._initPaginDom();
		
		this._buidlPaginButtons();
	
		this._appendPaginToDiv();
	}
}

FDPaginationView.prototype._initPaginDom = function() {
	this.gridDomMap.pageDiv_3 = document.createElement(FDTag.DIV);
	this.gridDomMap.pageDiv_3.className = "pui-paginator ui-widget-header";
	
	this.paginInfoDiv = document.createElement(FDTag.DIV);
}

FDPaginationView.prototype._appendPaginToDiv = function() {
	this.gridDomMap.gridDiv_3.appendChild(this.gridDomMap.pageDiv_3);
}

FDPaginationView.prototype._buidlPaginButtons = function() {
	// 显示分页
	if(this.options.showPaging) {
		this._buildPageSizeSelector();
		this._buildFirstPageButton();
		this._buildPrePageButton();
		this._buildNextPageButton();
		this._buildLastPageButton();
		this._buildResultInfo();
	}
	
	if(this.options.showSetting) {
		this._buildSettingButton();
	}
	
	if(!this.options.showPaging && !this.options.showSetting) {
		this.hide();
	}
}

FDPaginationView.prototype._buildPageSizeSelector = function() {
	var span = document.createElement(FDTag.SPAN);
	span.className = "pui-paginator-last pui-paginator-element";
	var self = this;
		
	this.pageSizeSelect = new FDSelectBox({items:this._getPageSizeItems(),showDefault:false});
	
	this.pageSizeSelect.addEvent('change',function(){
		self.options.pageSize = this.value;
		self.options.pageIndex = 1;
		self.grid.refresh();
	});
	
	this.pageSizeSelect.renderToDom(span);
	
	this.gridDomMap.pageDiv_3.appendChild(span);
}

FDPaginationView.prototype._getPageSizeItems = function() {
	var pageSizeParam = this.options.pageSizeParam;
	var selectItems = [];
	
	FDLib.util.each(pageSizeParam,function(pageSize){
		selectItems.push({value:pageSize,text:'每页' + pageSize + '条'});
	});
	
	return selectItems;
}

FDPaginationView.prototype._buildFirstPageButton = function(firstTR,cellIndex) {
	var self = this;
	this.firstBtn = this._createButton({
		btnClassName:'pui-paginator-first pui-paginator-element ui-state-default ui-corner-all'
		,iconClassName:'ui-icon ui-icon-seek-first'
		,title:'首页'
	});
	
	FDLib.event.addEvent(this.firstBtn,'click',function(){
		self.grid.moveFirst();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(this.firstBtn);
}

FDPaginationView.prototype._buildPrePageButton = function(firstTR,cellIndex) {
	var self = this;
	this.prevBtn = this._createButton({
		btnClassName:'pui-paginator-prev pui-paginator-element ui-state-default ui-corner-all'
		,iconClassName:'ui-icon ui-icon-seek-prev'
		,title:'上一页'
	});
	
	FDLib.event.addEvent(this.prevBtn,'click',function(){
		self.grid.movePreview();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(this.prevBtn);
}

FDPaginationView.prototype._buildNextPageButton = function(firstTR,cellIndex) {
	var self = this;
	this.nextBtn = this._createButton({
		btnClassName:'pui-paginator-next pui-paginator-element ui-state-default ui-corner-all'
		,iconClassName:'ui-icon ui-icon-seek-next'
		,title:'下一页'
	});
	
	FDLib.event.addEvent(this.nextBtn,'click',function(){
		self.grid.moveNext();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(this.nextBtn);
}

FDPaginationView.prototype._buildLastPageButton = function(firstTR,cellIndex) {
	var self = this;
	this.lastBtn = this._createButton({
		btnClassName:'pui-paginator-last pui-paginator-element ui-state-default ui-corner-all'
		,iconClassName:'ui-icon ui-icon-seek-end'
		,title:'尾页'
	});
	
	FDLib.event.addEvent(this.lastBtn,'click',function(){
		self.grid.moveLast();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(this.lastBtn);
}

FDPaginationView.prototype._createButton = function(btnData){
	var btn = document.createElement(FDTag.SPAN);
	btn.className = btnData.btnClassName;
	
	var icon = document.createElement(FDTag.SPAN);
	icon.className = btnData.iconClassName;
	icon.innerHTML = "p";
	
	btn.appendChild(icon);
	
	if(btnData.title){
		btn.setAttribute('title',btnData.title);
	}
	
	FDLib.event.addEvent(btn,'mouseover',function(e){
		if(!FDLib.dom.hasClass(btn,'ui-state-disabled')){
			FDLib.dom.addClass(btn,'ui-state-hover');
		}
		e.stopPropagation();
	});
	FDLib.event.addEvent(btn,'mouseout',function(e){
		FDLib.dom.removeClass(btn,'ui-state-hover');
		e.stopPropagation();
	});
	
	return btn;
}

FDPaginationView.prototype._buildResultInfo = function() {
	this.paginInfoDiv = document.createElement(FDTag.SPAN);
	this.gridDomMap.pageDiv_3.appendChild(this.paginInfoDiv);
}

FDPaginationView.prototype._buildSettingButton = function() {
	var self = this;
	var span = this._createNormalButton("设置");
	
	FDLib.event.addEvent(span,'click',function(){
		self.settingView.showWin();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(span);
}

FDPaginationView.prototype._createNormalButton = function(btnText) {
	var span = document.createElement(FDTag.SPAN);
	span.className = "pui-paginator-last pui-paginator-element ui-state-default ui-corner-all";
	span.innerHTML = btnText;
	
	FDLib.event.addEvent(span,'mouseover',function(e){
		FDLib.dom.addClass(span,'ui-state-hover');
		e.stopPropagation();
	});
	FDLib.event.addEvent(span,'mouseout',function(e){
		FDLib.dom.removeClass(span,'ui-state-hover');
		e.stopPropagation();
	});
	
	return span;
}


/**
 * 行选择
 * 2012-9-10
 * @private
 */
var FDRowSelectView = function(selectOption,options) {
	FDLib.implement(this,Cell);
	this.selectOption = selectOption;
	this.options = options;
	this.id = options.id;
	this.grid = options.getGrid();
	selectOption.name = selectOption.name || 'grid_select_' + FDControl.generateCount();
}

// @override
FDRowSelectView.prototype.buildCellData = function(rowData,td,rowIndex,tr) {
	var selector = this._buildSelector(rowData,rowIndex,tr);
	td.appendChild(selector);
	var onload = this.selectOption.onload;
	
	if(FDLib.util.isFunction(onload)){
		onload(rowData,selector,rowIndex,tr);
	}
	
	td.style.width = '20px';
	td.setAttribute('align','center');
}

FDRowSelectView.prototype._buildSelector = function(rowData,rowIndex,tr) {
	var self = this;
	var selectType = this.selectOption.singleSelect ? "radio" : "checkbox";
	var selector = this._buildSelectInput(selectType,rowData);
	
	// 自定义事件
	var onclickHandler = this.selectOption.onclick;
	// 设置事件
	
	selector.onclick = function() {
		// 执行自定义事件
		if(FDLib.util.isFunction(onclickHandler)) {
			onclickHandler(rowData,selector,rowIndex,tr);
		}
		if(this.checked) { // 如果勾选
			self.grid._doSelectHandler(selector,tr);
		}else{
			self.grid._doNoSelectedHandler(selector,tr);
		}
		
		if(self.selectOption.cache) {
			if(selector.type == 'radio') {
				self.grid.resetSelectCache();
			}
			self.grid.getSelectCache()[this.value] = this.checked ? rowData : false;
		}
		
	}
	
	selector.setSelect = function(checked) {
		selector.checked = !!checked;
		selector.onclick();
	}
	
	if(selector.checked) { // 如果勾选
		self.grid._doSelectHandler(selector,tr);
	}else{
		self.grid._doNoSelectedHandler(selector,tr);
	}
	
	return selector;
}

FDRowSelectView.prototype._buildSelectInput = function(selectType,rowData) {
	var selector = document.createElement(FDTag.INPUT);
	selector.setAttribute('type',selectType);
	selector.setAttribute('name',this.selectOption.name);
	selector.style.cursor = 'pointer';
	var idValue = rowData[this.id];
	if(idValue){
		selector.value = idValue;
	}
	
	if(this.selectOption.cache) {
		selector.checked = this.grid.isInCache(rowData,this.id);
	}
	
	return selector;
}


/*
 * 画出表格内容的视图层
 * @private
 */
var FDTableView = function(options,grid) {
	FDLib.implement(this,View);
	
	this.each = FDLib.util.each;
	this.options = options;
	this.grid = grid;
	// 后台返回的数据
	this.resultData = null;
	// 构建表格head部分的view
	this.headView = this._buildHeadView();
	// 存放FDCellView的实例
	this.cellViews = this._buildCellView();
	// 构建表格分页部分的view
	this.paginationView = this._buildPaginationView();
	
	this.gridDomMap = this.options.gridDomMap;
	
	this.renderTo(this.options.domId);
}

FDTableView.prototype.getTableView = function() {
	return this;
}

/**
 * 处理数据
 * @param data 格式类型:
 * {total:10,pageIndex:1,pageSize:10,gridMsg:'你好'
 * 	,rows:[{name:'jim',age:22},{name:'Tom',age:33}]
 * }
 */
FDTableView.prototype.processData = function(resultData) {
	this.resultData = resultData;
	
	this.removeAllData();
	
	if((this.resultData[GlobalParams.serverRowsName] || []).length > 0) {
		this._buildGridData();
	}else{
		this.showNoResultMsg();
	}
	this._refreshPaginationInfo(resultData);
}

FDTableView.prototype.renderTo = function(domId) {
	this._initTableDom();
	
	var desDom = FDLib.getEl(domId) || document.body;
	
	desDom.appendChild(this.gridDomMap.gridDiv_3);
}

/**
 * 移除所有数据
 */
FDTableView.prototype.removeAllData = function() {
	this.gridDomMap.tbody_0.parentNode.removeChild(this.gridDomMap.tbody_0);
	this.gridDomMap.tbody_0 = document.createElement(FDTag.TBODY);
	this.gridDomMap.table_1.appendChild(this.gridDomMap.tbody_0);
}


FDTableView.prototype._setTrStyle = function(tr,rowIndex) {
	var className = "ui-widget-content";
	
	if(rowIndex % 2 === 0) {
		className += " pui-datatable-even";
	}else{
		className += " pui-datatable-odd";
	}
	
	tr.className = className;
}

FDTableView.prototype._buildHeadView = function() {
	return new FDHeadView(this.options,this.grid);	
}

FDTableView.prototype._buildPaginationView = function() {
	return new FDPaginationView(this.options,this.grid);	
}

FDTableView.prototype._refreshPaginationInfo = function(data) {
	this.paginationView.refreshPaginationInfo(data);
}

/**
 * 构建表格内容
 */
FDTableView.prototype._buildGridData = function() {
	this.hideTable();
	var rows = this.resultData[GlobalParams.serverRowsName] || [];
	var self = this;
	// 遍历后台返回的rows
	this.each(rows,function(rowData,rowIndex){
		self.insertRow(rowIndex,rowData);
	});
	this.showTable();
}

FDTableView.prototype.showNoResultMsg = function() {
	var tr = this.gridDomMap.tbody_0.insertRow(0);
	var td = tr.insertCell(0);
	var colsLen = this.getColsLen();
	
	td.innerHTML = this.options.noDataText;
	td.setAttribute('colspan',colsLen);
	td.setAttribute('align','center');
}

FDTableView.prototype.getColsLen = function() {
	var colums = this.options.columns.length;
	var selectOption = this.options.selectOption || {};
	
	if(selectOption.singleSelect || selectOption.multiSelect) {
		colums++;
	}
	if(this.options.actionButtons.length > 0) {
		colums++;
	}
	return colums;
}

/**
 * 插入行数据
 * @param rowIndex 行索引
 * @param cells 数组,存放这一行所有单元格的数据
 * [
 * 	{html:'单元格内容1',text:'列名1',name:'username1',style:'width:100px;'}
 * 	,{html:'单元格内容2',text:'列名2',name:'username2',style:'width:200px;'}
 * 	,{html:'单元格内容3',text:'列名3',name:'username3',style:'width:300px;'}
 * ]
 * @param rowData 行的json数据
 */
FDTableView.prototype.insertRow = function(rowIndex,rowData) {
	// 创建行
	var tr = this.gridDomMap.tbody_0.insertRow(rowIndex);
	this._setTrEvent(tr,rowData,rowIndex);
	this._setTrStyle(tr,rowIndex);
	// 执行行的render方法
	this.options.rowRender(rowData,tr,rowIndex);
	
	this._buildRowCellsHtml(rowData,tr,rowIndex);
}

FDTableView.prototype._setTrEvent = function(tr,rowData,rowIndex){
	var that = this;
	var clickRowHandler = this.options.onClickRow;
	
	FDLib.event.addEvent(tr,'click',function(){
		that.grid._bindClickRowClass(tr);
		clickRowHandler(rowData,rowIndex);
	});
	
}

FDTableView.prototype._clearAllSelected = function(className) {
	var rows = this.gridDomMap.tbody_0.rows;
	var domUtil = FDLib.dom;
	FDLib.util.each(rows,function(row){
		if(domUtil.hasClass(row,className)) {
			domUtil.removeClass(row,className);
			return false;
		}
	});
}

FDTableView.prototype._buildRowCellsHtml = function(rowData,tr,rowIndex) {
	this.each(this.cellViews,function(cellView,columnIndex){
		var td = tr.insertCell(columnIndex); // 创建TD
		// 单元格数据
		cellView.buildCellData(rowData,td,rowIndex,tr);
	});
}

FDTableView.prototype.showTable = function() {
	this.gridDomMap.table_1.style.display = "";
}

FDTableView.prototype.hideTable = function() {
	this.gridDomMap.table_1.style.display = "none";
}


/**
 * 初始化构单元格视图层的实例
 */
FDTableView.prototype._buildCellView = function() {
	var columns = this.options.columns;
	var cellViews = [];
	var self = this;
	cellViews = this._addRowSelectAbility(cellViews);
	
	this.each(columns,function(column){
		cellViews.push(new FDCellView(column,self.options));
	});
	
	cellViews = this._addActionButtonAbility(cellViews);
	
	return cellViews;
}

FDTableView.prototype._addRowSelectAbility = function(cellViews) {
	if(this.multiSelect() || this.singleSelect()) {
		cellViews.push(new FDRowSelectView(this.options.selectOption,this.options));
	}
	return cellViews;
}



FDTableView.prototype._addActionButtonAbility = function(cellViews) {
	var actionButtons = this.options.actionButtons;
	if(FDLib.util.isArray(actionButtons) && actionButtons.length > 0){
		cellViews.push(new FDButtonView(this.options.actionColumnConfig,this.options));
	}
	
	return cellViews;
}

FDTableView.prototype.multiSelect = function() {
	return this.options.selectOption.multiSelect;
}

/**
 * 是否单选
 */
FDTableView.prototype.singleSelect = function() {
	return this.options.selectOption.singleSelect;
}

FDTableView.prototype._initTableDom = function() {
	this._initFrame();
	this._initHeadDom();
	this._initPaginDom();
	
	this.setStyle();
	
	this._initTableSize();
}

/**
 * 初始化表格框架.
 * 数字下标表示嵌套的层,0表示最内层,1在0的外层,以此类推
 */
FDTableView.prototype._initFrame = function() {
	this.gridDomMap.gridDiv_3 = document.createElement(FDTag.DIV);
	this.gridDomMap.tableDiv_2 = document.createElement(FDTag.DIV);
	this.gridDomMap.table_1 = document.createElement(FDTag.TABLE);
	this.gridDomMap.tbody_0 = document.createElement(FDTag.TBODY);
	
	this.gridDomMap.table_1.appendChild(this.gridDomMap.tbody_0);
	this.gridDomMap.tableDiv_2.appendChild(this.gridDomMap.table_1);
	this.gridDomMap.gridDiv_3.appendChild(this.gridDomMap.tableDiv_2);
}


/**
 * 设置样式
 */
FDTableView.prototype.setStyle = function() {
	this.gridDomMap.gridDiv_3.className = "pui-datatable ui-widget";
	this.gridDomMap.tbody_0.className = "pui-datatable-data";
	this.gridDomMap.tableDiv_2.className = "pui-datatable-scrollable-body";
}

FDTableView.prototype._initHeadDom = function() {
	this.headView.buildHead();
}

FDTableView.prototype._initPaginDom = function() {
	this.paginationView.buildPagination();
}

FDTableView.prototype._initTableSize = function() {
	var width = this.options.width;
	var height = this.options.height;
	if(width) {
		this.gridDomMap.gridDiv_3.style.width = FDLib.util.getPX(width);
	}
	if(height) {
		this.gridDomMap.tableDiv_2.style.height = FDLib.util.getPX(height);
	}
}

FDTableView.prototype._resetHeight = function() {
	this.gridDomMap.tableDiv_2.style.height = 'auto';
}



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


/**
 * 模型层,需要依赖
 * @private
 */
var FDModel = function() {
	FDLib.implement(this,Model);
}

FDModel.prototype = {
	/**
	 * 向后台提交请求
	 * @return 返回后台数据
	 */
	postData:function(url,schData,callback) {
		FDLib.ajax.request({url:url,params:schData,success:callback,error:function(e){
			FDWindow.alert(e.message);
		}});
	}
};


/**
 * GDGrid全局参数
 * @class
 */
var GlobalParams = {
	/**
	 * 发送请求的页索引属性名
	 * @field
	 */
	requestPageIndexName:'pageIndex'
	/**
	 * 发送请求的每页大小属性名
	 * @field
	 */
	,requestPageSizeName:'pageSize'
	/**
	 * 发送请求的排序字段属性名
	 * @field
	 */
	,requestSortName:'sortname'
	/**
	 * 发送请求的排序规则属性名
	 * @field
	 */
	,requestOrderName:'sortorder'
	
	/**
	 * 服务器端返回json数据的页索引标识
	 * @field
	 */
	,serverPageIndexName:'pageIndex'
	/**
	 * 服务器端返回json数据的页大小标识
	 * @field
	 */
	,serverPageSizeName:'pageSize'
	/**
	 * 服务器端返回json数据的总记录数标识
	 * @field
	 */
	,serverTotalName:'total'
	/**
	 * 服务器端返回json数据的rows标识
	 * @field
	 */
	,serverRowsName:'rows'
	/**
	 * 默认视图层
	 * @private
	 */
	,defalutView:FDTableView
	/**
	 * 默认模型层
	 * @private
	 */
	,defalutModel:FDModel
}

/**
 * Grid控件
 * @example 示例:
grid = new FDGrid({
	domId:'grid'
	//,url:'data.json'
	//,width:'200px'
	,data:gridData
	,onClickRow:function(rowData){
		FDLib.getEl('username').value = rowData.username;
		FDLib.getEl('addr').value = rowData.addr;
		FDLib.getEl('birth').value = rowData.birthday;
	}
	,selectOption:{singleSelect:true,onclick:selectHandler,onload:onloadSelect}
	,fitColumns:false
	,columns:[
		{text:"姓名",name:"username"}
		,{text:"联系地址",name:"addr"}
		,{text:"出生日期",name:"birthday"}
		,{text:"联系地址",name:"addr",style:{width:'200px'}}
		,{text:"出生日期",name:"birthday"}
		,{text:"联系地址",name:"addr"}
		,{text:"出生日期",name:"birthday"}
		,{text:"联系地址",name:"addr"}
		,{text:"出生日期",name:"birthday"}
		,{text:"联系地址",name:"addr"}
		,{text:"出生日期",name:"birthday"}
		,{text:"年龄",name:"age"}
	]
	,actionButtons:[
		{text:'修改',onclick:update}
		,{text:'删除',onclick:del,showFun:function(rowData,rowIndex){
			// 如果是3的倍数就显示删除按钮
			return ((rowIndex+1) % 3 === 0)
		}}
	]
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDGrid = function(options) {
	/**
	 * 存放view实例
	 */
	this.viewInstance;
	/**
	 * 存放model实例
	 */
	this.modelInstance;
	
	this.options = FDLib.util.apply(this.getOptions(),options);
	
	if(!this.getPageSize()){
		this.setPageSize(this.options.pageSizeParam[0]);
	}
	
	this.registView();
	this.registModel();
	
	if(this.options.loadSearch) {
		this.search();
	}
	
}

FDGrid.prototype = {
	/**
	 * 返回默认属性
	 * @return 返回json数据类型<pre><code>
{
	// html元素ID,指定表格渲染到那个元素上 
	domId:''
	// 服务端请求链接 
	,url:''
	// 主键ID 
	,id:null 
	// 表格宽,默认为自适应 
	,width:''
	// 表格高,默认为自适应 
	,height:''
	 // 申明表格列
	 // textOneLine:表格内容是否在同一行
	 // { text:"姓名",name:"username",style:{text-align:'center'}
	 // 	,render:function(rowData,td,rowIndex){return "aaa";}
	 //  ,sortName:'' ,textOneLine:false}
	,columns:[]
	// 列默认样式 
	,columnDefaultStyle:{width:'100px'}
	 // 使列自动展开/收缩到合适的数据表格宽度。
	,fitColumns:true
	 // 操作列配置表
	,actionColumnConfig:{text:'操作',style:{'textAlign':'center'}}
	 // 表格操作按钮
	 // {text:'修改',onclick:'update',showFun:function(rowData,rowIndex){}}
	,actionButtons:[]
	 // 列选择设置,
	 // 	multiSelect是否多选
	 // 	singleSelect是否单选
	,selectOption:{
		multiSelect:false
		,singleSelect:false
		,onclick:function(rowData,selector,tr,rowIndex){}
		,onload:function(rowData,selector,tr,rowIndex){}
	}
	//
	 // 存放表格DOM节点实例,统一管理
	 // 当前行render事件
	 // @param domTr当前行DOM对象
	 // @param rowData当前数据
	 // @param rowIndex当前行索引
	,rowRender:function(domTr,rowData,rowIndex){}
	 // 视图层类
	,view:GlobalParams.defalutView
	 // 模型层类
	,model:GlobalParams.defalutModel
	 // 是否显示分页组件
	,showPaging:true
	 // 是否显示表格设置按钮
	,showSetting:true
	 // 当前页数
	,pageCount:0
	 // 当前页索引
	,pageIndex:1
	// 总记录数 
	,total:0
	// 每页大小选择项 
	,pageSizeParam:[10,20,30]
	 // 每页几条数据
	,pageSize:0
	// 表格的查询参数 
	,schData:{}
	 // 结果
	,result:null
	// 表格数据,数组类型 
	,data:null
	// 排序字段 
	,sortName:null
	// 排序方式 
	,sortOrder:'DESC'
	// 表格加载完成立即查询数据,默认true
	,loadSearch:true
	 // 返回自身grid对象
	,getGrid:function() {
		return self;
	}
	// 勾选中的样式
	,selectRowClassName : 'ui-state-active'
	// 点击行的样式
	,clickRowClassName : 'ui-state-highlight'
	 // 在载入请求数据数据之前触发，如果返回false可终止载入数据操作。
	 // @return 如果返回false可终止载入数据操作。
	,onBeforeLoad:function(param){return true;}
	 // 在数据加载成功的时候触发。
	,onLoadSuccess:function(data){return data;}
	 // 在用户点击一行的时候触发
	 //  @param rowIndex：点击的行的索引值，该索引值从0开始。
	 //  @param rowData：对应于点击行的记录。
	,onClickRow:function(rowData,rowIndex){}
}
</code></pre>
	 */
	getOptions:function() {
		var self = this;
		// --------- 默认属性 ---------
		return {
			// html元素ID,指定表格渲染到那个元素上 
			domId:''
			// 服务端请求链接 
			,url:''
			// 主键ID 
			,id:null 
			// 表格宽,默认为自适应 
			,width:''
			// 表格高,默认为自适应 
			,height:''
			// 无数据显示的内容
			,noDataText:'无查询结果'
			 // 申明表格列
			 // { text:"姓名",name:"username",style:{text-align:'center'}
			 // 	,render:function(rowData,td,rowIndex){return "aaa";}
			 //  ,sortName:'' 
			 // ,textOneLine:false}
			,columns:[]
			// 列默认样式 
			,columnDefaultStyle:{width:'100px'}
			 // 使列自动展开/收缩到合适的数据表格宽度。
			,fitColumns:true
			 // 操作列配置表
			,actionColumnConfig:{text:'操作',style:{'textAlign':'center'}}
			 // 表格操作按钮
			 // {text:'修改',onclick:'update',showFun:function(rowData,rowIndex){}}
			,actionButtons:[]
			 // 列选择设置,
			 // 	multiSelect是否多选
			 // 	singleSelect是否单选
			,selectOption:{
				multiSelect:false
				,singleSelect:false
				,onclick:function(rowData,selector,tr,rowIndex){}
				,onload:function(rowData,selector,tr,rowIndex){}
				,hideCheckAll:false // 隐藏全选checkbox
				// 设置缓存,为true时,表格翻页也会记住勾选状态
				// 当进行search()或reload()会清除缓存
				,cache:false
			}
			// 表格勾选缓存
			,selectCache:{}
			 // 存放表格DOM节点实例,统一管理
			,gridDomMap:{
				tbody_0:null // <tbody>
				,table_1:null // <table>
				,tableDiv_2:null // <div><table></div>
				,gridDiv_3:null  // <div><div><table></div></div>
				
				,headThead_0:null // <thead>
				
				,pageDiv_3:null
				,paginTable_2:null
				,paginTfoot_1:null
			}
			 // 当前行render事件
			 // @param domTr当前行DOM对象
			 // @param rowData当前数据
			 // @param rowIndex当前行索引
			,rowRender:function(domTr,rowData,rowIndex){}
			 // 视图层类
			,view:GlobalParams.defalutView
			 // 模型层类
			,model:GlobalParams.defalutModel
			 // 是否显示分页组件
			,showPaging:true
			 // 是否显示表格设置按钮
			,showSetting:true
			 // 当前页数
			,pageCount:0
			// 当前页索引
			,pageIndex:1
			// 总记录数 
			,total:0
			// 每页大小选择项 
			,pageSizeParam:[10,20,30]
			// 每页几条数据
			,pageSize:0
			// 表格的查询参数 
			,schData:{}
			// 结果
			,result:null
			// 表格数据,数组类型 
			,data:null
			// 排序字段 
			,sortName:null
			// 排序方式 
			,sortOrder:'DESC'
			// 表格加载完成立即查询数据,默认true
			,loadSearch:true
			// 返回自身grid对象
			,getGrid:function() {
				return self;
			}
			// 勾选中的样式
			,selectRowClassName : 'ui-state-active'
			// 点击行的样式
			,clickRowClassName : 'ui-state-highlight'
			// 在载入请求数据数据之前触发，如果返回false可终止载入数据操作。
			// @return 如果返回false可终止载入数据操作。
			,onBeforeLoad:function(param){return true;}
			 // 在数据加载成功的时候触发。
			,onLoadSuccess:function(data){return data;}
			,afterRefresh:function(data) {}
			 // 在用户点击一行的时候触发
			 //  @param rowIndex：点击的行的索引值，该索引值从0开始。
			 //  @param rowData：对应于点击行的记录。
			,onClickRow:function(rowData,rowIndex){}
		};
	}
	// --------- 默认方法 ---------
	/**
	 * 注册view
	 * @private
	 */
	,registView:function() {
		var View = this.options.view;
		// 默认的view,被装饰对象
		this.viewInstance = new View(this.options,this);
	}
	/**
	 * 初始化装饰器,如果没有装饰器就返回默认的view实例
	 * @private
	 */
	,_initDecorators:function(viewInstance) {
		var decorators = this.options.decorators;
		var self = this;
		
		FDLib.util.each(decorators,function(deforators){
			viewInstance = new deforators(viewInstance,self);
		});
		
		return viewInstance;
	}
	/**
	 * @private
	 */
	,registModel:function() {
		var model = this.options.model;
		this.modelInstance = new model();
	}
	/**
	 * 搜索
	 * @param data 查询参数,json格式
	 */
	,search:function(schData) {
		if(this.options.url){
			this.options.schData = schData || {};
			this.options.pageIndex = 1;
		}
		this.resetSelectCache();
		this.refresh();
	}
	/**
	 * 清空勾选缓存
	 */
	,resetSelectCache:function() {
		if(this.isSelectable()) {
			this.options.selectCache = {};
		}
	}
	,getSelectCache:function() {
		return this.options.selectCache;
	}
	/**
	 * 加载本地数据，旧的行将被移除。
	 * @param data json数据
	 */
	,loadData:function(data){
		this.options.data = data;
		this.resetParam();
		this.refresh();
	}
	,getData:function(){
		return this.options.result;
	}
	/**
	 * 根据索引得到某行数据
	 * @param rowIndex 行索引
	 * @return json格式
	 */
	,getRowData:function(rowIndex) {
		return this.getRows()[rowIndex];
	}
	/**
	 * 获取所有数据
	 * @return 数组格式
	 */
	,getRows:function() {
		return this.getData()[GlobalParams.serverRowsName] || [];
	}
	/**
	 * 在复选框呗选中的时候返回所有行。
	 * @return 返回数组
	 */
	,getChecked:function(){
		if(this.multiSelect()) {
			var idName = this.options.id;
			var ret = [];
			var rows = this.getRows();
			var self = this;
			
			var isCache = this.options.selectOption.cache;
			
			if(isCache) {
				var selectCache = this.getSelectCache();
				// 先添加缓存中的
				for(var idVal in selectCache) {
					if(selectCache[idVal]) {
						ret.push(selectCache[idVal]);
					}
				}
			}
			// 再添加真实勾选的
			FDLib.util.each(rows,function(row,i){
				var selector = self.getSelectorByRowIndex(i);
				var isInCache = self.isInCache(row,idName);
				if(selector && selector.checked && !isInCache) {
					ret.push(row);
				}
			});
			
			return ret;
		}
	}
	,isInCache:function(row,idName) {
		if(!idName) {
			return false;
		}
		var idVal = row[idName];
		return !!this.options.selectCache[idVal];
	}
	/**
	 * 获取选中条数
	 */
	,getCheckedLength:function() {
		var checked = this.getChecked();
		if(!checked){
			return 0;
		}
		return checked.length;
	}
	/**
	 * 返回第一个被选中的行
	 * @return 返回行数据
	 */
	,getSelected:function(){
		if(this.singleSelect()) {
			var rows = this.getRows();
			var self = this;
			
			var isCache = this.options.selectOption.cache;
			
			if(isCache) {
				var selectCache = this.getSelectCache();
				// 先添加缓存中的
				for(var idVal in selectCache) {
					if(selectCache[idVal]) {
						return selectCache[idVal];
					}
				}
			}
			
			return FDLib.util.each(rows,function(row,i){
				var selector = self.getSelectorByRowIndex(i);
				if(selector && selector.checked) {
					return row;
				}
			});
		}
	}
	/**
	 * 选择当前页中所有的行。
	 */
	,checkAll:function() {
		if(this.multiSelect()) {
			var selectAll = this._getSelectAllInput();
			if(selectAll) {
				selectAll.checked = "checked";
				selectAll.onclick();
			}
		}
	}
	/**
	 * 取消选择所有当前页中所有的行。
	 */
	,uncheckAll:function(){
		if(this.multiSelect()) {
			var selectAll = this._getSelectAllInput();
			if(selectAll) {
				selectAll.checked = "";
				selectAll.onclick();
			}
		}
	}
	/**
	 * 选择一行，行索引从0开始。
	 */
	,selectRow:function(index){
	 	this.setSelected(index);
	}
	/**
	 * 设置url
	 */
	,setUrl:function(url){
		this.options.url = url;
	}
	/**
	 * 通过ID值参数选择一行。
	 */
	,selectRecord:function(id){
	  	var trs = this.getTableTR();
		var rowsCount = trs.length;
		for(var i=0; i<rowsCount; i++) {
			var selector = this.getSelectorByRowIndex(i);
			if(selector.value == id){
				this.setSelected(i);
				break;
			}
		}
	}
	/**
	 * 勾选一行，行索引从0开始。
	 * @param index 行索引
	 */
	,checkRow:function(index){
		this.setSelected(index);
	}
	/**
	 * 取消勾选一行，行索引从0开始。
	 * @param index 行索引
	 */
	,uncheckRow:function(index){
		this.setNoSelected(index);
	}
	/**
	 * 清除所有勾选的行。等同于uncheckAll()
	 */
	,clearChecked:function(){
		this.uncheckAll();
	}
	// 勾选行
	,_doSelectHandler:function(selector,tr){
		if(selector.disabled) {
			return;
		}
		if(this.singleSelect()){ // 如果是单选,移除上一条单选的状态
			this._bindSingleSelectRow(tr);
		}
		FDLib.dom.removeClass(tr,this.options.clickRowClassName);
		FDLib.dom.addClass(tr,this.options.selectRowClassName);
	}
	// 不勾选
	,_noSelectedHandler:function(selector,i) {
		var rows = this.getTableTR();
		if(selector.disabled) {
			return;
		}
		var tr = rows[i];
		this._doNoSelectedHandler(selector,tr);
	}
	,_doNoSelectedHandler:function(selector,tr){
		if(selector.disabled) {
			return;
		}
		selector.checked = '';
		FDLib.dom.removeClass(tr,this.options.selectRowClassName);
	}
	,_bindSingleSelectRow:function(tr){
		if(this.lastRadioSelectedTR){
			FDLib.dom.removeClass(this.lastRadioSelectedTR,this.options.selectRowClassName);
		}
		this.lastRadioSelectedTR = tr;
	}
	,_bindClickRowClass:function(tr){
		if(this.lastClickedTR){ // 移除上一次点击的高亮效果
			FDLib.dom.removeClass(this.lastClickedTR,this.options.clickRowClassName);
		}
		// 如果已经是勾选状态
		if(FDLib.dom.hasClass(tr,this.options.selectRowClassName)){
			return;
		}
		this.lastClickedTR = tr;
		FDLib.dom.addClass(tr,this.options.clickRowClassName);
	}
	/**
	 * 获取表格内容的TR
	 */
	,getTableTR:function() {
		return this.options.gridDomMap.tbody_0.rows;
	}
	/**
	 * @private
	 */
	,buildParam:function() {
		var param = this.options.schData || {};
		param[GlobalParams.requestPageIndexName] = this.getPageIndex();
		param[GlobalParams.requestPageSizeName] = this.getPageSize();
		// 排序字段
		if(this.options.sortName) {
			param[GlobalParams.requestSortName] = this.options.sortName;
			param[GlobalParams.requestOrderName] = this.options.sortOrder;
		}
		
		return param;
	}
	/**
	 * 排序,只支持单属性排序
	 * @param sortName 排序字段名
	 * @param sortOrder 排序方式,即ASC,DESC
	 */
	,sort:function(sortName,sortOrder) {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
		
		this.refresh();
	}
	/**
	 * 获取当前排序方式
	 */
	,getSortOrder:function() {
		return this.options.sortOrder;
	}
	/**
	 * 获取当前排序字段
	 */
	,getSortName:function() {
		return this.options.sortName;
	}
	/**
	 * 获取<thead>
	 */
	,getThead:function() {
		return this.options.gridDomMap.headThead_0;
	}
	/**
	 * 获取<tboady>
	 */
	,getTbody:function() {
		return this.options.gridDomMap.tbody_0;
	}
	/**
	 * 请求数据
	 * @private
	 */
	,postData:function() {
		if(this.options.url){
			var param = this.buildParam();
			var self = this;
			var ret = this.options.onBeforeLoad(param);
			if(ret){
				this.modelInstance.postData(this.options.url,param,function(data){
					self.options.result = self.options.onLoadSuccess(data);
					self.callViewsProcess();
				});
			}
		}else if(this.options.data){ // 本地分页
			var newObj = this.requestLocal(this.getPageIndex(),this.getPageSize());
			newObj = this.options.onLoadSuccess(newObj);
			this.options.result = newObj;
			this.callViewsProcess();
		}
		
		this.options.afterRefresh(this.options.result);
	}
	,getPageIndex:function() {
		return this.options.pageIndex;
	}
	,getPageSize:function() {
		return this.options.pageSize;
	}
	,setPageIndex:function(pageIndex) {
		this.options.pageIndex = pageIndex;
	}
	,setPageSize:function(pageSize) {
		this.options.pageSize = pageSize;
	}
	,requestLocal:function(pageIndex,pageSize) {
		var newData = [];
		var localData = this.options.data;
		var firstIndex=1,total=0;
		
		if(this.options.showPaging) {
			firstIndex = parseInt((pageIndex - 1) * pageSize);
			total = localData.length;
			newData = localData.slice(firstIndex,firstIndex+pageSize);
		}else{
			newData = localData;
		}
		var obj = {};
		
		obj[GlobalParams.serverRowsName] = newData;
		obj[GlobalParams.serverPageIndexName] = pageIndex;
		obj[GlobalParams.serverPageSizeName] = pageSize;
		obj[GlobalParams.serverTotalName] = total;
		
		return obj;
	}
	/**
	 * 调用视图层处理后台数据
	 * @private
	 */
	,callViewsProcess:function() {
		this.viewInstance.processData(this.options.result);
	}
	/**
	 * 本地刷新表格
	 */
	,refresh:function() {
		this.postData();
		this.reset();
	}
	/**
	 * 重新加载数据
	 */
	,reload:function() {
		this.resetParams();
		this.search();
	}
	/**
	 * 重置搜索参数
	 */
	,resetParams:function() {
		this.options.pageIndex = 1;
		this.options.schData = {};
	}
	,reset:function() {
		if(this.multiSelect()) {
			var selectAll = this._getSelectAllInput();
			if(selectAll) {
				selectAll.checked = "";
			}
		}
	}
	/**
	 * @private
	 */
	,resetParam:function() {
		this.options.pageIndex = 1;
	}
	/**
	 * 删除某一行
	 * @param rowIndex 行索引
	 */
	,deleteRow:function(rowIndex) {
		var data = this.options.data || {};
		var rows = data[GlobalParams.serverRowsName];
		if(rows.length > rowIndex){
		 	rows.splice(rowIndex,1);
		 	this.refresh();
		}
	}
	/**
	 * 是否是选择状态
	 */
	,isSelectable:function() {
		return this.singleSelect() || this.multiSelect();
	}
	,isSelectStatus:function(){
		return this.isSelectable();
	}
	/**
	 * 是否单选
	 */
	,singleSelect:function() {
		var selectOption = this.options.selectOption;
		return selectOption.singleSelect;
	}
	/**
	 * 是否多选
	 */
	,multiSelect:function() {
		var selectOption = this.options.selectOption;
		return selectOption.multiSelect;
	}
	,_getSelectAllInput:function() {
		if(this.multiSelect()) {
			return this.checkAllInput;
		}
	}
	/**
	 * 通过行索引获取选择器,即input
	 */
	,getSelectorByRowIndex:function(rowIndex) {
		if(this.isSelectable()) {
			var trs = this.getTableTR();
			return this._getInput(trs,rowIndex);
		}
	}
	,_getInput:function(trs,rowIndex) {
		var row = trs[rowIndex];
		var cell = row.cells[0];
		return cell.getElementsByTagName('input')[0];
	}
	// 能否操作选择器
	// 选择器存在并且没有禁用
	,_couldOperateSelector:function(selector) {
		return selector && !selector.disabled;
	}
	,_getTable:function() {
		return this.options.gridDomMap.table_1;
	}
	/**
	 * 设置某行数据被选中 
	 * @param rowIndex 行索引
	 */
	,setSelected:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector.disabled) {
			return;
		}
		selector.checked = 'checked';
		selector.onclick();
	}
	/**
	 * 设置某行数据不被选中 
	 * @param rowIndex 行索引
	 */
	,setNoSelected:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector.disabled) {
			return;
		}
		selector.checked = '';
		selector.onclick();
	}
	/**
	 * 取消单选的选择
	 */
	,clearSelected:function() {
		if(this.singleSelect()){
			var trs = this.getTableTR();
			var rowsCount = trs.length;
			var tr = null;
			for(var i=0; i<rowsCount; i++) {
				tr = trs[i];
				var selector = this.getSelectorByRowIndex(i);
				if(selector.checked){
					this._doNoSelectedHandler(selector,tr);
					break;
				}
			}
		}
	}
	/**
	 * 得到当前数据条数
	 * @return 返回int类型
	 */
	,getDataLength:function() {
		return this.getRows().length;
	}
	/**
	 * 设置某行不可选(在有选择框的条件下)
	 * @param rowIndex 行索引
	 */
	,setRowDisabled:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector) {
			selector.disabled = 'disabled';
		}
	}
	/**
	 * 设置某行可选(在有选择框的条件下)
	 * @param rowIndex 行索引
	 */
	,setRowEnabled:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector) {
			selector.disabled = '';
		}
	}
	/**
	 * 跳转至首页
	 */
	,moveFirst:function() {
		if(this.options.pageIndex != 1) {
			this.options.pageIndex = 1;
			this.refresh();
		}
	}
	/**
	 * 上一页
	 */
	,movePreview:function() {
		if(this.options.pageIndex > 1) {
			this.options.pageIndex--;
			this.refresh();
		}
	}
	/**
	 * 下一页
	 */
	,moveNext:function() {
		if(this.options.pageIndex < this.options.pageCount) {
			this.options.pageIndex++;
			this.refresh();
		}
	}
	/**
	 * 跳转至尾页
	 */
	,moveLast:function() {
		if(this.options.pageIndex != this.options.pageCount) {
			this.options.pageIndex = this.options.pageCount;
			this.refresh();
		}
	}
	
};


/**
 * tip控件
 * @example 示例:
FDLib.loadJs('FDTip',function() {
	var event = FDLib.event;
	
	// 单个创建
	var tip1Dom = FDLib.getEl('tip1');
	var tip1 = new FDTip();
	event.addEvent(tip1Dom,'mouseover',function(e){
		tip1.show(e,'查看tip1详情');
	});
	event.addEvent(tip1Dom,'mouseout',function(){
		tip1.hide();
	})
	
	// 单个创建,使用原始的title
	var tip2Dom = FDLib.getEl('tip2');
	var tip2 = new FDTip({delay:0});
	event.addEvent(tip2Dom,'mouseover',function(e){
		tip2.show(e);
	});
	event.addEvent(tip2Dom,'mouseout',function(e){
		tip2.hide();
	})
	
	// 用FDTipUtil工具创建,推荐
	var tip3Dom = FDLib.getEl('tip3');
	var tip4Dom = FDLib.getEl('tip4');
	FDTipUtil.addTip(tip3Dom,"这是tip3Dom的内容");
	FDTipUtil.addTip(tip4Dom);
});
 * @constructor
 */
var FDTip = function(options) {
	FDLib.implement(this,FDControl);
	
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.delayTimeout = null;
	// dom对象
	this.target = null;
	// 原始的title属性
	this.originalTitle = null;
	
	this.x = 0;
	this.y = 0;
	// 默认延迟
	this.delay = this.options.delay;
	// 提示层的偏移量
	this.offsetX = this.options.offsetX;
	this.offsetY = this.options.offsetY;
	
	this.tipDiv = document.createElement(FDTag.DIV);
	this.tipDiv.style.display = 'none';
	this.tipDiv.className='pui-tooltip pui-tooltip-global ui-widget ui-widget-content ui-corner-all pui-shadow';
	
	document.body.appendChild(this.tipDiv);
}

FDTip.prototype = {
	getOptions:function(){
		return {
			delay:500
			,offsetX:0
			,offsetY:15
		};
	}
	/**
	 * 显示提示层
	 * 如果不传text则显示dom节点title
	 * @param e event对象
	 * @param text tip内容
	 */
	,show:function(e,text,x,y) {
		e = FDLib.event.formatEvent(e);
		this.target = e.target;
		this._backupTargetTitle();
		text = this._insureTextExist(text);
		// 立即显示
		if(this.delay === 0) {
			this.doShow(e,text);
			return;
		}
		// 延迟显示
		if(this.delayTimeout == null) {
			var self = this;
            this.delayTimeout = setTimeout(function(){
	            self.doShow(e,text,x,y);
            },this.delay);
        }
	}
	/**
	 * 隐藏提示层
	 */
	,hide:function() {
		this._restoreTargetTitle();
		this.reset();
		this.tipDiv.style.display = 'none';
	}
	// 确保text存在,如果不传text,则取title属性
	,_insureTextExist:function(text) {
		if(typeof text === 'undefined') {
			text = this.originalTitle;
		}
		return text;
	}
	// 备份dom节点的title
	,_backupTargetTitle:function() {
		if(this.target.title) {
			this.originalTitle = this.target.title;
			this.target.title = '';
		}
	}
	// 还原dom节点的title
	,_restoreTargetTitle:function() {
		if(this.originalTitle) {
			this.target.title = this.originalTitle;
			this.originalTitle = null;
		}
	}
	/**
	 * @private
	 */
	,doShow:function(e,text,x,y) {
        this.tipDiv.innerHTML = text;
        this.x = this.x || e.pageX;
        this.y = this.y || e.pageY;
        
	    this.tipDiv.style.left = (this.x + this.offsetX) + 'px';
	    this.tipDiv.style.top = (this.y + this.offsetY) + 'px';
	    
        this.tipDiv.style.display = 'block';
	}
	,setXY:function(x,y) {
		this.x = x;
		this.y = y;
	}
	/**
	 * @private
	 */
	,reset:function() {
		clearTimeout(this.delayTimeout);
		this.delayTimeout = null;
		this.originalTitle = null;
		this.x = 0;
		this.y = 0;
	}
}

/**
 * tip工具类,用于批量创建tip,提高性能
 * @example 使用方法:
 * var dom = document.getElementById("id");
 * var text = "提示层的内容";
 * FDTipUtil.addTip(dom,text);
 * @class
 */
var FDTipUtil = (function(){
	
	var instance = null;
	var event = FDLib.event;
	
	function getInstance() {
		if(!instance) {
			instance = new FDTip();
		}
		return instance;
	}
	
	return {
		/**
		 * 添加tip,如果不传text则默认取dom的title
		 */
		addTip:function(dom,text,opt) {
			if(!dom) {
				throw new Error('请传入正确的dom对象')
			}
			var tip = getInstance();
			event.addEvent(dom,'mouseover',function(e){
				tip.show(e,text);
			});
			event.addEvent(dom,'mousemove',function(e){
				tip.setXY(e.pageX,e.pageY);
			});
			event.addEvent(dom,'mouseout',function(){
				tip.hide();
			})
		}
	};
	
})();

/**
 * @private
 */
var FDTreeDomView = function(options){
	this.options = options;
	this.childrenFieldName = options.childrenFieldName;
	this.valueFieldName = options.valueFieldName;
	this.textFieldName = options.textFieldName;
	this.onCheck = options.onCheck || function(){};
	this.selectedId = null;
	
	this.treePanel = this.buildTreePanel();
	
	this.togglers = [];
	// id对应LI
	this.idNodeMap = {}
	// id对应的rowData
	this.idDataMap = {};
}

FDTreeDomView.prototype = {
	refresh:function(rowsData){
		if(rowsData) {
			var ul = this.buildUL(rowsData,'pui-tree-container');
			this.treePanel.innerHTML = '';
			this.treePanel.appendChild(ul);
			this.render();
		}
	}
	,hide:function(){
		FDLib.dom.hideDom(this.treePanel);
	}
	,show:function(){
		FDLib.dom.showDom(this.treePanel);
	}
	,buildUL:function(rowsData,className,parentLi) {
		var ul = document.createElement(FDTag.UL);
		ul.className = className;
		
		for(var i=0,len=rowsData.length;i<len;i++) {
			var li = this.buildLi(rowsData[i]);
			ul.appendChild(li);
			if(parentLi){
				li.parentLi = parentLi;
			}
		}
		
		return ul;
	}
	
	//构建节点LI
	/*,LI的结构:
	<li class="pui-treenode">
		// nodeDisplay
		<span class="pui-treenode-content pui-treenode-selectable">
	  		<span class="pui-treenode-leaf-icon"></span> // toggler
	  		<span class="pui-treenode-icon ui-icon ui-icon-folder-collapsed"></span> // icon
	  		<span class="pui-treenode-label ui-corner-all ui-state-highlight ">Spring</span> // label
	   	</span>
	   	// 子节点内容
	   	<ul>...</ul>
	</li>
	 */
	,buildLi:function(rowData){
		var li = document.createElement(FDTag.LI);
		var liClassName = 'pui-treenode' + (this._isOpen(rowData) ? ' pui-treenode-expanded' : '');
		// 构建节点内容,显示的图标,文字等
		var nodeDisplay = this.buildNodeDisplay(rowData,li);
		li.appendChild(nodeDisplay);
		// 如果有子节点
		if(this.hasChild(rowData)){
			li.isParent = true;
			liClassName += ' pui-treenode-parent';
			var childrenData = this.getChildren(rowData);
			// 构建子节点内容
			var childrenUL = this.buildChildren(childrenData,li);
			
			li.toggler.childrenUL = childrenUL;
			
			li.appendChild(childrenUL);
		}
		li.className = liClassName;
		
		this.storeNode(rowData,li);
		
		return li;
	}
	,buildChildren:function(rowsData,parentLi){
		var childrenUL = this.buildUL(rowsData,'pui-treenode-children',parentLi);
		childrenUL.style.display = "none";
		return childrenUL;
	}
	,buildNodeDisplay:function(rowData,li) {
		var displaySpan = document.createElement(FDTag.SPAN);
		displaySpan.className = 'pui-treenode-content pui-treenode-selectable';
		
		var toggler = this.buildToggler(rowData);
		var icon = this.buildIcon(rowData,toggler);
		var checkbox = this.buildCheckbox(rowData);
		var lab = this.buildLabel(rowData,toggler);
		
		this.togglers.push(toggler);
		displaySpan.appendChild(toggler);
		
		if(icon){
			displaySpan.appendChild(icon);
		}
		if(checkbox){
			displaySpan.appendChild(checkbox);
		}
		displaySpan.appendChild(lab);
		
		li.toggler = toggler;
		li.icon = icon;
		li.lab = lab;
		
		return displaySpan;
	}
	,storeNode:function(rowData,li){
		this.idNodeMap[this.getId(rowData)] = li;
	}
	,getNode:function(id){
		return this.idNodeMap[id];
	}
	,buildToggler:function(rowData){
		var className = 'pui-tree-toggler ui-icon ' 
			+ ( (rowData.state && 'open' == rowData.state) ? this.getOpenClassName() : this.getCloseClassName());
		// 没有子节点,隐藏箭头
		if(!this.hasChild(rowData)){
			className = 'pui-treenode-leaf-icon';
		}
		
		var span = this._createNodeSpan(className);
		var that = this;
		
		span.onclick = function() {
			that.toggle(this,rowData);
		};
		
		return span;
	}
	,buildIcon:function(rowData,toggler){
		var iconCls = rowData.iconCls;
		if(iconCls){
			var className = 'pui-treenode-icon ui-icon ' + (iconCls ? iconCls : '');
			var icon = this._createNodeSpan(className);
			FDLib.event.addEvent(icon,'click',function(){
				toggler.onclick();
			});
			
			return icon;
		}
		return null;
	}
	,buildLabel:function(rowData,toggler){
		var className = 'pui-treenode-label ui-corner-all';
		var lab = this._createNodeSpan(className,this.getText(rowData));
		// 点击文字伸缩
		var isClickToggle = this.options.clickToggle;
		var that = this;
		var isHoverEffect = true;
		
		var hoverEffectHandler = this.options.hoverEffectHandler;
		if(FDLib.util.isFunction(hoverEffectHandler)){
			isHoverEffect = hoverEffectHandler(rowData,lab);
		}
		if(isHoverEffect){
			FDLib.addHoverEffect(lab);
		}
		
		lab.onclick = function(){
			if(isClickToggle){
				toggler.onclick();
			}
			if(that.options.onclick) {
				that.options.onclick(rowData);
			}
			that.setClickHighlight(lab,rowData);
		}
		
		return lab;
	}
	,buildCheckbox:function(rowData,lab){
		if(this.options.checkable){
			var that = this;
			var checkbox = document.createElement(FDTag.INPUT);
			checkbox.type = 'checkbox';
			checkbox.value = rowData[this.valueFieldName];
			checkbox.data = rowData;
			
			checkbox.onclick = function() {
				that.onCheck(rowData,this.checked);
				that.checkChildren(this,rowData,this.checked);
			}
			
			return checkbox;
		}
	}
	,checkChildren:function(selfCheckbox,rowData,isChecked){
		var li = this.getNode(rowData[this.valueFieldName]);
		var checkboxs = li.getElementsByTagName('input');
		
		for(var i=0,len=checkboxs.length; i<len; i++) {
			var checkbox = checkboxs[i];
			if(selfCheckbox == checkbox){
				continue;
			}
			checkbox.checked = isChecked;
			this.onCheck(checkbox.data,isChecked);
		}
	}
	,getId:function(rowData){
		var id = rowData[this.valueFieldName];
		if(!id){
			rowData[this.valueFieldName] = 'tree_node_' + FDControl.generateCount()
		}
		return rowData[this.valueFieldName];
	}
	,storeData:function(rowData){
		var id = this.getId(rowData);
		this.idDataMap[id] = rowData;
	}
	,getRowDataById:function(id){
		return this.idDataMap[id];
	}
	,getText:function(rowData){
		if(this.options.render) {
			return this.options.render(rowData);
		}
		return rowData[this.textFieldName];
	}
	,getOpenClassName:function(){
		return 'ui-icon-triangle-1-s';
	}
	,getCloseClassName:function(){
		return 'ui-icon-triangle-1-e';
	}
	// 展开所有父节点
	,expandParent:function(li){
		var parentLi = li.parentLi;
		if(li && parentLi){
			this.expandByLi(parentLi);
			this.expandParent(parentLi);
		}
	}
	,expandByLi:function(li){
		var toggler = li.toggler;
		if(li && li.isParent && toggler){
			this.expand(toggler);
		}
	}
	,select:function(id,callback){
		this.selectedId = id;
		var data = this.getRowDataById(id);
		var li = this.getNode(id);
		this.expandByLi(li); // 展开当前节点
		this.expandParent(li); // 展开父级
		callback && callback(data);
		li.lab.onclick();
	}
	,getSelected:function(){
		return this.getRowDataById(this.selectedId);
	}
	,getChecked:function(callback){
		var data = [];
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			if(checkbox.checked){
				data.push(checkbox.data);
			}
		}
		return data;
	}
	,getUnChecked:function(){
		var data = [];
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			if(!checkbox.checked){
				data.push(checkbox.data);
			}
		}
		return data;
	}
	,check:function(idArr,callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			for(var j=0,len2=idArr.length; j<len2; j++) {
				if(idArr[j] == checkbox.value){
					checkbox.checked = true;
					this.onCheck(checkbox.data,checkbox.checked);
					callback && callback(checkbox.data,checkbox);
				}
			}
		}
	}
	,uncheck:function(idArr,callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			for(var j=0,len2=idArr.length; j<len2; j++) {
				if(idArr[j] == checkbox.value){
					checkbox.checked = false;
					this.onCheck(checkbox.data,checkbox.checked);
					callback && callback(checkbox.data,checkbox);
				}
			}
		}
	}
	// 全选
	,checkAll:function(callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			checkbox.checked = true;
			this.onCheck(checkbox.data,checkbox.checked);
			callback && callback(checkbox.data,checkbox);
		}
	}
	// 不全选
	,uncheckAll:function(callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			checkbox.checked = false;
			this.onCheck(checkbox.data,checkbox.checked);
			callback && callback(checkbox.data,checkbox);
		}
	}
	// 反选
	,checkOthers:function(callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			checkbox.checked = !checkbox.checked;
			this.onCheck(checkbox.data,checkbox.checked);
			callback && callback(checkbox.data,checkbox);
		}
	}
	,setClickHighlight:function(dom,rowData) {
		var isSetHighlight = true;
		var highlightHandler = this.options.highlightHandler;
		if(FDLib.util.isFunction(highlightHandler)){
			isSetHighlight = highlightHandler(rowData,dom);
		}
		if(isSetHighlight){
			this.doClickHighlight(dom);
		}
	}
	// 设置高亮
	,doClickHighlight:function(dom){
		if(this.lastClickSpan){
			FDLib.dom.removeClass(this.lastClickSpan,'ui-state-highlight');
		}
		this.lastClickSpan = dom;
		FDLib.dom.addClass(dom,'ui-state-highlight');
	}
	,toggle:function(dom,rowData){
		if(this._isOpen(dom)){
			this.collapse(dom);
			rowData.state = 'closed';
		}else{
			this.expand(dom);
			rowData.state = 'open';
		}
	}
	,expandAll:function(){
		for(var i=0,len=this.togglers.length; i<len; i++) {
			this.expand(this.togglers[i]);
		}
	}
	,collapseAll:function() {
		for(var i=0,len=this.togglers.length; i<len; i++) {
			this.collapse(this.togglers[i]);
		}
	}
	,expand:function(toggler){
		toggler.state = 'open';
		var children = toggler.childrenUL;
		if(children){
			FDLib.dom.removeClass(toggler,this.getCloseClassName());
			FDLib.dom.addClass(toggler,this.getOpenClassName());
			children.style.display="block";
		}
	}
	,collapse:function(toggler){
		toggler.state = 'close';
		var children = toggler.childrenUL;
		if(children){
			FDLib.dom.removeClass(toggler,this.getOpenClassName());
			FDLib.dom.addClass(toggler,this.getCloseClassName());
			children.style.display="none";
		}
	}
	,_isOpen:function(dom){
		if(!dom.state) {
			return false;
		}
		return dom.state == 'open';
	}
	,_createNodeSpan:function(className,text){
		var span = document.createElement(FDTag.SPAN);
		span.className = className;
		if(text){
			span.innerHTML = text;
		}
		return span;
	}
	,buildTreePanel:function() {
		var treePanel = document.createElement(FDTag.DIV);
		treePanel.className = 'pui-tree ui-widget ui-widget-content ui-corner-all';
		if(!this.options.showBorder) {
			treePanel.style.border = '0px';
		}
		return treePanel;
	}
	,hasChild:function(rowData){
		return this.getChildren(rowData).length > 0;
	}
	,getChildren:function(rowData) {
		return rowData[this.childrenFieldName] || [];
	}
	,render:function(){
		if(FDRight.checkByCode(this.options.operateCode)) {
			var dom = FDLib.getEl(this.options.domId);
			dom.innerHTML = '';
			dom.appendChild(this.treePanel);
		}
	}
}

/**
 * Tree控件
 * @example 示例:
tree = new FDTree({
	domId:'menu'
	,data:rows
	,onclick:function(node) {
		document.getElementById('d').innerHTML = (node.text);
		if(node.url) {
			window.open(node.url)
		}
	}
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * @author thc 
 * 2013-3-28
 */
var FDTree = function(options) {
	FDLib.implement(this,FDControl);
	
	this.options = FDLib.util.apply(this.getOptions(),options);
	
	var view = this.options.view;
	this.treeView = new view(this.options);
	
	this.reload();
}

FDTree.prototype = {
/**
 * <code>
// 渲染控件的domId
domId:null
// 服务器请求路径
,url:''
// 后台请求参数
,params:{}
// 点击节点事件.点击任何节点都会触发
,onclick:function(rowData){}
// 点击checkbox触发的事件
,onCheck:function(rowData,isChecked){}
// 节点数据,数组形式
,data:null
// 默认的视图层
,view:FDTreeView
// 后台传递值的字段名
,valueFieldName:'id'
// 后台传递数据显示值的字段名
,textFieldName:'text'
// 后台传递数据子元素的属性名
,childrenFieldName:'children'
// 是否显示checkbox
,checkable:false
// 是否显示边框
,showBorder:true
// 任何情况下点击"+/-"展开/收缩
// true时点击节点即可展开/收缩
// 默认为false
,clickToggle:false
 * </code>
 */
	getOptions:function() {
		return {
			domId:null
			,url:''
			// 后台请求参数
			,params:{}
			// 点击节点事件.点击任何节点都会触发
			,onclick:function(rowData){}
			// 
			,onCheck:function(rowData,isCheck){}
			// 节点数据,数组形式
			,data:null
			// 阶段渲染,类似于grid的render
			,render:null
			,view:FDTreeDomView
			,valueFieldName:'id'
			,textFieldName:'text'
			,childrenFieldName:'children'
			// 是否显示checkbox
			,checkable:false
			// 是否显示边框
			,showBorder:true
			// 任何情况下点击"+/-"展开/收缩
			// true时点击节点即可展开/收缩
			// 默认为false
			,clickToggle:false
			// 点击时高亮
			,highlightHandler:function(rowData,dom){return true;}
			// 鼠标移动高亮
			,hoverEffectHandler:function(rowData,lab){return true;}
		}
	}
	/**
	 * 模拟选中节点
	 */
	,select:function(id) {
		this.treeView.select(id);
	}
	/**
	 * 勾选某个节点,参数为数组,数组元素为节点id
	 * @param idArr 数组,元素为节点id
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,check:function(idArr,callback){
		this.treeView.check(idArr,callback);
	}
	/**
	 * 取消勾选
	 * @param idArr 数组,元素为节点id
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,uncheck:function(idArr,callback){
		this.treeView.uncheck(idArr,callback);
	}
	/**
	 * 勾选所有节点
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,checkAll:function(callback) {
		this.treeView.checkAll(callback);
	}
	/**
	 * 取消勾选所有节点
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,uncheckAll:function(callback) {
		this.treeView.uncheckAll(callback);
	}
	/**
	 * 反选
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,checkOthers:function(callback) {
		this.treeView.checkOthers(callback);
	}
	/**
	 * 获取选中的值
	 * @return 返回rowData对象
	 */
	,getSelected:function() {
		return this.treeView.getSelected();
	}
	/**
	 * 返回勾选的数据
	 * @return 返回数组,数组里面元素是node对象[{...},{...}]
	 */
	,getChecked:function(){
		return this.treeView.getChecked();
	}
	/**
	 * 返回没有勾选的数据
	 * @return 返回数组,数组里面元素是node对象[{...},{...}]
	 */
	,getUnChecked:function(){
		return this.treeView.getUnChecked();
	}
	/**
	 * 设置数据
	 * @param data 数组形式
	 */
	,setData:function(data) {
		if(FDLib.util.isObject(data)) {
			this.options.data = data;
			this.reload();
		}
	}
	/**
	 * 全部展开
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj)<br>
	 * 	nodeObj为节点对象
	 */
	,expandAll:function(callback) {
		this.treeView.expandAll(callback);
	}
	/**
	 * 全部收缩
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj)<br>
	 * 	nodeObj为节点对象
	 */
	,collapseAll:function(callback) {
		this.treeView.collapseAll(callback);
	}
	/**
	 * 重新加载
	 * @param params 服务器请求参数
	 */
	,reload:function(params) {
		var that = this;
		var opt = this.options;
		opt.params = params || {};
		if(opt.url) {
			FDLib.ajax.request({
				url:opt.url
				,params:opt.params
				,success:function(data) {
					opt.data = data;
					that.treeView.refresh(data);
				}
			});
		}else{
			that.treeView.refresh(opt.data);
		}
		
	}
	/**
	 * 隐藏
	 */
	,hide:function() {
		this.treeView.hide();
	}
	/**
	 * 显示
	 */
	,show:function() {
		this.treeView.show();
	}
}

