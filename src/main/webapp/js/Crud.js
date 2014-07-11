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