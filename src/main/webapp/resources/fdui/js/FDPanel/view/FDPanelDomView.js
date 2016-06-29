/**
 * Panel控件视图层
 * 2015-3-16
 */
var FDPanelDomView = function(options){
	this.options = options;
	// 目标节点
	this.targetDom = this.buildTargetDom();
	
	this.initPanel();
	
	this.render();
}

FDPanelDomView.prototype = {
	initPanel:function() {
		this.panel = this.buildPanel();
		this.titleBar = this.buildTitleBar();
		this.title = this.buildTitle();
		this.content = this.buildContent();
		
		this.titleBar.appendChild(this.title);
		
		if(this.options.closeable){
			this.closeBtn = this.buildCloseBtn();
			this.titleBar.appendChild(this.closeBtn);
		}
		if(this.options.toggleable){
			this.toggleBtn = this.buildToggleBtn();
			this.titleBar.appendChild(this.toggleBtn);
		}
		
		this.panel.appendChild(this.titleBar);
		this.panel.appendChild(this.content);
		
		this._initSize();
	}
	,setTitle:function(title){
		this.title.innerHTML = title;
	}
	,setWidth:function(width) {
		if(FDLib.util.isString(width)) {
			this.content.style.width = width;
		}
	}
	,setHeight:function(height) {
		if(FDLib.util.isString(height)) {
			this.content.style.height = height;
		}
	}
	,setContent:function(content) {
		this.content.innerHTML = content;
	}
	,render:function(domId){
		if(FDRight.checkByCode(this.options.operateCode)) {
			this.content.appendChild(this.targetDom);
			
			if(domId){
				this.options.domId = domId;
			}
			var dom = FDLib.getEl(this.options.domId) || document.body;
			
			dom.appendChild(this.panel);
		}
	}
	,close:function() {
		this.panel.style.display = 'none';
	}
	,hide:function(){
		this.close();
	}
	// 显示窗体
	,show:function() {
		// 显示内容
		this.targetDom.style.display = 'block';
		// 显示整个窗体
		this.panel.style.display = 'block';
	}
	,buildTargetDom:function() {
		if(this.options.contentId){
			var cont =  FDLib.getEl(this.options.contentId);
			if(!cont){
				throw Error('未找到' + this.options.contentId);
			}
			cont.style.display = "none";
			return cont;
		}else{
			throw new Error('没有指定contentId,当前contentId值为:' + this.options.contentId);
		}
	}
	,buildPanel:function() {
		var panel = this.createEl(FDTag.DIV,this.getPanelClassName());
		panel.style.display = "none";
		return panel;
	}
	,buildTitleBar:function() {
		var titleBar = this.createEl(FDTag.DIV,this.getTitleBarClassName());
		titleBar.style.fontSize = '12px';
		return titleBar;
	}
	,buildTitle:function() {
		var title = this.createEl(FDTag.SPAN,this.getTitleClassName());
		// 标题文字不可选中
		title.setAttribute('unselectable','on');
		title.setAttribute('onselectstart','return false;');
		title.style.cssText = '-moz-user-select:none;';
		if(this.options.title){
			title.innerHTML = this.options.title;
		}
		return title;
	}
	,buildCloseBtn:function() {
		var that = this;
		if(this.options.closeable){
			var closeBtn = this.createEl(FDTag.A,this.getTitleBarBtnClassName());
			
			FDLib.event.addEvent(closeBtn,'click',function(e){
				that.close();
				e.preventDefault();
				e.stopPropagation();
			});
			
			var closeIcon = this.createEl(FDTag.SPAN,this.getCloseIconClassName());
			closeBtn.appendChild(closeIcon);
			
			FDLib.addHoverEffect(closeBtn);
			
			return closeBtn;
		}else{
			return this._getEmptySpan();
		}
	}
	,buildToggleBtn:function() {
		var that = this;
		if(this.options.toggleable){
			var toggleBtn = this.createEl(FDTag.A,this.getTitleBarBtnClassName());
			FDLib.event.addEvent(toggleBtn,'click',function(e){
				that.slideToggle();
				e.preventDefault();
				e.stopPropagation();
			});
			var icon = this.getToggleIcon();
			toggleBtn.appendChild(icon);
			
			FDLib.addHoverEffect(toggleBtn);
			
			if(this.options.isExpand) {
				toggleBtn.title = "点击收缩";
			}else{
				toggleBtn.title = "点击展开";
			}
			
			return toggleBtn;
		}else{
			return this._getEmptySpan();
		}
	}
	,getToggleIcon:function(){
		if(!this.toggleIcon){
			this.toggleIcon = this.createEl(FDTag.SPAN,this.getToggleIconClassName());
		}
		return this.toggleIcon;
	}
	,buildContent:function() {
		return this.createEl(FDTag.DIV,this.getContentClassName());;
	}
	,slideToggle:function() {
		if(this.isExpand()) {
			this.collapse();
		}else{
			this.expand();
		}
		return false;
	}
	,expand:function() {
		var target = this.toggleBtn;
		this.content.style.display = 'block';
		this.options.isExpand = true;
		target.title = "点击收缩";
		var icon = this.getToggleIcon();
		FDLib.dom.removeClass(icon,'ui-icon-plusthick');
		FDLib.dom.addClass(icon,'ui-icon-minusthick');
		this.afterExpand();
	}
	,unexpand:function() {
		this.collapse();
	}
	,collapse:function() {
		var target = this.toggleBtn;
		this.content.style.display = 'none';
		this.options.isExpand = false;
		target.title = "点击展开";
		var icon = this.getToggleIcon();
		FDLib.dom.addClass(icon,'ui-icon-plusthick');
		FDLib.dom.removeClass(icon,'ui-icon-minusthick');
		this.afterCollapse();
	}
	,afterExpand:function() {
		
	}
	,afterCollapse:function(){
		
	}
	,isExpand:function() {
		var options = this.options;
		var toggleable = options.toggleable
		return !toggleable || (options.isExpand && toggleable);
	}
	
	,getTitleBarBtnClassName:function() {
		return 'pui-panel-titlebar-icon ui-corner-all ui-state-default';
	}
	,getTitleClassName:function() {
		return 'ui-panel-title';
	}
	,getPanelClassName:function() {
		return 'pui-panel ui-widget ui-widget-content ui-corner-all';
	}
	,getTitleBarClassName:function() {
		return 'pui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all';
	}
	,getContentClassName:function() {
		return 'pui-panel-content ui-widget-content';
	}
	,getCloseIconClassName:function(){
		return 'ui-icon ui-icon-closethick';
	}
	,getToggleIconClassName:function() {
		return 'ui-icon ui-icon-minusthick';
	}
	,createEl:function(elName,className){
		var el = document.createElement(elName);
		el.className = className;
		return el;
	}
	,_getEmptySpan:function() {
		return this.createEl(FDTag.SPAN,'');
	}
	,_initSize:function() {
		var width = this.options.width;
		var height = this.options.height;
		this.setWidth(width);
		this.setHeight(height);
	}
}
