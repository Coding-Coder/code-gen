/**
 * 窗体控件FDWindow,继承自<a href="FDPanel.html">FDPanel</a><br>
 * @example 示例:
tip = FDLib.getEl('tip');
win = new FDWindow({
	contentId:'win'
	,title:'标题'
	,modal:false
	,afterShow:function(){tip.innerHTML = 'afterShow'}
	,afterClose:function(){tip.innerHTML = 'afterClose'} 
});
win3 = new FDWindow({
	contentId:'win3'
	,title:'标题3'
});

var win2 = new FDWindow({domId:'win2',width:'200px',modal:false,dragable:false,title:'无法拖动,无法关闭的标题',closeable:false});
win2.moveTo(100,100);
win2.show();
 * @param options 参见{@link #getOptions}返回的对象
 * @constructor
 * 2012-8-8
 */
var FDWindow = function(options) {
	FDWindow.superclass.constructor.call(this,options);
	FDLib.implement(this,FDControl);
}

FDLib.extend(FDWindow,FDPanel);

/**
 * 默认属性,继承<a href="FDPanel.html">FDPanel</a>的属性并添加自身属性
 * @example <pre><code>
{
	domId:''
	// 标题 
	,title:''
	// 按钮,参考FDButton
	,buttons:[]
	// 视图层类 
	,view:FDWindowView
	// 是否显示右上角关闭按钮 
	,closeable:true
	// 能否拖拽窗体 
	,dragable:true
	// 是否显示遮罩层 
	,modal:true
	// 打开窗体后执行的方法 
	,afterShow:null
	// 关闭窗体后执行的方法 
	,afterClose:null
	// 是否立即显示
	,isLoadShow:false
}</code></pre>
 */
//@override
FDWindow.prototype.getOptions = function() {
	var options = FDWindow.superclass.getOptions.call(this);
	return FDLib.util.apply(options,{
		domId:''
		/** 标题 */
		,title:''
		/** 按钮 */
		,buttons:[]
		/** 视图层类 */
		,view:FDWindowDomView
		/** 是否显示右上角关闭按钮 */
		,closeable:true
		/** 能否拖拽窗体 */
		,dragable:true
		/** 是否显示遮罩层 */
		,modal:true
		/** 打开窗体后执行的方法 */
		,afterShow:null
		/** 关闭窗体后执行的方法 */
		,afterClose:null
		/** 是否立即显示 */
		,isLoadShow:false
		,toggleable:false
	});
}

/**
 * 返回按钮
 * @return 返回按钮集合,数组形式,每个元素都是FDButton对象
 */
FDWindow.prototype.getButtons = function() {
	return this.options.buttons;
}

/**
 * 移动到中央
 */
FDWindow.prototype.moveToCenter = function() {
	this.viewInstance.moveToCenter();
}

/**
 * 移动窗体
 * @param left 距离页面左边的距离,int类型
 * @param top 距离页面顶部的距离,int类型
 */
FDWindow.prototype.moveTo = function(left,top) {
	this.viewInstance.moveTo(left,top);
}

/*------------------------------------confirm------------------------------------*/
/**
 * 确认框,功能类似于window.confirm()
 * @param content 窗口内容
 * @param callback 回调函数,即点击确定后需要执行的函数
 * @param options FDWindow的options参数
 * @example 示例:
<pre>
FDWindow.confirm('确定关闭吗?',function(r){
	if(r){
		alert('确定')
	}else{
		alert('取消')
	}
}); 
</pre>
 */
FDWindow.confirm = (function(){
	
	var okBtn = null;
	var noBtn = null;
	var confirmWin = null;
	
	var def = {
		title:'提示'
		,width:'220px'
		,yesText:"确定"
		,noText:"取消"
	};
	
	return function(content,callback,options){
		var defOpt = FDLib.util.clone(def);
		
		options = FDLib.util.apply(defOpt,options);
		
		initWindow(content,options,callback);
		
		confirmWin.show();
	};
	
	function initWindow(content,options,callback){
		if(!confirmWin) {
			okBtn = new FDButton();
			noBtn = new FDButton();
			confirmWin = new FDWindow({
				contentId:buildWindowHtml()
				,closeable:false
				,buttons:[okBtn,noBtn]
			});
		}
		
		confirmWin.setTitle(options.title);
		confirmWin.setContent(content || '');
		
		confirmWin.setWidth(options.width);
		confirmWin.setHeight(options.height);
		
		okBtn.setText(options.yesText);
		noBtn.setText(options.noText);
		
		okBtn.setOnclick(function(){
			callback&&callback(true);
			confirmWin.close();
		});
		
		noBtn.setOnclick(function(){
			callback&&callback(false);
			confirmWin.close();
		});
		
	}
	
	function buildWindowHtml() {
		var div = document.createElement(FDTag.DIV);
		var id = "confirmWin_" + FDControl.generateCount();
		div.setAttribute('id',id);
		document.body.appendChild(div);
		return id;
	}
})();

/*------------------------------------alert------------------------------------*/
/**
 * 确认框,功能类似于window.alert()
 * @param content 窗口内容
 * @param callback 回调函数,即点击确定后需要执行的函数
 * @param options FDWindow的options参数
 * @example 示例:
<pre>
FDWindow.alert('成功!',function(r){
	alert('确定')
}); 
</pre>
 */
FDWindow.alert = (function(){
	
	var okBtn = null;
	var alertWin = null;
	
	var def = {
		title:'提示'
		,width:'220px'
		,yesText:"确定"
	};
	
	return function(content,callback,options){
		var defOpt = FDLib.util.clone(def);
		
		options = FDLib.util.apply(defOpt,options);
		
		initWindow(content,options,callback);
		
		alertWin.show();
	};
	
	function initWindow(content,options,callback){
		if(!alertWin) {
			okBtn = new FDButton();
			alertWin = new FDWindow({
				contentId:buildWindowHtml()
				,closeable:false
				,buttons:[okBtn]
			});
		}
		
		alertWin.setTitle(options.title);
		alertWin.setContent(content || '');
		
		alertWin.setWidth(options.width);
		alertWin.setHeight(options.height);
		
		okBtn.setText(options.yesText);
		
		okBtn.setOnclick(function(){
			callback&&callback();
			alertWin.close();
		});
	}
	
	function buildWindowHtml() {
		var div = document.createElement(FDTag.DIV);
		var id = "alertWin_" + FDControl.generateCount();
		div.setAttribute('id',id);
		document.body.appendChild(div);
		return id;
	}
})();

