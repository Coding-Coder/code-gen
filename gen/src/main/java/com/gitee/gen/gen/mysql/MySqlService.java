package com.gitee.gen.gen.mysql;

import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.SQLService;
import com.gitee.gen.gen.TableSelector;

public class MySqlService implements SQLService {

	@Override
	public TableSelector getTableSelector(GeneratorConfig generatorConfig) {
		return new MySqlTableSelector(new MySqlColumnSelector(generatorConfig), generatorConfig);
	}

}
