/**
 * 分页视图,负责显示分页按钮,分页信息
 * @private
 */
var FDPaginationView = function(options,grid) {
	this.grid = grid;
	this.options = options;
	this.gridDomMap = this.options.gridDomMap;
	this.settingView = new FDSettingView(this.options);
	this.paginInfoDiv;
	
	this.firstBtn = null;
	this.prevBtn = null;
	this.nextBtn = null;
	this.lastBtn = null;
}

FDPaginationView.prototype.refreshPaginationInfo = function(data) {
	if(this.options.showPaging){
		this.options.total = parseInt(data[GlobalParams.serverTotalName] || 0);
		this.options.pageIndex = parseInt(data[GlobalParams.serverPageIndexName] || 1);
		this.options.pageSize =  parseInt(data[GlobalParams.serverPageSizeName] || 10);
		this.options.pageCount = FDPaginationView.calcPageCount(this.options.pageSize,this.options.total);
		this.paginInfoDiv.innerHTML = '&nbsp;&nbsp;第'+this.options.pageIndex+'/'+this.options.pageCount+'页，共'+this.options.total+'条数据&nbsp;&nbsp;';
		this.pageSizeSelect.setValue(this.options.pageSize);
		this._initBtnState();
	}
}
//分页数算法:页数 = (总记录数  +  每页记录数  - 1) / 每页记录数
FDPaginationView.calcPageCount = function(pageSize,total) {
	return pageSize == 0 ? 1 : parseInt( (total  +  pageSize - 1) / pageSize );
}

FDPaginationView.prototype._initBtnState = function(data) {
	if(this.options.pageIndex == 1){
		FDLib.dom.addClass(this.firstBtn,'ui-state-disabled');
		FDLib.dom.addClass(this.prevBtn,'ui-state-disabled');
	}else{
		FDLib.dom.removeClass(this.firstBtn,'ui-state-disabled');
		FDLib.dom.removeClass(this.prevBtn,'ui-state-disabled');
	}
	
	if(this.options.pageIndex == this.options.pageCount){
		FDLib.dom.addClass(this.nextBtn,'ui-state-disabled');
		FDLib.dom.addClass(this.lastBtn,'ui-state-disabled');
	}else{
		FDLib.dom.removeClass(this.nextBtn,'ui-state-disabled');
		FDLib.dom.removeClass(this.lastBtn,'ui-state-disabled');
	}
}

FDPaginationView.prototype.hide = function() {
	if(this.gridDomMap.pageDiv_3){
		FDLib.dom.hideDom(this.gridDomMap.pageDiv_3);
	}
}

FDPaginationView.prototype.show = function() {
	if(this.gridDomMap.pageDiv_3){
		FDLib.dom.showDom(this.gridDomMap.pageDiv_3);
	}
}

/**
 * 构建分页
 */
FDPaginationView.prototype.buildPagination = function() {
	if(!this.gridDomMap.pageDiv_3) {
		
		this._initPaginDom();
		
		this._buidlPaginButtons();
	
		this._appendPaginToDiv();
	}
}

FDPaginationView.prototype._initPaginDom = function() {
	this.gridDomMap.pageDiv_3 = document.createElement(FDTag.DIV);
	this.gridDomMap.pageDiv_3.className = "pui-paginator ui-widget-header";
	
	this.paginInfoDiv = document.createElement(FDTag.DIV);
}

FDPaginationView.prototype._appendPaginToDiv = function() {
	this.gridDomMap.gridDiv_3.appendChild(this.gridDomMap.pageDiv_3);
}

FDPaginationView.prototype._buidlPaginButtons = function() {
	// 显示分页
	if(this.options.showPaging) {
		this._buildPageSizeSelector();
		this._buildFirstPageButton();
		this._buildPrePageButton();
		this._buildNextPageButton();
		this._buildLastPageButton();
		this._buildResultInfo();
	}
	
	if(this.options.showSetting) {
		this._buildSettingButton();
	}
	
	if(!this.options.showPaging && !this.options.showSetting) {
		this.hide();
	}
}

FDPaginationView.prototype._buildPageSizeSelector = function() {
	var span = document.createElement(FDTag.SPAN);
	span.className = "pui-paginator-last pui-paginator-element";
	var self = this;
		
	this.pageSizeSelect = new FDSelectBox({items:this._getPageSizeItems(),showDefault:false});
	
	this.pageSizeSelect.addEvent('change',function(){
		self.options.pageSize = this.value;
		self.options.pageIndex = 1;
		self.grid.refresh();
	});
	
	this.pageSizeSelect.renderToDom(span);
	
	this.gridDomMap.pageDiv_3.appendChild(span);
}

