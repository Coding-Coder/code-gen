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
