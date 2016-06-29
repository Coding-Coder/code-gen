/*
 * 画出表格内容的视图层
 * @private
 */
var FDTableView = function(options,grid) {
	FDLib.implement(this,View);
	
	this.each = FDLib.util.each;
	this.options = options;
	this.grid = grid;
	// 后台返回的数据
	this.resultData = null;
	// 构建表格head部分的view
	this.headView = this._buildHeadView();
	// 存放FDCellView的实例
	this.cellViews = this._buildCellView();
	// 构建表格分页部分的view
	this.paginationView = this._buildPaginationView();
	
	this.gridDomMap = this.options.gridDomMap;
	
	this.renderTo(this.options.domId);
}

FDTableView.prototype.getTableView = function() {
	return this;
}

/**
 * 处理数据
 * @param data 格式类型:
 * {total:10,pageIndex:1,pageSize:10,gridMsg:'你好'
 * 	,rows:[{name:'jim',age:22},{name:'Tom',age:33}]
 * }
 */
FDTableView.prototype.processData = function(resultData) {
	this.resultData = resultData;
	
	this.removeAllData();
	
	if((this.resultData[GlobalParams.serverRowsName] || []).length > 0) {
		this._buildGridData();
	}else{
		this.showNoResultMsg();
	}
	this._refreshPaginationInfo(resultData);
}

FDTableView.prototype.renderTo = function(domId) {
	this._initTableDom();
	
	var desDom = FDLib.getEl(domId) || document.body;
	
	desDom.appendChild(this.gridDomMap.gridDiv_3);
}

/**
 * 移除所有数据
 */
FDTableView.prototype.removeAllData = function() {
	this.gridDomMap.tbody_0.parentNode.removeChild(this.gridDomMap.tbody_0);
	this.gridDomMap.tbody_0 = document.createElement(FDTag.TBODY);
	this.gridDomMap.table_1.appendChild(this.gridDomMap.tbody_0);
}


FDTableView.prototype._setTrStyle = function(tr,rowIndex) {
	var className = "ui-widget-content";
	
	if(rowIndex % 2 === 0) {
		className += " pui-datatable-even";
	}else{
		className += " pui-datatable-odd";
	}
	
	tr.className = className;
}

FDTableView.prototype._buildHeadView = function() {
	return new FDHeadView(this.options,this.grid);	
}

FDTableView.prototype._buildPaginationView = function() {
	return new FDPaginationView(this.options,this.grid);	
}

FDTableView.prototype._refreshPaginationInfo = function(data) {
	this.paginationView.refreshPaginationInfo(data);
}

/**
 * 构建表格内容
 */
FDTableView.prototype._buildGridData = function() {
	this.hideTable();
	var rows = this.resultData[GlobalParams.serverRowsName] || [];
	var self = this;
	// 遍历后台返回的rows
	this.each(rows,function(rowData,rowIndex){
		self.insertRow(rowIndex,rowData);
	});
	this.showTable();
}

FDTableView.prototype.showNoResultMsg = function() {
	var tr = this.gridDomMap.tbody_0.insertRow(0);
	var td = tr.insertCell(0);
	var colsLen = this.getColsLen();
	
	td.innerHTML = this.options.noDataText;
	td.setAttribute('colspan',colsLen);
	td.setAttribute('align','center');
}

FDTableView.prototype.getColsLen = function() {
	var colums = this.options.columns.length;
	var selectOption = this.options.selectOption || {};
	
	if(selectOption.singleSelect || selectOption.multiSelect) {
		colums++;
	}
	if(this.options.actionButtons.length > 0) {
		colums++;
	}
	return colums;
}

/**
 * 插入行数据
 * @param rowIndex 行索引
 * @param cells 数组,存放这一行所有单元格的数据
 * [
 * 	{html:'单元格内容1',text:'列名1',name:'username1',style:'width:100px;'}
 * 	,{html:'单元格内容2',text:'列名2',name:'username2',style:'width:200px;'}
 * 	,{html:'单元格内容3',text:'列名3',name:'username3',style:'width:300px;'}
 * ]
 * @param rowData 行的json数据
 */
FDTableView.prototype.insertRow = function(rowIndex,rowData) {
	// 创建行
	var tr = this.gridDomMap.tbody_0.insertRow(rowIndex);
	this._setTrEvent(tr,rowData,rowIndex);
	this._setTrStyle(tr,rowIndex);
	// 执行行的render方法
	this.options.rowRender(rowData,tr,rowIndex);
	
	this._buildRowCellsHtml(rowData,tr,rowIndex);
}

