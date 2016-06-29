/**
 * form组件的父类,提供默认的属性,和方法
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 */
var FDComponent = function(options) {
	FDLib.implement(this,FDControl);
	
	this.options = FDLib.util.apply(this.getOptions(),options);

	this.contentDoms = this.refreshContent();	
	
	this.render();
	
	this.initEvent();
	
	this.setBounds(this.options.width,this.options.height);
}

FDComponent.prototype = {
/**
 * 获取组件的默认属性
   @return <pre><code>返回json数据类型
{
	domId:null // 定位的节点ID
	,label:"" // 控件前面要显示的文字
	,labelAlign:'right' // label水平对齐方式
	,labelValign:'middle' // label垂直对齐方式
	,name:"" // 控件的name
	,width:"" // 控件的宽,如'120px'
	,height:"" // 控件的高,如'30px'
	,validates:[] // 验证类
	,renderable:true // 是否画出控件,false则不画出,这样在HTML中就不显示
}</code></pre>
 */
	getOptions:function() {
		return {
			domId:null
			,label:""
			,labelAlign:'right'
			,labelValign:'middle'
			,name:""
			,width:""
			,height:""
			,validates:[]
			,renderable:true
			,nativeAttr:null
		};
	}
	/**
	 * 初始化事件
	 */
	,initEvent:function(){}
	/**
	 * 初始化DOM原生属性
	 * @private
	 */
	,initAttr:function(){
		var nativeAttr = this.options.nativeAttr;
		FDLib.util.each(this.contentDoms,function(dom){
			for(var attrName in nativeAttr) {
				dom.setAttribute(attrName,nativeAttr[attrName]);
			}
		});
	}
	/**
	 * 将控件渲染到页面上,如果指定domId,则渲染到对应的domId中
	 * 否则渲染到body中
	 * @param domId
	 */
	,render:function(domId){
		if(domId && FDLib.util.isString(domId)){
			this.options.domId = domId;
		}
		
		var desDom = FDLib.getEl(this.options.domId);
		this.renderToDom(desDom);
	}
	/**
	 * 将控件渲染到指定dom对象中
	 * @param dom DOM对象
	 */
	,renderToDom:function(desDom){
		if(desDom && FDRight.checkByCode(this.options.operateCode)) {
			FDLib.util.each(this.contentDoms,function(dom){
				desDom.appendChild(dom);
			});
		}
	}
	/**
	 * 初始化控件内容
	 */
	,initContent:function() {
		var contentDom = this.buildContent();
		
		if(FDLib.util.isArray(contentDom)){
			FDLib.util.each(contentDom,function(dom){
				this.outerDiv.appendChild(dom);
			});
		}else{
			this.outerDiv.appendChild(contentDom);
		}
	}
	/**
	 * 刷新控件内容
	 */
	,refreshContent:function() {
		this.contentDoms = this.buildContent();	
	
		if(!FDLib.util.isArray(this.contentDoms)){
			this.contentDoms = [this.contentDoms];
		}
		
		this.initAttr();
		
		return this.contentDoms;
	}
	/**
	 * 构建内容
	 * @param 返回DOM对象
	 */
	,buildContent:function(){
		throw new Error('必须重写FDComponent.buildContent()方法');	
	}
	/**
	 * 显示控件
	 */
	,show:function() {
		FDLib.util.each(this.contentDoms,function(dom){
			dom.style.display = "block";
		});
	}
	/**
	 * 隐藏控件
	 */
	,hide:function() {
		FDLib.util.each(this.contentDoms,function(dom){
			dom.style.display = "none";
		});
	}
};

