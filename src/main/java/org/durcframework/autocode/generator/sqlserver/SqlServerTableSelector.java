package org.durcframework.autocode.generator.sqlserver;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.TableBean;
import org.durcframework.autocode.generator.TableSelector;
import org.durcframework.autocode.util.SqlHelper;

public class SqlServerTableSelector extends TableSelector {

	public SqlServerTableSelector(DataBaseConfig dataBaseConfig) {
		super(dataBaseConfig);
	}

	@Override
	protected String getShowTablesSQL() {
		return "SELECT name FROM sys.tables ORDER BY name";
	}

	@Override
	public List<TableBean> getTableList() {
		List<Map<String, Object>> resultList = SqlHelper.runSql(getDataBaseConfig(), getShowTablesSQL());
		List<TableBean> tableNames = new ArrayList<TableBean>();
		
		for (Map<String, Object> rowMap : resultList) {
			Set<String> keySet = rowMap.keySet();
			for (String key : keySet) {
				String tableName = (String)rowMap.get(key);
				tableNames.add(new TableBean(tableName));
			}
		}
		
		return tableNames;
	}

}
