/**
 * 构建单元格的类
 * 
 * @param options 列的结构
 * { text:"姓名",name:"username",width:100,style:'text-align:100px;'
 * 	,render:function(data){return "aaa";} }
 * @private
 */
var FDCellView = function(column,options) {
	FDLib.implement(this,Cell);
	this.options = options;
	this.column = column;
}

/**
 * 构建表格单元格信息
 * @param rowIndex 当前行索引,从0开始
 * @param rowData 当前行的数据
 * @return 返回单元格信息. 数据格式为:
 * {html:'单元格内容',text:'列名',name:'username',style:{width:'100px'}}
 */
FDCellView.prototype.buildCellData = function(rowData,td,rowIndex,tr) {
	var html = rowData[this.column.name] || '';
	var style =  this.getStyle();
	
	if(FDLib.util.isFunction(this.column.render)){
		html = this.column.render(rowData,td,rowIndex);
	}
	
	td.innerHTML = html; // 设置TD内容
	
	FDLib.dom.bindDomStyle(td,style);
	// 文本在同一行
	if(this.column.textOneLine) {
		td.style.whiteSpace='nowrap';
	}else{
		td.style.wordWrap='break-word';
		td.style.whiteSpace = 'normal';
	}
	
}

FDCellView.prototype.getStyle = function() {
	var style =  this.column.style;
	// 不是自适应
	if(!this.options.fitColumns) {
		style = FDLib.util.apply(this.getColumnDefaultStyle(),this.column.style);
	}
	
	return style;
}

/**
 * 获取列选项的默认样式
 * @return 返回options.columnDefaultStyle的副本
 */
FDCellView.prototype.getColumnDefaultStyle = function(){
	return FDLib.util.clone(this.options.columnDefaultStyle);
}
