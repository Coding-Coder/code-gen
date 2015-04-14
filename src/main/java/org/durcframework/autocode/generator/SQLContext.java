package org.durcframework.autocode.generator;

import java.util.List;

import org.durcframework.autocode.util.FieldUtil;

/**
 * SQL上下文,这里可以取到表,字段信息<br>
 * 最终会把SQL上下文信息放到velocity中
 */
public class SQLContext {
	private TableDefinition tableDefinition; // 表结构定义
	private String packageName; // 包名
	
	public SQLContext(TableDefinition tableDefinition){
		this.tableDefinition = tableDefinition;
		// 默认为全字母小写的类名
		this.packageName = getJavaBeanName().toLowerCase();
	}
	
	public String getJavaBeanName(){
		String tableName = tableDefinition.getTableName();
		tableName = FieldUtil.underlineFilter(tableName);
		tableName = FieldUtil.dotFilter(tableName);
		return FieldUtil.upperFirstLetter(tableName);
	}
	
	public String getPkName(){
		if(this.tableDefinition.getPkColumn() != null){
			return this.tableDefinition.getPkColumn().getColumnName();
		}
		return "";
	}
	
	public String getJavaPkName(){
		if(this.tableDefinition.getPkColumn() != null){
			return this.tableDefinition.getPkColumn().getJavaFieldName();
		}
		return "";
	}
	
	public String getJavaPkType(){
		if(this.tableDefinition.getPkColumn() != null){
			return this.tableDefinition.getPkColumn().getJavaType();
		}
		return "";
	}
	
	public String getMybatisPkType(){
		if(this.tableDefinition.getPkColumn() != null){
			return this.tableDefinition.getPkColumn().getMybatisJdbcType();
		}
		return "";
	}

	public TableDefinition getTableDefinition() {
		return tableDefinition;
	}

	public void setTableDefinition(TableDefinition tableDefinition) {
		this.tableDefinition = tableDefinition;
	}
	
	public List<ColumnDefinition> getColumnDefinitionList(){
		return tableDefinition.getColumnDefinitions();
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}
	
}
