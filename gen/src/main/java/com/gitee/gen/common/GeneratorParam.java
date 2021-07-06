package com.gitee.gen.common;

import lombok.Data;

import java.util.List;

@Data
public class GeneratorParam {
    /**
     * datasource_config主键
     */
    private int datasourceConfigId;
    /**
     * 表名
     */
    private List<String> tableNames;
    /**
     * template_config主键
     */
    private List<Integer> templateConfigIdList;
    private String packageName;
    private String delPrefix;
    private String author;
    private String charset = "UTF-8";
}
