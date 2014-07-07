package org.durcframework.autocode.generator;

import java.util.List;

public abstract class TableSelector {

	private DataBaseConfig dataBaseConfig;

	public TableSelector(DataBaseConfig dataBaseConfig) {
		this.dataBaseConfig = dataBaseConfig;
	}

	/**
	 * 查询数据库表的SQL
	 * 
	 * @return
	 */
	protected abstract String getShowTablesSQL();

	/**
	 * 返回表结构
	 * 
	 * @return
	 */
	public abstract List<TableBean> getTableList();

	public DataBaseConfig getDataBaseConfig() {
		return dataBaseConfig;
	}

	public void setDataBaseConfig(DataBaseConfig dataBaseConfig) {
		this.dataBaseConfig = dataBaseConfig;
	}

}
