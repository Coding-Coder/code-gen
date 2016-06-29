/**
 * 面板视图层,已废弃,改用FDPanelDomView
 * 2012-8-12
 * @deprecated
 * @private
 */
var FDPanelView = function(options) {
	this.options = options;
	this.panelCount = FDControl.generateCount();
	FDPanelView.panelMap[this.panelCount] = this;
	
	this.panelContentDivId = this.options.domId + '_panelContentDivId_' + this.panelCount;
	this.titleDivId = this.options.domId + '_titleDivId_' + this.panelCount;
	this.contentId = this.options.domId + '_contId_' + this.panelCount;
	this.titleId = this.options.domId + '_titleId_' + this.panelCount;
	this.toggleBtnId = this.options.domId + 'toggleBtnId' + this.panelCount;
	this.closeBtnId = this.options.domId + 'closeBtnId' + this.panelCount;
	
	
	this.panelDiv = document.createElement(FDTag.DIV);
	this.panelDiv.style.display = 'none';
	
	this.titleDiv;
	this.panelContentDiv;
	this.titleH3;
	
	this.buildPanel();
	
	this._setSize();
	
	if(!this.isExpand()) {
		this.unexpand();
	}
	
	if(this.options.closeable){
		FDLib.getEl(this.closeBtnId).style.display = "block";
	}
	if(this.options.toggleable){
		this.getToggleTarget().style.display = "block";
	}
}

FDPanelView.panelCount = 0;

FDPanelView.panelMap = {};


FDPanelView.prototype = {
	show:function() {
		this.panelDiv.style.display = '';
	}
	,close:function() {
		this.panelDiv.style.display = 'none';
		return false;
	}
	,slideToggle:function() {
		if(this.isExpand()) {
			this.unexpand();
		}else{
			this.expand();
		}
		return false;
	}
	,expand:function() {
		var target = this.getToggleTarget();
		this.getContentDiv().style.display = 'block';
		this.options.isExpand = true;
		target.title = "点击收缩";
		FDLib.dom.removeClass(target,'ui-icon-plusthick');
		FDLib.dom.addClass(target,'ui-icon-minusthick');
	}
	,unexpand:function() {
		var target = this.getToggleTarget();
		this.getContentDiv().style.display = 'none';
		this.options.isExpand = false;
		target.title = "点击展开";
		FDLib.dom.addClass(target,'ui-icon-plusthick');
		FDLib.dom.removeClass(target,'ui-icon-minusthick');
	}
	,isExpand:function() {
		var options = this.options;
		var isSlide = options.isSlide
		return !isSlide || (options.isExpand && isSlide);
	}
	,setWidth:function(width) {
		if(FDLib.util.isString(width)) {
			this.getPanelContentDiv().style.width = width;
		}
	}
	,setHeight:function(height) {
		if(FDLib.util.isString(height)) {
			this.getContentDiv().style.height = height;
		}
	}
	,setContent:function(content) {
		this.getContentDiv().innerHTML = content;
	}
	,appendContentChild:function(dom) {
		this.getContentDiv().appendChild(dom);
	}
	,getContentDiv:function() {
		return FDLib.getEl(this.contentId);
	}
	,getPanelDiv:function() {
		return this.panelDiv;
	}
	,setTitle:function(title) {
		if(!this.titleH3) {
			this.titleH3 = FDLib.getEl(this.titleId);
		}
		this.titleH3.innerHTML = title;
	}
	,getTitleDiv:function() {
		if(!this.titleDiv) {
			this.titleDiv = FDLib.getEl(this.titleDivId);
		}
		return this.titleDiv;
	}
	,getToggleTarget:function() {
		return FDLib.getEl(this.toggleBtnId);
	}
	,getPanelContentDiv:function() {
		if(!this.panelContentDiv) {
			this.panelContentDiv = FDLib.getEl(this.panelContentDivId);
		}
		return this.panelContentDiv;
	}
	,setStyle:function(style) {
		if(FDLib.util.isString(style)) {
			this.panelDiv.className = style;
		}
	}
	,buildPanel:function() {
		this._initPanelDivHtml();
		
		var dom = this.getContentDom();
		// 在目标节点外层加个div
		wrap = FDLib.dom.wrap(dom,'<div></div>');
		// 克隆目标节点
		var domClone = dom.cloneNode(true);
		// 添加目标节点
		this.appendContentChild(domClone);
		// 替换目标节点
		wrap.replaceChild(this.panelDiv,dom);
	}
	,getContentDom:function() {
		var contDiv = FDLib.getEl(this.options.domId);
		if(!contDiv) {
			throw new Error('找不到窗体内容,请设置正确的domId,['+this.options.domId+']');
		}
		return contDiv;
	}
	,_initPanelDivHtml:function() {
		var panelFrameTemplate = this.getPanelDivTemplate();
		
		var panelHtml = FDLib.string.format(panelFrameTemplate
			,this._getTitleAndContentObj());
		
		this.panelDiv.innerHTML = panelHtml;
		
		document.body.appendChild(this.panelDiv);
	}
	,_setSize:function() {
		var width = this.options.width;
		var height = this.options.height;
		this.setWidth(width);
		this.setHeight(height);
	}
	,_getTitleAndContentObj:function() {
		return {
			title:this.options.title
			,toggleHandlerArea:this.getToggleHandlerArea()
			,closeHandlerArea:this.getCloseHandlerArea()
			,titleDivId:this.titleDivId
			,panelContentDivId:this.panelContentDivId
			,titleId:this.titleId
			,contentId:this.contentId
			,panelBoxId:this.panelBoxId
			,toggleBtnId:this.toggleBtnId
			,closeBtnId:this.closeBtnId
		};
	}
	,getToggleHandlerArea:function() {
		if(this.options.isSlide) {
			var toggleFunc = 'FDPanelView.panelMap['+this.panelCount+'].slideToggle()';
			return 'onclick="'+toggleFunc+'"';
		}
		
		return '';
	}
	,getCloseHandlerArea:function() {
		var toggleFunc = 'FDPanelView.panelMap['+this.panelCount+'].close()';
		return 'onclick="'+toggleFunc+'"';
	}
	,getPanelDivTemplate:function() {
		return FDPanelView.panelFrameTemplate;
	}
};

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
