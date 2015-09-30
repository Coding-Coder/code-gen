/**
 * GDGrid全局参数
 * @class
 */
var GlobalParams = {
	/**
	 * 发送请求的页索引属性名
	 * @field
	 */
	requestPageIndexName:'pageIndex'
	/**
	 * 发送请求的每页大小属性名
	 * @field
	 */
	,requestPageSizeName:'pageSize'
	/**
	 * 发送请求的排序字段属性名
	 * @field
	 */
	,requestSortName:'sortname'
	/**
	 * 发送请求的排序规则属性名
	 * @field
	 */
	,requestOrderName:'sortorder'
	
	/**
	 * 服务器端返回json数据的页索引标识
	 * @field
	 */
	,serverPageIndexName:'pageIndex'
	/**
	 * 服务器端返回json数据的页大小标识
	 * @field
	 */
	,serverPageSizeName:'pageSize'
	/**
	 * 服务器端返回json数据的总记录数标识
	 * @field
	 */
	,serverTotalName:'total'
	/**
	 * 服务器端返回json数据的rows标识
	 * @field
	 */
	,serverRowsName:'rows'
	/**
	 * 默认视图层
	 * @private
	 */
	,defalutView:FDTableView
	/**
	 * 默认模型层
	 * @private
	 */
	,defalutModel:FDModel
}