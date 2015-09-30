/**
 * 构建表格head的view
 * @param column: 
 * { text:"姓名",style:{width:100}
 *  }
 * @private
 */
var FDHeadCellView = function(column,options) {
	this.column = column;
	this.options = options;
	this.upTxt = "▲";
	this.downTxt = "▼";
	this.grid = options.getGrid();
}

FDLib.extend(FDHeadCellView,FDCellView);

FDHeadCellView.prototype.buildCellData = function(td,tr) {
	var style =  this.getStyle();
	td.innerHTML = this.column.text; // 设置TD内容
	this._buildSortButton(td);
	FDLib.dom.bindDomStyle(td,style);
}

// 构建排序按钮
FDHeadCellView.prototype._buildSortButton = function(td) {
	if(this.column.sortName) {
		// 设置当前排序方式
		this.currentSortOrder = this.grid.getSortOrder() || "DESC";
		
		var sortClickBtn = this._buildTagA();
		
		this._initTagAEvent(sortClickBtn);
				
		td.appendChild(sortClickBtn);
	}
}

FDHeadCellView.prototype._buildTagA = function() {
	var sortClickBtn = document.createElement(FDTag.A);
	sortClickBtn.href = "javascript:void(0)";
	sortClickBtn.innerHTML 
		= (this.currentSortOrder == "DESC")	? this.downTxt : this.upTxt;
		
	return sortClickBtn;
}

FDHeadCellView.prototype._initTagAEvent = function(a) {
	var self = this;
	var sortName = this.column.sortName;
	FDLib.event.addEvent(a,"click",function(e){
		var btn = e.target;
		if(self.currentSortOrder == 'ASC') {
			btn.innerHTML = self.downTxt;
			self.currentSortOrder = "DESC";
		}else{
			btn.innerHTML = self.upTxt;
			self.currentSortOrder = "ASC";
		}		
		self.grid.sort(sortName,self.currentSortOrder);
	});
}

