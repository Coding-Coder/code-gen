/**
 * 行选择
 * 2012-9-10
 * @private
 */
var FDRowSelectView = function(selectOption,options) {
	FDLib.implement(this,Cell);
	this.selectOption = selectOption;
	this.options = options;
	this.id = options.id;
	this.grid = options.getGrid();
	selectOption.name = selectOption.name || 'grid_select_' + FDControl.generateCount();
}

// @override
FDRowSelectView.prototype.buildCellData = function(rowData,td,rowIndex,tr) {
	var selector = this._buildSelector(rowData,rowIndex,tr);
	td.appendChild(selector);
	var onload = this.selectOption.onload;
	
	if(FDLib.util.isFunction(onload)){
		onload(rowData,selector,rowIndex,tr);
	}
	
	td.style.width = '20px';
	td.setAttribute('align','center');
}

FDRowSelectView.prototype._buildSelector = function(rowData,rowIndex,tr) {
	var self = this;
	var selectType = this.selectOption.singleSelect ? "radio" : "checkbox";
	var selector = this._buildSelectInput(selectType,rowData);
	
	// 自定义事件
	var onclickHandler = this.selectOption.onclick;
	// 设置事件
	
	selector.onclick = function() {
		// 执行自定义事件
		if(FDLib.util.isFunction(onclickHandler)) {
			onclickHandler(rowData,selector,rowIndex,tr);
		}
		if(this.checked) { // 如果勾选
			self.grid._doSelectHandler(selector,tr);
		}else{
			self.grid._doNoSelectedHandler(selector,tr);
		}
		
		if(self.selectOption.cache) {
			if(selector.type == 'radio') {
				self.grid.resetSelectCache();
			}
			self.grid.getSelectCache()[this.value] = this.checked ? rowData : false;
		}
		
	}
	
	selector.setSelect = function(checked) {
		selector.checked = !!checked;
		selector.onclick();
	}
	
	if(selector.checked) { // 如果勾选
		self.grid._doSelectHandler(selector,tr);
	}else{
		self.grid._doNoSelectedHandler(selector,tr);
	}
	
	return selector;
}

FDRowSelectView.prototype._buildSelectInput = function(selectType,rowData) {
	var selector = document.createElement(FDTag.INPUT);
	selector.setAttribute('type',selectType);
	selector.setAttribute('name',this.selectOption.name);
	selector.style.cursor = 'pointer';
	var idValue = rowData[this.id];
	if(idValue){
		selector.value = idValue;
	}
	
	if(this.selectOption.cache) {
		selector.checked = this.grid.isInCache(rowData,this.id);
	}
	
	return selector;
}

