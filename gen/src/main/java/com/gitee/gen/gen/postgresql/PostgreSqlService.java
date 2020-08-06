package com.gitee.gen.gen.postgresql;

import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.SQLService;
import com.gitee.gen.gen.TableSelector;

/**
 * @author tanghc
 */
public class PostgreSqlService implements SQLService {
    @Override
    public TableSelector getTableSelector(GeneratorConfig generatorConfig) {
        return new PostgreSqlTableSelector(new PostgreSqlColumnSelector(generatorConfig), generatorConfig);
    }

}
