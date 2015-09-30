/**
 * JString对象,功能类似于Java中的StringBuilder
 * @example 示例:
var str = new JString();
str.append('Hello').append(' World');
alert(str.toString()); // Hello World
 * @class
 */
function JString(s){
	this._strings = new Array;
	if(s && typeof s === 'string') {
		this._strings.push(s);
	}
}

/**
 * 追加字符串
 * @return 返回JString对象
 */
JString.prototype.append = function(s){
	this._strings.push(s);
	return this;
}

/**
 * 返回字符串
 */
JString.prototype.toString = function(){
	return this._strings.join("");
}
