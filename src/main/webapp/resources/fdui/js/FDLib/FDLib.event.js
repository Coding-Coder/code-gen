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
	}	/**
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

