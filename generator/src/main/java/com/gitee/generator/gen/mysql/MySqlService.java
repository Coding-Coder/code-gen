package com.gitee.generator.gen.mysql;

import com.gitee.generator.gen.ColumnSelector;
import com.gitee.generator.gen.GeneratorConfig;
import com.gitee.generator.gen.SQLService;
import com.gitee.generator.gen.TableSelector;

public class MySqlService implements SQLService {

	@Override
	public TableSelector getTableSelector(GeneratorConfig dataBaseConfig) {
		return new MySqlTableSelector(new MySqlColumnSelector(dataBaseConfig), dataBaseConfig);
	}

	@Override
	public ColumnSelector getColumnSelector(GeneratorConfig dataBaseConfig) {
		return new MySqlColumnSelector(dataBaseConfig);
	}


}
