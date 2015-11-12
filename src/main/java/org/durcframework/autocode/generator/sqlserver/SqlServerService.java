package org.durcframework.autocode.generator.sqlserver;

import org.durcframework.autocode.generator.ColumnSelector;
import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.SQLService;
import org.durcframework.autocode.generator.TableSelector;

public class SqlServerService implements SQLService {

	@Override
	public TableSelector getTableSelector(DataBaseConfig dataBaseConfig) {
		return new SqlServerTableSelector(new SqlServerColumnSelector(dataBaseConfig), dataBaseConfig);
	}

	@Override
	public ColumnSelector getColumnSelector(DataBaseConfig dataBaseConfig) {
		return new SqlServerColumnSelector(dataBaseConfig);
	}

}