FDPaginationView.prototype._getPageSizeItems = function() {
	var pageSizeParam = this.options.pageSizeParam;
	var selectItems = [];
	
	FDLib.util.each(pageSizeParam,function(pageSize){
		selectItems.push({value:pageSize,text:'每页' + pageSize + '条'});
	});
	
	return selectItems;
}

FDPaginationView.prototype._buildFirstPageButton = function(firstTR,cellIndex) {
	var self = this;
	this.firstBtn = this._createButton({
		btnClassName:'pui-paginator-first pui-paginator-element ui-state-default ui-corner-all'
		,iconClassName:'ui-icon ui-icon-seek-first'
		,title:'首页'
	});
	
	FDLib.event.addEvent(this.firstBtn,'click',function(){
		self.grid.moveFirst();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(this.firstBtn);
}

FDPaginationView.prototype._buildPrePageButton = function(firstTR,cellIndex) {
	var self = this;
	this.prevBtn = this._createButton({
		btnClassName:'pui-paginator-prev pui-paginator-element ui-state-default ui-corner-all'
		,iconClassName:'ui-icon ui-icon-seek-prev'
		,title:'上一页'
	});
	
	FDLib.event.addEvent(this.prevBtn,'click',function(){
		self.grid.movePreview();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(this.prevBtn);
}

FDPaginationView.prototype._buildNextPageButton = function(firstTR,cellIndex) {
	var self = this;
	this.nextBtn = this._createButton({
		btnClassName:'pui-paginator-next pui-paginator-element ui-state-default ui-corner-all'
		,iconClassName:'ui-icon ui-icon-seek-next'
		,title:'下一页'
	});
	
	FDLib.event.addEvent(this.nextBtn,'click',function(){
		self.grid.moveNext();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(this.nextBtn);
}

FDPaginationView.prototype._buildLastPageButton = function(firstTR,cellIndex) {
	var self = this;
	this.lastBtn = this._createButton({
		btnClassName:'pui-paginator-last pui-paginator-element ui-state-default ui-corner-all'
		,iconClassName:'ui-icon ui-icon-seek-end'
		,title:'尾页'
	});
	
	FDLib.event.addEvent(this.lastBtn,'click',function(){
		self.grid.moveLast();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(this.lastBtn);
}

FDPaginationView.prototype._createButton = function(btnData){
	var btn = document.createElement(FDTag.SPAN);
	btn.className = btnData.btnClassName;
	
	var icon = document.createElement(FDTag.SPAN);
	icon.className = btnData.iconClassName;
	icon.innerHTML = "p";
	
	btn.appendChild(icon);
	
	if(btnData.title){
		btn.setAttribute('title',btnData.title);
	}
	
	FDLib.event.addEvent(btn,'mouseover',function(e){
		if(!FDLib.dom.hasClass(btn,'ui-state-disabled')){
			FDLib.dom.addClass(btn,'ui-state-hover');
		}
		e.stopPropagation();
	});
	FDLib.event.addEvent(btn,'mouseout',function(e){
		FDLib.dom.removeClass(btn,'ui-state-hover');
		e.stopPropagation();
	});
	
	return btn;
}

FDPaginationView.prototype._buildResultInfo = function() {
	this.paginInfoDiv = document.createElement(FDTag.SPAN);
	this.gridDomMap.pageDiv_3.appendChild(this.paginInfoDiv);
}

FDPaginationView.prototype._buildSettingButton = function() {
	var self = this;
	var span = this._createNormalButton("设置");
	
	FDLib.event.addEvent(span,'click',function(){
		self.settingView.showWin();
	});
	
	this.gridDomMap.pageDiv_3.appendChild(span);
}

FDPaginationView.prototype._createNormalButton = function(btnText) {
	var span = document.createElement(FDTag.SPAN);
	span.className = "pui-paginator-last pui-paginator-element ui-state-default ui-corner-all";
	span.innerHTML = btnText;
	
	FDLib.event.addEvent(span,'mouseover',function(e){
		FDLib.dom.addClass(span,'ui-state-hover');
		e.stopPropagation();
	});
	FDLib.event.addEvent(span,'mouseout',function(e){
		FDLib.dom.removeClass(span,'ui-state-hover');
		e.stopPropagation();
	});
	
	return span;
}

