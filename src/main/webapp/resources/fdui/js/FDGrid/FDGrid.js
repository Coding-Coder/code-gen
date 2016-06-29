/**
 * Grid控件
 * @example 示例:
grid = new FDGrid({
	domId:'grid'
	//,url:'data.json'
	//,width:'200px'
	,data:gridData
	,onClickRow:function(rowData){
		FDLib.getEl('username').value = rowData.username;
		FDLib.getEl('addr').value = rowData.addr;
		FDLib.getEl('birth').value = rowData.birthday;
	}
	,selectOption:{singleSelect:true,onclick:selectHandler,onload:onloadSelect}
	,fitColumns:false
	,columns:[
		{text:"姓名",name:"username"}
		,{text:"联系地址",name:"addr"}
		,{text:"出生日期",name:"birthday"}
		,{text:"联系地址",name:"addr",style:{width:'200px'}}
		,{text:"出生日期",name:"birthday"}
		,{text:"联系地址",name:"addr"}
		,{text:"出生日期",name:"birthday"}
		,{text:"联系地址",name:"addr"}
		,{text:"出生日期",name:"birthday"}
		,{text:"联系地址",name:"addr"}
		,{text:"出生日期",name:"birthday"}
		,{text:"年龄",name:"age"}
	]
	,actionButtons:[
		{text:'修改',onclick:update}
		,{text:'删除',onclick:del,showFun:function(rowData,rowIndex){
			// 如果是3的倍数就显示删除按钮
			return ((rowIndex+1) % 3 === 0)
		}}
	]
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDGrid = function(options) {
	/**
	 * 存放view实例
	 */
	this.viewInstance;
	/**
	 * 存放model实例
	 */
	this.modelInstance;
	
	this.options = FDLib.util.apply(this.getOptions(),options);
	
	if(!this.getPageSize()){
		this.setPageSize(this.options.pageSizeParam[0]);
	}
	
	this.registView();
	this.registModel();
	
	if(this.options.loadSearch) {
		this.search();
	}
	
}

