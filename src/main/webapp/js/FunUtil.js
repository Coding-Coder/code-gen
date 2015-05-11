/*
&nbsp;使用方法:
&nbsp;FunUtil.createFun(scope,'some_mothod_name',obj1);
&nbsp;FunUtil.createFun(scope,'some_mothod_name',obj1,obj2);
&nbsp;...
*/
var FunUtil = (function(){
	
	var index = 0; 
	var handlerStore = []; // 存放方法句柄

	return {		
		// scope:作用域
		// methodName:方法名,字符串格式
		// ...:参数可放多个
		createFun:function(scope,methodName){
			var currentIndex = index++; // 创建索引
			
			var argu = []; // 用来存放多个参数
			// 构建参数
			for(var i=2,len=arguments.length;i<len;i++){
				argu.push(arguments[i]);	
			}

			// 把函数句柄存在数组里
			handlerStore[currentIndex] = (function(scope,methodName,argu){
				// 生成函数调用句柄
				return function(){
					scope[methodName].apply(scope,argu);
				}

			}(scope,methodName,argu));			
			
			return 'FunUtil._runFun(event,'+currentIndex+');';
		}
		// 执行方法
		// index:索引.根据这个索引找到执行函数
		,_runFun:function(e,index){
			var handler = handlerStore[index];
			handler();// 该函数已经传入了参数
			
			// 阻止默认行为并取消冒泡
			if(typeof e.preventDefault === 'function') {
				e.preventDefault();
				e.stopPropagation();
			}else {
				e.returnValue = false;
				e.cancelBubble = true;
			}
		}
	};
	
})();
