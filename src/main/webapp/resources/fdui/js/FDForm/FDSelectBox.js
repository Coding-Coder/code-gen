/**
 * 选择框类FDSelectBox,继承自<a href="FDItemComponent.html">FDItemComponent</a><br>
 * @example 示例:
 * <pre></code>
// 设置JS路径
FDLib.setDir('../../src/');

var select1;
var select2;

var genderItems = [{value:1,text:"男"},{value:0,text:"女"}];
var constellationItems = [{value:0,text:"金牛座",date:'03-01'},{value:1,text:"天枰座",date:'04-01'}
,{value:2,text:"巨蟹座",date:'05-01'},{value:3,text:"双子座",date:'06-01'}];

var newItems = [
{value:10,text:'北京'},{value:11,text:'上海'},{value:12,text:'天津'}
,{value:13,text:'重庆'}
                ];
                
FDLib.loadJs('FDSelectBox',function() {
	select1 = new FDSelectBox({name:"gender",defaultValue:0,items:genderItems,showDefault:false});
	
	select2 = new FDSelectBox({domId:'constellation',name:'constellation',items:constellationItems,label:'星坐:'});
	select2.addEvent('change',function(){
		FDLib.getEl('msg').innerHTML = 'value:' + this.value 
			+ ' text:' + select2.getSelectItem().text;
	});
});</code></pre>
 * 2012-8-1
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDSelectBox = function(options) {
	FDSelectBox.superclass.constructor.call(this,options);
}

FDLib.extend(FDSelectBox,FDItemComponent);

/**
 * 覆盖父类方法,获取组件的默认属性
   @return <pre><code>返回json数据类型
 * {
 *  domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,items:[] 
	// 是否显示默认选项
	,showDefault:true
	// 默认选项的文本
	,defaultItemText:'-请选择-'
	// 默认选项的值
	,defaultItemValue:''
	,defaultValue:''
 * }</code></pre>
 */
//@override
FDSelectBox.prototype.getOptions = function() {
	var options = FDSelectBox.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		// 是否显示默认选项
		showDefault:true
		// 默认选项的文本
		,defaultItemText:'-请选择-'
		// 默认选项的值
		,defaultItemValue:''
		,defaultValue:null
	});
}


/**
 * @private
 */
//@override
FDSelectBox.prototype.buildControlDom = function() {
	var select = document.createElement(FDTag.SELECT);
	select.setAttribute('name',this.options.name);
	
	this._initOptions(select);
	
	return select;
}

// 初始化下拉框选项
FDSelectBox.prototype._initOptions = function(select) {
	var selOptions = select.options;
	var items = this.getItems();
	
	if(items.length === 0) {
		items.push({text:this.options.defaultItemText,value:this.options.defaultItemValue});
	}
	
	// 如果不显示默认项,则取第一项做默认项
	if(!this.options.showDefault) {
		var firstItem = items.shift();
		this.options.defaultItemText = firstItem.text;
		this.options.defaultItemValue = firstItem.value;
	}
	// 添加第一项
	selOptions.add(new Option(this.options.defaultItemText,this.options.defaultItemValue));
	// 添加剩下的项
	FDLib.util.each(items,function(item){
		selOptions.add(new Option(item.text,item.value));
	});
	
	// 设置默认值
	if(FDLib.util.isNull(this.options.defaultValue)) {
		this.options.defaultValue = this.options.defaultItemValue;
	}
}

/**
 * 构建控件内容
 */
// @override
FDSelectBox.prototype.buildContent = function() {
	this.controlDom = this.buildControlDom();
	return this.getControlDom();
}
