package com.gitee.gen.controller.vo;

import com.gitee.gen.common.GeneratorParam;

import java.util.List;

/**
 * @author tanghc
 */
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
    private List<String> templateNames;

    public GeneratorParam getConfigContent() {
        return configContent;
    }

    public void setConfigContent(GeneratorParam configContent) {
        this.configContent = configContent;
    }

    public String getGenerateTime() {
        return generateTime;
    }

    public void setGenerateTime(String generateTime) {
        this.generateTime = generateTime;
    }

    public String getDatasource() {
        return datasource;
    }

    public void setDatasource(String datasource) {
        this.datasource = datasource;
    }

    public List<String> getTemplateNames() {
        return templateNames;
    }

    public void setTemplateNames(List<String> templateNames) {
        this.templateNames = templateNames;
    }
}
