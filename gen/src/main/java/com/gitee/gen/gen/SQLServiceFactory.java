package com.gitee.gen.gen;

import com.gitee.gen.gen.mysql.MySqlService;
import com.gitee.gen.gen.oracle.OracleService;
import com.gitee.gen.gen.postgresql.PostgreSqlService;
import com.gitee.gen.gen.sqlserver.SqlServerService;

import java.util.HashMap;
import java.util.Map;

public class SQLServiceFactory {


    private static final Map<Integer, SQLService> SERVICE_CONFIG = new HashMap<>(16);

    static {
        SERVICE_CONFIG.put(DbType.MYSQL.getType(), new MySqlService());
        SERVICE_CONFIG.put(DbType.ORACLE.getType(), new OracleService());
        SERVICE_CONFIG.put(DbType.SQL_SERVER.getType(), new SqlServerService());
        SERVICE_CONFIG.put(DbType.POSTGRE_SQL.getType(), new PostgreSqlService());
    }

    public static SQLService build(GeneratorConfig generatorConfig) {
        SQLService service = SERVICE_CONFIG.get(generatorConfig.getDbType());
        if (service == null) {
            throw new RuntimeException("本系统暂不支持该数据源(" + generatorConfig.getDriverClass() + ")");
        }
        return service;
    }

}
