/**
 * var crud = Crud.create({
 *  pk:'id'
	,addUrl:ctx + 'addDataSource.do'
	,updateUrl:ctx + 'updateDataSource.do'
	,delUrl:ctx + 'delDataSource.do'
	,dlgId:'dlg'
	,formId:'fm'
	,girdId:'dg'
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
			this.$form.form('clear');
			this.submitUrl = this.addUrl;
		}
		,update:function(row,title){
			title = title || '修改'
			if (row){
				this.$dlg.dialog('open').dialog('setTitle',title);
				this.$form.form('clear').form('load',row);
				this.submitUrl = this.updateUrl + ['?',this.pk,'=',row[this.pk]].join('');
			}
		}		,del:function(row,msg){
			msg = msg || '确定要删除该数据吗?';
			var self = this;
			if (row){
				var $ = parent.$ || $;
				$.messager.confirm('Confirm',msg,function(r){
					if (r){
						$.post(self.delUrl,row,function(result){
							if (result.success){
								self.$grid.datagrid('reload');	// reload the user data
							} else {
								$.messager.show({	// show error message
									title: '提示',
									msg: result.errorMsg
								});
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
						errorMsg = errorMsg || buildValidateError(result)
						parent.$.messager.show({
							title: '提示',
							msg: errorMsg,
							style:{
								right:'',
								top:document.body.scrollTop+document.documentElement.scrollTop,
								bottom:''
							}
						});
					}
				}
			});
		}
		,closeDlg:function(){
			this.$dlg.dialog('close');
		}
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