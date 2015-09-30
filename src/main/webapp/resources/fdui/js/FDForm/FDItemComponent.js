/**
 * 拥有item属性的类,如radio,checkbox,select<br>
 * 继承自<a href="FDFieldComponent.html">FDFieldComponent</a>
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDItemComponent = function(options) {
	FDItemComponent.superclass.constructor.call(this,options);
	FDLib.implement(this,FDItem);
	
	this.selectItemCache = {};
	
	this.domCont;
}

FDLib.extend(FDItemComponent,FDFieldComponent);


/**
 * 覆盖父类方法,获取组件的默认属性
   @return <pre><code>返回json数据类型
 * {
 *  domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,items:[] 
	,defaultValue:null // 默认值,需要子类去实现
 * }</code></pre>
 */
//@override
FDItemComponent.prototype.getOptions = function() {
	var options = FDItemComponent.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		items:[]
		,defaultValue:null
	});
}

/**
 * 设置items
 * @param items 数组形式,如:[{value:1,text:'足球'},{value:2,text:'篮球'}]
 */
FDItemComponent.prototype.setItems = function(items) {
	if(FDLib.util.isArray(items)) {
		this.options.items = items;
		// 移除原来的
		this._removeOldControlDom();
		
		this.refreshContent();
		
		this.render();
	}
}


/**
 * 获取items
 * @return 返回数组
 */
FDItemComponent.prototype.getItems = function() {
	return this.options.items || [];
}

/**
 * 获取选中状态下对应的json数据
 * @return 返回json对象
 */
FDItemComponent.prototype.getSelectItem = function() {
	var value = this.getValue(); // getValue需要在子类中实现
	var util = FDLib.util;
	var retItem = {};
	// 如果是空字符串
	if(FDLib.string.isEmptyStr(value)) {
		return retItem;
	}
	
	if(util.isNumber(value) || util.isBoolean(value) || util.isString(value)) {
		retItem = this._getNormalValueItem(value);
	}
	
	if(FDLib.util.isArray(value)) {
		retItem = this._getArrayValueItem(value);
	}
	
	return retItem;
}

FDItemComponent.prototype._getNormalValueItem = function(value) {
	var util = FDLib.util;
	var items = this.getItems();
	var mapValue = this.selectItemCache[value];
	if(mapValue) {
		return mapValue;
	}
	var self = this;
	return util.each(items,function(item){
		if(item.value == value) {
			self.selectItemCache[value] = item;
			return item;
		}
	});
}

FDItemComponent.prototype._getArrayValueItem = function(valueArr) {
	var key = valueArr.join('-');
	var mapValue = this.selectItemCache[key];
	if(mapValue) {
		return mapValue;
	}
	
	var items = this.getItems();
	var outItems = [];
	
	var each = FDLib.util.each;
	each(valueArr,function(value){
		each(items,function(item){
			if(value == item.value) {
				outItems.push(item);
			}
		});
	});
	
	this.selectItemCache[key] = outItems;
	return outItems;
}


// 移除原来的DOM
FDItemComponent.prototype._removeOldControlDom = function() {
	FDLib.dom.removeDom(this.domCont);
	this.controlDom = null;
}

// override
FDItemComponent.prototype.buildContent = function(){
	var that = this;
	var domArr = this.getControlDom();
	that.domCont = document.createElement(FDTag.DIV);
	var id = null;
	
	FDLib.util.each(domArr,function(radioDom){
		id = 'radio_' + FDControl.generateCount();
		var lab = document.createElement(FDTag.LABEL);
		radioDom.id = id;
		lab.setAttribute('for',id);
		
		radioDom.style.cursor = 'pointer';
		lab.style.cursor = 'pointer';
		
		lab.innerHTML = radioDom.text;
		
		that.domCont.appendChild(radioDom);
		that.domCont.appendChild(lab);
	});
	
	return that.domCont;
}
