package com.gitee.gen.gen.mysql;

import com.gitee.gen.gen.ColumnSelector;
import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.SQLService;
import com.gitee.gen.gen.TableSelector;

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
