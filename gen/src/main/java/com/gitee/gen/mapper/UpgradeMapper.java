package com.gitee.gen.mapper;

import com.gitee.gen.entity.ColumnInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author tanghc
 */
@Mapper
public interface UpgradeMapper {

    void runSql(@Param("sql") String sql);

    /**
     * 新增表字段
     * @param tableName 表名
     * @param columnName 字段名
     * @param type 类型
     */
    void addColumn(@Param("tableName") String tableName, @Param("columnName")String columnName,@Param("type") String type);

    /**
     * 新增mysql表字段
     * @param tableName 表名
     * @param columnName 字段名
     * @param type 类型
     */
    void addColumnMysql(@Param("tableName") String tableName, @Param("columnName")String columnName,@Param("type") String type);

    /**
     * 查看表字段信息
     * @param tableName 表名
     * @return 返回字段信息
     */
    List<ColumnInfo> listColumnInfo(@Param("tableName") String tableName);

    /**
     * 查看MYSQL表字段信息
     * @param tableName 表名
     * @return 返回字段信息
     */
    List<ColumnInfo> listColumnInfoMysql(@Param("tableName") String tableName);

    List<String> listTableName();

    List<String> listTableNameMysql();
}
