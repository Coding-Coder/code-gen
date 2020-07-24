package com.gitee.gen.gen.sqlserver;

import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.SQLService;
import com.gitee.gen.gen.ColumnSelector;
import com.gitee.gen.gen.TableSelector;

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
