/**
 * 日期工具类
 * @class
 */
FDLib.date = {
	/**
	 * 判断是否是闰年
	 * @param year 年份
	 * @return 闰年为true
	 */
	isLeapYear:function(year) {
		return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
	}
	/**
	 * 是否是日期类型
	 * @param dateStr 字符串日期
	 * @return 是,true
	 */
	,isDateStr:function(dateStr) {
		return !!this._parseDateStrToNum(dateStr);
	}
	/**
	 * 根据年份获取每月的天数
	 * @param year 年份
	 * @return 返回每个月的天数,数组形式
	 */
	,getMonthDaysArr:function(year) {
		// 存放每月天数
		var month_days_arr = [31,28,31,30,31,30,31,31,30,31,30,31];
		// 二月份天数
		month_days_arr[1] = this.isLeapYear(year) ? 29 : 28;
		
		return month_days_arr;
	}
	/**
	 * 根据年月得到该月的最后一天
	 * @param year 年份
	 * @param month 月份
	 * @return 返回该月最后一天
	 */
	,getEndDate:function(year,month) {
		// 存放每月天数
		var month_days_arr = this.getMonthDaysArr(year);
		return month_days_arr[month - 1];
	}
	/**
	 * 将字符串日期转换成Date类型
	 * 	
	 * @param dateStr 字符串日期,如:
	 *  var s = "2012-9-3 09:41:30";
	 *  var s2 = "2012-09-03 09:41:30";
	 *  var s3 = "9/3/2012 09:41:30";
	 *  var s4 = "2012-9-3";
	 * @return Date类型日期
	 */
	,parse:function(dateStr) {
		return new Date(this._parseDateStrToNum(dateStr)); 
	}
	,_parseDateStrToNum:function(dateStr) {
		return Date.parse(dateStr.replace(/-/g,"/"));
	}
	/**
	 * 格式化日期<br>
	 * 使用方法:
	 * <code>
	 * var dateStr = FDLib.date.format(new Date(),'yyyy-MM-dd hh:mm:ss.S');
	 * </code>
	 * 
	 * @param dateInstance Date实例
	 * @param 格式化字符串,如"yyyy-MM-dd","yyyy-MM-dd hh:mm:ss.S"
	 * 
	 * @return 返回格式化后的字符串
	 */
	,format:function(dateInstance,pattern) {
		var o = {   
			"M+" : dateInstance.getMonth()+1,                 //月份    
			"d+" : dateInstance.getDate(),                    //日    
			"h+" : dateInstance.getHours(),                   //小时    
			"m+" : dateInstance.getMinutes(),                 //分    
			"s+" : dateInstance.getSeconds(),                 //秒    
			"q+" : Math.floor((dateInstance.getMonth()+3)/3), //季度    
			"S"  : dateInstance.getMilliseconds()             //毫秒    
		};   
		if(/(y+)/.test(pattern)) {
			pattern = pattern.replace(RegExp.$1, (dateInstance.getFullYear()+"").substring(4 - RegExp.$1.length));   
		}
			
		for(var k in o) {
			if(new RegExp("("+ k +")").test(pattern)) {
				pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) 
					? (o[k]) 
					: (("00"+ o[k]).substring((""+ o[k]).length))); 
			}
		}
			
		return pattern; 
	}
};