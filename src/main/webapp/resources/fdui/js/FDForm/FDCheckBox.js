/**
 * 单选框FDCheckBox继承自<a href="FDItemComponent.html">FDItemComponent</a><br>
 * @example 示例:
 * <pre><code>
var genderItems = [{value:1,text:"足球"},{value:0,text:"篮球"}];
var constellationItems = [{value:0,text:"金牛座",date:'03-01'},{value:1,text:"天枰座",date:'04-01'}
,{value:2,text:"巨蟹座",date:'05-01'},{value:3,text:"双子座",date:'06-01'}];

var newItems = [
{value:10,text:'北京'},{value:11,text:'上海'},{value:12,text:'天津'}
,{value:13,text:'重庆'}
                ];

// 设置JS路径
FDLib.setDir('../../src/');

FDLib.loadJs('FDCheckBox',function() {
	checkbox1 = new FDCheckBox({name:"gender",items:genderItems
		,validates:[ new FDValidate({notNull:true}) ]	
	});
	
	checkbox2 = new FDCheckBox({domId:'constellation',name:'constellation'
			,defaultValue:[0,2]
			,items:constellationItems,label:'星坐:',vertical:true});
	
	checkbox2.addEvent('click',function(){
		var data = checkbox2.getSelectItem();
		var s = '';
		for(var key in data) {
			s += data[key].value + ":" + data[key].text + ' '
		}
		FDLib.getEl('msg').innerHTML = s;
	});
});
</code></pre>
* @param options 参见{@link #getOptions}返回的对象
 * 2012-8-1
 * @constructor
 */
var FDCheckBox = function(options) {
	FDCheckBox.superclass.constructor.call(this,options);
}

FDLib.extend(FDCheckBox,FDItemComponent);

/**
 * options项
 * @return 返回json数据类型<pre><code>
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,items:[] // checkbox的item项{value:1,text:'足球'}
	,vertical:false // checkbox排练方式,默认为水平排放
	,defaultValue:[] // 默认值
}</code></pre>
 */
//@override
FDCheckBox.prototype.getOptions = function() {
	var options = FDCheckBox.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		items:[]
		// 垂直排放
		,vertical:false
		,defaultValue:[]
	});
}

/**
 * 重写父类方法,返回checkbox数组
 */
// override
FDCheckBox.prototype.buildControlDom = function() {
	var that = this;
	var items = this.getItems();
	var doms = [];
	FDLib.util.each(items,function(item){
		doms.push(that._createCheckboxInput(item));
	});
	return doms;
}

FDCheckBox.prototype._createCheckboxInput = function(item) {
	var input = document.createElement(FDTag.INPUT);
	input.setAttribute('type','checkbox');
	input.setAttribute('name',this.options.name);
	input.value = item.value;
	input.text = item.text;
	return input;
}

/**
 * 重写setValue,这里参数传入数组类型
 * @param valArr 如:[1,2,3]
 */
//@override
FDCheckBox.prototype.setValue = function(valArr) {
	var util = FDLib.util;
	if(!util.isArray(valArr)) {
		throw new Error('方法FDCheckBox.setValue参数必须为数组类型');
	}
	var controls = this.getControlItems();
	
	util.each(controls,function(ctrl){
		ctrl.checked = null;
		util.each(valArr,function(val){
			if(ctrl.value == val) {
				ctrl.checked = "checked";
				return true;
			}
		});
	});
	
}

/**
 * 重写getValue,没有选中则返回空的数组
 * @return 返回数组
 */
//@override
FDCheckBox.prototype.getValue = function() {
	var controls = this.getControlItems();
	var valArr = [];
	FDLib.util.each(controls,function(ctrl){
		if(ctrl.checked) {
			valArr.push(ctrl.value);
		}
	});
	return valArr;
}

