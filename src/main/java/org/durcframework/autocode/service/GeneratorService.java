package org.durcframework.autocode.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.velocity.VelocityContext;
import org.durcframework.autocode.common.AutoCodeContext;
import org.durcframework.autocode.entity.ClientParam;
import org.durcframework.autocode.entity.CodeFile;
import org.durcframework.autocode.entity.DataSourceConfig;
import org.durcframework.autocode.entity.GeneratorParam;
import org.durcframework.autocode.entity.TemplateConfig;
import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.SQLContext;
import org.durcframework.autocode.generator.SQLService;
import org.durcframework.autocode.generator.SQLServiceFactory;
import org.durcframework.autocode.generator.TableDefinition;
import org.durcframework.autocode.generator.TableSelector;
import org.durcframework.autocode.util.FileUtil;
import org.durcframework.autocode.util.VelocityUtil;
import org.durcframework.autocode.util.XmlFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class GeneratorService {
    @Autowired
    private TemplateConfigService templateConfigService;
    
    private static final String DOWNLOAD_FOLDER_NAME = "download";

    /**
     * 生成代码内容,map的
     * @param tableNames
     * @param tcIds
     * @param dataSourceConfig
     * @return 一张表对应多个模板
     */
    public List<CodeFile> generate(GeneratorParam generatorParam, DataSourceConfig dataSourceConfig) {

    	List<SQLContext> contextList = this.buildSQLContextList(generatorParam,dataSourceConfig);

        List<CodeFile> codeFileList = new ArrayList<CodeFile>();
        
        for (SQLContext sqlContext : contextList) {
            setPackageName(sqlContext, generatorParam.getPackageName());

            String packageName = sqlContext.getJavaBeanNameLF();

            for (int tcId : generatorParam.getTcIds()) {

                TemplateConfig template = templateConfigService.get(tcId);
                
                String fileName = doGenerator(sqlContext,template.getFileName());
                String content = doGenerator(sqlContext, template.getContent());

                CodeFile codeFile = new CodeFile(packageName, fileName, content);
                
                this.formatFile(codeFile);
                
                codeFileList.add(codeFile);
            }
        }

        return codeFileList;
    }
    
    private void formatFile(CodeFile file) {
    	String formated = this.doFormat(file.getTemplateName(), file.getContent());
    	file.setContent(formated);
    }
    
    private String doFormat(String fileName,String content) {
    	if(fileName.endsWith(".xml")) {
			return XmlFormat.format(content);
    	}
    	return content;
    }
    
    /**
     * 生成zip
     * @param generatorParam
     * @param dataSourceConfig
     * @param webRootPath
     * @return
     */
    public String generateZip(GeneratorParam generatorParam, DataSourceConfig dataSourceConfig,String webRootPath) {
    	List<SQLContext> contextList = this.buildSQLContextList(generatorParam,dataSourceConfig);
        String projectFolder = this.buildProjectFolder(webRootPath);
        
        for (SQLContext sqlContext : contextList) {
            setPackageName(sqlContext, generatorParam.getPackageName());
            for (int tcId : generatorParam.getTcIds()) {
                TemplateConfig template = templateConfigService.get(tcId);
                String content = doGenerator(sqlContext, template.getContent());
                String fileName = doGenerator(sqlContext,template.getFileName());
                String savePath = doGenerator(sqlContext,template.getSavePath());
                
                content = this.doFormat(fileName, content);
                
                if(StringUtils.isEmpty(fileName)) {
                	fileName = template.getName();
                }
                
                FileUtil.createFolder(projectFolder +File.separator + savePath);
                
                String filePathName = projectFolder + File.separator + 
                		savePath + File.separator + 
                		fileName;
                FileUtil.write(content,filePathName,generatorParam.getCharset());
            }
        }
        
        try {
			FileUtil.zip(projectFolder, projectFolder + ".zip");
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			FileUtil.deleteDir(new File(projectFolder));
		}

        return projectFolder + ".zip";
    }
    
    public String generateClientZip(ClientParam clientParam,String webRootPath) {
    	DataBaseConfig dataBaseConfig = clientParam.buildDataBaseConfig();
    	SQLContext sqlContext = this.buildClientSQLContextList(clientParam,dataBaseConfig);
    	
    	int[] classTcIds = {clientParam.getTcIdController(),clientParam.getTcIdDao(),clientParam.getTcIdEntity()
    			,clientParam.getTcIdEntitySch(),clientParam.getTcIdService()};
    	
    	int[] resourcesTcIds = {clientParam.getTcIdMyBatis()};
    	
    	String projectFolder = this.buildProjectFolder(webRootPath);
    	String classFolder = projectFolder + "/class";
    	String resourcesFolder = projectFolder + "/resources";
    	
         setPackageName(sqlContext, clientParam.getPackageName());
         
         for (int tcId : classTcIds) {
             TemplateConfig template = templateConfigService.get(tcId);
             String content = doGenerator(sqlContext, template.getContent());
             String fileName = doGenerator(sqlContext,template.getFileName());
             String savePath = doGenerator(sqlContext,template.getSavePath());
             
             content = this.doFormat(fileName, content);
             
             if(StringUtils.isEmpty(fileName)) {
             	fileName = template.getName();
             }
             
             FileUtil.createFolder(classFolder +File.separator + savePath);
             
             String filePathName = classFolder + File.separator + 
             		savePath + File.separator + 
             		fileName;
             FileUtil.write(content,filePathName,clientParam.getCharset());
         }
         
         for (int tcId : resourcesTcIds) {
             TemplateConfig template = templateConfigService.get(tcId);
             String content = doGenerator(sqlContext, template.getContent());
             String fileName = doGenerator(sqlContext,template.getFileName());
             String savePath = doGenerator(sqlContext,template.getSavePath());
             
             content = this.doFormat(fileName, content);
             
             if(StringUtils.isEmpty(fileName)) {
             	fileName = template.getName();
             }
             
             FileUtil.createFolder(resourcesFolder +File.separator + savePath);
             
             String filePathName = resourcesFolder + File.separator + 
             		savePath + File.separator + 
             		fileName;
             FileUtil.write(content,filePathName,clientParam.getCharset());
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
    }
    
    /**
	 * 返回SQL上下文列表
	 * @param tableNames
	 * @return
	 */
	private SQLContext buildClientSQLContextList(ClientParam generatorParam,DataBaseConfig dataBaseConfig) {
		
		List<String> tableNames = Arrays.asList(generatorParam.getTableName());
		
        SQLService service = SQLServiceFactory.build(dataBaseConfig);
        
        TableSelector tableSelector = service.getTableSelector(dataBaseConfig);
        tableSelector.setSchTableNames(tableNames);
        
        List<TableDefinition> tableDefinitions = tableSelector.getTableDefinitions();
        
        SQLContext context = new SQLContext(tableDefinitions.get(0));
        
		return context;
	}
    
    /**
	 * 返回SQL上下文列表
	 * @param tableNames
	 * @return
	 */
	private List<SQLContext> buildSQLContextList(GeneratorParam generatorParam,DataBaseConfig dataSourceConfig) {
		
		List<String> tableNames = generatorParam.getTableNames();
		List<SQLContext> contextList = new ArrayList<SQLContext>();
        SQLService service = SQLServiceFactory.build(dataSourceConfig);
        
        TableSelector tableSelector = service.getTableSelector(dataSourceConfig);
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
    	if(template == null) {
    		return "";
    	}
        VelocityContext context = new VelocityContext();

        context.put("context", sqlContext);
        context.put("table", sqlContext.getTableDefinition());
        context.put("pkColumn", sqlContext.getTableDefinition().getPkColumn());
        context.put("columns", sqlContext.getTableDefinition().getColumnDefinitions());

        return VelocityUtil.generate(context, template);
    }

}
