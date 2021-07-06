package com.gitee.gen.controller.vo;

import com.gitee.gen.common.GeneratorParam;
import lombok.Data;

import java.util.List;

/**
 * @author tanghc
 */
@Data
public class GenerateHistoryVO {

    /*
    {
    "datasourceConfigId": 1,
    "tableNames": [
        "datasource_config",
        "generate_history"
    ],
    "templateConfigIdList": [
        1
    ],
    "packageName": "com.gitee.gen",
    "delPrefix": "template_",
    "groupId": "",
    "groupName": "JPA"
}
     */
    private GeneratorParam configContent;

    private String generateTime;

    private String datasource;
    private String templateGroupName;
    private List<String> templateNames;
}
