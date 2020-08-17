package com.gitee.gen.gen;

/**
 * 统一类型枚举
 *
 * @author tanghc
 */
public enum TypeEnum {

    BIT("bit"),

    BOOLEAN("boolean"),

    TINYINT("tinyint"),

    SMALLINT("smallint"),

    INT("int"),

    BIGINT("bigint"),

    FLOAT("float"),

    DOUBLE("double"),

    DECIMAL("decimal"),

    VARCHAR("varchar"),

    DATETIME("datetime"),

    BLOB("blob"),


    ;
    private final String type;

    TypeEnum(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
