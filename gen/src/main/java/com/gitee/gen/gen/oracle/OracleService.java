package com.gitee.gen.gen.oracle;

import com.gitee.gen.gen.ColumnSelector;
import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.SQLService;
import com.gitee.gen.gen.TableSelector;

public class OracleService implements SQLService {

	@Override
	public TableSelector getTableSelector(GeneratorConfig dataBaseConfig) {
		return new OracleTableSelector(new OracleColumnSelector(dataBaseConfig), dataBaseConfig);
	}

	@Override
	public ColumnSelector getColumnSelector(GeneratorConfig dataBaseConfig) {
		return new OracleColumnSelector(dataBaseConfig);
	}


}
