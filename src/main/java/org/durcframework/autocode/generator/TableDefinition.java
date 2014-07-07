package org.durcframework.autocode.generator;

import java.util.Collections;
import java.util.List;

/**
 * 数据库表定义,从这里可以获取表名,字段信息
 */
public class TableDefinition {

	private String tableName; // 表名
	private List<ColumnDefinition> columnDefinitions; // 字段定义
	
	public TableDefinition(String tableName) {
		this(tableName, Collections.<ColumnDefinition> emptyList());
	}

	public TableDefinition(String tableName,
			List<ColumnDefinition> columnDefinitions) {
		this.tableName = tableName;
		this.columnDefinitions = columnDefinitions;
	}
	
	public ColumnDefinition getPkColumn(){
		for (ColumnDefinition column : columnDefinitions) {
			if(column.getIsPk()){
				return column;
			}
		}
		return null;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public List<ColumnDefinition> getColumnDefinitions() {
		return columnDefinitions;
	}

	public void setColumnDefinitions(List<ColumnDefinition> columnDefinitions) {
		this.columnDefinitions = columnDefinitions;
	}

}
