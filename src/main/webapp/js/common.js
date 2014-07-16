var Action = {
	ajsxSucc:function(e,succFun){
		if(succFun){
			succFun(e);
		}
	},
	/**
	 * 异步请求
	 */
	jsonAsyncActByData:function(url,data,succFun){
		$.ajax({
			type: "POST",
			url: url,
			async:true,
			traditional:true,
			dataType: "json",
			data:data,
			success: function(e){
				Action.ajsxSucc(e,succFun);
			},
			error:function(hxr,type,error){
				Action._showError('后台出错，请查看日志');
			}
		});
	},
	/**
	 * 同步请求
	 */
	jsonSyncActByData:function(url,data,succFun){
		$.ajax({
			type: "POST",
			url: url,
			async:false,
			traditional:true,
			dataType: "json",
			data:data,
			success: function(e){
				Action.ajsxSucc(e,succFun);
			},
			error:function(hxr,type,error){
				Action._showError('后台出错，请查看日志');
			}
		});
	}
	,_showError:function(msg,title){
		title = title || "提示";
		var $ = parent.$ || $;
		$.messager.show({
			title: title,
			msg: msg,
			style:{
				right:'',
				top:document.body.scrollTop+document.documentElement.scrollTop,
				bottom:''
			}
		});
	}
}

/**
 * var crud = Crud.create({
 *  pk:'id' // 主键名
	,addUrl:ctx + 'addDataSource.do' // 添加请求
	,updateUrl:ctx + 'updateDataSource.do' // 修改请求
	,delUrl:ctx + 'delDataSource.do' // 删除请求
	,dlgId:'dlg' // 对话框id
	,formId:'fm' // 表单id
	,girdId:'dg' // 表格id
})
 */
