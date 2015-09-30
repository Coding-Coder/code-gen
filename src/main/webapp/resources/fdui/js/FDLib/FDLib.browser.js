/**
 * 浏览器工具类
 * @class
 */
FDLib.browser = (function(){
	var ua = navigator.userAgent.toLowerCase();
	/**
	 * @private
	 */
	var check = function(r){
		return r.test(ua);
	}
	
	return  {
		/**
		 * 是否为Opera浏览器
		 * @return true,是
		 */
		isOpera : function(){return check(/opera/) }
		/**
		 * 是否为IE浏览器
		 * @return true,是
		 */
		,isIE : function(){return !this.isOpera() && check(/msie/) }
		/**
		 * 是否为windows操作系统
		 * @return true,是
		 */
		,isWin : function(){return check(/windows|win32/) }
		/**
		 * 是否为Mac操作系统
		 * @return true,是
		 */
		,isMac : function(){return check(/macintosh|mac os x/) }
		/**
		 * 是否基于KHTML,即webkit核心
		 */
		,isKHTML : function() {
			return ua.indexOf('khtml') > -1 
				|| ua.indexOf('konqueror') > -1
				|| ua.indexOf('applewebkit') > -1; 
					
		}
		/**
		 * 是否为mozilla浏览器
		 * @return true,是
		 */
		,isMoz : function() {
			return ua.indexOf('gecko') > -1 && !this.isKHTML();
		}
	};
	
})();

