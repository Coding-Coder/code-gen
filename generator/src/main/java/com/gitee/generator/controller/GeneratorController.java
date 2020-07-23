package com.gitee.generator.controller;

import com.gitee.generator.common.Action;
import com.gitee.generator.common.GeneratorParam;
import com.gitee.generator.common.Result;
import com.gitee.generator.entity.DatasourceConfig;
import com.gitee.generator.gen.GeneratorConfig;
import com.gitee.generator.service.DatasourceConfigService;
import com.gitee.generator.service.GeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author tanghc
 */
@RestController
@RequestMapping("generate")
public class GeneratorController {

    @Autowired
    private DatasourceConfigService datasourceConfigService;

    @Autowired
    private GeneratorService generatorService;

    /**
     * 生成代码
     *
     * @param generatorParam 生成参数
     * @return 返回代码内容
     */
    @RequestMapping("/code")
    public Result code(@RequestBody GeneratorParam generatorParam) {
        int datasourceConfigId = generatorParam.getDatasourceConfigId();
        DatasourceConfig datasourceConfig = datasourceConfigService.getById(datasourceConfigId);
        GeneratorConfig generatorConfig = GeneratorConfig.build(datasourceConfig);
        return Action.ok(generatorService.generate(generatorParam, generatorConfig));
    }

}
