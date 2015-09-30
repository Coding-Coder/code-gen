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


