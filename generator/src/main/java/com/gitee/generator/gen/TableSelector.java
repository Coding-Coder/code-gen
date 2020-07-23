package com.gitee.generator.gen;

import com.gitee.generator.util.SqlHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public abstract class TableSelector {

    private ColumnSelector columnSelector;
    private GeneratorConfig dataBaseConfig;
    private List<String> schTableNames;

    public TableSelector(ColumnSelector columnSelector, GeneratorConfig dataBaseConfig) {
        this.dataBaseConfig = dataBaseConfig;
        this.columnSelector = columnSelector;
    }

    /**
     * 查询数据库表的SQL
     * 1.如果是oracle的話則應該傳入用戶名，oracle是根據用戶去管理數據的
     * 2.mysql的话是传入数据库名，mysql和sqlserver是根据数据库去管理的
     *
     * @return
     */
    protected abstract String getShowTablesSQL(String showParam);

    protected abstract TableDefinition buildTableDefinition(Map<String, Object> tableMap);

    public List<TableDefinition> getTableDefinitions() {
        String showParam = dataBaseConfig.getDbName();
        // 如果是oracle数据库则传oracle数据库用户大写
        if (dataBaseConfig.getDriverClass().contains("oracle")) {
            showParam = dataBaseConfig.getUsername().toUpperCase();
        }
        List<Map<String, Object>> resultList = SqlHelper.runSql(getDataBaseConfig(), getShowTablesSQL(showParam));
        List<TableDefinition> tablesList = new ArrayList<TableDefinition>(resultList.size());

        for (Map<String, Object> rowMap : resultList) {
            TableDefinition tableDefinition = this.buildTableDefinition(rowMap);
            String tableName = tableDefinition.getTableName();
            tableDefinition.setColumnDefinitions(columnSelector.getColumnDefinitions(tableName));
            tablesList.add(tableDefinition);
        }

        return tablesList;
    }

    public List<TableDefinition> getSimpleTableDefinitions() {
        String showParam = dataBaseConfig.getDbName();
        // 如果是oracle数据库则传oracle数据库用户大写
        if (dataBaseConfig.getDriverClass().contains("oracle")) {
            showParam = dataBaseConfig.getUsername().toUpperCase();
        }
        List<Map<String, Object>> resultList = SqlHelper.runSql(getDataBaseConfig(), getShowTablesSQL(showParam));
        List<TableDefinition> tablesList = new ArrayList<TableDefinition>(resultList.size());

        for (Map<String, Object> rowMap : resultList) {
            tablesList.add(this.buildTableDefinition(rowMap));
        }

        return tablesList;
    }

    public GeneratorConfig getDataBaseConfig() {
        return dataBaseConfig;
    }

    public void setDataBaseConfig(GeneratorConfig dataBaseConfig) {
        this.dataBaseConfig = dataBaseConfig;
    }

    public ColumnSelector getColumnSelector() {
        return columnSelector;
    }

    public void setColumnSelector(ColumnSelector columnSelector) {
        this.columnSelector = columnSelector;
    }

    public List<String> getSchTableNames() {
        return schTableNames;
    }

    public void setSchTableNames(List<String> schTableNames) {
        this.schTableNames = schTableNames;
    }

}
