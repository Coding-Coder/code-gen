var FDWindowDomView = function(options) {
	FDWindowDomView.superclass.constructor.call(this,options);
	
	this.buttonPanel = null;
	
	this._createButtons();
	
	this.setDragable();
	
	this.setPanelClick();
}

FDLib.extend(FDWindowDomView,FDPanelDomView);

// zIndex初始值
FDWindowDomView.zIndex = 200;

/**
 * 获取下一个zIndex
 */
FDWindowDomView.getNextZ_Index = function() {
	return ++FDWindowDomView.zIndex;
}

/**
 * 打开窗体
 */
//@override
FDWindowDomView.prototype.show = function(callback) {
	
	if(this.options.modal) {
		this.showBgModal();
	}
	// 放在showBgModal()后面,确保zIndex始终比遮罩层的大
	this.addPanelZ_Index();
	
	FDWindowDomView.superclass.show.call(this);
	
	var afterShow = this.options.afterShow;
	
	if(FDLib.util.isFunction(afterShow)) {
		afterShow();
	}
	if(FDLib.util.isFunction(callback)){
		callback();
	}
}

// 增加z-index
FDWindowDomView.prototype.addPanelZ_Index = function() {
	this.panel.style.zIndex = FDWindowDomView.getNextZ_Index();
}

//@override
FDWindowDomView.prototype.close = function(callback) {
	this.hideBgModal();
	FDWindowDomView.superclass.close.call(this);
	if(FDLib.util.isFunction(callback)){
		callback();
	}
}

//@override
FDWindowDomView.prototype.afterExpand = function() {
	FDLib.dom.showDom(this.buttonPanel);
}

//@override
FDWindowDomView.prototype.afterCollapse = function(){
	FDLib.dom.hideDom(this.buttonPanel);
}


FDWindowDomView.prototype.hideBgModal = function() {
	this.getBgModal().style.display = 'none';
}

// 创建遮罩层
FDWindowDomView._createBgModal = function() {
	var bgModal = document.createElement(FDTag.DIV);
	
	bgModal.className = 'ui-widget-overlay';
	bgModal.style.display = 'none';
	
	return bgModal;
}

/**
 * 获取遮罩层
 */
FDWindowDomView.prototype.getBgModal = function() {
	if(!this.bgModal){
		this.bgModal = FDWindowDomView._createBgModal();
		document.body.appendChild(this.bgModal);
	}
	return this.bgModal;
}

FDWindowDomView.prototype.showBgModal = function() {
	var zIndex = FDWindowDomView.getNextZ_Index();
	var doc = document;
	var body = doc.body;
	var docEl = doc.documentElement;
		
	var clientHeight = docEl.clientHeight || body.clientHeight;
	var scrollHeight = docEl.scrollHeight || body.scrollHeight;
	var height = Math.max(clientHeight,scrollHeight);
	
	var bgModal = this.getBgModal();
	
	bgModal.style.height = height + 'px';
	
	bgModal.style.zIndex = zIndex;
	bgModal.style.display = 'block';
}

FDWindowDomView.prototype.moveTo = function(left,top) {
	this.panel.style.left = left + 'px';
    this.panel.style.top = top + 'px';
}

FDWindowDomView.prototype.setDragable = function() {
	if(this.couldMoveWindow()) {
		FDDragUtil.regist(this.panel,this.titleBar);
		// 移到屏幕中央
		this.moveToCenter();
	}else{
		FDDragUtil.destory(this.titleBar);
	}
}

FDWindowDomView.prototype.setPanelClick = function() {
	var that = this;
	FDLib.event.addEvent(this.panel,'mousedown',function(e){
		that.addPanelZ_Index();
	});
}

// 构建按钮
FDWindowDomView.prototype._createButtons = function() {
	var buttons = this.options.buttons;
	var buttonsInstaces = [];
	if(FDLib.util.isArray(buttons)) {
		FDLib.util.each(buttons,function(button,i){
			if(!(button instanceof FDButton)) {
				button = new FDButton(button);
				buttons[i] = button;
			}
			buttonsInstaces.push(button);
		});
		
		this._appendButtons(buttonsInstaces);
	}
}

FDWindowDomView.prototype._appendButtons = function(buttonInstances) {
	var that = this;
	if(buttonInstances.length > 0) {
		if(!this.buttonPanel){
			this.buttonPanel = this.createEl(FDTag.DIV,this.getButtonPanelClassName());
			this.panel.appendChild(this.buttonPanel);
		}
		this.buttonPanel.innerHTML = '';
		FDLib.util.each(buttonInstances,function(btnInstance){
			btnInstance.renderToDom(that.buttonPanel);
		});
	}
}

FDWindowDomView.prototype.moveToCenter = function() {
	var winWidth = this.options.width;
	var winHeight = this.options.height;
	FDDragUtil.moveToCenter(this.panel,winWidth,winHeight);
}

FDWindowDomView.prototype.couldMoveWindow = function() {
	return this.options.dragable;
}

FDWindowDomView.prototype.getTitleBarBtnClassName = function() {
	return 'pui-dialog-titlebar-icon pui-dialog-titlebar-close ui-corner-all';
}
FDWindowDomView.prototype.getTitleClassName = function() {
	return 'pui-dialog-title';
}
FDWindowDomView.prototype.getPanelClassName = function() {
	var className = 'pui-dialog ui-widget ui-widget-content ui-corner-all pui-shadow';
	if(this.options.dragable){
		className += ' ui-draggable';
	}
	return className;
}
FDWindowDomView.prototype.getTitleBarClassName = function() {
	return 'pui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top';
}
FDWindowDomView.prototype.getContentClassName = function() {
	return 'pui-dialog-content ui-widget-content';
}
FDWindowDomView.prototype.getCloseIconClassName = function(){
	return 'ui-icon ui-icon-close';	
}
FDWindowDomView.prototype.getButtonPanelClassName = function(){
	return 'pui-dialog-buttonpane ui-widget-content ui-helper-clearfix';	
}
