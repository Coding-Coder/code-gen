/**
 * Tree控件
 * @example 示例:
tree = new FDTree({
	domId:'menu'
	,data:rows
	,onclick:function(node) {
		document.getElementById('d').innerHTML = (node.text);
		if(node.url) {
			window.open(node.url)
		}
	}
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * @author thc 
 * 2013-3-28
 */
var FDTree = function(options) {
	FDLib.implement(this,FDControl);
	
	this.options = FDLib.util.apply(this.getOptions(),options);
	
	var view = this.options.view;
	this.treeView = new view(this.options);
	
	this.reload();
}

FDTree.prototype = {
/**
 * <code>
// 渲染控件的domId
domId:null
// 服务器请求路径
,url:''
// 后台请求参数
,params:{}
// 点击节点事件.点击任何节点都会触发
,onclick:function(rowData){}
// 点击checkbox触发的事件
,onCheck:function(rowData,isChecked){}
// 节点数据,数组形式
,data:null
// 默认的视图层
,view:FDTreeView
// 后台传递值的字段名
,valueFieldName:'id'
// 后台传递数据显示值的字段名
,textFieldName:'text'
// 后台传递数据子元素的属性名
,childrenFieldName:'children'
// 是否显示checkbox
,checkable:false
// 是否显示边框
,showBorder:true
// 任何情况下点击"+/-"展开/收缩
// true时点击节点即可展开/收缩
// 默认为false
,clickToggle:false
 * </code>
 */
	getOptions:function() {
		return {
			domId:null
			,url:''
			// 后台请求参数
			,params:{}
			// 点击节点事件.点击任何节点都会触发
			,onclick:function(rowData){}
			// 
			,onCheck:function(rowData,isCheck){}
			// 节点数据,数组形式
			,data:null
			// 阶段渲染,类似于grid的render
			,render:null
			,view:FDTreeDomView
			,valueFieldName:'id'
			,textFieldName:'text'
			,childrenFieldName:'children'
			// 是否显示checkbox
			,checkable:false
			// 是否显示边框
			,showBorder:true
			// 任何情况下点击"+/-"展开/收缩
			// true时点击节点即可展开/收缩
			// 默认为false
			,clickToggle:false
			// 点击时高亮
			,highlightHandler:function(rowData,dom){return true;}
			// 鼠标移动高亮
			,hoverEffectHandler:function(rowData,lab){return true;}
		}
	}
	/**
	 * 模拟选中节点
	 */
	,select:function(id) {
		this.treeView.select(id);
	}
	/**
	 * 勾选某个节点,参数为数组,数组元素为节点id
	 * @param idArr 数组,元素为节点id
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,check:function(idArr,callback){
		this.treeView.check(idArr,callback);
	}
	/**
	 * 取消勾选
	 * @param idArr 数组,元素为节点id
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,uncheck:function(idArr,callback){
		this.treeView.uncheck(idArr,callback);
	}
	/**
	 * 勾选所有节点
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,checkAll:function(callback) {
		this.treeView.checkAll(callback);
	}
	/**
	 * 取消勾选所有节点
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,uncheckAll:function(callback) {
		this.treeView.uncheckAll(callback);
	}
	/**
	 * 反选
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj,checkbox)<br>
	 * 	nodeObj为节点对象,checkbox为<input>对象
	 */
	,checkOthers:function(callback) {
		this.treeView.checkOthers(callback);
	}
	/**
	 * 获取选中的值
	 * @return 返回rowData对象
	 */
	,getSelected:function() {
		return this.treeView.getSelected();
	}
	/**
	 * 返回勾选的数据
	 * @return 返回数组,数组里面元素是node对象[{...},{...}]
	 */
	,getChecked:function(){
		return this.treeView.getChecked();
	}
	/**
	 * 返回没有勾选的数据
	 * @return 返回数组,数组里面元素是node对象[{...},{...}]
	 */
	,getUnChecked:function(){
		return this.treeView.getUnChecked();
	}
	/**
	 * 设置数据
	 * @param data 数组形式
	 */
	,setData:function(data) {
		if(FDLib.util.isObject(data)) {
			this.options.data = data;
			this.reload();
		}
	}
	/**
	 * 全部展开
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj)<br>
	 * 	nodeObj为节点对象
	 */
	,expandAll:function(callback) {
		this.treeView.expandAll(callback);
	}
	/**
	 * 全部收缩
	 * @param callback 回调函数,该回调函数有两个参数callback(nodeObj)<br>
	 * 	nodeObj为节点对象
	 */
	,collapseAll:function(callback) {
		this.treeView.collapseAll(callback);
	}
	/**
	 * 重新加载
	 * @param params 服务器请求参数
	 */
	,reload:function(params) {
		var that = this;
		var opt = this.options;
		opt.params = params || {};
		if(opt.url) {
			FDLib.ajax.request({
				url:opt.url
				,params:opt.params
				,success:function(data) {
					opt.data = data;
					that.treeView.refresh(data);
				}
			});
		}else{
			that.treeView.refresh(opt.data);
		}
		
	}
	/**
	 * 隐藏
	 */
	,hide:function() {
		this.treeView.hide();
	}
	/**
	 * 显示
	 */
	,show:function() {
		this.treeView.show();
	}
}