FDGrid.prototype = {
	/**
	 * 返回默认属性
	 * @return 返回json数据类型<pre><code>
{
	// html元素ID,指定表格渲染到那个元素上 
	domId:''
	// 服务端请求链接 
	,url:''
	// 主键ID 
	,id:null 
	// 表格宽,默认为自适应 
	,width:''
	// 表格高,默认为自适应 
	,height:''
	 // 申明表格列
	 // textOneLine:表格内容是否在同一行
	 // { text:"姓名",name:"username",style:{text-align:'center'}
	 // 	,render:function(rowData,td,rowIndex){return "aaa";}
	 //  ,sortName:'' ,textOneLine:false}
	,columns:[]
	// 列默认样式 
	,columnDefaultStyle:{width:'100px'}
	 // 使列自动展开/收缩到合适的数据表格宽度。
	,fitColumns:true
	 // 操作列配置表
	,actionColumnConfig:{text:'操作',style:{'textAlign':'center'}}
	 // 表格操作按钮
	 // {text:'修改',onclick:'update',showFun:function(rowData,rowIndex){}}
	,actionButtons:[]
	 // 列选择设置,
	 // 	multiSelect是否多选
	 // 	singleSelect是否单选
	,selectOption:{
		multiSelect:false
		,singleSelect:false
		,onclick:function(rowData,selector,tr,rowIndex){}
		,onload:function(rowData,selector,tr,rowIndex){}
	}
	//
	 // 存放表格DOM节点实例,统一管理
	 // 当前行render事件
	 // @param domTr当前行DOM对象
	 // @param rowData当前数据
	 // @param rowIndex当前行索引
	,rowRender:function(domTr,rowData,rowIndex){}
	 // 视图层类
	,view:GlobalParams.defalutView
	 // 模型层类
	,model:GlobalParams.defalutModel
	 // 是否显示分页组件
	,showPaging:true
	 // 是否显示表格设置按钮
	,showSetting:true
	 // 当前页数
	,pageCount:0
	 // 当前页索引
	,pageIndex:1
	// 总记录数 
	,total:0
	// 每页大小选择项 
	,pageSizeParam:[10,20,30]
	 // 每页几条数据
	,pageSize:0
	// 表格的查询参数 
	,schData:{}
	 // 结果
	,result:null
	// 表格数据,数组类型 
	,data:null
	// 排序字段 
	,sortName:null
	// 排序方式 
	,sortOrder:'DESC'
	// 表格加载完成立即查询数据,默认true
	,loadSearch:true
	 // 返回自身grid对象
	,getGrid:function() {
		return self;
	}
	// 勾选中的样式
	,selectRowClassName : 'ui-state-active'
	// 点击行的样式
	,clickRowClassName : 'ui-state-highlight'
	 // 在载入请求数据数据之前触发，如果返回false可终止载入数据操作。
	 // @return 如果返回false可终止载入数据操作。
	,onBeforeLoad:function(param){return true;}
	 // 在数据加载成功的时候触发。
	,onLoadSuccess:function(data){return data;}
	 // 在用户点击一行的时候触发
	 //  @param rowIndex：点击的行的索引值，该索引值从0开始。
	 //  @param rowData：对应于点击行的记录。
	,onClickRow:function(rowData,rowIndex){}
}
</code></pre>
	 */
	getOptions:function() {
		var self = this;
		// --------- 默认属性 ---------
		return {
			// html元素ID,指定表格渲染到那个元素上 
			domId:''
			// 服务端请求链接 
			,url:''
			// 主键ID 
			,id:null 
			// 表格宽,默认为自适应 
			,width:''
			// 表格高,默认为自适应 
			,height:''
			// 无数据显示的内容
			,noDataText:'无查询结果'
			 // 申明表格列
			 // { text:"姓名",name:"username",style:{text-align:'center'}
			 // 	,render:function(rowData,td,rowIndex){return "aaa";}
			 //  ,sortName:'' 
			 // ,textOneLine:false}
			,columns:[]
			// 列默认样式 
			,columnDefaultStyle:{width:'100px'}
			 // 使列自动展开/收缩到合适的数据表格宽度。
			,fitColumns:true
			 // 操作列配置表
			,actionColumnConfig:{text:'操作',style:{'textAlign':'center'}}
			 // 表格操作按钮
			 // {text:'修改',onclick:'update',showFun:function(rowData,rowIndex){}}
			,actionButtons:[]
			 // 列选择设置,
			 // 	multiSelect是否多选
			 // 	singleSelect是否单选
			,selectOption:{
				multiSelect:false
				,singleSelect:false
				,onclick:function(rowData,selector,tr,rowIndex){}
				,onload:function(rowData,selector,tr,rowIndex){}
				,hideCheckAll:false // 隐藏全选checkbox
				// 设置缓存,为true时,表格翻页也会记住勾选状态
				// 当进行search()或reload()会清除缓存
				,cache:false
			}
			// 表格勾选缓存
			,selectCache:{}
			 // 存放表格DOM节点实例,统一管理
			,gridDomMap:{
				tbody_0:null // <tbody>
				,table_1:null // <table>
				,tableDiv_2:null // <div><table></div>
				,gridDiv_3:null  // <div><div><table></div></div>
				
				,headThead_0:null // <thead>
				
				,pageDiv_3:null
				,paginTable_2:null
				,paginTfoot_1:null
			}
			 // 当前行render事件
			 // @param domTr当前行DOM对象
			 // @param rowData当前数据
			 // @param rowIndex当前行索引
			,rowRender:function(domTr,rowData,rowIndex){}
			 // 视图层类
			,view:GlobalParams.defalutView
			 // 模型层类
			,model:GlobalParams.defalutModel
			 // 是否显示分页组件
			,showPaging:true
			 // 是否显示表格设置按钮
			,showSetting:true
			 // 当前页数
			,pageCount:0
			// 当前页索引
			,pageIndex:1
			// 总记录数 
			,total:0
			// 每页大小选择项 
			,pageSizeParam:[10,20,30]
			// 每页几条数据
			,pageSize:0
			// 表格的查询参数 
			,schData:{}
			// 结果
			,result:null
			// 表格数据,数组类型 
			,data:null
			// 排序字段 
			,sortName:null
			// 排序方式 
			,sortOrder:'DESC'
			// 表格加载完成立即查询数据,默认true
			,loadSearch:true
			// 返回自身grid对象
			,getGrid:function() {
				return self;
			}
			// 勾选中的样式
			,selectRowClassName : 'ui-state-active'
			// 点击行的样式
			,clickRowClassName : 'ui-state-highlight'
			// 在载入请求数据数据之前触发，如果返回false可终止载入数据操作。
			// @return 如果返回false可终止载入数据操作。
			,onBeforeLoad:function(param){return true;}
			 // 在数据加载成功的时候触发。
			,onLoadSuccess:function(data){return data;}
			,afterRefresh:function(data) {}
			 // 在用户点击一行的时候触发
			 //  @param rowIndex：点击的行的索引值，该索引值从0开始。
			 //  @param rowData：对应于点击行的记录。
			,onClickRow:function(rowData,rowIndex){}
		};
	}
	// --------- 默认方法 ---------
	/**
	 * 注册view
	 * @private
	 */
	,registView:function() {
		var View = this.options.view;
		// 默认的view,被装饰对象
		this.viewInstance = new View(this.options,this);
	}
	/**
	 * 初始化装饰器,如果没有装饰器就返回默认的view实例
	 * @private
	 */
	,_initDecorators:function(viewInstance) {
		var decorators = this.options.decorators;
		var self = this;
		
		FDLib.util.each(decorators,function(deforators){
			viewInstance = new deforators(viewInstance,self);
		});
		
		return viewInstance;
	}
	/**
	 * @private
	 */
	,registModel:function() {
		var model = this.options.model;
		this.modelInstance = new model();
	}
	/**
	 * 搜索
	 * @param data 查询参数,json格式
	 */
	,search:function(schData) {
		if(this.options.url){
			this.options.schData = schData || {};
			this.options.pageIndex = 1;
		}
		this.resetSelectCache();
		this.refresh();
	}
	/**
	 * 清空勾选缓存
	 */
	,resetSelectCache:function() {
		if(this.isSelectable()) {
			this.options.selectCache = {};
		}
	}
	,getSelectCache:function() {
		return this.options.selectCache;
	}
	/**
	 * 加载本地数据，旧的行将被移除。
	 * @param data json数据
	 */
	,loadData:function(data){
		this.options.data = data;
		this.resetParam();
		this.refresh();
	}
	,getData:function(){
		return this.options.result;
	}
	/**
	 * 根据索引得到某行数据
	 * @param rowIndex 行索引
	 * @return json格式
	 */
	,getRowData:function(rowIndex) {
		return this.getRows()[rowIndex];
	}
	/**
	 * 获取所有数据
	 * @return 数组格式
	 */
	,getRows:function() {
		return this.getData()[GlobalParams.serverRowsName] || [];
	}
	/**
	 * 在复选框呗选中的时候返回所有行。
	 * @return 返回数组
	 */
	,getChecked:function(){
		if(this.multiSelect()) {
			var idName = this.options.id;
			var ret = [];
			var rows = this.getRows();
			var self = this;
			
			var isCache = this.options.selectOption.cache;
			
			if(isCache) {
				var selectCache = this.getSelectCache();
				// 先添加缓存中的
				for(var idVal in selectCache) {
					if(selectCache[idVal]) {
						ret.push(selectCache[idVal]);
					}
				}
			}
			// 再添加真实勾选的
			FDLib.util.each(rows,function(row,i){
				var selector = self.getSelectorByRowIndex(i);
				var isInCache = self.isInCache(row,idName);
				if(selector && selector.checked && !isInCache) {
					ret.push(row);
				}
			});
			
			return ret;
		}
	}
	,isInCache:function(row,idName) {
		if(!idName) {
			return false;
		}
		var idVal = row[idName];
		return !!this.options.selectCache[idVal];
	}
	/**
	 * 获取选中条数
	 */
	,getCheckedLength:function() {
		var checked = this.getChecked();
		if(!checked){
			return 0;
		}
		return checked.length;
	}
	/**
	 * 返回第一个被选中的行
	 * @return 返回行数据
	 */
	,getSelected:function(){
		if(this.singleSelect()) {
			var rows = this.getRows();
			var self = this;
			
			var isCache = this.options.selectOption.cache;
			
			if(isCache) {
				var selectCache = this.getSelectCache();
				// 先添加缓存中的
				for(var idVal in selectCache) {
					if(selectCache[idVal]) {
						return selectCache[idVal];
					}
				}
			}
			
			return FDLib.util.each(rows,function(row,i){
				var selector = self.getSelectorByRowIndex(i);
				if(selector && selector.checked) {
					return row;
				}
			});
		}
	}
	/**
	 * 选择当前页中所有的行。
	 */
	,checkAll:function() {
		if(this.multiSelect()) {
			var selectAll = this._getSelectAllInput();
			if(selectAll) {
				selectAll.checked = "checked";
				selectAll.onclick();
			}
		}
	}
	/**
	 * 取消选择所有当前页中所有的行。
	 */
	,uncheckAll:function(){
		if(this.multiSelect()) {
			var selectAll = this._getSelectAllInput();
			if(selectAll) {
				selectAll.checked = "";
				selectAll.onclick();
			}
		}
	}
	/**
	 * 选择一行，行索引从0开始。
	 */
	,selectRow:function(index){
	 	this.setSelected(index);
	}
	/**
	 * 设置url
	 */
	,setUrl:function(url){
		this.options.url = url;
	}
	/**
	 * 通过ID值参数选择一行。
	 */
	,selectRecord:function(id){
	  	var trs = this.getTableTR();
		var rowsCount = trs.length;
		for(var i=0; i<rowsCount; i++) {
			var selector = this.getSelectorByRowIndex(i);
			if(selector.value == id){
				this.setSelected(i);
				break;
			}
		}
	}
	/**
	 * 勾选一行，行索引从0开始。
	 * @param index 行索引
	 */
	,checkRow:function(index){
		this.setSelected(index);
	}
	/**
	 * 取消勾选一行，行索引从0开始。
	 * @param index 行索引
	 */
	,uncheckRow:function(index){
		this.setNoSelected(index);
	}
	/**
	 * 清除所有勾选的行。等同于uncheckAll()
	 */
	,clearChecked:function(){
		this.uncheckAll();
	}
	// 勾选行
	,_doSelectHandler:function(selector,tr){
		if(selector.disabled) {
			return;
		}
		if(this.singleSelect()){ // 如果是单选,移除上一条单选的状态
			this._bindSingleSelectRow(tr);
		}
		FDLib.dom.removeClass(tr,this.options.clickRowClassName);
		FDLib.dom.addClass(tr,this.options.selectRowClassName);
	}
	// 不勾选
	,_noSelectedHandler:function(selector,i) {
		var rows = this.getTableTR();
		if(selector.disabled) {
			return;
		}
		var tr = rows[i];
		this._doNoSelectedHandler(selector,tr);
	}
	,_doNoSelectedHandler:function(selector,tr){
		if(selector.disabled) {
			return;
		}
		selector.checked = '';
		FDLib.dom.removeClass(tr,this.options.selectRowClassName);
	}
	,_bindSingleSelectRow:function(tr){
		if(this.lastRadioSelectedTR){
			FDLib.dom.removeClass(this.lastRadioSelectedTR,this.options.selectRowClassName);
		}
		this.lastRadioSelectedTR = tr;
	}
	,_bindClickRowClass:function(tr){
		if(this.lastClickedTR){ // 移除上一次点击的高亮效果
			FDLib.dom.removeClass(this.lastClickedTR,this.options.clickRowClassName);
		}
		// 如果已经是勾选状态
		if(FDLib.dom.hasClass(tr,this.options.selectRowClassName)){
			return;
		}
		this.lastClickedTR = tr;
		FDLib.dom.addClass(tr,this.options.clickRowClassName);
	}
	/**
	 * 获取表格内容的TR
	 */
	,getTableTR:function() {
		return this.options.gridDomMap.tbody_0.rows;
	}
	/**
	 * @private
	 */
	,buildParam:function() {
		var param = this.options.schData || {};
		param[GlobalParams.requestPageIndexName] = this.getPageIndex();
		param[GlobalParams.requestPageSizeName] = this.getPageSize();
		// 排序字段
		if(this.options.sortName) {
			param[GlobalParams.requestSortName] = this.options.sortName;
			param[GlobalParams.requestOrderName] = this.options.sortOrder;
		}
		
		return param;
	}
	/**
	 * 排序,只支持单属性排序
	 * @param sortName 排序字段名
	 * @param sortOrder 排序方式,即ASC,DESC
	 */
	,sort:function(sortName,sortOrder) {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
		
		this.refresh();
	}
	/**
	 * 获取当前排序方式
	 */
	,getSortOrder:function() {
		return this.options.sortOrder;
	}
	/**
	 * 获取当前排序字段
	 */
	,getSortName:function() {
		return this.options.sortName;
	}
	/**
	 * 获取<thead>
	 */
	,getThead:function() {
		return this.options.gridDomMap.headThead_0;
	}
	/**
	 * 获取<tboady>
	 */
	,getTbody:function() {
		return this.options.gridDomMap.tbody_0;
	}
	/**
	 * 请求数据
	 * @private
	 */
	,postData:function() {
		if(this.options.url){
			var param = this.buildParam();
			var self = this;
			var ret = this.options.onBeforeLoad(param);
			if(ret){
				this.modelInstance.postData(this.options.url,param,function(data){
					self.options.result = self.options.onLoadSuccess(data);
					self.callViewsProcess();
				});
			}
		}else if(this.options.data){ // 本地分页
			var newObj = this.requestLocal(this.getPageIndex(),this.getPageSize());
			newObj = this.options.onLoadSuccess(newObj);
			this.options.result = newObj;
			this.callViewsProcess();
		}
		
		this.options.afterRefresh(this.options.result);
	}
	,getPageIndex:function() {
		return this.options.pageIndex;
	}
	,getPageSize:function() {
		return this.options.pageSize;
	}
	,setPageIndex:function(pageIndex) {
		this.options.pageIndex = pageIndex;
	}
	,setPageSize:function(pageSize) {
		this.options.pageSize = pageSize;
	}
	,requestLocal:function(pageIndex,pageSize) {
		var newData = [];
		var localData = this.options.data;
		var firstIndex=1,total=0;
		
		if(this.options.showPaging) {
			firstIndex = parseInt((pageIndex - 1) * pageSize);
			total = localData.length;
			newData = localData.slice(firstIndex,firstIndex+pageSize);
		}else{
			newData = localData;
		}
		var obj = {};
		
		obj[GlobalParams.serverRowsName] = newData;
		obj[GlobalParams.serverPageIndexName] = pageIndex;
		obj[GlobalParams.serverPageSizeName] = pageSize;
		obj[GlobalParams.serverTotalName] = total;
		
		return obj;
	}
	/**
	 * 调用视图层处理后台数据
	 * @private
	 */
	,callViewsProcess:function() {
		this.viewInstance.processData(this.options.result);
	}
	/**
	 * 本地刷新表格
	 */
	,refresh:function() {
		this.postData();
		this.reset();
	}
	/**
	 * 重新加载数据
	 */
	,reload:function() {
		this.resetParams();
		this.search();
	}
	/**
	 * 重置搜索参数
	 */
	,resetParams:function() {
		this.options.pageIndex = 1;
		this.options.schData = {};
	}
	,reset:function() {
		if(this.multiSelect()) {
			var selectAll = this._getSelectAllInput();
			if(selectAll) {
				selectAll.checked = "";
			}
		}
	}
	/**
	 * @private
	 */
	,resetParam:function() {
		this.options.pageIndex = 1;
	}
	/**
	 * 删除某一行
	 * @param rowIndex 行索引
	 */
	,deleteRow:function(rowIndex) {
		var data = this.options.data || {};
		var rows = data[GlobalParams.serverRowsName];
		if(rows.length > rowIndex){
		 	rows.splice(rowIndex,1);
		 	this.refresh();
		}
	}
	/**
	 * 是否是选择状态
	 */
	,isSelectable:function() {
		return this.singleSelect() || this.multiSelect();
	}
	,isSelectStatus:function(){
		return this.isSelectable();
	}
	/**
	 * 是否单选
	 */
	,singleSelect:function() {
		var selectOption = this.options.selectOption;
		return selectOption.singleSelect;
	}
	/**
	 * 是否多选
	 */
	,multiSelect:function() {
		var selectOption = this.options.selectOption;
		return selectOption.multiSelect;
	}
	,_getSelectAllInput:function() {
		if(this.multiSelect()) {
			return this.checkAllInput;
		}
	}
	/**
	 * 通过行索引获取选择器,即input
	 */
	,getSelectorByRowIndex:function(rowIndex) {
		if(this.isSelectable()) {
			var trs = this.getTableTR();
			return this._getInput(trs,rowIndex);
		}
	}
	,_getInput:function(trs,rowIndex) {
		var row = trs[rowIndex];
		var cell = row.cells[0];
		return cell.getElementsByTagName('input')[0];
	}
	// 能否操作选择器
	// 选择器存在并且没有禁用
	,_couldOperateSelector:function(selector) {
		return selector && !selector.disabled;
	}
	,_getTable:function() {
		return this.options.gridDomMap.table_1;
	}
	/**
	 * 设置某行数据被选中 
	 * @param rowIndex 行索引
	 */
	,setSelected:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector.disabled) {
			return;
		}
		selector.checked = 'checked';
		selector.onclick();
	}
	/**
	 * 设置某行数据不被选中 
	 * @param rowIndex 行索引
	 */
	,setNoSelected:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector.disabled) {
			return;
		}
		selector.checked = '';
		selector.onclick();
	}
	/**
	 * 取消单选的选择
	 */
	,clearSelected:function() {
		if(this.singleSelect()){
			var trs = this.getTableTR();
			var rowsCount = trs.length;
			var tr = null;
			for(var i=0; i<rowsCount; i++) {
				tr = trs[i];
				var selector = this.getSelectorByRowIndex(i);
				if(selector.checked){
					this._doNoSelectedHandler(selector,tr);
					break;
				}
			}
		}
	}
	/**
	 * 得到当前数据条数
	 * @return 返回int类型
	 */
	,getDataLength:function() {
		return this.getRows().length;
	}
	/**
	 * 设置某行不可选(在有选择框的条件下)
	 * @param rowIndex 行索引
	 */
	,setRowDisabled:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector) {
			selector.disabled = 'disabled';
		}
	}
	/**
	 * 设置某行可选(在有选择框的条件下)
	 * @param rowIndex 行索引
	 */
	,setRowEnabled:function(rowIndex) {
		var selector = this.getSelectorByRowIndex(rowIndex);
		if(selector) {
			selector.disabled = '';
		}
	}
	/**
	 * 跳转至首页
	 */
	,moveFirst:function() {
		if(this.options.pageIndex != 1) {
			this.options.pageIndex = 1;
			this.refresh();
		}
	}
	/**
	 * 上一页
	 */
	,movePreview:function() {
		if(this.options.pageIndex > 1) {
			this.options.pageIndex--;
			this.refresh();
		}
	}
	/**
	 * 下一页
	 */
	,moveNext:function() {
		if(this.options.pageIndex < this.options.pageCount) {
			this.options.pageIndex++;
			this.refresh();
		}
	}
	/**
	 * 跳转至尾页
	 */
	,moveLast:function() {
		if(this.options.pageIndex != this.options.pageCount) {
			this.options.pageIndex = this.options.pageCount;
			this.refresh();
		}
	}
	
};

