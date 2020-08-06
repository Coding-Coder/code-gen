package com.gitee.gen.gen.sqlserver;

import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.SQLService;
import com.gitee.gen.gen.TableSelector;

public class SqlServerService implements SQLService {

	@Override
	public TableSelector getTableSelector(GeneratorConfig generatorConfig) {
		return new SqlServerTableSelector(new SqlServerColumnSelector(generatorConfig), generatorConfig);
	}

}
