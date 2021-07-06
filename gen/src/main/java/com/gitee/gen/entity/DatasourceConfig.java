package com.gitee.gen.entity;


import lombok.Data;

/**
 * 数据源配置表
 */
@Data
public class DatasourceConfig {
    private Integer id;
    /**
     * 数据库类型
     *
     * @see com.gitee.gen.gen.DbType
     */
    private Integer dbType;
    /**
     * 数据库驱动
     */
    private String driverClass;
    /**
     * 数据库名称
     */
    private String dbName;
    /**
     * schema(PGSQL专用)
     */
    private String schemaName;
    /**
     * 数据库host
     */
    private String host;
    /**
     * 数据库端口
     */
    private Integer port;
    /**
     * 数据库用户名
     */
    private String username;
    /**
     * 数据库密码
     */
    private String password;
    /**
     * 是否已删除，1：已删除，0：未删除
     */
    private Integer isDeleted;
    /**
     * 包名
     */
    private String packageName;
    /**
     * 删除的前缀
     */
    private String delPrefix;
    /**
     * 代码生成器模板组id
     */
    private Integer groupId;
    /**
     * 作者名
     */
    private String author;
}