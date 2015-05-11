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