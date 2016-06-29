/**
 * tab控件
 * @example 示例:
var tab1;
var tab2;
FDLib.loadJs('FDTab',function() {
	tab1 = new FDTab({domId:'tab1'
		,isHover:true
		,items:[
		{text:'英文',value:1,contentId:'tab1-cont1',closeable:true,checked:false}
		,{text:'中文',value:2,contentId:'tab1-cont2',checked:true}
	]});
	
	
	var en = 'After viewing the metamorphosis at sunrise, '
		+ 'I would walk downhill along the steep mountain-path, '
		+ 'towards the rocky beach, for a brief swim. Each time, '
		+ 'I noticed a flurry of activity in a distant compound with a single decrepit building.';
	
	var zh = '在观看了日出时奇妙的变化以后，我会沿着陡峭的山路下行，走到一个遍布岩石的海滩，游一会儿泳。'
	tab2 = new FDTab({domId:'tab2'
		,items:[
		{text:'英文2',value:3,content:'<i>'+en+'</i>',closeable:true,checked:false,onchange:changeHandler}
		,{text:'中文2',value:4,content:'<b>'+zh+'</b>',closeable:true,checked:true,onchange:changeHandler}
		,{text:"百度",closeable:true,url:'http://www.baidu.com',isRefresh:true,onclick:function(){alert('show baidu')},checked:false}
	]});
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDTab = function(options) {
	FDLib.implement(this,FDControl);
	this.options = FDLib.util.apply(this.getOptions(),options);
	// 根据value储存item
	this.options.itemStore = {};
	
	this.tabInstance = new this.options.view(this.options,this);
	
	this._buildTab(this.options.items);
}

FDTab.prototype = {
/**
 * 返回默认的属性
 *<pre><code>
{
	domId:''

	// item项:
	// {text:'tab名'
	//  ,value:'tab值'
	// 	,contentId:'',html:''
	// 	,url:null
	// 	,isRefresh:false // 设置了url,每次点击tab是否刷新
	// 	,onchange:function(item){}
	// 	,checked:false
	//  ,closeable:false
	// }
	,items:[]
	//鼠标滑过切换tab,默认以click方式切换 
	,isHover:false
	,view:FDTabView
}</code></pre>
 */
	getOptions:function() {
		return {
			domId:''
			,items:[]
			,isHover:false
			,view:FDTabView
		}
	}
	/**
	 * 显示控件
	 */
	,show:function() {
		this.tabInstance.show();
	}
	/**
	 * 隐藏
	 */
	,hide:function() {
		this.tabInstance.hide();
	}
	/**
	 * 根据value选择某一个tab
	 * @param val item的value
	 */
	,setValue:function(val) {
		this.tabInstance.showItem(val);
	}
	/**
	 * 设置items
	 * @param items item属性
	 */
	,setItems:function(items) {
		this.removeAll();
		this.options.items = items;
		this._buildTab(items);
	}
	/**
	 * 移除所有项
	 */
	,removeAll:function() {
		this.tabInstance.removeAll();
		this._resetData();
	}
	/**
	 * 根据value值移除某一项
	 * @param value item的value
	 */
	,removeItemByValue:function(value) {
		var item = this.getItemByValue(value);
		this.removeItem(item);
	}
	/**
	 * 根据index移除某一项
	 * @param tab的索引,从0开始
	 */
	,removeItemByIndex:function(index) {
		var item = this.getItemByIndex(index);
		this.removeItem(item);
	}
	/**
	 * 根据item项来移除
	 * @param item item对象
	 */
	,removeItem:function(item) {
		if(item) {
			this.tabInstance.removeItem(item);
			
			this._delItemDataByValue(item.value);
		}
	}
	/**
	 * 添加一个item
	 * @param item item对象
	 */
	,addItem:function(item) {
		this.addItems([item]);
	}
	/**
	 * 添加多个item
	 * @param items item数组
	 */
	,addItems:function(items) {
		if(FDLib.util.isArray(items)) {
			this.options.items = this.options.items.concat(items);
			this._buildTab(items);
		}
	}
	/**
	 * 根据value获取item对象
	 * @param value item的value
	 */
	,getItemByValue:function(value) {
		return this.options.itemStore[value];
	}
	/**
	 * 根据value值选择tab项
	 * @param value item的value
	 */
	,selectItemByValue:function(value) {
		this.tabInstance.showItemByValue(value);
	}
	/**
	 * 根据index值选择tab项
	 * @param tab的索引,从0开始
	 */
	,selectItemByIndex:function(index) {
		var item = this.getItemByIndex(index);
		if(item) {
			this.selectItemByValue(item.value);
		}
	}
	/**
	 * 根据value禁用tab项
	 * @param value item的value
	 */
	,disableByValue:function(value) {
		var item = this.getItemByValue(value);
		this.disable(item);
	}
	/**
	 * 根据index禁用tab项
	 * @param tab的索引,从0开始
	 */
	,disableByIndex:function(index) {
		var item = this.getItemByIndex(index);
		this.disable(item);
	}
	/**
	 * 根据value值启用tab项
	 * @param value item的value
	 */
	,enableByValue:function(value) {
		var item = this.getItemByValue(value);
		this.enable(item);
	}
	/**
	 * 根据index值启用tab项
	 * @param tab的索引,从0开始
	 */
	,enableByIndex:function(index) {
		var item = this.getItemByIndex(index);
		this.enable(item);
	}
	/**
	 * @private
	 */
	,disable:function(item) {
		if(item) {
			this.tabInstance.disable(item);
		}
	}
	/**
	 * @private
	 */
	,enable:function(item) {
		if(item) {
			this.tabInstance.enable(item);
		}
	}
	/**
	 * 根据index获取item对象
	 * @param tab的索引,从0开始
	 */
	,getItemByIndex:function(index) {
		return this.options.items[index];
	}
	// private
	// 初始化items项
	,_initItems:function(items) {
		var self = this;
		var newItems = this._refreshPermissionItems(items);
		FDLib.util.each(newItems,function(item){
			item = self._checkValueAndContentId(item);
			item = self._checkContentDiv(item);
			
			self._storeItem(item);
		});
		
		return newItems;
	}
	,_refreshPermissionItems:function(items) {
		var newItems = [];
		FDLib.util.each(items,function(item){
			FDRight.checkByCode(item.operateCode,function(){
				newItems.push(item);
			});
		});
		
		this.options.items = newItems;
		
		return newItems;
	}
	,_buildTab:function(items) {
		var newItems = this._initItems(items);
		this.tabInstance.buildTab(newItems);
	}
	,_resetData:function() {
		this.options.itemStore = {};
		this.options.item = [];
	}
	,_delItemDataByValue:function(value) {
		var itemIndex = 0;
		var items = this.options.items;
		
		FDLib.util.each(items,function(item,i){
			if(item.value == value) {
				itemIndex = i;
				return false;
			}
		});
		
		this._delItemData(itemIndex);
		this._delItemStoreByValue(value);
	}
	,_delItemData:function(itemIndex) {
		var items = this.options.items;
		if(items.length > itemIndex){
		 	items.splice(itemIndex,1);
		}
	}
	,_delItemStoreByValue:function(value) {
		delete this.options.itemStore[value];
	}
	,_storeItem:function(item) {
		this.options.itemStore[item.value] = item;
	}
	// 确保value和contentId存在
	,_checkValueAndContentId:function(item) {
		var util = FDLib.util;
		var count = FDControl.generateCount();
		// 确保value存在
		if(util.isUndefined(item.value)) {
			item.value = 'tabValue_' + count;
		}
		if(util.isUndefined(item.contentId)) {
			item.contentId = 'tabContId_' + count;
		}
		return item;
	}
	// 确保content对应的div存在
	,_checkContentDiv:function(item) {
		// 保content存在
		if(FDLib.util.isUndefined(item.content)) {
			item.content = '';
		}
		var contentId = item.contentId,
			content = item.content;
		var contentDiv = null;
			
		if(contentId && FDLib.util.isString(contentId)) {
			contentDiv = FDLib.getEl(contentId);
		}
		// 如果contentDiv找不到,则创建一个空的div
		if(!contentDiv) {
			contentDiv = this._buildContentDiv(item);
		}
		item.contentDiv = contentDiv;
		
		return item;
	}
	,_buildContentDiv:function(item) {
		var contentId = item.contentId;
		var contentDiv = document.createElement(FDTag.DIV);
		contentDiv.setAttribute('id',contentId);
		contentDiv.innerHTML = item.content;
		
		this._buildIFrame(contentDiv,item);
		
		return contentDiv;
	}
	,_buildIFrame:function(contentDiv,item) {
		var url = item.url;
		if(FDLib.util.isString(url) && url) {
			var iframe = document.createElement(FDTag.IFRAME);
			//iframe.src = url; // 延迟加载
			iframe.style.cssText = "width:100%;height:100%;border:0px;";
			item.iframe = iframe;
			contentDiv.style.height = "100%";
			contentDiv.appendChild(iframe);
		}
	}
}
