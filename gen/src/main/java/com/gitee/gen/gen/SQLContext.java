package com.gitee.gen.gen;

import com.gitee.gen.util.FieldUtil;

import java.util.List;

/**
 * SQL上下文,这里可以取到表,字段信息<br>
 * 最终会把SQL上下文信息放到velocity中
 */
public class SQLContext {

	/** 表结构定义 */
	private TableDefinition tableDefinition;
	/** 包名 */
	private String packageName;
	/** 数据库名 */
	private String dbName;

	public SQLContext(TableDefinition tableDefinition){
		this.tableDefinition = tableDefinition;
		// 默认为全字母小写的类名
		this.packageName = getJavaBeanName().toLowerCase();
	}
	
	/**
	 * 返回Java类名
	 * @return
	 */
	public String getJavaBeanName(){
		String tableName = getJavaBeanNameLF();
		return FieldUtil.upperFirstLetter(tableName);
	}
	
	/**
	 * 返回Java类名且首字母小写
	 * @return
	 */
	public String getJavaBeanNameLF(){
		String tableName = tableDefinition.getTableName();
		tableName = FieldUtil.underlineFilter(tableName);
		tableName = FieldUtil.dotFilter(tableName);
		return FieldUtil.lowerFirstLetter(tableName);
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

	public String getDbName() {
		return dbName;
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}
}
