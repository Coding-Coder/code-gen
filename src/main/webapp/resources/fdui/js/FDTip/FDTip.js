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