package com.gitee.gen.gen;

import com.gitee.gen.entity.DatasourceConfig;
import org.springframework.beans.BeanUtils;

import java.util.HashMap;
import java.util.Map;

public class GeneratorConfig {

    private static final Map<String, String> JDBC_URL_MAP = new HashMap<String, String>();

    static {
        JDBC_URL_MAP.put("com.mysql.cj.jdbc.Driver", "jdbc:mysql://%s:%s/%s?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai");
        JDBC_URL_MAP.put("oracle.jdbc.driver.OracleDriver", "jdbc:oracle:thin:@%s:%s:%s");
        JDBC_URL_MAP.put("net.sourceforge.jtds.jdbc.Driver", "jdbc:jtds:sqlserver://%s:%s;databaseName=%s");
    }

    private String dbName;
    private String driverClass;
    private String host;
    private int port;
    private String username;
    private String password;

    public static GeneratorConfig build(DatasourceConfig datasourceConfig) {
        GeneratorConfig generatorConfig = new GeneratorConfig();
        BeanUtils.copyProperties(datasourceConfig, generatorConfig);
        return generatorConfig;
    }

    public String getJdbcUrl() {
        String url = JDBC_URL_MAP.get(driverClass);
        return String.format(url, host, port, dbName);
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getDriverClass() {
        return driverClass;
    }

    public void setDriverClass(String driverClass) {
        this.driverClass = driverClass;
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

}
