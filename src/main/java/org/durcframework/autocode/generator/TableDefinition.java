package org.durcframework.autocode.generator;

import java.util.Collections;
import java.util.List;

/**
 * 数据库表定义,从这里可以获取表名,字段信息
 */
public class TableDefinition {

	private String tableName; // 表名
	private String comment; // 注释
	private List<ColumnDefinition> columnDefinitions = Collections.emptyList(); // 字段定义

	public TableDefinition() {
	}

	public TableDefinition(String tableName) {
		this.tableName = tableName;
	}

	/**
	 * 是否含有时间字段
	 * @return
	 */
	public boolean getHasDateField() {
		List<ColumnDefinition> columns = getColumnDefinitions();
		for (ColumnDefinition definition : columns) {
			if("Date".equals(definition.getJavaType())) {
				return true;
			}
		}
		return false;
	}

	public ColumnDefinition getPkColumn() {
		for (ColumnDefinition column : columnDefinitions) {
			if (column.getIsPk()) {
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public List<ColumnDefinition> getColumnDefinitions() {
		return columnDefinitions;
	}

	public void setColumnDefinitions(List<ColumnDefinition> columnDefinitions) {
		this.columnDefinitions = columnDefinitions;
	}

}
