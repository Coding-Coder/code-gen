/**
 * 窗体视图层
 * 2012-8-8
 * @private
 */
var FDWindowView = function(options) {
	FDWindowView.superclass.constructor.call(this,options);

	FDLib.dom.addClass(this.getPanelContentDiv(),'shadow');
	this.btnId = this.options.domId + 'btnId' + this.panelCount;

	//this._buildButtons();
	
	this._createBgModal();
	// 设置拖拽事件
	this.setDragable(this.options.dragable);
}

FDLib.extend(FDWindowView,FDPanelView);

// zIndex初始值
FDWindowView.zIndex = 200;

/**
 * 获取下一个zIndex
 */
FDWindowView.getNextZ_Index = function() {
	return ++FDWindowView.zIndex;
}

/**
 * 打开窗体
 */
//@override
FDWindowView.prototype.show = function() {
	if(this.options.modal) {
		this.showBgModal();
	}
	// 放在showBgModal()后面,确保zIndex始终比遮罩层的大
	this.getPanelDiv().style.zIndex = FDWindowView.getNextZ_Index();
	this.getPanelDiv().style.display = '';
	this._runAfterShowHandler();
}

//@override
FDWindowView.prototype.close = function() {
	this.hideBgModal();
	this.getPanelDiv().style.display = 'none';
	this._runAfterCloseHandler();
}

FDWindowView.prototype.moveTo = function(left,top) {
	this.getPanelDiv().style.left = left + 'px';
    this.getPanelDiv().style.top = top + 'px';
}

FDWindowView.prototype.setDragable = function() {
	var titleDiv = this.getTitleDiv();
	if(this.couldMoveWindow()) {
		FDDragUtil.regist(this.getPanelDiv(),titleDiv);
		// 移到屏幕中央
		this.moveToCenter();
	}else{
		FDDragUtil.destory(titleDiv);
	}
}

FDWindowView.prototype.moveToCenter = function() {
	FDDragUtil.moveToCenter(this.getPanelDiv());
}

FDWindowView.prototype.couldMoveWindow = function() {
	return this.options.dragable;
}

FDWindowView.prototype.showBgModal = function() {
	this.bgModal.style.display = '';
	this.bgModal.style.zIndex = FDWindowView.getNextZ_Index();
}

FDWindowView.prototype.hideBgModal = function() {
	this.bgModal.style.display = 'none';
}

//@override
FDWindowView.prototype.buildPanel = function() {
	
	this._buildWindowPanel();
	
	this._setContentChild();
}

