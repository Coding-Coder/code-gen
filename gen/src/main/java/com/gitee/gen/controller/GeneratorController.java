package com.gitee.gen.controller;

import com.gitee.gen.common.Action;
import com.gitee.gen.common.GeneratorParam;
import com.gitee.gen.common.Result;
import com.gitee.gen.entity.DatasourceConfig;
import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.service.DatasourceConfigService;
import com.gitee.gen.service.GeneratorService;
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
