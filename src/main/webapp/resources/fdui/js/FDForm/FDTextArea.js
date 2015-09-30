/**
 * 文本框控件,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:
 * <pre><code>
// 设置JS路径
FDLib.setDir('../../src/');

var remark;
FDLib.loadJs('FDTextArea',function() {
	remark = new FDTextArea({domId:'remark'
		//,width:300,height:80
		,name:'addr',label:'地址:',labelValign:'top'
		,validates:[new FDValidate({minLength:4,maxLength:10})]});
});
 * </code></pre>
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-7-31
 */
var FDTextArea = function(options) {
	FDTextArea.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
}

FDLib.extend(FDTextArea,FDTextBox);

/**
 * 覆盖父类方法,获取组件的默认属性
   @return <pre><code>返回json数据类型
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'top' // label垂直对齐方式
	,name:"" // 控件的name
	,width:240 // 控件的宽,如'120px'
	,height:80 // 控件的高,如'30px'
	,validates:[] // 验证类
	,defaultValue:'' // 默认值
}</code></pre>
 */
//@override
FDTextArea.prototype.getOptions = function() {
	var options = FDTextArea.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		width:240
		,height:80
		,labelValign:'top'
	});
}

/**
 * @private
 */
//@override
FDTextArea.prototype.buildControlDom = function() {
	var textarea = document.createElement(FDTag.TEXTAREA);
	textarea.setAttribute('name',this.options.name);
	textarea.className = this.options.defaultClassName;
	return textarea;
}
