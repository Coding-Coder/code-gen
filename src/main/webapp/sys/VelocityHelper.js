/**
 * VelocityHelper.show()
 */
var VelocityHelper = (function(){
	
	var treeData = null;
	
	var treeDomId = '_treeDomId';
	var winDomId = '_veloctyHelper';
	
	var tree,win;
	
	function getData(){		
		if(!treeData) {
			treeData = [
				{text:'${pkColumn} : 主键对象,即${columns}中的一个元素'}
				,{
			     	text:'${context}'
			     	,children:[
			     		{text:'${context.packageName} : 包名'}
			     		,{text:'${context.javaBeanName} : Java类名'}
			     		,{text:'${context.javaBeanNameLF} : Java类名且首字母小写'}
			     		,{text:'${context.pkName} : 表主键名'}
			     		,{text:'${context.javaPkName} : 表主键对应的java字段名'}
			     		,{text:'${context.javaPkType} : 主键的java类型'}
			     		,{text:'${context.mybatisPkType} : 主键对应的mybatis类型'}
			     	]
			     }
			     ,{text:'${table}'
			     	,children:[
			     		{text:'${table.tableName} : 数据库表名'}
			     		,{text:'${table.comment} : 表注释'}
			     	]
			     }
			     ,{text:'#foreach($column in $columns)...#end'
			     	,children:[
			     		{text:'$column.columnName : 表中字段名'}
			     		,{text:'$column.type : 字段的数据库类型'}
			     		,{text:'$column.javaFieldName : java字段名'}
			     		,{text:'$column.javaFieldNameUF : java字段名首字母大写'}
			     		,{text:'$column.javaType : 字段的java类型'}
			     		,{text:'$column.javaTypeBox : 字段的java装箱类型,如Integer,Long'}
			     		,{text:'$column.isIdentity : 是否自增,返回boolean'}
			     		,{text:'$column.isPk} : 是否自增主键,返回boolean'}
			     		,{text:'$column.isIdentityPk : 是否自增主键,返回boolean'}
			     		,{text:'$column.mybatisJdbcType : 返回mybatis定义的jdbcType'}
			     		,{text:'$column.comment : 表字段注释'}
			     	]
			     }
			];
		}
		return treeData;
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
		,create:function() {
			
			init();
			
			tree = new FDTree({
				domId:treeDomId
				,clickToggle:true
				,data:getData()
			});
			tree.expandAll();
			
			
			win = new FDWindow({
				contentId:winDomId
				,title:'Velocity参数'
				,modal:false
				,width:'400px'
			});
			
		}
		,show:function() {
			if(!win) {
				this.create();
			}
			win.show();
			win.moveTo(getClientWidth()-430,0);
		}
	}
	
	function init() {
		var treeDiv = document.createElement(FDTag.DIV);
		treeDiv.id = treeDomId;
		
		var winDiv = document.createElement(FDTag.DIV);
		winDiv.id = winDomId;
		winDiv.style.display = 'none';
		
		winDiv.appendChild(treeDiv);
		
		document.body.appendChild(winDiv);
	}
	
	function getClientHeight() {
		return document.documentElement.clientHeight || document.body.clientHeight;
	}
	function getClientWidth() {
		return document.documentElement.clientWidth || document.body.clientWidth;
	}
	
}());