// 构建按钮
FDWindowView.prototype._buildButtons = function() {
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

FDWindowView.prototype._appendButtons = function(buttonInstances) {
	if(buttonInstances.length > 0) {
		
		var btnDiv = this.getBtnDiv();
		FDLib.util.each(buttonInstances,function(btnInstance){
			btnInstance.renderToDom(btnDiv);
		});
	}
}

// 构建最外层div
FDWindowView.prototype._buildWindowPanel = function() {
	// 获取模板
	var panelFrameTemplate = this.getPanelDivTemplate();
	// 填充模板
	var panelHtml = FDLib.string.format(panelFrameTemplate
		,this._getTitleAndContentObj());

	this.getPanelDiv().innerHTML = panelHtml;
	
	document.body.appendChild(this.getPanelDiv());
}

// 设置窗体节点内容
FDWindowView.prototype._setContentChild = function() {
	var contDiv = FDLib.getEl(this.options.domId);
	if(!contDiv) {
		throw new Error('找不到窗体内容,请设置正确的domId');
	}
	this.appendContentChild(contDiv);
}

FDWindowView.prototype.getBtnDiv = function() {
	return FDLib.getEl(this.btnId);
}

// override
FDWindowView.prototype._getTitleAndContentObj = function() {
	var obj = FDWindowView.superclass._getTitleAndContentObj.call(this);
	obj.btnId = this.btnId;
	return obj;
}
//@override
FDWindowView.prototype.getCloseArea = function() {
	if(this.options.closeable) {
		var area = new JString();
		var closeFunc = 'FDPanelView.panelMap['+this.panelCount+'].close()';
		area.append('<span class="close"><a href="javascript:void(0);" onclick="'+closeFunc+'">')
			.append(this.options.closeText)
			.append('</a></span>');
			
		return area.toString();
	}
	
	return '';
}

FDWindowView.prototype._createBgModal = function() {
	var doc = document;
	this.bgModal = doc.createElement(FDTag.DIV);
	
	var height = Math.max(doc.documentElement.clientHeight,doc.body.scrollHeight);
	var color = this.options.modelColor;
	var opacity = this.options.modelOpacity;
	
	this.bgModal.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:"+height+"px;filter:Alpha(Opacity=" + (opacity * 100) + ");opacity:"+opacity+";background-color:"+color+";";
	this.bgModal.style.display = 'none';
	
	document.body.appendChild(this.bgModal);
}

FDWindowView.prototype._runAfterShowHandler = function() {
	var afterShow = this.options.afterShow;
	if(FDLib.util.isFunction(afterShow)) {
		afterShow();
	}
}

FDWindowView.prototype._runAfterCloseHandler = function() {
	var afterClose = this.options.afterClose;
	if(FDLib.util.isFunction(afterClose)) {
		afterClose();
	}
}

FDWindowView.prototype.getPanelDivTemplate = function() {
	return FDWindowView.panelFrameTemplate;
}

// 模板
FDPanelView.panelFrameTemplate = [
'<div id="{panelContentDivId}" class="pui-panel ui-widget ui-widget-content ui-corner-all">'
	,'<div id="{titleDivId}" class="pui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all">'
		,'<span id="{titleId}" class="ui-panel-title">{title}</span>'
		// 关闭按钮
		,'<a id="{closeBtnId}" {closeHandlerArea} style="display:none;" class="pui-panel-titlebar-icon ui-corner-all ui-state-default" href="#">'
			,'<span class="ui-icon ui-icon-closethick"></span>'
		,'</a>'
		// 伸缩按钮
		,'<a id="{toggleBtnId}" {toggleHandlerArea} style="display:none;" class="pui-panel-titlebar-icon ui-corner-all ui-state-default" href="#">'
			,'<span id="{toggleBtnId}" class="ui-icon ui-icon-minusthick"></span>'
		,'</a>'
	,'</div>'
	,'<div id="{contentId}" class="pui-panel-content ui-widget-content">'
	,'</div>'
,'</div>'
].join('');

// 模板
FDWindowView.panelFrameTemplate = [
'<div id="{panelContentDivId}" class="pui-dialog ui-widget ui-widget-content ui-corner-all pui-shadow ui-draggable ui-resizable">'
 ,'<div id="{titleDivId}" class="pui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">'
     ,'<span id="{titleId}" class="pui-dialog-title">{title}</span>'
     ,'<a id="{closeBtnId}" {closeHandlerArea} class="pui-dialog-titlebar-icon pui-dialog-titlebar-close ui-corner-all" href="#">'
       ,'<span class="ui-icon ui-icon-close"/>'
     ,'</a>'
     ,'<a id="{toggleBtnId}" {toggleHandlerArea} class="pui-dialog-titlebar-icon pui-dialog-titlebar-minimize ui-corner-all" href="#" role="button">'
       ,'<span class="ui-icon ui-icon-minus"/>'
     ,'</a>'
   ,'</div>'
   ,'<div id="{contentId}" class="pui-dialog-content ui-widget-content" style="height: auto; width: auto; display: block;"> '
   ,'</div>'
   ,'<div id={btnId} class="pui-dialog-buttonpane ui-widget-content ui-helper-clearfix" style="display: block;">'
   ,'</div>'
 ,'</div>'
].join('');