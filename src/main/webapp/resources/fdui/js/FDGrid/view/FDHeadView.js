/**
 * 表格列名的装饰类
 * @private
 */
var FDHeadView = function(options,grid) {
	this.grid = grid;
	this.options = options;
	this.gridDomMap = this.options.gridDomMap;
	
	this.headCellViews = null;
	
	this._initHeadCellViews();
}

/**
 * 构建表头
 */
FDHeadView.prototype.buildHead = function() {
	this.gridDomMap.headThead_0 = this.gridDomMap.table_1.createTHead();
	this._buildHeadHtml(this.gridDomMap.headThead_0);
}

/**
 * 构建head内容
 */
FDHeadView.prototype._buildHeadHtml = function(thead) {
	var cellViews = this.headCellViews;
	FDLib.util.each(cellViews,function(cellView,columnIndex){
		var th = document.createElement(FDTag.TH)
		th.className = "ui-state-default";
		thead.appendChild(th);
		// 单元格数据
		cellView.buildCellData(th,thead);
	});
}

FDHeadView.prototype._initHeadCellViews = function() {
	this.headCellViews = [];
	var options = this.options;
	var columns = options.columns;
	var self = this;
	// 如果有选择列
	this._addSelectView();
	
	FDLib.util.each(columns,function(column){
		self.headCellViews.push(new FDHeadCellView(column,options));
	});
	
	// 如果有操作列
	this._addButtonView(options);
}

FDHeadView.prototype._addSelectView = function() {
	var selectOption = this.options.selectOption;
	if(!selectOption){
		return;
	}
	if(selectOption.multiSelect || selectOption.singleSelect) {
		this.headCellViews.push(new FDSelectHeadCellView(selectOption,this.options));
	}
}

FDHeadView.prototype._addButtonView = function(options) {
	if(options.actionButtons.length > 0) {
		this.headCellViews.push(new FDHeadCellView(this.options.actionColumnConfig,options));
	}
}

