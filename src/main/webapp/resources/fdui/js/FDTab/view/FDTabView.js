/**
 * @private
 */
var FDTabView = function(options,tab) {
	this.options = options;
	// 保存li,key为value
	this.liStore = {};
	this.tab = tab;

	this.tabDiv = document.createElement(FDTag.DIV);
	this.tabDiv.className = 'pui-tabview ui-widget ui-widget-content ui-corner-all ui-hidden-container pui-tabview-top';
	
	this.ul = document.createElement(FDTag.UL);
	this.ul.className = 'pui-tabview-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all';
	this.ul.style.height = '32px';
	
	this.tabContent = document.createElement(FDTag.DIV);
	this.tabContent.className = 'pui-tabview-panels';
	
	this.tabDiv.appendChild(this.ul);
	this.tabDiv.appendChild(this.tabContent);
	
	this.checkedItem = null;
	
	this._buildTabEvent();
}

FDTabView.prototype = {
	/**
	 * 构建tab
	 * @param items 
	 */
	buildTab:function(items) {
		this._buildTabItem(items);
		
		this._renderToDesDom();
	}
	/**
	 * 显示整个tab
	 */
	,show:function() {
		this.tabDiv.style.display = 'block';
	}
	/**
	 * 隐藏整个tab
	 */
	,hide:function() {
		this.tabDiv.style.display = 'none';
	}
	,disable:function(item) {
		this._selectOtherItem(item);
		item.disable = true;
		var li = this._getLiByValue(item.value);
		li.className = this._getDisabledClassName();
		//li.getElementsByTagName('span')[0].style.cursor = 'default';
	}
	,enable:function(item) {
		item.disable = false;
		var li = this._getLiByValue(item.value);
		li.className = this._getLiClassName();
		//li.getElementsByTagName('span')[0].style.cursor = 'pointer';
	}
	,_getDisabledClassName:function(){
		return 'ui-state-disabled';
	}
	/**
	 * 移除所有的tab项
	 */
	,removeAll:function() {
		this._hideAllItemContent();
		// remove all li
		this.ul.innerHTML = '';
		// clear store
		this.liStore = {};
	}
	/**
	 * 移除某一个item
	 */
	,doRemoveItem:function(item) {
		var value = item.value;
		// hide contentDiv
		// 这里只隐藏div,不做删除
		// 如果删除div的话,会自定义的div删掉
		this._hideItemContent(item);
		// remove li
		var li = this._getLiByValue(value);
		li.parentNode.removeChild(li);
		// clear store
		this._clearLiStore(value);
		
	}
	/**
	 * 根据value移除一个item
	 * @param item 单个item项
	 */
	,removeItem:function(item) {
		if(this._isAbleOperate(item)) {
			this._selectOtherItem(item);
			this.doRemoveItem(item);
		}
	}
	/**
	 * 根据value值显示tab
	 * @param value item中的value
	 */
	,showItemByValue:function(value) {
		var item = this._getItemByValue(value);
		if(item) {
			// 始终执行onclick事件
			if(this._isAbleOperate(item)) {
				this._processClickEvent(item);
			}
			if(this._isAbleOperate(item) && !this.isChecked(item)) {
				this._selectItem(item);
				this._processChangeEvent(item);
			}
			// 刷新iframe
			this._refresh(item);
		}
	}
	// 将所有的items未选中
	,_unselectAllItems:function() {
		var itemStore = this._getItemStore();
		for(var value in itemStore) {
			var item = itemStore[value];
			// 如果不是禁用状态
			if(this._isAbleOperate(item)) {
				this._unselectItem(item);
			}
		}
	}
	,_isAbleOperate:function(item) {
		return item && !item.disable;
	}
	// 选中item
	,_selectItem:function(item) {
		if(item) {
			this._unselectAllItems();
			item.checked = true;
			FDLib.dom.addClass(this._getLiByValue(item.value),this._getSelectClassName());
			this._showItemContent(item);
		}
	}
	// 未选中
	,_unselectItem:function(item) {
		item.checked = false;
		FDLib.dom.removeClass(this._getLiByValue(item.value),this._getSelectClassName());
		this._hideItemContent(item);
	}
	,isChecked:function(item) {
		return item && item.checked;
	}
	,_getSelectClassName:function(){
		return 'pui-tabview-selected ui-state-active';
	}
	,_getLiClassName:function() {
		return 'ui-state-default ui-corner-top';
	}
	// 选择其它的item
	,_selectOtherItem:function(item) {
		var li = this._getLiByValue(item.value);
		// 如果当前的li已经被选中
		if(this.isChecked(item)) {
			// 获取当前LI左边或者右边的一个LI
			var otherLI = li.previousSibling || li.nextSibling;
			if(otherLI) {
				var otherLiValue = otherLI.getAttribute('value');
				this.showItemByValue(otherLiValue);
			}
		}
	}
	// 将tab定位在HTML节点上
	,_renderToDesDom:function() {
		if(FDRight.checkByCode(this.options.operateCode)) {
			var desDom = FDLib.getEl(this.options.domId);
			desDom.appendChild(this.tabDiv);
			this._selectItem(this.checkedItem || this.options.items[0]);
		}
	}
	// 构建选项卡
	,_buildTabItem:function(items) {
		var self = this;
		FDLib.util.each(items,function(item){
			var li = self._buildLI(item);
			self.ul.appendChild(li);
			self._storeLI(li,item.value);
			self._buildItemContent(item);
		});
	}
	// 根据value缓存li
	,_storeLI:function(li,value) {
		this.liStore[value] = li;
	}
	// 构建li
	,_buildLI:function(item) {
		var li = document.createElement(FDTag.LI);
		li.className = this._getLiClassName();
		li.setAttribute("value",item.value);
		li.innerHTML = FDLib.string.format(FDTabView.aTemplate,{text:item.text});
		this._addHoverEffect(li,item);
		if(item.closeable) {
			this._buildCloseButton(li);
		}
		
		if(item.checked){
			this.checkedItem = item;
		}
		
		return li;
	}
	,_addHoverEffect:function(li,item){
		var hoverClassName = 'ui-state-hover';
		var that = this;
		FDLib.event.addEvent(li,'mouseover',function(){
			if(that._isAbleOperate(item)){
				FDLib.dom.addClass(li,hoverClassName);
			}
		});
		FDLib.event.addEvent(li,'mouseout',function(){
			FDLib.dom.removeClass(li,hoverClassName);
		});
	}
	// 构建关闭按钮
	,_buildCloseButton:function(li) {
		var closeBtn = document.createElement(FDTag.SPAN);
		closeBtn.className = 'ui-icon ui-icon-close';
		li.appendChild(closeBtn);
	}
	// 构建item对应的内容
	,_buildItemContent:function(item) {
		var contentDiv = item.contentDiv;
		contentDiv.className = 'pui-tabview-panel ui-widget-content ui-corner-bottom';
		this.tabContent.appendChild(contentDiv);
		
		if(item.checked) {
			this._showItemContent(item);
		} else {
			this._hideItemContent(item);
		}
	}
	// 根据value清除li
	,_clearLiStore:function(value) {
		delete this.liStore[value];
	}
	// 添加Tab事件
	,_buildTabEvent:function() {
		var that = this;
		var toggleStyle = this.options.isHover ? 'mouseover' : 'click';
		// 添加tab的切换事件
		FDLib.event.addBatchEvent({
			// 监听ul下面所有的a
			superDom:this.ul,tagName:'A',eventName:toggleStyle
			,handler:function(target) {
				that._showItemHandler(target);
			}
		});
		// 添加tab的关闭事件
		FDLib.event.addBatchEvent({
			superDom:this.ul,tagName:'SPAN',eventName:'click'
			,handler:function(target) {
				that._closeItemHandler(target);
			}
		});
	}
	,_showItemHandler:function(target) {
		var parentNode = target.parentNode;
		var value = parentNode.getAttribute('value');
		this.showItemByValue(value);
	}
	,_closeItemHandler:function(target) {
		var parentNode = target.parentNode;
		var value = parentNode.getAttribute('value');
		if(this._isAbleOperate(this._getItemByValue(value))) {
			this.tab.removeItemByValue(value);
		}
	}
	,_processClickEvent:function(item) {
		var onclickHandler = item.onclick;
		if(FDLib.util.isFunction(onclickHandler)) {
			onclickHandler(this.tab,item);
		}
	}
	,_processChangeEvent:function(item) {
		var onchangeHandler = item.onchange;
		if(FDLib.util.isFunction(onchangeHandler)) {
			onchangeHandler(this.tab,item);
		}
	}
	// 刷新iframe
	,_refresh:function(item) {
		if(this._hasIframe(item)) {
			var iframe = item.iframe;
			if(this._isNeedRefresh(iframe,item)) {
				this._refreshIFrame(iframe,item);
			}
		}
	}
	// 显示item对应的content
	,_showItemContent:function(item) {
		item.contentDiv.style.display = "block";
	}
	// 隐藏某一个item
	,_hideItemContent:function(item) {
		item.contentDiv.style.display = "none";
	}
	// 隐藏全部内容
	,_hideAllItemContent:function() {
		var itemStore = this._getItemStore();
		for(var value in itemStore) {
			this._hideItemContent(itemStore[value]);
		}
	}
	// 是否有item
	,_hasIframe:function(item) {
		return item.iframe;
	}
	// 是否是第一次加载
	,_isFirstLoad:function(iframe) {
		return !iframe.src;
	}
	// 刷新iframe
	,_refreshIFrame:function(iframe,item) {
		iframe.src = item.url;
	}
	// 是否需要刷新
	,_isNeedRefresh:function(iframe,item) {
		if(this._isFirstLoad(iframe)) {
			return true;
		}
		return (FDLib.util.isString(item.url) && item.url && item.isRefresh);
	}
	// 获取itemStore
	,_getItemStore:function() {
		return this.options.itemStore;
	}
	// 通过value获取Item
	,_getItemByValue:function(value) {
		return this._getItemStore()[value];
	}
	// 通过value获取LI
	,_getLiByValue:function(value) {
		return this.liStore[value];
	}
}
// 关闭按钮模板
FDTabView.aTemplate = '<a href="javascript:void(0);">{text}</a>';

