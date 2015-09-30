/**
 * 构建表格head的select项
 * @param column: 
 * { text:"姓名",width:100,style:'text-align:100px;'
 *  }
 * @private
 */
var FDSelectHeadCellView = function(selectOption,options) {
	this.selectOption = selectOption;
	this.options = options;
	this.grid = options.getGrid();
}

FDLib.extend(FDSelectHeadCellView,FDHeadCellView);

FDSelectHeadCellView.prototype.buildCellData = function(th) {
	if(this.selectOption.multiSelect) {
		var selector = this._buildSelector(th);
		if(this.selectOption.hideCheckAll){
			FDLib.dom.hideDom(selector);
		}
		this.grid.checkAllInput = selector;
		th.appendChild(selector);
	}else{
		th.innerHTML = "&nbsp;";
	}
	th.style.width = '20px';
	th.setAttribute('align','center');
}

FDSelectHeadCellView.prototype._buildSelector = function(th) {
	var self = this;
	var selector = document.createElement(FDTag.INPUT);
	selector.setAttribute('type','checkbox');
	selector.style.cursor = 'pointer';
	
	selector.onclick = function(){
		var selectors = document.getElementsByName(self.selectOption.name);
		var checked = this.checked ? 'checked' : '';
		
		FDLib.util.each(selectors,function(sel,i){
			if(sel.disabled) {
				return;
			}
			if(sel.checked == checked) {
				return;
			}
			sel.checked = checked;
			sel.onclick();
		});
	}
	
	return selector;
}

