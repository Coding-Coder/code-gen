/**
 * 权限检查<br>
 * 使用方法:FDRight.setData(datas);
 * var hasPermission = FDRight.check(1,'view');
 * @class
 */
var FDRight = (function() {
	
	var config = {
		// 系统资源ID名称
		systemResourceIdName:'srId'
		// 操作代码名称
		,operateCodeName:'operateCode'
		// 强行检查,如果没有定义operateCode属性则没有权限
		,forceCheck:false
	};
	
	/**
	 * 结构:
	 * //key/value -> srId/operateCodes
	 * var permissionData = {
			{"1":["view","update"],"2":["del"]}
			,{"2":["view","del"]}
		}
	* */
	var permissionData = [];
	
	return {
		config:function(configParam){
			FDLib.util.apply(config,configParam);
		}
		,setData:function(data) {
			permissionData = data;
			return this;
		}
		,setForceCheck:function(b){
			config.forceCheck = !!b;
			return this;
		}
		/**
		 * 检查权限
		 */
		,check:function(srId,operateCode){
			// 非强制检查,如果operateCode属性没有定义则显示
			if(!config.forceCheck && FDLib.util.isUndefined(operateCode)) {
				return true;
			}
			
			if(!srId || !operateCode) {
				return false;
			}
			
			var operateCodeArr = permissionData[srId];
			
			return FDLib.util.contains(operateCodeArr,operateCode);
		}
		,checkByCode:function(operateCode,callback){
			var srId = FDLib.util.getParam(config.systemResourceIdName);
			var hasPerm = this.check(srId,operateCode);
			if(hasPerm && callback) {
				return callback();
			}else{
				return hasPerm;
			}
		}
	};
	
})();