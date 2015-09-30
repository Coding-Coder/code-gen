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

