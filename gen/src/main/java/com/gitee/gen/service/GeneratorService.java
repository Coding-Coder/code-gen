package com.gitee.gen.service;

import com.gitee.gen.common.GeneratorParam;
import com.gitee.gen.entity.TemplateConfig;
import com.gitee.gen.gen.CodeFile;
import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.SQLContext;
import com.gitee.gen.gen.SQLService;
import com.gitee.gen.gen.SQLServiceFactory;
import com.gitee.gen.gen.TableDefinition;
import com.gitee.gen.gen.TableSelector;
import com.gitee.gen.util.VelocityUtil;
import org.apache.velocity.VelocityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 生成代码逻辑
 */
@Service
public class GeneratorService {

    @Autowired
    private TemplateConfigService templateConfigService;

    /**
     * 生成代码内容,map的
     *
     * @param generatorParam 生成参数
     * @param generatorConfig 数据源配置
     * @return 一张表对应多个模板
     */
    public List<CodeFile> generate(GeneratorParam generatorParam, GeneratorConfig generatorConfig) {
        List<SQLContext> contextList = this.buildSQLContextList(generatorParam, generatorConfig);
        List<CodeFile> codeFileList = new ArrayList<>();

        for (SQLContext sqlContext : contextList) {
            setPackageName(sqlContext, generatorParam.getPackageName());
            setDelPrefix(sqlContext, generatorParam.getDelPrefix());
            for (int tcId : generatorParam.getTemplateConfigIdList()) {
                TemplateConfig template = templateConfigService.getById(tcId);
                String folder = template.getName();
                String fileName = doGenerator(sqlContext, template.getFileName());
                String content = doGenerator(sqlContext, template.getContent());
                CodeFile codeFile = new CodeFile();
                codeFile.setFolder(folder);
                codeFile.setFileName(fileName);
                codeFile.setContent(content);
                codeFileList.add(codeFile);
            }
        }

        return codeFileList;
    }


    /**
     * 返回SQL上下文列表
     *
     * @param generatorParam 参数
     * @param generatorConfig 配置
     * @return 返回SQL上下文
     */
    private List<SQLContext> buildSQLContextList(GeneratorParam generatorParam, GeneratorConfig generatorConfig) {

        List<String> tableNames = generatorParam.getTableNames();
        List<SQLContext> contextList = new ArrayList<>();
        SQLService service = SQLServiceFactory.build(generatorConfig);

        TableSelector tableSelector = service.getTableSelector(generatorConfig);
        tableSelector.setSchTableNames(tableNames);

        List<TableDefinition> tableDefinitions = tableSelector.getTableDefinitions();

        for (TableDefinition tableDefinition : tableDefinitions) {
            SQLContext sqlContext = new SQLContext(tableDefinition);
            sqlContext.setDbName(generatorConfig.getDbName());
            contextList.add(sqlContext);
        }

        return contextList;
    }

    private void setPackageName(SQLContext sqlContext, String packageName) {
        if (StringUtils.hasText(packageName)) {
            sqlContext.setPackageName(packageName);
        }
    }

    private void setDelPrefix(SQLContext sqlContext, String delPrefix) {
        if (StringUtils.hasText(delPrefix)) {
            sqlContext.setDelPrefix(delPrefix);
        }
    }

    private String doGenerator(SQLContext sqlContext, String template) {
        if (template == null) {
            return "";
        }
        VelocityContext context = new VelocityContext();

        context.put("context", sqlContext);
        context.put("table", sqlContext.getTableDefinition());
        context.put("pk", sqlContext.getTableDefinition().getPkColumn());
        context.put("columns", sqlContext.getTableDefinition().getColumnDefinitions());
        context.put("csharpColumns", sqlContext.getTableDefinition().getCsharpColumnDefinitions());

        return VelocityUtil.generate(context, template);
    }

}
