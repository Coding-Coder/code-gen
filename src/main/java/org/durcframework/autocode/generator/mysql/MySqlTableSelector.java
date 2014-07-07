package org.durcframework.autocode.generator.mysql;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.TableBean;
import org.durcframework.autocode.generator.TableSelector;
import org.durcframework.autocode.util.SqlHelper;

/**
 * 查询mysql数据库表
 */
public class MySqlTableSelector extends TableSelector {
	
	public MySqlTableSelector(DataBaseConfig dataBaseConfig) {
		super(dataBaseConfig);
	}

	@Override
	protected String getShowTablesSQL() {
		return "SHOW TABLES";
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
