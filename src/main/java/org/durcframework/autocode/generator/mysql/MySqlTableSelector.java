package org.durcframework.autocode.generator.mysql;

import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.TableSelector;

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

}
