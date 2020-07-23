package com.gitee.generator.service;

import com.gitee.generator.common.GeneratorParam;
import com.gitee.generator.entity.TemplateConfig;
import com.gitee.generator.gen.CodeFile;
import com.gitee.generator.gen.GeneratorConfig;
import com.gitee.generator.gen.SQLContext;
import com.gitee.generator.gen.SQLService;
import com.gitee.generator.gen.SQLServiceFactory;
import com.gitee.generator.gen.TableDefinition;
import com.gitee.generator.gen.TableSelector;
import com.gitee.generator.util.FileUtil;
import com.gitee.generator.util.VelocityUtil;
import com.gitee.generator.util.XmlFormat;
import org.apache.velocity.VelocityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 生成代码逻辑
 */
@Service
public class GeneratorService {

    @Autowired
    private TemplateConfigService templateConfigService;

    private static final String DOWNLOAD_FOLDER_NAME = "download";

    /**
     * 生成代码内容,map的
     *
     * @param generatorParam 生成参数
     * @param generatorConfig 数据源配置
     * @return 一张表对应多个模板
     */
    public List<CodeFile> generate(GeneratorParam generatorParam, GeneratorConfig generatorConfig) {
        List<SQLContext> contextList = this.buildSQLContextList(generatorParam, generatorConfig);
        List<CodeFile> codeFileList = new ArrayList<CodeFile>();

        for (SQLContext sqlContext : contextList) {
            setPackageName(sqlContext, generatorParam.getPackageName());
            String tableName = sqlContext.getTableDefinition().getTableName();
            for (int tcId : generatorParam.getTemplateConfigIdList()) {
                TemplateConfig template = templateConfigService.getById(tcId);
                String fileName = doGenerator(sqlContext, template.getFileName());
                String content = doGenerator(sqlContext, template.getContent());
                CodeFile codeFile = new CodeFile(tableName, fileName, content);
                codeFileList.add(codeFile);
            }
        }

        return codeFileList;
    }

    private String doFormat(String fileName, String content) {
        if (fileName.endsWith(".xml")) {
            return XmlFormat.format(content);
        }
        return content;
    }

    /**
     * 生成zip
     *
     * @param generatorParam
     * @param dataSourceConfig
     * @param webRootPath
     * @return
     */
    public String generateZip(GeneratorParam generatorParam, GeneratorConfig dataSourceConfig, String webRootPath) {
        List<SQLContext> contextList = this.buildSQLContextList(generatorParam, dataSourceConfig);
        String projectFolder = this.buildProjectFolder(webRootPath);

        for (SQLContext sqlContext : contextList) {
            setPackageName(sqlContext, generatorParam.getPackageName());
            for (int tcId : generatorParam.getTemplateConfigIdList()) {
                TemplateConfig template = templateConfigService.getById(tcId);
                String content = doGenerator(sqlContext, template.getContent());
                String fileName = doGenerator(sqlContext, template.getFileName());
                String folder = sqlContext.getTableDefinition().getTableName();

                content = this.doFormat(fileName, content);

                if (StringUtils.isEmpty(fileName)) {
                    fileName = template.getName();
                }

                FileUtil.createFolder(projectFolder + File.separator + folder);

                String filePathName = projectFolder + File.separator +
                        folder + File.separator +
                        fileName;
                FileUtil.write(content, filePathName, generatorParam.getCharset());
            }
        }

        try {
            FileUtil.zip(projectFolder, projectFolder + ".zip");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            FileUtil.deleteDir(new File(projectFolder));
        }

        return projectFolder + ".zip";
    }

