/**
 * 验证数字的validate,继承自<a href="FDBaseValidate.html">FDBaseValidate</a><br>
 * @example 示例:
var controls
FDLib.init(function() {
	controls = [
		new FDTextBox({domId:'t1',label:'验证正整数:',validates:[{rule:{positiveInt:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'X 请输入整整数'}]})
		,new FDTextBox({domId:'t2',label:'验证自然数(长度4~10):',validates:
				[
				{rule:{naturalNum:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入自然数'}
				,{rule:{minLength:4,maxLength:10},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'长度必须为4~10'}
				]})
		,new FDTextBox({domId:'t3',label:'验证正数:',validates:[{rule:{positiveNum:true,notNull:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入大于零的数'}]})
		,new FDTextBox({domId:'t4',label:'验证浮点数:',validates:[{rule:{floatNum:true,notNull:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入浮点数'}]})
		,new FDTextBox({domId:'t5',label:'验证正浮点数:',validates:[{rule:{positiveFloatNum:true,notNull:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入正浮点数'}]})
		,new FDTextBox({domId:'t6',label:'验证非负浮点数:',validates:[{rule:{notNegativeFloatNum:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入非负浮点数'}]})
		,new FDTextBox({domId:'t7',label:'验证邮箱:',validates:[{rule:{email:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入正确的邮箱'}]})
		,new FDTextBox({domId:'t8',label:'验证手机号:',validates:[{rule:{mobile:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入正确的手机号'}]})
		,new FDTextBox({domId:'t9',label:'验证电话:',validates:[{rule:{tel:true},successClass:'success',errorClass:'error',successMsg:'√',errorMsg:'请输入正确的电话号'}]})
	]
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-7-31
 */
var FDValidate = function(options) {
	this.options = FDLib.util.apply(this.getOptions(),options);
	this.msgDom = FDLib.getEl(this.options.msgId);
}

FDValidate.prototype = {

	getOptions:function() {
		return {
			rule:{}
			,msgId:''
			,errorMsg:''
			,successMsg:''
			,errorClass:''
			,successClass:''
			// 自定义校验方法
			,validateHandler:null
		};
	}
	/**
	 * 设置提示信息的id
	 */
	,setMsgId:function(id){
		this.options.msgId = id;
		this.msgDom = FDLib.getEl(this.options.msgId);
	}
	,showErrorMsg:function(msg) {
		if(this.options.errorClass) {
			this.msgDom.className = '';
			FDLib.dom.addClass(this.msgDom,this.options.errorClass);
		}
		if(this.msgDom) {
			this.msgDom.innerHTML = msg || this.options.errorMsg;
		}
	}
	,showSuccessMsg:function(msg) {
		if(this.options.successClass) {
			this.msgDom.className = '';
			FDLib.dom.addClass(this.msgDom,this.options.successClass);
		}
		if(this.msgDom) {
			this.msgDom.innerHTML = msg || this.options.successMsg;
		}
	}
	/**
	 * 验证操作
	 */
	,validate:function(val){
		if(typeof this.options.validateHandler === 'function') {
			var succ =  this.options.validateHandler(val);
			if(!succ){
				this.showErrorMsg();
			}
			return succ;
		}
		var rule = this.options.rule;
		for(var key in rule) {
			// 检测空值
			var len = this.getValueLength(val);
			if(len === 0) {
				if(this.options.rule.notNull) {
					this.showErrorMsg();
					return false;
				}
				return true;
			}
			
			// 检测长度
			if(!this.validateLength(val)) {
				return false;
			}
			
			var shouldValidate = rule[key];
			if(shouldValidate && !this.validateItem(val,key)) {
				return false;
			}
		}
		// 验证成功
		this.showSuccessMsg();
		return true;
	}
	/**
	 * 验证长度
	 */
	,validateLength:function(val) {
		var len = this.getValueLength(val);
		var mixLen = this.options.rule.minLength || -1;
		var maxLen = this.options.rule.maxLength || -1;
		if(mixLen !== -1) {
			if(len < mixLen) {
				this.showErrorMsg();
				return false;
			}
		}
		
		if(maxLen !== -1) {
			if(len > maxLen) {
				this.showErrorMsg();
				return false;
			}
		}
		
		return true;
	}
	/**
	 * 验证单个项
	 */
	,validateItem:function(val,item) {
		var validateMap = FDValidateStore;
		var validateHandler = validateMap[item];
		if(FDLib.util.isFunction(validateHandler)) {
			// 验证不通过
			if(!validateHandler(val)) {
				this.showErrorMsg();
				return false;
			}
		}
		return true;
	}
	/**
	 * 返回字节长度,一个汉字返回2个长度
	 */
	,getValueLength:function(value) {
		if(typeof value === 'undefined') {
			return 0;
		}
		// 如果是数组
		if(FDLib.util.isArray(value)) {
			return value.length;
		}
		return (value + '').replace(/[^\x00-\xff]/g, "**").length;
	}
}