package com.gitee.gen.entity;


import com.gitee.gen.gen.DbType;

/**
 * 数据源配置表
 */
public class DatasourceConfig {
    private Integer id;
    /** 数据库类型，1：MySql, 2:Oracle, 3:sqlserver */
    private Integer dbType;
    /** 数据库驱动 */
    private String driverClass;
    /** 数据库名称 */
    private String dbName;
    /** 数据库host */
    private String host;
    /** 数据库端口 */
    private Integer port;
    /** 数据库用户名 */
    private String username;
    /** 数据库密码 */
    private String password;
    /** 是否已删除，1：已删除，0：未删除 */
    private Integer isDeleted;

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return this.id;
    }

    public void setDbType(Integer dbType) {
        this.dbType = dbType;
    }

    public Integer getDbType() {
        return this.dbType;
    }

    public void setDriverClass(String driverClass) {
        this.driverClass = driverClass;
    }

    public String getDriverClass() {
        DbType dbType = DbType.of(this.dbType);
        if (dbType == null) {
            return "unknown";
        }
        return dbType.getDriverClass();
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getDbName() {
        return this.dbName;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getHost() {
        return this.host;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public Integer getPort() {
        return this.port;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Integer getIsDeleted() {
        return this.isDeleted;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) { return true; }
        if (o == null || getClass() != o.getClass()) {return false;}
        DatasourceConfig that = (DatasourceConfig) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id);
    }

    @Override
    public String toString() {
        return "DatasourceConfig{" +
                "id=" + id +
                ",dbType='" + dbType + "'" +
                ",driverClass='" + driverClass + "'" +
                ",dbName='" + dbName + "'" +
                ",host='" + host + "'" +
                ",port='" + port + "'" +
                ",username='" + username + "'" +
                ",password='" + password + "'" +
                ",isDeleted='" + isDeleted + "'" +
                '}';
    }

}