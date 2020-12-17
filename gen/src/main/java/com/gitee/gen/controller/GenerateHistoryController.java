package com.gitee.gen.controller;

import com.alibaba.fastjson.JSON;
import com.gitee.gen.common.Action;
import com.gitee.gen.common.GeneratorParam;
import com.gitee.gen.common.Result;
import com.gitee.gen.controller.vo.GenerateHistoryVO;
import com.gitee.gen.entity.DatasourceConfig;
import com.gitee.gen.entity.GenerateHistory;
import com.gitee.gen.entity.TemplateConfig;
import com.gitee.gen.service.DatasourceConfigService;
import com.gitee.gen.service.GenerateHistoryService;
import com.gitee.gen.service.TemplateConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("history")
public class GenerateHistoryController {

    @Autowired
    private GenerateHistoryService generateHistoryService;

    @Autowired
    private DatasourceConfigService datasourceConfigService;

    @Autowired
    private TemplateConfigService templateConfigService;

    /**
     * 查询所有记录
     *
     * @return 返回集合，没有返回空List
     */
    @RequestMapping("list")
    public Result listAll() {
        List<GenerateHistory> generateHistories = generateHistoryService.listAll();
        List<GenerateHistoryVO> generateHistoryVOS = generateHistories.stream()
                .map(generateHistory -> {
                    GenerateHistoryVO generateHistoryVO = new GenerateHistoryVO();
                    GeneratorParam generatorParam = JSON.parseObject(generateHistory.getConfigContent(), GeneratorParam.class);
                    String datasourceInfo = getDatasourceInfo(generatorParam.getDatasourceConfigId());
                    if (datasourceInfo == null) {
                        return null;
                    }
                    List<String> templateNames = this.listTemplateNames(generatorParam.getTemplateConfigIdList());
                    generateHistoryVO.setGenerateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(generateHistory.getGenerateTime()));
                    generateHistoryVO.setConfigContent(generatorParam);
                    generateHistoryVO.setDatasource(datasourceInfo);
                    generateHistoryVO.setTemplateNames(templateNames);
                    return generateHistoryVO;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return Action.ok(generateHistoryVOS);
    }

    private String getDatasourceInfo(int datasourceConfigId) {
        DatasourceConfig datasourceConfig = datasourceConfigService.getById(datasourceConfigId);
        if (datasourceConfig == null) {
            return null;
        }
        String tpl = "%s（%s:%s）";
        return String.format(tpl, datasourceConfig.getDbName(), datasourceConfig.getHost(), datasourceConfig.getPort());
    }

    private List<String> listTemplateNames(List<Integer> idList) {
        return templateConfigService.listTemplate(idList)
                .stream()
                .map(TemplateConfig::getName)
                .collect(Collectors.toList());
    }

}