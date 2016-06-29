/**
 * 面板控件
 * @example 示例:
tip = FDLib.getEl('tip');
win = new FDPanel({
	domId:'win'
	,title:'标题'
	,isSlide:true
	,width:'500px'
	,height:'300px'
});
win3 = new FDPanel({
	domId:'win3'
	,title:'标题3'
});
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-8-12
 */
var FDPanel = function(options) {
	FDLib.implement(this,FDControl);
	this.options = FDLib.util.apply(this.getOptions(),options);
	var view = this.options.view;
	/** 视图层实例 */
	this.viewInstance = new view(this.options);
	
	if(this.options.isLoadShow) {
		this.show();
	}
}

FDPanel.prototype = {
/**
 * 默认属性
 * <pre></code>
{
	// 节点ID
	domId:''
	// 标题
	,title:''
	//视图层类 
	,view:FDPanelView
	//是否可以展开/关闭 
	,isSlide:false
	// 是否立即展开
	,isExpand:true
	// 立即显示 
	,isLoadShow:true
	,width:null
	,height:null
	// 是否显示关闭按钮 
	,closeable:false
	// 是否可以伸缩
	,toggleable:false
}</code></pre>
 */
	getOptions:function() {
		return {
			domId:''
			/** 标题 */
			,title:''
			/** 视图层类 */
			,view:FDPanelDomView
			/** 是否可以展开/关闭 */
			,isSlide:false
			/** 是否立即展开 */
			,isExpand:true
			/** 立即显示 */
			,isLoadShow:true
			,width:null
			,height:null
			/** 是否显示关闭按钮 */
			,closeable:false
			/** 是否显示折叠按钮 */
			,toggleable:true
		};
	}
	/**
	 * 显示窗体
	 * @param callback 显示后的回调函数,与afterShow不冲突
	 */
	,show:function(callback) {
		this.viewInstance.show();
		if(FDLib.util.isFunction(callback)) {
			callback();
		}
	}
	/**
	 * 关闭窗体
	 * @param callback 关闭后的回调函数,与afterClose不冲突
	 */
	,hide:function(callback) {
		this.viewInstance.close();
		if(FDLib.util.isFunction(callback)) {
			callback();
		}
	}
	/**
	 * 等同hide()
	 */
	,close:function(callback) {
		this.hide(callback);
	}
	/**
	 * 设置面板的width属性
	 * @param width 字符串类型,如:'120px'
	 */
	,setWidth:function(width) {
		this.options.width = width;
		this.viewInstance.setWidth(width);
	}
	/**
	 * 设置面板的height属性
	 * @param height 字符串类型,如:'120px'
	 */
	,setHeight:function(height) {
		this.options.height = height;
		this.viewInstance.setHeight(height);
	}
	/**
	 * 设置标题
	 * @param title 标题
	 */
	,setTitle:function(title) {
		this.viewInstance.setTitle(title);
	}
	/**
	 * 设置窗体内容
	 * @param content 内容,字符串类型
	 */
	,setContent:function(content) {
		this.viewInstance.setContent(content);
	}
}