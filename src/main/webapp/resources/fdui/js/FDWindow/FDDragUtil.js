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