var Crud = (function(){
	
	var CrudClass = function(param){
		this.addUrl = param.addUrl;
		this.listUrl = param.listUrl;
		this.updateUrl = param.updateUrl;
		this.delUrl = param.delUrl;
		this.pk = param.pk;
		
		this.$dlg = $('#'+param.dlgId);
		this.$form = $('#'+param.formId);
		this.$grid = $('#'+param.gridId);
		
		this.submitUrl;
	}
	
	CrudClass.prototype = {
		add:function(title){
			title = title || '添加'
			this.$dlg.dialog('open').dialog('setTitle',title);
			this.$form.form('reset');
			this.submitUrl = this.addUrl;
			
			if(this._hasPkInput()){
				this.getPkInput().prop('disabled',false);
			}
		}
		,update:function(row,title){
			title = title || '修改'
			if (row){
				this.$dlg.dialog('open').dialog('setTitle',title);
				this.$form.form('clear').form('load',row);
				
				this.submitUrl = this.updateUrl + ['?',this.pk,'=',row[this.pk]].join('');
				
				// 如果表单中有主键控件,则不能被修改
				if(this._hasPkInput()){
					this.getPkInput().prop('disabled',true);
				}
			}
		}
		,_hasPkInput:function(){
			return this.getPkInput().length > 0;
		}
		,getPkInput:function(){
			return this.$form.find('[name='+this.pk+']');
		}		,del:function(row,msg){
			msg = msg || '确定要删除该数据吗?';
			var self = this;
			if (row){
				$.messager.confirm('Confirm',msg,function(r){
					if (r){
						$.post(self.delUrl,row,function(result){
							if (result.success){
								self.$grid.datagrid('reload');	// reload the user data
							} else {
								showMsg(result.errorMsg);
							}
						},'json');
					}
				});
			}
		}
		,save:function(){
			var self = this;
			this.$form.form('submit',{
				url: this.submitUrl,
				onSubmit: function(){
					return $(this).form('validate');
				},
				success: function(resultTxt){
					var result = $.parseJSON(resultTxt);
					if (result.success){
						self.$dlg.dialog('close');		// close the dialog
						self.$grid.datagrid('reload');	// reload the user data
					} else {
						var errorMsg = result.errorMsg;
						errorMsg = errorMsg || buildValidateError(result);
						showMsg(errorMsg);
					}
				}
			});
		}
		
		,createOperColumn:function(){
			return {field:'_operate',title:'操作',align:'center',formatter:this.createOperFormatter()};
		}
		
		,createOperFormatter:function(){
			var that = this;
			return function(val,row,index){
				return '<a href="javascript:void(0)" onclick="'+FunUtil.createFun(that,'update',row)+'">修改</a>'+
				' | <a href="javascript:void(0)" onclick="'+FunUtil.createFun(that,'del',row)+'">删除</a>';
			}
		}
		/**
		 * 创建datagrid,options为追加的datagird属性
		 * crud.datagrid([    
			    {field:'name',title:'名称'}  
			    ,{field:'driverClass',title:'驱动'}  
			    ,{field:'driverClass',title:'驱动'}
			    ,{field:'jdbcUrl',title:'连接'}
			    
			],{toolbar:"#toolbar"});
		 */
		,buildGrid:function(columns,options){
			// 默认参数
			var settings = {    
			    url:this.listUrl,columns:[columns],toolbar:'#toolbar'
			    ,pagination:true,fitColumns:true,singleSelect:true,striped:true
			};
			// 合并参数
			$.extend(settings, options);
			
			this.$grid.datagrid(settings);
		}
		,closeDlg:function(){
			this.$dlg.dialog('close');
		}
	}
	
	function showMsg(errorMsg){
		var $ = parent.$ || $;
		$.messager.show({
			title: '提示',
			msg: errorMsg,
			style:{
				right:'',
				top:document.body.scrollTop+document.documentElement.scrollTop,
				bottom:''
			}
		});
	}
	
	function buildValidateError(result){
		var validateErrors = result.validateErrors;
		return validateErrors.join('<br>')
	}
	
	return {
		create:function(param){
			return new CrudClass(param);
		}
	};
	
})();
var EventUtil = {
	/**
	 * 格式化事件对象
	 */
	getEvent : function(){
		if(window.event){
			return this.formatEvent(window.event);
		}else {
			return this.getEvent.caller.arguments[0];
		}
	}
	/**
	 * 格式化事件对象,做到IE与DOM的统一
	 * @param oEvent:事件对象
	 */
	,formatEvent : function(oEvent){
		if($.browser.msie){
			oEvent.charCode = (oEvent.type == "keypress")?oEvent.charCode:0;
			oEvent.eventPhase = 2;
			oEvent.isChar = (oEvent.charCode > 0);
			oEvent.pageX = oEvent.clientX + document.body.scrollLeft;
			oEvent.pageY = oEvent.clientY + document.body.scrollTop;
			// 阻止某个事件的默认行为
			oEvent.preventDefault = function(){
				this.returnValue = false;
			}
			
			if(oEvent.type == "mouseout"){
				oEvent.relateTarget = oEvent.toElement;
			} else if(oEvent.type == "mouseover"){
				oEvent.relateTarget = oEvent.fromElement;
			}
			
			// 阻止冒泡
			oEvent.stopPropagation = function(){
				this.cancelBubble = true;
			}
			
			oEvent.target = oEvent.srcElement;
			oEvent.timestamp = (new Date()).getTime();
		}
		return oEvent;
	}
}
/*
&nbsp;使用方法:
&nbsp;FunUtil.createFun(scope,'some_mothod_name',obj1);
&nbsp;FunUtil.createFun(scope,'some_mothod_name',obj1,obj2);
&nbsp;...
*/
var FunUtil = (function(){
	
	var index = 0; 
	var handlerStore = []; // 存放方法句柄

	return {		
		// scope:作用域
		// methodName:方法名,字符串格式
		// ...:参数可放多个
		createFun:function(scope,methodName){
			var currentIndex = index++; // 创建索引
			
			var argu = []; // 用来存放多个参数
			// 构建参数
			for(var i=2,len=arguments.length;i<len;i++){
				argu.push(arguments[i]);	
			}

			// 把函数句柄存在数组里
			handlerStore[currentIndex] = (function(scope,methodName,argu){
				// 生成函数调用句柄
				return function(){
					scope[methodName].apply(scope,argu);
				}

			}(scope,methodName,argu));			
			
			return 'FunUtil._runFun(event,'+currentIndex+');';
		}
		// 执行方法
		// index:索引.根据这个索引找到执行函数
		,_runFun:function(e,index){
			var handler = handlerStore[index];
			handler();// 该函数已经传入了参数
			
			// 阻止默认行为并取消冒泡
			if(typeof e.preventDefault === 'function') {
				e.preventDefault();
				e.stopPropagation();
			}else {
				e.returnValue = false;
				e.cancelBubble = true;
			}
		}
	};
	
})();

var HtmlUtil = (function(){
	
	var parseHtmlMap = {
		"<":"&lt;"
		,">":"&gt;"
		,"\r\n":"<br>"
		," ":"&nbsp;"
		,"\t":"&nbsp;&nbsp;&nbsp;&nbsp;"
	}
	
	var parseTextMap = {
		"\&nbsp;":' '
		,"\<br ?\/?\>":'\r\n'
		,"\&lt;":"<"
		,"\&gt;":">"
	}
	
	function parse(content,map){
		for(var key in map){
			content = content.replace(new RegExp(key, "g"),map[key]);
		}
		return content;
	}
	
	return {
		parseToHtml:function(text){
			return parse(text,parseHtmlMap);
		}
		,parseToText:function(html){
			return parse(html,parseTextMap);
		}
	}
	
}());
/**
 * 使用方法:
 * 开启:MaskUtil.mask();
 * 关闭:MaskUtil.unmask();
 * 
 * MaskUtil.mask('其它提示文字...');
 */
