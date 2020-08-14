package com.gitee.gen.gen;

import com.gitee.gen.util.FieldUtil;

/**
 * SQL上下文,这里可以取到表,字段信息<br>
 * 最终会把SQL上下文信息放到velocity中
 */
public class SQLContext {

    /**
     * 表结构定义
     */
    private final TableDefinition tableDefinition;
    private final JavaColumnDefinition javaPkColumn;
    /**
     * 包名
     */
    private String packageName;
    /**
     * 数据库名
     */
    private String dbName;

    public SQLContext(TableDefinition tableDefinition) {
        this.tableDefinition = tableDefinition;
        // 默认为全字母小写的类名
        this.packageName = getJavaBeanName().toLowerCase();
        this.javaPkColumn = (JavaColumnDefinition) this.tableDefinition.getPkColumn();
    }

    /**
     * 返回Java类名
     *
     * @return
     */
    public String getJavaBeanName() {
        return getClassName();
    }

    /**
     * 返回类名
     * @return
     */
    public String getClassName() {
        String tableName = getJavaBeanNameLF();
        return FieldUtil.upperFirstLetter(tableName);
    }

    /**
     * 返回Java类名且首字母小写
     *
     * @return
     */
    public String getJavaBeanNameLF() {
        String tableName = tableDefinition.getTableName();
        tableName = FieldUtil.underlineFilter(tableName);
        tableName = FieldUtil.dotFilter(tableName);
        return FieldUtil.lowerFirstLetter(tableName);
    }

    public String getPkName() {
        if (javaPkColumn != null) {
            return javaPkColumn.getColumnName();
        }
        return "";
    }

    public String getJavaPkName() {
        if (javaPkColumn != null) {
            return javaPkColumn.getJavaFieldName();
        }
        return "";
    }

    public String getJavaPkType() {
        if (javaPkColumn != null) {
            return javaPkColumn.getJavaType();
        }
        return "";
    }

    public String getMybatisPkType() {
        if (javaPkColumn != null) {
            return javaPkColumn.getMybatisJdbcType();
        }
        return "";
    }

    public TableDefinition getTableDefinition() {
        return tableDefinition;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }
}
