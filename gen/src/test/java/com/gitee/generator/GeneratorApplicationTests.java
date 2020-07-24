package com.gitee.gen;

import com.gitee.gen.common.GeneratorParam;
import com.gitee.gen.entity.DatasourceConfig;
import com.gitee.gen.entity.TemplateConfig;
import com.gitee.gen.gen.CodeFile;
import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.mapper.DatasourceConfigMapper;
import com.gitee.gen.mapper.TemplateConfigMapper;
import com.gitee.gen.service.GeneratorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;

@SpringBootTest
class GeneratorApplicationTests {

    @Autowired
    private TemplateConfigMapper templateConfigMapper;

    @Autowired
    private DatasourceConfigMapper datasourceConfigMapper;

    @Autowired
    private GeneratorService generatorService;

    @Test
    void contextLoads() {
        TemplateConfig templateConfig = templateConfigMapper.getById(1);
        Assert.notNull(templateConfig, "can not null");
        System.out.println(templateConfig);
    }

    @Test
    void saveDatabase() {
        DatasourceConfig datasourceConfig = new DatasourceConfig();
        datasourceConfig.setDbType(1);
        datasourceConfig.setHost("localhost");
        datasourceConfig.setPort(3306);
        datasourceConfig.setDriverClass("aaa");
        datasourceConfig.setDbName("card");
        datasourceConfig.setUsername("root");
        datasourceConfig.setPassword("123");
        datasourceConfig.setIsDeleted(0);
        datasourceConfigMapper.insert(datasourceConfig);
        Assert.notNull(datasourceConfig.getId(), "id null");
    }

    @Test
    void gen() {
        DatasourceConfig datasourceConfig = datasourceConfigMapper.getById(1);
        TemplateConfig templateConfig = templateConfigMapper.getById(1);
        GeneratorParam generatorParam = new GeneratorParam();
        // 指定数据源
        generatorParam.setDatasourceConfigId(datasourceConfig.getId());
        // 指定表名
        generatorParam.setTableNames(Collections.singletonList("t_user"));
        // 指定package
        generatorParam.setPackageName("com.project.user");
        // 指定模板
        generatorParam.setTemplateConfigIdList(Collections.singletonList(templateConfig.getId()));

        GeneratorConfig generatorConfig = new GeneratorConfig();
        BeanUtils.copyProperties(datasourceConfig, generatorConfig);

        List<CodeFile> codeFileList = generatorService.generate(generatorParam, generatorConfig);

        System.out.println("=== 生成代码 ===");
        for (CodeFile codeFile : codeFileList) {
            System.out.println(codeFile.getContent());
        }
    }

}
