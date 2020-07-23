package com.gitee.generator.gen;


public interface SQLService {

	TableSelector getTableSelector(GeneratorConfig dataBaseConfig);

	ColumnSelector getColumnSelector(GeneratorConfig dataBaseConfig);

}
