package com.gitee.gen.gen;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * 数据库表定义,从这里可以获取表名,字段信息
 */
@Data
@NoArgsConstructor
public class TableDefinition {

    /**
     * PSSQL对应的schema
     */
    private String schema;

    /**
     * 表名
     */
    private String tableName;

    /**
     * 表注释
     */
    private String comment;

    /**
     * Java相关字段
     */
    private transient List<ColumnDefinition> columnDefinitions = Collections.emptyList();

    /**
     * C#相关字段
     */
    private transient List<CsharpColumnDefinition> csharpColumnDefinitions = Collections.emptyList();

    public TableDefinition(String tableName) {
        this.tableName = tableName;
    }

    /**
     * 返回表注释，没有则返回表名
     *
     * @return
     */
    public String getLabel() {
        return StringUtils.hasLength(comment) ? comment : tableName;
    }

    /**
     * 是否有时间字段
     *
     * @return true：有
     */
    public boolean getHasDateColumn() {
        for (ColumnDefinition definition : columnDefinitions) {
            if (TypeEnum.DATETIME.getType().equalsIgnoreCase(definition.getType())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否含有时间字段
     *
     * @return
     */
    public boolean getHasDateField() {
        for (ColumnDefinition definition : columnDefinitions) {
            if (Date.class.getSimpleName().equals(((JavaColumnDefinition) definition).getJavaType())) {
                return true;
            }
        }
        return false;
    }

    public boolean getHasLocalDateField() {
        for (ColumnDefinition definition : columnDefinitions) {
            if (LocalDate.class.getSimpleName().equals(((JavaColumnDefinition) definition).getJavaType())) {
                return true;
            }
        }
        return false;
    }

    public boolean getHasLocalDateTimeField() {
        for (ColumnDefinition definition : columnDefinitions) {
            if (LocalDateTime.class.getSimpleName().equals(((JavaColumnDefinition) definition).getJavaType())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否含有BigDecimal字段
     *
     * @return
     */
    public boolean getHasBigDecimalField() {
        for (ColumnDefinition definition : columnDefinitions) {
            if ("BigDecimal".equals(((JavaColumnDefinition) definition).getJavaType())) {
                return true;
            }
        }
        return false;
    }

    public boolean getHasJsonbField() {
        for (ColumnDefinition definition : columnDefinitions) {
            if ("jsonb".equals(definition.getType())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取主键信息
     *
     * @return 返回主键信息，如果没有则抛出异常
     */
    @JsonIgnore
    public ColumnDefinition getPkColumn() {
        ColumnDefinition pk = null;
        for (ColumnDefinition column : columnDefinitions) {
            if (column.getColumnName().equalsIgnoreCase("id")) {
                pk = column;
            }
            if (column.getIsPk()) {
                return column;
            }
        }
        return pk;
    }
}
