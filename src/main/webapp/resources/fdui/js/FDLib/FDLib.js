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
		,createClass:function(className,initFun,superClass) {
			var subClass = initFun;
			window[className] = subClass;
			if(superClass) {
				this.extend(subClass,superClass);
			}
		}
		/**
		 * 创建接口
		 * @param {String} className 类名
		 * @param {Array} methods 接口方法列表
		 */
		,Interface:function(className,methods) {
			var _interface = new Interface(methods);
			_interface.className = className;
			window[className] = _interface;
			return _interface;
		}
		/**
		 * 创建类
		 * @param {String} className 类名
		 * @param {Object} props 类方法
		 * @param {Function} superClass 父类
		 */
		,Class:function(className,props,superClass) {
			var subClass = function() {
				// 如果有父类,调用父类构造函数
				if(subClass.superclass) {
					subClass.superclass.init.apply(this,arguments);
				}
				// 调用构造函数
				props.init.apply(this,arguments);
				// 将构造函数清除,不允许后续再调用
				this.init = function(){
					throw new Error('类' + this.getClassName() + '已经被初始化,调用init()无效');
				};
			}
			
			// 如果有父类,则继承
			if(typeof superClass === 'function') {
				var F = function(){};
				F.prototype = superClass.prototype;
				subClass.prototype = new F();			
				subClass.prototype.constructor = subClass;
				
				subClass.superclass = superClass.prototype;
				if(superClass.prototype.constructor == Object.prototype.constructor) {
					superClass.prototype.constructor = superClass;
				}
				
				// 新增一个函数,可以用来调用父类方法
				subClass.prototype._super = function(methodName) {
					var argus = [];
					for(var i=1, len=arguments.length;i<len; i++) {
						argus.push(arguments[i]);
					}
					return subClass.superclass[methodName].apply(this,argus);
				}
			}
			
			var subProto = subClass.prototype;
			// 复制方法
			for(var propName in props) {
				subProto[propName] = props[propName];
			}
			
			// 增加方法,放在继承处理之后
			subClass.prototype.getClassName = function() {
				return className;
			}
			
			// 接口验证
			subClass.impl = function() {
				if (arguments.length > 0) {
					var proto = subClass.prototype;
		        	var _className = proto.getClassName();
		            for (var i = 0, len = arguments.length; i < len; i++) {
		                var interfac = arguments[i];
		                var interfaceName = interfac.className;
		                if (!interfac._isInterfaceType) {
		                    throw new Error(_className + ".impl()第" + (i + 1) + "个参数必须是接口类型");
		                }
		                for (var j = 0, methodLen = interfac.methods.length; j < methodLen; j++) {
		                    var method = interfac.methods[j];
		                    if (!proto[method] || typeof proto[method] !== "function") {
		                        throw new Error("类"+_className+"没有实现"+interfaceName+"." + method + "()方法");
		                    }
		                }
		            }
		        }
		        
		        return subClass;
			}
			
			window[className] = subClass;
			
			return subClass;
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