    /*public String generateClientZip(ClientParam clientParam, String webRootPath) {
        DataBaseConfig generatorConfig = clientParam.buildDataBaseConfig();
        SQLContext sqlContext = this.buildClientSQLContextList(clientParam, generatorConfig);

        int[] classTcIds = {clientParam.getTcIdController(), clientParam.getTcIdDao(), clientParam.getTcIdEntity()
                , clientParam.getTcIdEntitySch(), clientParam.getTcIdService()};

        int[] resourcesTcIds = {clientParam.getTcIdMyBatis()};

        String projectFolder = this.buildProjectFolder(webRootPath);
        String classFolder = projectFolder + "/class";
        String resourcesFolder = projectFolder + "/resources";

        setPackageName(sqlContext, clientParam.getPackageName());

        for (int tcId : classTcIds) {
            TemplateConfig template = templateConfigService.get(tcId);
            String content = doGenerator(sqlContext, template.getContent());
            String fileName = doGenerator(sqlContext, template.getFileName());
            String folder = doGenerator(sqlContext, template.getFolder());

            content = this.doFormat(fileName, content);

            if (StringUtils.isEmpty(fileName)) {
                fileName = template.getName();
            }

            FileUtil.createFolder(classFolder + File.separator + folder);

            String filePathName = classFolder + File.separator +
                    folder + File.separator +
                    fileName;
            FileUtil.write(content, filePathName, clientParam.getCharset());
        }

        for (int tcId : resourcesTcIds) {
            TemplateConfig template = templateConfigService.get(tcId);
            String content = doGenerator(sqlContext, template.getContent());
            String fileName = doGenerator(sqlContext, template.getFileName());
            String folder = doGenerator(sqlContext, template.getFolder());

            content = this.doFormat(fileName, content);

            if (StringUtils.isEmpty(fileName)) {
                fileName = template.getName();
            }

            FileUtil.createFolder(resourcesFolder + File.separator + folder);

            String filePathName = resourcesFolder + File.separator +
                    folder + File.separator +
                    fileName;
            FileUtil.write(content, filePathName, clientParam.getCharset());
        }

        try {
            FileUtil.zip(classFolder, classFolder + ".zip");
            FileUtil.zip(resourcesFolder, resourcesFolder + ".zip");

            FileUtil.deleteDir(new File(classFolder));
            FileUtil.deleteDir(new File(resourcesFolder));

            FileUtil.zip(projectFolder, projectFolder + ".zip");
            FileUtil.deleteDir(new File(projectFolder));
        } catch (Exception e) {
            e.printStackTrace();
        }


        return projectFolder + ".zip";
    }*/

    /**
     * 返回SQL上下文列表
     *
     * @param tableName
     * @param generatorConfig
     * @return
     */
    private SQLContext buildClientSQLContextList(String tableName, GeneratorConfig generatorConfig) {

        List<String> tableNames = Collections.singletonList(tableName);

        SQLService service = SQLServiceFactory.build(generatorConfig);

        TableSelector tableSelector = service.getTableSelector(generatorConfig);
        tableSelector.setSchTableNames(tableNames);

        List<TableDefinition> tableDefinitions = tableSelector.getTableDefinitions();

        SQLContext context = new SQLContext(tableDefinitions.get(0));

        return context;
    }

    /**
     * 返回SQL上下文列表
     *
     * @param generatorParam
     * @param generatorConfig
     * @return
     */
    private List<SQLContext> buildSQLContextList(GeneratorParam generatorParam, GeneratorConfig generatorConfig) {

        List<String> tableNames = generatorParam.getTableNames();
        List<SQLContext> contextList = new ArrayList<SQLContext>();
        SQLService service = SQLServiceFactory.build(generatorConfig);

        TableSelector tableSelector = service.getTableSelector(generatorConfig);
        tableSelector.setSchTableNames(tableNames);

        List<TableDefinition> tableDefinitions = tableSelector.getTableDefinitions();

        for (TableDefinition tableDefinition : tableDefinitions) {
            contextList.add(new SQLContext(tableDefinition));
        }

        return contextList;
    }

    private String buildProjectFolder(String webRootPath) {
        return webRootPath + File.separator +
                DOWNLOAD_FOLDER_NAME + File.separator + System.currentTimeMillis();
    }

    private void setPackageName(SQLContext sqlContext, String packageName) {
        if (StringUtils.hasText(packageName)) {
            sqlContext.setPackageName(packageName);
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

        return VelocityUtil.generate(context, template);
    }

}
