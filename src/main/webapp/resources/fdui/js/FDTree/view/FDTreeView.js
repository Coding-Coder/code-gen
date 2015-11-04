/**
 * FDTree的视图层
 * @private
 */
var FDTreeView = function(options) {
	this.options = options;
	this.div = document.createElement(FDTag.DIV);
	this.div.className = 'pui-tree ui-widget ui-widget-content ui-corner-all';
	
	this.uniqueIdPrefix = 'fdtree_' + FDControl.generateCount() + '_'
	this.objId = 'objId_' + FDControl.generateCount();
	FDTreeView.objs[this.objId] = this;
	this.nodeStore = {};
	
	FDLib.getEl(options.domId).appendChild(this.div);
	
	//this._buildEvent();
}

FDTreeView.objs = {};
FDTreeView.nodeStore = {};

FDTreeView.prototype = {
	refresh:function(data) {
		this.buildTree(data);
	}
	,hide:function() {
		FDLib.dom.hideDom(this.div);
	}
	,show:function() {
		FDLib.dom.showDom(this.div);
	}
	,clickNode:function(id) {
		var uniqueId = this._wrapId2UniqueId(id);
		var span = FDLib.getEl(uniqueId);
		if(span) {
			this._expandParent(span);
			// 执行点击节点事件
			this._clickNode(span);
		}
	}
	,select:function(id,callback) {
		this._doSelectOption(id,function(nodeObj,checkbox){
			checkbox.checked = true;
			if(FDLib.util.isFunction(callback)) {
				callback(nodeObj,checkbox);
			}
		});
	}
	,unselect:function(id,callback) {
		this._doSelectOption(id,function(nodeObj,checkbox){
			checkbox.checked = false;
			if(FDLib.util.isFunction(callback)) {
				callback(nodeObj,checkbox);
			}
		});
	}
	,selectAll:function(callback) {
		this._doSelectAllOption(function(nodeObj,checkbox){
			checkbox.checked = true;
			if(FDLib.util.isFunction(callback)) {
				callback(nodeObj,checkbox);
			}
		});
	}
	,unselectAll:function(callback) {
		this._doSelectAllOption(function(nodeObj,checkbox){
			checkbox.checked = false;
			if(FDLib.util.isFunction(callback)) {
				callback(nodeObj,checkbox);
			}
		});
	}
	// 反选
	,selectOthers:function(callback) {
		this._doSelectAllOption(function(nodeObj,checkbox){
			checkbox.checked = !checkbox.checked;
			if(FDLib.util.isFunction(callback)) {
				callback(nodeObj,checkbox);
			}
		});
	}
	,_doSelectAllOption:function(callback) {
		if(this._getOptionsValue('checkable')) {
			var that = this;
			var allCheckboxes = this._getAllCheckboxes();
			FDLib.util.each(allCheckboxes,function(checkbox){
				var nodeObj = that._getNodeObjById(checkbox.value);
				callback(nodeObj,checkbox);
			});
		}
	} 
	,_getAllCheckboxes:function() {
		return FDLib.dom.getChildNodes(this.div,'input');
	}
	,getSelectedCheckboxes:function() {
		if(!this._getOptionsValue('checkable')) {
			return [];
		}
		var selectedCheckboxes = [];
		var allCheckboxes = this._getAllCheckboxes();
		FDLib.util.each(allCheckboxes,function(checkbox){
			if(checkbox.checked) {
				selectedCheckboxes.push(checkbox);
			}
		});
		
		return selectedCheckboxes;
	}
	,_doSelectOption:function(id,callback) {
		if(this._getOptionsValue('checkable')) {
			var uniqueId = this._wrapId2UniqueId(id);
			var span = FDLib.getEl(uniqueId);
			if(span) {
				this._expandParent(span);
				var checkbox = FDLib.dom.getChildNodes(span,'input')[0];
				
				if(checkbox && id == checkbox.value) {
					var nodeObj = this._getNodeObjById(checkbox.value);
					callback(nodeObj,checkbox);
				}
			}
		}
	}
	// 展开父节点
	,_expandParent:function(span) {
		var pId = span.getAttribute('pId');
		if(pId) {
			span = FDLib.getEl(pId);
			this.expand(span,span.nextSibling);
			this._expandParent(span);
		}
	}
	/**
	 * 展开关闭
	 */
	,toggle:function(target) {
		if(this._hasChildNode(target)) {
			var ul = target.parentNode.nextSibling;
			if(!ul.isExpand) {
				this.expand(target,ul);
			}else{
				this.collapse(target,ul);
			}
		}
	}
	,expand:function(target,ul) {
		FDLib.dom.removeClass(target,'ui-icon-triangle-1-e');
		FDLib.dom.addClass(target,'ui-icon-triangle-1-s');
		ul.isExpand = true;
		FDLib.dom.showDom(ul);
	}
	,collapse:function(target,ul) {
		FDLib.dom.removeClass(target,'ui-icon-triangle-1-s');
		FDLib.dom.addClass(target,'ui-icon-triangle-1-e');
		ul.isExpand = false;
		FDLib.dom.hideDom(ul);
	}
	/**
	 * 全部展开
	 */
	,expandAll:function(callback) {
		var spans = FDLib.dom.getChildNodes(this.div,'span');
		var that = this;
		FDLib.util.each(spans,function(span){
			if(that._hasChildNode(span)) {
				that.expand(span);
				if(FDLib.util.isFunction(callback)) {
					var nodeObj = that._getNodeObjByUniqueId(span.id);
					callback(nodeObj);
				}
			}
		});
	}
	/**
	 * 全部收缩
	 */
	,collapseAll:function(callback) {
		var spans = FDLib.dom.getChildNodes(this.div,'span');
		var that = this;
		FDLib.util.each(spans,function(span){
			if(that._hasChildNode(span)) {
				that.collapse(span);
				if(FDLib.util.isFunction(callback)) {
					var nodeObj = that._getNodeObjByUniqueId(span.id);
					callback(nodeObj);
				}
			}
		});
	}
	,buildTree:function(rows) {
		var jStr = new JString();
		jStr.append('<ul class="pui-tree-container">');
		for(var i=0,len=rows.length;i<len;i++) {
			this.buildTreeHtml(rows[i],jStr);
		}
		jStr.append('</ul>');
		
		this.div.innerHTML = jStr.toString();
	}
	,buildTreeHtml:function(node,jStr) {
		this._createId(node);
		var children = this._getChildren(node);
		// 储存node
		this._storeNode(node);
		var hasChildren = children.length>0;
		var liClassName = 'pui-treenode' + (hasChildren ? ' pui-treenode-parent' : '');
		
		jStr.append('<li class="' + liClassName + '">');
		// 如果有子节点
		if(hasChildren){
			jStr.append(this._buildNodeDisplay(node));
			// 当前节点名称
			//jStr.append(this._buildToggleNodeHtml(node));
			// 构建子节点
			jStr.append('<ul class="pui-treenode-children" style="display: none;">');
			for(var i=0,len=children.length;i<len;i++) {
				children[i].parentUniqueId = this._getUniqueId(node);
				this.buildTreeHtml(children[i],jStr);
			}
			jStr.append('</ul>');
		} else{ // 如果没有子节点就直接输出文本
			jStr.append(this._buildNormalNodeHtml(node));
		}
		
		jStr.append('</li>');
	}
	,_createId:function(node) {
		var id = (this._getNodeId(node) || FDControl.generateCount());
		this._setNodeId(node,id);
	}
	,_buildToggleNodeHtml:function(node) {
		var nodeStr = new JString();
		// 父节点uniqueId
		var pId = node.parentUniqueId ? 'pId='+node.parentUniqueId : '';
		nodeStr.append('<span class="pui-treenode-content pui-treenode-selectable" isroot="true" '+pId+'>').append('<a href="javascript:void(0)">+</a>')
			.append(this._buildNodeTextHtml(node))
			.append('</span>');
		
		return nodeStr.toString();
	}
	,_buildNodeDisplay:function(node) {
		var nodeStr = new JString();
		var textHtml = this._buildNodeTextHtml(node);
		
		var toggleFun = 'FDTreeView.objs[\''+this.objId+'\'].toggle(this);';
		var toggler = '<span onclick="'+toggleFun+'" class="pui-tree-toggler ui-icon ui-icon-triangle-1-e"></span>';
		
		var iconClassName = node.iconClassName || 'ui-icon-folder-collapsed';
		var icon = '<span class="pui-treenode-icon ui-icon ' + iconClassName + '"></span>';
		
		var funStr = 'FDTreeView.objs[\''+this.objId+'\']._clickNode(this);';
		var text = '<span id="' + this._getUniqueId(node) + '" onclick="'+funStr+'" class="pui-treenode-label ui-corner-all">'+textHtml+'</span>';
		// 父节点uniqueId
		var pId = node.parentUniqueId ? 'pId='+node.parentUniqueId : '';
		
		nodeStr.append('<span class="pui-treenode-content pui-treenode-selectable" id="' + this._getUniqueId(node) + '" '+pId+'>')
			.append(toggler)
			.append(icon)
			.append(text)
			.append('</span>');

		return nodeStr.toString();
	}
	,_buildNormalNodeHtml:function(node) {
				var nodeStr = new JString();
		var textHtml = this._buildNodeTextHtml(node);
		
		var toggler = '<span class="pui-treenode-leaf-icon"></span>';
		
		var iconClassName = node.iconClassName || 'ui-icon-document';
		var icon = '<span class="pui-treenode-icon ui-icon ' + iconClassName + '"></span>';
		
		var funStr = 'FDTreeView.objs[\''+this.objId+'\']._clickNode(this);';
		var text = '<span id="' + this._getUniqueId(node) + '" onclick="'+funStr+'" class="pui-treenode-label ui-corner-all">'+textHtml+'</span>';
		// 父节点uniqueId
		var pId = node.parentUniqueId ? 'pId='+node.parentUniqueId : '';
		
		nodeStr.append('<span class="pui-treenode-content pui-treenode-selectable" id="' + this._getUniqueId(node) + '" '+pId+'>')
			.append(toggler)
			.append(icon)
			.append(text)
			.append('</span>');

		return nodeStr.toString();
	}
	,_buildNodeTextHtml:function(node) {
		var text = '';
		if(this._getOptionsValue('checkable')) {
			text += this._buildCheckboxHtml(node);
		}
		text += this._getNodeText(node);
		
		return text;
	}
	,_buildEvent:function() {
		var that = this;
		FDLib.event.addBatchEvent({
			superDom:this.div // 父节点DOM对象
			,tagName:'SPAN'  // 子节点的类型
			,eventName:'click' // 事件名
			,handler:function(target) {  // 执行方法,target是子节点的DOM对象
				that._clickNode(target);
			}
		});
		
		FDLib.event.addBatchEvent({
			superDom:this.div // 父节点DOM对象
			,tagName:'A'  // 子节点的类型
			,eventName:'click' // 事件名
			,handler:function(a) {  // 执行方法,target是子节点的DOM对象
				var target = a.parentNode;
				that.toggle(target);
			}
		});
	}
	,_buildCheckboxHtml:function(node) {
		var nodeId = this._getNodeId(node);
		var funStr = 'FDTreeView.objs[\''+this.objId+'\'].runCheckboxClick(event);';
		return '<input type="checkbox" onclick="'+funStr+'" value="'+nodeId+'">';
	}
	,runCheckboxClick:function(event) {
		event = FDLib.event.formatEvent(event);
		var checkbox = event.target;
		var that = this;
		var span = checkbox.parentNode;
		
		this._runOncheckHandler(checkbox.value,checkbox);
		// 如果有子节点
		if(this._hasChildNode(span)) {
			var ul = span.parentNode.nextSibling; // 子节点
			var inputs = FDLib.dom.getChildNodes(ul,'input');
			FDLib.util.each(inputs,function(input){
				input.checked = checkbox.checked;
				that._runOncheckHandler(input.value,input);
			})
		}
		
		event.stopPropagation();
	}
	// 运行checkbox事件
	,_runOncheckHandler:function(uniqueId,checkbox) {
		var node = this._getNodeObjById(uniqueId);
		var oncheckHandler = this._getOptionsValue('onchecked');
		if(FDLib.util.isFunction(oncheckHandler)) {
			oncheckHandler(node,checkbox);
		}
	}
	// target is SPAN
	,_clickNode:function(target) {
		if(this._getOptionsValue('clickToggle')) {
			this.toggle(target);
		}
		this._setHighlight(target);
		this._runOnclickHandler(target.id);
	}
	// 获取node对象中的子节点
	// 没有则返回一个空数组
	,_getChildren:function(node) {
		return node[this._getOptionsValue('childrenFieldName')] || [];
	}
	,_getNodeId:function(node) {
		return node[this._getOptionsValue('valueFieldName')]
	}
	,_setNodeId:function(node,id) {
		node[this._getOptionsValue('valueFieldName')] = id;
	}
	,_getUniqueId:function(node) {
		return this._wrapId2UniqueId(this._getNodeId(node));
	}
	,_wrapId2UniqueId:function(id) {
		return this.uniqueIdPrefix + id;
	}
	,_getNodeText:function(node) {
		return node[this._getOptionsValue('textFieldName')];
	}
	,_getOptionsValue:function(proName) {
		return this.options[proName];
	}
	// 是否有子节点
	,_hasChildNode:function(target) {
		return !!target.parentNode.nextSibling;
	}
	// 运行onclick事件
	,_runOnclickHandler:function(uniqueId) {
		var node = this._getNodeObjByUniqueId(uniqueId);
		if(this.options.onclick) {
			this.options.onclick(node);
		}
	}
	// 设置高亮
	,_setHighlight:function(target) {
		this._removeOtherHighlight();
		FDLib.dom.addClass(target,'selected');
	}
	// 移除高亮状态
	,_removeOtherHighlight:function() {
		var spanArr = this._getAllClickNodes();
		var domUtil = FDLib.dom;
		FDLib.util.each(spanArr,function(span){
			if(domUtil.hasClass(span,'selected')) {
				domUtil.removeClass(span,'selected');
				return false; // 退出循环
			}
		});
	}
	// 获取所有可点击的节点
	,_getAllClickNodes:function() {
		return FDLib.dom.getChildNodes(this.div,'span');
	}
	,_getNodeObjById:function(id) {
		var uniqueId = this._wrapId2UniqueId(id);
		return this._getNodeObjByUniqueId(uniqueId);
	}
	,_getNodeObjByUniqueId:function(uniqueId) {
		return this.nodeStore[uniqueId];
	}
	// 根据uniqueId储存node
	,_storeNode:function(node) {
		var id = this._getUniqueId(node);
		this.nodeStore[id] = node;
	}
}
