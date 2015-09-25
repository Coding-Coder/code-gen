// FDUI的jquery插件
// 此文件必须放在FDUI以及jquery之后
// 2015-7-27

FDLib.ajax.type = "POST";
FDLib.ajax.dataType = "json";

/**
 * 提交请求
 * @param options
 * { url:'',params:{},success:function(){},error:function(){} }
 */
FDLib.ajax.request = function(options){
	
	var url = options.url;
	var params = options.params || {};
	var callback = options.success || function(e){alert(e)};
	var error = options.error || function(e){alert('数据请求失败')};
	
	jQuery.ajax({
		type: FDLib.ajax.type,
		url: options.url,
		async:true,
		traditional:true,
		dataType: FDLib.ajax.dataType,
		data:params,
		success: function(e){
			callback(e);
		},
		error:function(hxr,type,error){
			error(error);
		}
	})
}
