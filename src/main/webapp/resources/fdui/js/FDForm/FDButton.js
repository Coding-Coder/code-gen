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
