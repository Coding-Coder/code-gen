package com.gitee.gen.common;

/**
 * @author tanghc
 */
public enum DbType {

    MYSQL(1, "com.mysql.cj.jdbc.Driver"),
    ORACLE(2, "oracle.jdbc.driver.OracleDriver"),
    SQL_SERVER(3, "net.sourceforge.jtds.jdbc.Driver"),

    ;
    private int type;
    private String driverClass;

    DbType(int type, String driverClass) {
        this.type = type;
        this.driverClass = driverClass;
    }

    public int getType() {
        return type;
    }

    public String getDriverClass() {
        return driverClass;
    }
}
