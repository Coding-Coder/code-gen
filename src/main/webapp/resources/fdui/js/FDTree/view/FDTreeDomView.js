/**
 * @private
 */
var FDTreeDomView = function(options){
	this.options = options;
	this.childrenFieldName = options.childrenFieldName;
	this.valueFieldName = options.valueFieldName;
	this.textFieldName = options.textFieldName;
	this.onCheck = options.onCheck || function(){};
	this.selectedId = null;
	
	this.treePanel = this.buildTreePanel();
	
	this.togglers = [];
	// id对应LI
	this.idNodeMap = {}
	// id对应的rowData
	this.idDataMap = {};
}

FDTreeDomView.prototype = {
	refresh:function(rowsData){
		if(rowsData) {
			var ul = this.buildUL(rowsData,'pui-tree-container');
			this.treePanel.innerHTML = '';
			this.treePanel.appendChild(ul);
			this.render();
		}
	}
	,hide:function(){
		FDLib.dom.hideDom(this.treePanel);
	}
	,show:function(){
		FDLib.dom.showDom(this.treePanel);
	}
	,buildUL:function(rowsData,className,parentLi) {
		var ul = document.createElement(FDTag.UL);
		ul.className = className;
		
		for(var i=0,len=rowsData.length;i<len;i++) {
			var li = this.buildLi(rowsData[i]);
			ul.appendChild(li);
			if(parentLi){
				li.parentLi = parentLi;
			}
		}
		
		return ul;
	}
	
	//构建节点LI
	/*,LI的结构:
	<li class="pui-treenode">
		// nodeDisplay
		<span class="pui-treenode-content pui-treenode-selectable">
	  		<span class="pui-treenode-leaf-icon"></span> // toggler
	  		<span class="pui-treenode-icon ui-icon ui-icon-folder-collapsed"></span> // icon
	  		<span class="pui-treenode-label ui-corner-all ui-state-highlight ">Spring</span> // label
	   	</span>
	   	// 子节点内容
	   	<ul>...</ul>
	</li>
	 */
	,buildLi:function(rowData){
		var li = document.createElement(FDTag.LI);
		var liClassName = 'pui-treenode' + (this._isOpen(rowData) ? ' pui-treenode-expanded' : '');
		// 构建节点内容,显示的图标,文字等
		var nodeDisplay = this.buildNodeDisplay(rowData,li);
		li.appendChild(nodeDisplay);
		// 如果有子节点
		if(this.hasChild(rowData)){
			li.isParent = true;
			liClassName += ' pui-treenode-parent';
			var childrenData = this.getChildren(rowData);
			// 构建子节点内容
			var childrenUL = this.buildChildren(childrenData,li);
			
			li.toggler.childrenUL = childrenUL;
			
			li.appendChild(childrenUL);
		}
		li.className = liClassName;
		
		this.storeNode(rowData,li);
		
		return li;
	}
	,buildChildren:function(rowsData,parentLi){
		var childrenUL = this.buildUL(rowsData,'pui-treenode-children',parentLi);
		childrenUL.style.display = "none";
		return childrenUL;
	}
	,buildNodeDisplay:function(rowData,li) {
		var displaySpan = document.createElement(FDTag.SPAN);
		displaySpan.className = 'pui-treenode-content pui-treenode-selectable';
		
		var toggler = this.buildToggler(rowData);
		var icon = this.buildIcon(rowData,toggler);
		var checkbox = this.buildCheckbox(rowData);
		var lab = this.buildLabel(rowData,toggler);
		
		this.togglers.push(toggler);
		displaySpan.appendChild(toggler);
		
		if(icon){
			displaySpan.appendChild(icon);
		}
		if(checkbox){
			displaySpan.appendChild(checkbox);
		}
		displaySpan.appendChild(lab);
		
		li.toggler = toggler;
		li.icon = icon;
		li.lab = lab;
		
		return displaySpan;
	}
	,storeNode:function(rowData,li){
		this.idNodeMap[this.getId(rowData)] = li;
	}
	,getNode:function(id){
		return this.idNodeMap[id];
	}
	,buildToggler:function(rowData){
		var className = 'pui-tree-toggler ui-icon ' 
			+ ( (rowData.state && 'open' == rowData.state) ? this.getOpenClassName() : this.getCloseClassName());
		// 没有子节点,隐藏箭头
		if(!this.hasChild(rowData)){
			className = 'pui-treenode-leaf-icon';
		}
		
		var span = this._createNodeSpan(className);
		var that = this;
		
		span.onclick = function() {
			that.toggle(this,rowData);
		};
		
		return span;
	}
	,buildIcon:function(rowData,toggler){
		var iconCls = rowData.iconCls;
		if(iconCls){
			var className = 'pui-treenode-icon ui-icon ' + (iconCls ? iconCls : '');
			var icon = this._createNodeSpan(className);
			FDLib.event.addEvent(icon,'click',function(){
				toggler.onclick();
			});
			
			return icon;
		}
		return null;
	}
	,buildLabel:function(rowData,toggler){
		var className = 'pui-treenode-label ui-corner-all';
		var lab = this._createNodeSpan(className,this.getText(rowData));
		// 点击文字伸缩
		var isClickToggle = this.options.clickToggle;
		var that = this;
		var isHoverEffect = true;
		
		var hoverEffectHandler = this.options.hoverEffectHandler;
		if(FDLib.util.isFunction(hoverEffectHandler)){
			isHoverEffect = hoverEffectHandler(rowData,lab);
		}
		if(isHoverEffect){
			FDLib.addHoverEffect(lab);
		}
		
		lab.onclick = function(){
			if(isClickToggle){
				toggler.onclick();
			}
			if(that.options.onclick) {
				that.options.onclick(rowData);
			}
			that.setClickHighlight(lab,rowData);
		}
		
		return lab;
	}
	,buildCheckbox:function(rowData,lab){
		if(this.options.checkable){
			var that = this;
			var checkbox = document.createElement(FDTag.INPUT);
			checkbox.type = 'checkbox';
			checkbox.value = rowData[this.valueFieldName];
			checkbox.data = rowData;
			
			checkbox.onclick = function() {
				that.onCheck(rowData,this.checked);
				that.checkChildren(this,rowData,this.checked);
			}
			
			return checkbox;
		}
	}
	,checkChildren:function(selfCheckbox,rowData,isChecked){
		var li = this.getNode(rowData[this.valueFieldName]);
		var checkboxs = li.getElementsByTagName('input');
		
		for(var i=0,len=checkboxs.length; i<len; i++) {
			var checkbox = checkboxs[i];
			if(selfCheckbox == checkbox){
				continue;
			}
			checkbox.checked = isChecked;
			this.onCheck(checkbox.data,isChecked);
		}
	}
	,getId:function(rowData){
		var id = rowData[this.valueFieldName];
		if(!id){
			rowData[this.valueFieldName] = 'tree_node_' + FDControl.generateCount()
		}
		return rowData[this.valueFieldName];
	}
	,storeData:function(rowData){
		var id = this.getId(rowData);
		this.idDataMap[id] = rowData;
	}
	,getRowDataById:function(id){
		return this.idDataMap[id];
	}
	,getText:function(rowData){
		if(this.options.render) {
			return this.options.render(rowData);
		}
		return rowData[this.textFieldName];
	}
	,getOpenClassName:function(){
		return 'ui-icon-triangle-1-s';
	}
	,getCloseClassName:function(){
		return 'ui-icon-triangle-1-e';
	}
	// 展开所有父节点
	,expandParent:function(li){
		var parentLi = li.parentLi;
		if(li && parentLi){
			this.expandByLi(parentLi);
			this.expandParent(parentLi);
		}
	}
	,expandByLi:function(li){
		var toggler = li.toggler;
		if(li && li.isParent && toggler){
			this.expand(toggler);
		}
	}
	,select:function(id,callback){
		this.selectedId = id;
		var data = this.getRowDataById(id);
		var li = this.getNode(id);
		this.expandByLi(li); // 展开当前节点
		this.expandParent(li); // 展开父级
		callback && callback(data);
		li.lab.onclick();
	}
	,getSelected:function(){
		return this.getRowDataById(this.selectedId);
	}
	,getChecked:function(callback){
		var data = [];
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			if(checkbox.checked){
				data.push(checkbox.data);
			}
		}
		return data;
	}
	,getUnChecked:function(){
		var data = [];
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			if(!checkbox.checked){
				data.push(checkbox.data);
			}
		}
		return data;
	}
	,check:function(idArr,callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			for(var j=0,len2=idArr.length; j<len2; j++) {
				if(idArr[j] == checkbox.value){
					checkbox.checked = true;
					this.onCheck(checkbox.data,checkbox.checked);
					callback && callback(checkbox.data,checkbox);
				}
			}
		}
	}
	,uncheck:function(idArr,callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			for(var j=0,len2=idArr.length; j<len2; j++) {
				if(idArr[j] == checkbox.value){
					checkbox.checked = false;
					this.onCheck(checkbox.data,checkbox.checked);
					callback && callback(checkbox.data,checkbox);
				}
			}
		}
	}
	// 全选
	,checkAll:function(callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			checkbox.checked = true;
			this.onCheck(checkbox.data,checkbox.checked);
			callback && callback(checkbox.data,checkbox);
		}
	}
	// 不全选
	,uncheckAll:function(callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			checkbox.checked = false;
			this.onCheck(checkbox.data,checkbox.checked);
			callback && callback(checkbox.data,checkbox);
		}
	}
	// 反选
	,checkOthers:function(callback){
		var allCheckboxs = this.treePanel.getElementsByTagName('input');
		for(var i=0,len=allCheckboxs.length; i<len; i++) {
			var checkbox = allCheckboxs[i];
			checkbox.checked = !checkbox.checked;
			this.onCheck(checkbox.data,checkbox.checked);
			callback && callback(checkbox.data,checkbox);
		}
	}
	,setClickHighlight:function(dom,rowData) {
		var isSetHighlight = true;
		var highlightHandler = this.options.highlightHandler;
		if(FDLib.util.isFunction(highlightHandler)){
			isSetHighlight = highlightHandler(rowData,dom);
		}
		if(isSetHighlight){
			this.doClickHighlight(dom);
		}
	}
	// 设置高亮
	,doClickHighlight:function(dom){
		if(this.lastClickSpan){
			FDLib.dom.removeClass(this.lastClickSpan,'ui-state-highlight');
		}
		this.lastClickSpan = dom;
		FDLib.dom.addClass(dom,'ui-state-highlight');
	}
	,toggle:function(dom,rowData){
		if(this._isOpen(dom)){
			this.collapse(dom);
			rowData.state = 'closed';
		}else{
			this.expand(dom);
			rowData.state = 'open';
		}
	}
	,expandAll:function(){
		for(var i=0,len=this.togglers.length; i<len; i++) {
			this.expand(this.togglers[i]);
		}
	}
	,collapseAll:function() {
		for(var i=0,len=this.togglers.length; i<len; i++) {
			this.collapse(this.togglers[i]);
		}
	}
	,expand:function(toggler){
		toggler.state = 'open';
		var children = toggler.childrenUL;
		if(children){
			FDLib.dom.removeClass(toggler,this.getCloseClassName());
			FDLib.dom.addClass(toggler,this.getOpenClassName());
			children.style.display="block";
		}
	}
	,collapse:function(toggler){
		toggler.state = 'close';
		var children = toggler.childrenUL;
		if(children){
			FDLib.dom.removeClass(toggler,this.getOpenClassName());
			FDLib.dom.addClass(toggler,this.getCloseClassName());
			children.style.display="none";
		}
	}
	,_isOpen:function(dom){
		if(!dom.state) {
			return false;
		}
		return dom.state == 'open';
	}
	,_createNodeSpan:function(className,text){
		var span = document.createElement(FDTag.SPAN);
		span.className = className;
		if(text){
			span.innerHTML = text;
		}
		return span;
	}
	,buildTreePanel:function() {
		var treePanel = document.createElement(FDTag.DIV);
		treePanel.className = 'pui-tree ui-widget ui-widget-content ui-corner-all';
		if(!this.options.showBorder) {
			treePanel.style.border = '0px';
		}
		return treePanel;
	}
	,hasChild:function(rowData){
		return this.getChildren(rowData).length > 0;
	}
	,getChildren:function(rowData) {
		return rowData[this.childrenFieldName] || [];
	}
	,render:function(){
		if(FDRight.checkByCode(this.options.operateCode)) {
			var dom = FDLib.getEl(this.options.domId);
			dom.innerHTML = '';
			dom.appendChild(this.treePanel);
		}
	}
}
