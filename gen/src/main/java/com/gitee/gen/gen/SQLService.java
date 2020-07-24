package com.gitee.gen.gen;


public interface SQLService {

	TableSelector getTableSelector(GeneratorConfig dataBaseConfig);

	ColumnSelector getColumnSelector(GeneratorConfig dataBaseConfig);

}