FDTableView.prototype._setTrEvent = function(tr,rowData,rowIndex){
	var that = this;
	var clickRowHandler = this.options.onClickRow;
	
	FDLib.event.addEvent(tr,'click',function(){
		that.grid._bindClickRowClass(tr);
		clickRowHandler(rowData,rowIndex);
	});
	
}

FDTableView.prototype._clearAllSelected = function(className) {
	var rows = this.gridDomMap.tbody_0.rows;
	var domUtil = FDLib.dom;
	FDLib.util.each(rows,function(row){
		if(domUtil.hasClass(row,className)) {
			domUtil.removeClass(row,className);
			return false;
		}
	});
}

FDTableView.prototype._buildRowCellsHtml = function(rowData,tr,rowIndex) {
	this.each(this.cellViews,function(cellView,columnIndex){
		var td = tr.insertCell(columnIndex); // 创建TD
		// 单元格数据
		cellView.buildCellData(rowData,td,rowIndex,tr);
	});
}

FDTableView.prototype.showTable = function() {
	this.gridDomMap.table_1.style.display = "";
}

FDTableView.prototype.hideTable = function() {
	this.gridDomMap.table_1.style.display = "none";
}


/**
 * 初始化构单元格视图层的实例
 */
FDTableView.prototype._buildCellView = function() {
	var columns = this.options.columns;
	var cellViews = [];
	var self = this;
	cellViews = this._addRowSelectAbility(cellViews);
	
	this.each(columns,function(column){
		cellViews.push(new FDCellView(column,self.options));
	});
	
	cellViews = this._addActionButtonAbility(cellViews);
	
	return cellViews;
}

FDTableView.prototype._addRowSelectAbility = function(cellViews) {
	if(this.multiSelect() || this.singleSelect()) {
		cellViews.push(new FDRowSelectView(this.options.selectOption,this.options));
	}
	return cellViews;
}



FDTableView.prototype._addActionButtonAbility = function(cellViews) {
	var actionButtons = this.options.actionButtons;
	if(FDLib.util.isArray(actionButtons) && actionButtons.length > 0){
		cellViews.push(new FDButtonView(this.options.actionColumnConfig,this.options));
	}
	
	return cellViews;
}

FDTableView.prototype.multiSelect = function() {
	return this.options.selectOption.multiSelect;
}

/**
 * 是否单选
 */
FDTableView.prototype.singleSelect = function() {
	return this.options.selectOption.singleSelect;
}

FDTableView.prototype._initTableDom = function() {
	this._initFrame();
	this._initHeadDom();
	this._initPaginDom();
	
	this.setStyle();
	
	this._initTableSize();
}

/**
 * 初始化表格框架.
 * 数字下标表示嵌套的层,0表示最内层,1在0的外层,以此类推
 */
FDTableView.prototype._initFrame = function() {
	this.gridDomMap.gridDiv_3 = document.createElement(FDTag.DIV);
	this.gridDomMap.tableDiv_2 = document.createElement(FDTag.DIV);
	this.gridDomMap.table_1 = document.createElement(FDTag.TABLE);
	this.gridDomMap.tbody_0 = document.createElement(FDTag.TBODY);
	
	this.gridDomMap.table_1.appendChild(this.gridDomMap.tbody_0);
	this.gridDomMap.tableDiv_2.appendChild(this.gridDomMap.table_1);
	this.gridDomMap.gridDiv_3.appendChild(this.gridDomMap.tableDiv_2);
}


/**
 * 设置样式
 */
FDTableView.prototype.setStyle = function() {
	this.gridDomMap.gridDiv_3.className = "pui-datatable ui-widget";
	this.gridDomMap.tbody_0.className = "pui-datatable-data";
	this.gridDomMap.tableDiv_2.className = "pui-datatable-scrollable-body";
}

FDTableView.prototype._initHeadDom = function() {
	this.headView.buildHead();
}

FDTableView.prototype._initPaginDom = function() {
	this.paginationView.buildPagination();
}

FDTableView.prototype._initTableSize = function() {
	var width = this.options.width;
	var height = this.options.height;
	if(width) {
		this.gridDomMap.gridDiv_3.style.width = FDLib.util.getPX(width);
	}
	if(height) {
		this.gridDomMap.tableDiv_2.style.height = FDLib.util.getPX(height);
	}
}

FDTableView.prototype._resetHeight = function() {
	this.gridDomMap.tableDiv_2.style.height = 'auto';
}


