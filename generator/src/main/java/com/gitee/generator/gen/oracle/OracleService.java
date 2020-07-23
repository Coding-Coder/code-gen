package com.gitee.generator.gen.oracle;

import com.gitee.generator.gen.ColumnSelector;
import com.gitee.generator.gen.GeneratorConfig;
import com.gitee.generator.gen.SQLService;
import com.gitee.generator.gen.TableSelector;

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
