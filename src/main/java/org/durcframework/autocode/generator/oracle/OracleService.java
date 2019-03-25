package org.durcframework.autocode.generator.oracle;

import org.durcframework.autocode.generator.ColumnSelector;
import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.SQLService;
import org.durcframework.autocode.generator.TableSelector;

public class OracleService implements SQLService {

	@Override
	public TableSelector getTableSelector(DataBaseConfig dataBaseConfig) {
		return new OracleTableSelector(new OracleColumnSelector(dataBaseConfig), dataBaseConfig);
	}

	@Override
	public ColumnSelector getColumnSelector(DataBaseConfig dataBaseConfig) {
		return new OracleColumnSelector(dataBaseConfig);
	}


}
