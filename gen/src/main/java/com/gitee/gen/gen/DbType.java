package com.gitee.gen.gen;

/**
 * @author tanghc
 */
public enum DbType {

    MYSQL(1,
            "MySQL",
            "com.mysql.cj.jdbc.Driver",
            "jdbc:mysql://%s:%s/%s?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai"
    ),
    ORACLE(2,
            "Oracle",
            "oracle.jdbc.driver.OracleDriver",
            "jdbc:oracle:thin:@%s:%s%s"),

    SQL_SERVER(3,
            "SQL Server",
            "com.microsoft.sqlserver.jdbc.SQLServerDriver",
            "jdbc:sqlserver://%s:%s;DatabaseName=%s"),

    POSTGRE_SQL(4,
            "PostgreSQL",
            "org.postgresql.Driver",
            "jdbc:postgresql://%s:%s/%s"),

    ;
    private final int type;
    private final String displayName;
    private final String driverClass;
    private final String jdbcUrl;

    DbType(int type, String displayName, String driverClass, String jdbcUrl) {
        this.type = type;
        this.displayName = displayName;
        this.driverClass = driverClass;
        this.jdbcUrl = jdbcUrl;
    }

    public static DbType of(int type) {
        for (DbType value : DbType.values()) {
            if (value.type == type) {
                return value;
            }
        }
        return null;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getJdbcUrl() {
        return jdbcUrl;
    }

    public int getType() {
        return type;
    }

    public String getDriverClass() {
        return driverClass;
    }
}
