/**
 * 设置项
 * @private
 */
var FDSettingView = function(options){
	this.options = options;
	
	this.settingDiv = document.createElement(FDTag.DIV);
	this.settingDiv.id = this.options.domId + '_setting';
	document.body.appendChild(this.settingDiv);
	this.gridDom = FDLib.getEl(this.options.domId);
	
	this.grid = options.getGrid();
	
	this.settingWin = this._createSettingWin();
	
	this.tab = this._createTab();
	
	this.checkbox;
	
	var afterSearch = this.options.afterSearch || function(){};
	
	var that = this;
	this.options.afterSearch = function() {
		afterSearch(options.getGrid(),options);
		that.init();
	}
}

FDSettingView.prototype = {
	
	_createSettingWin:function() {
		var win = new FDWindow({
			contentId:this.settingDiv.id
			,title:'设置项'
			,modal:true
			,buttons:[
				new FDButton({text:'关闭',onclick:function(){
					win.close();
				}})
			]
		});
		
		return win;
	}
	,_createTab:function() {
		var tabDiv = document.createElement(FDTag.DIV);
		tabDiv.id = this.options.domId + "_tab";
		this.settingDiv.appendChild(tabDiv);
		
		var tab = new FDTab({domId:tabDiv.id,items:this._getTabItems()});
		
		return tab;
	}
	,_getTabItems:function() {
		var id = this._createColumnSelect();
		return [
			{text:'列显示',value:1,contentId:id,checked:true}
		]
	}
	,_createColumnSelect:function() {
		var colSelectDiv = document.createElement(FDTag.DIV);
		var id = this.options.domId + '_colSelectId';
		colSelectDiv.id = id;
		document.body.appendChild(colSelectDiv);
		
		this._createCheckboxes(colSelectDiv);
		
		return id;
	}
	,_createCheckboxes:function(colSelectDiv) {
		var columns = this.options.columns;
		var isSelected = this._isHasSelectRowAbility();
		
		// item is {text:"姓名",name:"username"}
		var checkboxItems = [];
		var defVal = [];
		FDLib.util.each(columns,function(item,i){
			var index = isSelected ? (i + 1) : i;
			checkboxItems.push({text:item.text || '#',value:index});
			
			defVal.push(index);
		});
		
		this.checkbox = new FDCheckBox({items:checkboxItems,defaultValue:defVal});
		this.checkbox.renderToDom(colSelectDiv);
		
		var that = this;
		this.checkbox.addEvent('click',function(){
			var index = this.value;
			var isCheck = this.checked;
			
			that.columnSelectorHandler(index,isCheck);
		});
	}
	,_isHasSelectRowAbility:function() {
		return this.grid.isSelectStatus();
	}
	,init:function() {
		var controls = this.checkbox.getControlItems();
		var that = this;
		
		FDLib.util.each(controls,function(checkbox){
			var index = checkbox.value;
			var isCheck = checkbox.checked;
			
			that.columnSelectorHandler(index,isCheck);
		});
	}
	// 隐藏列勾选事件
	,columnSelectorHandler:function(index,checked) {
		var thead = this.grid.getThead();
		
		var theadThs = thead.getElementsByTagName('th');
		var tbodyTrs = this.grid.getTableTR();
		
		this.toggleHeadColumn(theadThs,index,checked);
		this.toggleBodyColumn(tbodyTrs,index,checked);
	}
	,toggleHeadColumn:function(theadThs,index,isCheck) {
		var th = theadThs[index];
		if(isCheck) {
				FDLib.dom.showDom(th);	
		}else{
			FDLib.dom.hideDom(th);
		}
	}
	,toggleBodyColumn:function(trs,index,isCheck) {
		FDLib.util.each(trs,function(tr){
			var td = tr.cells[index];
			if(isCheck) {
					FDLib.dom.showDom(td);	
			}else{
				FDLib.dom.hideDom(td);
			}
		});
	}
	,showWin:function() {
		this.settingWin.show();
	}
};
