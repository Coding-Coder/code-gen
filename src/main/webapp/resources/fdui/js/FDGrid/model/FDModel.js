/**
 * 模型层,需要依赖
 * @private
 */
var FDModel = function() {
	FDLib.implement(this,Model);
}

FDModel.prototype = {
	/**
	 * 向后台提交请求
	 * @return 返回后台数据
	 */
	postData:function(url,schData,callback) {
		FDLib.ajax.request({url:url,params:schData,success:callback,error:function(e){
			FDWindow.alert(e.message);
		}});
	}
};

