package com.gitee.gen.gen;

import com.gitee.gen.gen.converter.ColumnTypeConverter;
import lombok.Data;
import org.springframework.util.StringUtils;

/**
 * 表字段信息
 */
@Data
public class ColumnDefinition {
    /**
     * 数据库字段名
     */
    private String columnName;
    /**
     * 数据库类型
     */
    private String type;
    /**
     * 是否自增
     */
    private Boolean isIdentity;
    /**
     * 是否主键
     */
    private Boolean isPk;
    /**
     * 字段注释
     */
    private String comment = "";
    /**
     * 字段长度
     */
    private Integer maxLength;
    /**
     * 小数位长度
     */
    private Integer scale;

    /**
     * 返回字段注释，没有则返回字段名
     *
     * @return
     */
    public String getLabel() {
        return StringUtils.hasLength(comment) ? comment : columnName;
    }

    /**
     * 获得基本类型,int,float
     *
     * @return 返回基本类型
     */

    public String getFieldType() {
        return getColumnTypeConverter().convertType(type);
    }

    /**
     * 获得装箱类型,Integer,Float
     *
     * @return 返回装箱类型
     */

    public String getFieldTypeBox() {
        return getColumnTypeConverter().convertTypeBox(getType());
    }

    /**
     * 是否是自增主键
     *
     * @return true, 是自增主键
     */
    public boolean getIsIdentityPk() {
        return getIsPk() && getIsIdentity();
    }

    public ColumnTypeConverter getColumnTypeConverter() {
        throw new UnsupportedOperationException("未覆盖com.gitee.gen.gen.ColumnDefinition.getColumnTypeConverter方法");
    }
}
