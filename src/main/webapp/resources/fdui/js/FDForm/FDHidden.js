/**
 * 文本框控件FDTextBox,继承自<a href="FDFieldComponent.html">FDFieldComponent</a><br>
 * @example 示例:<br>
 * <pre><code>
// 设置JS路径
FDLib.setDir('../../src/');

var hidden1;

FDLib.loadJs('FDHidden',function() {
	hidden1 = new FDHidden({name:"username",defaultValue:'请输入姓名'});
	hidden1.render('username');
});

</code></pre>
* @param options 参见<a href="FDFieldComponent.html#getOptions">FDFieldComponent.getOptions()</a><br>
* @constructor
 */
var FDHidden = function(options) {
	FDHidden.superclass.constructor.call(this,options);
	this.options = FDLib.util.apply(this.getOptions(),options);
}

FDLib.extend(FDHidden,FDFieldComponent);

/**
 * @private
 */
//@override
FDHidden.prototype.buildControlDom = function() {
	var input = document.createElement(FDTag.INPUT);
	input.setAttribute('type','hidden');
	input.setAttribute('name',this.options.name);
	return input;
}
// 重写方法
// hidden控件不需要这些方法
FDHidden.prototype.hide = 
FDHidden.prototype.show = 
FDHidden.prototype.enable = 
/** @private */
FDHidden.prototype.disable = function(){};
