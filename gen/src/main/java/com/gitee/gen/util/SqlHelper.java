package com.gitee.gen.util;

import com.gitee.gen.gen.GeneratorConfig;
import org.apache.ibatis.datasource.pooled.PooledDataSourceFactory;
import org.apache.ibatis.jdbc.SqlRunner;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.scripting.xmltags.DynamicSqlSource;
import org.apache.ibatis.scripting.xmltags.TextSqlNode;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.transaction.TransactionFactory;
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * 执行SQL语句的帮助类
 *
 * @author hc.tang
 */
public class SqlHelper {
    private static final Logger logger = LoggerFactory.getLogger(SqlHelper.class);

    private static final String DRIVER = "driver";
    private static final String URL = "url";
    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";

    /**
     * <pre>
     * String sql = "SELECT * FROM datasource_config WHERE dc_id=${id}";
     *
     * DataSourceConfig dataSourceConfig = new DataSourceConfig();
     * dataSourceConfig.setDriverClass("com.mysql.jdbc.Driver");
     * dataSourceConfig.setJdbcUrl("jdbc:mysql://localhost:3306/auto_code");
     * dataSourceConfig.setUsername("root");
     * dataSourceConfig.setPassword("root");
     *
     * Map<String, Object> params = new HashMap<String, Object>();
     * params.put("id", 2);
     *
     * List<Map<String, Object>> map = SqlHelper.runSql(dataSourceConfig, sql,params);
     * </pre>
     *
     * @param generatorConfig 配置
     * @param sql             sql
     * @param params          参数
     * @return 返回查询结果
     */
    public static List<Map<String, Object>> runSql(GeneratorConfig generatorConfig, String sql,
                                                   Map<String, Object> params) {

        DataSource dataSource = buildDataSource(generatorConfig);

        String runSql = buildSqlWithParams(dataSource, sql, params);
        String[] sqls = runSql.split(";");
        logger.info("执行SQL:" + runSql);
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            SqlRunner runner = buildSqlRunner(conn);
            int sqlCount = sqls.length;
            if (sqlCount == 1) {
                return runner.selectAll(sqls[0]);
            } else {
                for (int i = 0; i < sqlCount - 1; i++) {
                    runner.run(sqls[i]);
                }
                return runner.selectAll(sqls[sqlCount - 1]);
            }
        } catch (SQLException e1) {
            logger.error("生成代码错误", e1);
            throw new RuntimeException("生成代码错误");
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    logger.error("close connection error", e);
                }
            }
        }
    }

    // 参数绑定
    private static String buildSqlWithParams(DataSource dataSource, String sql, Map<String, Object> params) {
        Configuration configuration = buildConfiguration(dataSource);
        TextSqlNode node = new TextSqlNode(sql);
        DynamicSqlSource dynamicSqlSource = new DynamicSqlSource(configuration, node);
        BoundSql boundSql = dynamicSqlSource.getBoundSql(params);
        return boundSql.getSql();
    }

    public static List<Map<String, Object>> runSql(GeneratorConfig dataBaseConfig, String sql) {
        return runSql(dataBaseConfig, sql, null);
    }

    private static SqlRunner buildSqlRunner(Connection connection) {
        return new SqlRunner(connection);
    }

    private static DataSource buildDataSource(GeneratorConfig dataBaseConfig) {
        Properties properties = new Properties();
        properties.setProperty(DRIVER, dataBaseConfig.getDriverClass());
        properties.setProperty(URL, dataBaseConfig.getJdbcUrl());
        properties.setProperty(USERNAME, dataBaseConfig.getUsername());
        properties.setProperty(PASSWORD, dataBaseConfig.getPassword());
        PooledDataSourceFactory pooledDataSourceFactory = new PooledDataSourceFactory();
        pooledDataSourceFactory.setProperties(properties);
        return pooledDataSourceFactory.getDataSource();
    }

    private static Configuration buildConfiguration(DataSource dataSource) {
        TransactionFactory transactionFactory = new JdbcTransactionFactory();
        Environment environment = new Environment("development",
                transactionFactory, dataSource);
        return new Configuration(environment);
    }

}
