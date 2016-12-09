/**
 * @private
 */
var FDValidateStore = (function(){
	var reg_positiveInt = /^[1-9]\d*$/
		,reg_naturalNum = /^(0|([1-9]\d*))$/
		,reg_positiveNum = /^(((0|([1-9]\d*))[\.]?[0-9]+)|[1-9])$/
		,reg_floatNum = /^-?[0-9]{1,4}([.]{1}[0-9]{1,})?$/
		,reg_positiveFloatNum = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
		,reg_notNegativeFloatNum = /^[0-9]{1,4}([.]{1}[0-9]{1,})?$/
		,reg_email = /^\s*[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]*)*@[a-zA-Z0-9\-]+([\.][a-zA-Z0-9\-]+)+\s*$/
		,reg_mobile = /^\s*(\+86)*0*1(3|5|8)\d{9}\s*$/
		,reg_tel = /\(?0\d{2,3}[)-]?\d{7,8}/
	
	return {
		/**
		 * 匹配正整数
		 */
		positiveInt:function(val) {
			return reg_positiveInt.test(val);
		}
		/**
		 * 匹配自然数,0,1,2,3...
		 */
		,naturalNum:function(val) {
			return reg_naturalNum.test(val);
		}
		/**
		 * 匹配正数
		 */ 
		,positiveNum:function(val) {
			return reg_positiveNum.test(val);
		}
		/**
		 * 匹配浮点数
		 */
		,floatNum:function(val) {
			return reg_floatNum.test(val);
		}
		/**
		 * 匹配正浮点数
		 */
		,positiveFloatNum:function(val) {
			return reg_positiveFloatNum.test(val);
		}
		/**
		 * 匹配非负浮点数（正浮点数 + 0） 
		 */
		,notNegativeFloatNum:function(val) {
			if(val === 0) {
				return true;
			}
			return reg_notNegativeFloatNum.test(val);
		}
		/**
		 * 匹配邮箱
		 */
		,email:function(val) {
			return reg_email.test(val);
		}
		/**
		 * 匹配手机号
		 */
		,mobile:function(val) {
			return reg_mobile.test(val);
		}
		/**
		 * 匹配联系电话
		 * (010)88886666，或022-22334455，或02912345678
		 */
		,tel:function(val) {
			return reg_tel.test(val);
		}
	};
})();