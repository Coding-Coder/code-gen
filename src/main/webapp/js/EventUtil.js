var EventUtil = {
	/**
	 * 格式化事件对象
	 */
	getEvent : function(){
		if(window.event){
			return this.formatEvent(window.event);
		}else {
			return this.getEvent.caller.arguments[0];
		}
	}
	/**
	 * 格式化事件对象,做到IE与DOM的统一
	 * @param oEvent:事件对象
	 */
	,formatEvent : function(oEvent){
		if($.browser.msie){
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
}