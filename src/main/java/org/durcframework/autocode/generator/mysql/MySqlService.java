package org.durcframework.autocode.generator.mysql;

import org.durcframework.autocode.generator.ColumnSelector;
import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.SQLService;
import org.durcframework.autocode.generator.TableSelector;

public class MySqlService implements SQLService {

	@Override
	public TableSelector getTableSelector(DataBaseConfig dataBaseConfig) {
		return new MySqlTableSelector(new MySqlColumnSelector(dataBaseConfig), dataBaseConfig);
	}

	@Override
	public ColumnSelector getColumnSelector(DataBaseConfig dataBaseConfig) {
		return new MySqlColumnSelector(dataBaseConfig);
	}


}
