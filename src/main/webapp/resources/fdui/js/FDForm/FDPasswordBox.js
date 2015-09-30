/**
 * 密码输入框类,继承自<a href="FDTextBox.html">FDTextBox</a><br>
 * @example 示例:
 * <pre><code>
 * var txtPassword = new FDPasswordBox({domId:'password',name:'password',label:'密码:'});
 * txtPassword.render();
 * </code></pre>
 * @constructor
 */
var FDPasswordBox = function(options) {
	FDPasswordBox.superclass.constructor.call(this,options);
}

FDLib.extend(FDPasswordBox,FDTextBox);

/**
 * 返回密码控件的html
 * @private
 */
//@override
FDPasswordBox.prototype.buildControlDom = function() {
	var input = document.createElement(FDTag.INPUT);
	input.setAttribute('type','password');
	input.setAttribute('name',this.options.name);
	input.className = this.options.defaultClassName;
	return input;
}
