/**
 * 字符串工具类
 * @class
 */
FDLib.string = {
	/**
	 * 格式化字符串
	 * @example 用法:
	 * FDLib.string.formatStr('{y}年{m}月{d}日',{y:'2010',m:'09',d:'15'});
	 * 返回:2010年09月15日
	 * 
	 * @param str 需要格式化的字符串
	 * @param obj json数据
	 * @return 返回格式化后的字符串
	 */
	format:function(str,obj){
		for(var key in obj){
			str = str.replace(new RegExp("\\{\\s*" + key + "\\s*\\}", "g"), obj[key]);
		}
		return str;
	}
	/**
	 * 是否是一个空字符串. ''或""
	 * @return 是,true
	 */
	,isEmptyStr:function(value) {
		return (typeof value === 'string' && !value);
	}
};
