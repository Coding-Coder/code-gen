package com.gitee.gen.gen;

import com.gitee.gen.entity.DatasourceConfig;
import org.springframework.beans.BeanUtils;

public class GeneratorConfig {

    private Integer dbType;
    /** 数据库名称 */
    private String dbName;
    /** schema(PGSQL专用) */
    private String schemaName;
    /** 数据库host */
    private String host;
    /** 数据库端口 */
    private Integer port;
    /** 数据库用户名 */
    private String username;
    /** 数据库密码 */
    private String password;

    public static GeneratorConfig build(DatasourceConfig datasourceConfig) {
        GeneratorConfig generatorConfig = new GeneratorConfig();
        BeanUtils.copyProperties(datasourceConfig, generatorConfig);
        return generatorConfig;
    }

    public String getDriverClass() {
        DbType dbType = DbType.of(this.dbType);
        if (dbType == null) {
            throw new RuntimeException("不支持数据库类型" + this.dbType + "，请在DbType.java中配置");
        }
        return dbType.getDriverClass();
    }

    public String getJdbcUrl() {
        DbType dbType = DbType.of(this.dbType);
        if (dbType == null) {
            throw new RuntimeException("不支持数据库类型" + this.dbType + "，请在DbType.java中配置");
        }
        String jdbcUrl = dbType.getJdbcUrl();
        return String.format(jdbcUrl, host, port, dbName);
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public Integer getDbType() {
        return dbType;
    }

    public void setDbType(Integer dbType) {
        this.dbType = dbType;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSchemaName() {
        return schemaName;
    }

    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }
}
