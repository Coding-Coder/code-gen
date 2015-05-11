package org.durcframework.autocode.generator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.durcframework.autocode.util.SqlHelper;

/**
 * 表信息查询
 */
public abstract class ColumnSelector {

	private DataBaseConfig dataBaseConfig;
	
	public ColumnSelector(DataBaseConfig dataBaseConfig){
		this.dataBaseConfig = dataBaseConfig;
	}

	/**
	 * 返回查询表信息的SQL语句,不同的数据查询表信息不一样
	 * 如mysql是DESC tableName
	 * @return
	 */
	protected abstract String getTableDetailSQL(String tableName);
	
	/**
	 * 构建列信息
	 * @param rowMap
	 * @return
	 */
	protected abstract ColumnDefinition buildColumnDefinition(Map<String, Object> rowMap);

	/**
	 * 返回SQL上下文列表
	 * @param tableNames
	 * @return
	 */
	public List<SQLContext> buildSQLContextList(List<String> tableNames) {
		List<SQLContext> contexts = new ArrayList<SQLContext>();
		
		for (String tableName : tableNames) {
			List<Map<String, Object>> resultList = SqlHelper.runSql(this.getDataBaseConfig(), getTableDetailSQL(tableName));
			
			List<ColumnDefinition> columnDefinitionList = new ArrayList<ColumnDefinition>();
			// 构建columnDefinition
			for (Map<String, Object> rowMap : resultList) {
				columnDefinitionList.add(buildColumnDefinition(rowMap));
			}
			
			TableDefinition tableDefinition = new TableDefinition(tableName,columnDefinitionList);
			SQLContext context = new SQLContext(tableDefinition);
						
			contexts.add(context);
		}
	
		return contexts;
	}

	public DataBaseConfig getDataBaseConfig() {
		return dataBaseConfig;
	}

	public void setDataBaseConfig(DataBaseConfig dataBaseConfig) {
		this.dataBaseConfig = dataBaseConfig;
	}

}
