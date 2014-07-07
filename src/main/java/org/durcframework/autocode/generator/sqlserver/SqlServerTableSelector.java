package org.durcframework.autocode.generator.sqlserver;

import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.TableSelector;

public class SqlServerTableSelector extends TableSelector {

	public SqlServerTableSelector(DataBaseConfig dataBaseConfig) {
		super(dataBaseConfig);
	}

	@Override
	protected String getShowTablesSQL() {
		return "SELECT name FROM sys.tables ORDER BY name";
	}

}
