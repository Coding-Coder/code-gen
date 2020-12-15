package com.gitee.gen.entity;


import java.util.Objects;

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
    /** 包名*/
    private String packageName;
    /** 删除的前缀*/
    private String delPrefix;
    /** 代码生成器模板组id*/
    private String groupId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDbType() {
        return dbType;
    }

    public void setDbType(Integer dbType) {
        this.dbType = dbType;
    }

    public String getDriverClass() {
        return driverClass;
    }

    public void setDriverClass(String driverClass) {
        this.driverClass = driverClass;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
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

    public Integer getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getDelPrefix() {
        return delPrefix;
    }

    public void setDelPrefix(String delPrefix) {
        this.delPrefix = delPrefix;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DatasourceConfig that = (DatasourceConfig) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(dbType, that.dbType) &&
                Objects.equals(driverClass, that.driverClass) &&
                Objects.equals(dbName, that.dbName) &&
                Objects.equals(host, that.host) &&
                Objects.equals(port, that.port) &&
                Objects.equals(username, that.username) &&
                Objects.equals(password, that.password) &&
                Objects.equals(isDeleted, that.isDeleted) &&
                Objects.equals(packageName, that.packageName) &&
                Objects.equals(delPrefix, that.delPrefix) &&
                Objects.equals(groupId, that.groupId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, dbType, driverClass, dbName, host, port, username, password, isDeleted, packageName, delPrefix, groupId);
    }

    @Override
    public String toString() {
        return "DatasourceConfig{" +
                "id=" + id +
                ", dbType=" + dbType +
                ", driverClass='" + driverClass + '\'' +
                ", dbName='" + dbName + '\'' +
                ", host='" + host + '\'' +
                ", port=" + port +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", isDeleted=" + isDeleted +
                ", packageName='" + packageName + '\'' +
                ", delPrefix='" + delPrefix + '\'' +
                ", groupId='" + groupId + '\'' +
                '}';
    }
}