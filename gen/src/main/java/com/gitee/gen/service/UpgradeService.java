package com.gitee.gen.service;

import com.gitee.gen.entity.ColumnInfo;
import com.gitee.gen.mapper.UpgradeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

/**
 * 升级
 * @author tanghc
 */
@Service
public class UpgradeService {

    public static final String TABLE_DATASOURCE_CONFIG = "datasource_config";
    public static final String TABLE_TEMPLATE_CONFIG = "template_config";
    public static final String TABLE_TEMPLATE_GROUP = "template_group";
    public static final String TABLE_GENERATE_HISTORY = "generate_history";

    @Autowired
    private UpgradeMapper upgradeMapper;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    public static void initDatabase() {
        String filename = "gen.db";
        String filepath = System.getProperty("user.dir") + "/" + filename;
        File dbFile = new File(filepath);
        if (!dbFile.exists()) {
            ClassPathResource resource = new ClassPathResource(filename);
            try {
                FileCopyUtils.copy(resource.getInputStream(), new FileOutputStream(dbFile));
            } catch (IOException e) {
                throw new RuntimeException("初始化数据库失败", e);
            }
        }
    }

    /**
     * 升级
     */
    public void upgrade() {
        upgradeV1_4_0();
        upgradeV1_4_12();
        upgradeV1_4_17();
    }

    private void upgradeV1_4_17() {
        this.addColumn(TABLE_TEMPLATE_CONFIG, "folder", "varchar(64)");
    }

    private void upgradeV1_4_12() {
        this.addColumn(TABLE_DATASOURCE_CONFIG, "schema_name", "varchar(100)");
    }

    /**
     * 升级v1.4.0
     */
    private void upgradeV1_4_0() {
        this.createTable(TABLE_GENERATE_HISTORY);
        boolean isCreate = this.createTable(TABLE_TEMPLATE_GROUP);
        if (isCreate) {
            runSql("INSERT INTO `template_group` (`id`, `group_name`, `is_deleted`) VALUES (1,'default',0)");
        }

        this.addColumn(TABLE_DATASOURCE_CONFIG, "package_name", "varchar(100)");
        this.addColumn(TABLE_DATASOURCE_CONFIG, "del_prefix", "varchar(200)");
        this.addColumn(TABLE_DATASOURCE_CONFIG, "group_id", "int");

        this.addColumn(TABLE_TEMPLATE_CONFIG, "group_id", "int");
        this.addColumn(TABLE_TEMPLATE_CONFIG, "group_name", "varchar(100)");
        runSql("update template_config set group_id=1,group_name='default' where group_id IS NULL");
    }

    private void runSql(String sql) {
        upgradeMapper.runSql(sql);
    }

    /**
     * 添加表字段
     * @param tableName 表名
     * @param columnName 字段名
     * @param type 字段类型，如：varchar(128),text,integer
     * @return 返回true，插入成功
     */
    public boolean addColumn(String tableName, String columnName, String type) {
        if (!isColumnExist(tableName, columnName)) {
            if (isMysql()) {
                upgradeMapper.addColumnMysql(tableName, columnName, type);
            } else {
                upgradeMapper.addColumn(tableName, columnName, type);
            }
            return true;
        }
        return false;
    }

    /**
     * 创建表
     * @param tableName 表名
     * @return 创建成功返回true
     */
    public boolean createTable(String tableName) {
        if (!isTableExist(tableName)) {
            String sql = this.loadDDL(tableName);
            upgradeMapper.runSql(sql);
            return true;
        }
        return false;
    }

    private String loadDDL(String tableName) {
        String tmp_mysql = "ddl_%s_mysql.txt";
        String tmp_sqlite = "ddl_%s_sqlite.txt";
        String tmp = isMysql() ? tmp_mysql : tmp_sqlite;
        String filename = "upgrade/" + String.format(tmp, tableName);
        ClassPathResource resource = new ClassPathResource(filename);
        if (!resource.exists()) {
            throw new RuntimeException("找不到文件：" + filename);
        }
        try {
            byte[] bytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
            return new String(bytes);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("打开文件出错", e);
        }
    }

    /**
     * 判断列是否存在
     * @param tableName 表名
     * @param columnName 列名
     * @return true：存在
     */
    public boolean isColumnExist(String tableName, String columnName) {
        List<ColumnInfo> columnInfoList = isMysql() ? upgradeMapper.listColumnInfoMysql(tableName) :
                upgradeMapper.listColumnInfo(tableName);
        return columnInfoList
                .stream()
                .anyMatch(columnInfo -> Objects.equals(columnInfo.getName(), columnName));
    }

    /**
     * 表是否存在
     * @param tableName
     * @return
     */
    public boolean isTableExist(String tableName) {
        List<String> tableNameList;
        if (isMysql()) {
            tableNameList = upgradeMapper.listTableNameMysql();
        } else {
            tableNameList = upgradeMapper.listTableName();
        }
        return tableNameList != null && tableNameList.contains(tableName);
    }

    private boolean isMysql() {
        return this.driverClassName.contains("mysql");
    }
}
