package com.gitee.generator.gen.sqlserver;

import com.gitee.generator.gen.GeneratorConfig;
import com.gitee.generator.gen.SQLService;
import com.gitee.generator.gen.ColumnSelector;
import com.gitee.generator.gen.TableSelector;

public class SqlServerService implements SQLService {

	@Override
	public TableSelector getTableSelector(GeneratorConfig dataBaseConfig) {
		return new SqlServerTableSelector(new SqlServerColumnSelector(dataBaseConfig), dataBaseConfig);
	}

	@Override
	public ColumnSelector getColumnSelector(GeneratorConfig dataBaseConfig) {
		return new SqlServerColumnSelector(dataBaseConfig);
	}

}