var MaskUtil = (function(){
	
	var $mask,$maskMsg;
	
	var defMsg = '正在处理，请稍待。。。';
	
	function init(){
		if(!$mask){
			$mask = $("<div class=\"datagrid-mask mymask\"></div>").appendTo("body");
		}
		if(!$maskMsg){
			$maskMsg = $("<div class=\"datagrid-mask-msg mymask\">"+defMsg+"</div>")
				.appendTo("body").css({'font-size':'12px'});
		}
		
		$mask.css({width:"100%",height:$(document).height()});
		
		$maskMsg.css({
			left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2
		}); 
				
	}
	
	return {
		mask:function(msg){
			init();
			$mask.show();
			$maskMsg.html(msg||defMsg).show();
		}
		,unmask:function(){
			$mask.hide();
			$maskMsg.hide();
		}
	}
	
}());

var MsgUtil = {
	topMsg:function(msg,title){
		title = title || "提示";
		this.getJQ().messager.show({
			title: title,
			msg: msg,
			showSpeed:300,
			style:{
				right:'',
				top:document.body.scrollTop+document.documentElement.scrollTop,
				bottom:''
			}
		});
	}
	,alert:function(msg,title,type){
		title = title || "提示";
		type = type || 'info'
		
		if(msg && msg.length > 1000){
			this.getJQ().messager.show({
				title: title,
				msg: '<div style="height:300px;overflow-y: auto; overflow-x:hidden;">'+msg+'</div>',
				width:600,
				height:350,
				showType:null,
				timeout:0,
				style:{
					right:'',
					bottom:''
				}
			});
		}else{
			$.messager.alert(title,msg,type);
		}
		
	}
	,error:function(msg,title){
		title = title || "错误";
		this.alert(msg,title,'error')
	}
	,confirm:function(msg,callback,title){
		title = title || "确认";
		this.getJQ().messager.confirm(title,msg,function(r){    
		    if (r){    
		        callback();
		    } 
		});
	}
	,getJQ:function(){
		return parent.$ || $;
	}
}  

	


/**
 * VelocityContext.createGrid('id');
 */
var VelocityContext = (function(){
	
	var data = null;
	
	function getData(){
		if(!data){
			data = [
			{"name":"${context.packageName}","value":"包名","group":"${context}"}
			,{"name":"${context.javaBeanName}","value":"Java类名","group":"${context}"}
			,{"name":"${context.pkName}","value":"表主键名","group":"${context}"}
			,{"name":"${context.javaPkName}","value":"表主键对应的java字段名","group":"${context}"}
			,{"name":"${context.javaPkType}","value":"主键的java类型","group":"${context}"}
			,{"name":"${context.mybatisPkType}","value":"主键对应的mybatis类型","group":"${context}"}
			
			,{"name":"${table.tableName}","value":"数据库表名","group":"${table}"}
			
			
			,{"name":"${pkColumn}","value":"主键对象<br>即${columns}中的一个元素","group":"${pkColumn}"}
			
			,{"name":"${column.columnName}","value":"表中字段名","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.type}","value":"字段的数据库类型","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.javaFieldName}","value":"java字段名","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.javaFieldNameUF}","value":"java字段名<br>并且第一个字母大写","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.javaType}","value":"字段的java类型","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.javaTypeBox}","value":"字段的java装箱类型<br>如Integer,Long","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.isIdentity}","value":"是否自增,返回boolean","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.isPk}","value":"是否主键,返回boolean","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.isIdentityPk}","value":"是否自增主键,返回boolean","group":"#foreach($column in $columns)...#end"}
			,{"name":"${column.mybatisJdbcType}","value":"返回mybatis定义的jdbcType,<br>如VARCHAR,INTEGER等","group":"#foreach($column in $columns)...#end"}
			]
		}
		return data;	
	}
	
	return {
		/**
		 * 创建Velocity参数列表
		 */
		createGrid:function(id){
			var $pgVelocity = $('<table></table>');
			$('#'+id).html($pgVelocity);
			$pgVelocity.propertygrid({    
			    showGroup: true,    
			    fitColumns:true,
			    border:false,
			    scrollbarSize: 0    
			}).propertygrid('loadData',getData());
			
			return $pgVelocity;
		}
	}
	
}());
