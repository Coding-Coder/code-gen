/**
 * 构建列按钮
 * @param column 
 * @param options 
 * {
 * 	text:'修改'
 * 	,onclick:function(rowData,rowIndex){}
 * 	,render:function(rowData,td,rowIndex){}
 * 	,showFun:function(data){}
 * }
 * @private
 */
var FDButtonView = function(column,options) {
	FDLib.implement(this,Cell);
	this.options = options;
	this.column = column;
	this.actionButtons = this.options.actionButtons;
}

FDLib.extend(FDButtonView,FDCellView);

// @override
FDButtonView.prototype.buildCellData = function(rowData,td,rowIndex,tr) {
	var self = this;
	var style =  this.getStyle();
	
	FDLib.util.each(this.actionButtons,function(button){
		
		if(FDRight.checkByCode(button.operateCode)) {
			var a = self._buildButton(button,rowData,rowIndex);
		
			if(a) {
				td.appendChild(a);
				FDLib.dom.bindDomStyle(td,style);
			}
		}
		
	});

}

/**
 * 构建一个a标签,如果不显示则返回undefined
 */
FDButtonView.prototype._buildButton = function(button,rowData,rowIndex) {
	if(this._isShowButton(button,rowData,rowIndex)) {
		var a = document.createElement(FDTag.A);
		a.style.marginLeft = '5px';
		a.style.marginRight = '5px';
		a.href = 'javascript:void(0)';
		a.innerHTML = button.text;
		FDLib.event.addEvent(a,'click',function(){
			button.onclick(rowData,rowIndex);
		});
		return a;
	}
}

/**
 * 是否显示按钮
 */
FDButtonView.prototype._isShowButton = function(button,rowData,rowIndex) {
	var isRenderable = this.options.isRenderable || true;
	if(!isRenderable) {
		return false;
	}
	var hasShowFunHandler = FDLib.util.isFunction(button.showFun);
	if(hasShowFunHandler) {
		return button.showFun(rowData,rowIndex);
	}
	return true;
}


