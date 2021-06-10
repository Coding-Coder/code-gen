package com.gitee.gen.controller;

import com.gitee.gen.common.Action;
import com.gitee.gen.common.Result;
import com.gitee.gen.entity.TemplateConfig;
import com.gitee.gen.entity.TemplateGroup;
import com.gitee.gen.service.TemplateConfigService;
import com.gitee.gen.service.TemplateGroupService;
import com.gitee.gen.util.TemplateMetaUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author tanghc
 */
@RestController
@RequestMapping("template")
public class TemplateConfigController {

    @Autowired
    private TemplateConfigService templateConfigService;

    @Autowired
    private TemplateGroupService templateGroupService;

    @RequestMapping("/add")
    public Result add(@RequestBody TemplateConfig templateConfig) {
        templateConfigService.insert(templateConfig);
        return Action.ok(templateConfig);
    }

    @RequestMapping("/get/{id}")
    public Result get(@PathVariable("id") int id) {
        return Action.ok(templateConfigService.getById(id));
    }

    @RequestMapping("/list")
    public Result list(String groupId) {
        List<TemplateConfig> templateConfigs = null;
        if(StringUtils.isEmpty(groupId)){
            templateConfigs = templateConfigService.listAll();
        }else {
            templateConfigs = templateConfigService.listByGroupId(groupId);
        }
        Map<Integer, String> idMap = templateGroupService.listAll()
                .stream()
                .collect(Collectors.toMap(TemplateGroup::getId, TemplateGroup::getGroupName));
        for (TemplateConfig templateConfig : templateConfigs) {
            Integer gid = templateConfig.getGroupId();
            if (gid != null) {
                String groupName = idMap.getOrDefault(gid, "");
                templateConfig.setGroupName(groupName);
            }
            templateConfig.setContent(TemplateMetaUtils.generateMetaContent(templateConfig));
        }
        return Action.ok(templateConfigs);
    }

    @RequestMapping("/update")
    public Result update(@RequestBody TemplateConfig templateConfig) {
        templateConfigService.update(templateConfig);
        return Action.ok();
    }

    @RequestMapping("/del")
    public Result del(@RequestBody TemplateConfig templateConfig) {
        templateConfigService.delete(templateConfig);
        return Action.ok();
    }

    @RequestMapping("/save")
    public Result save(@RequestBody TemplateConfig templateConfig) {
        templateConfigService.save(templateConfig);
        return Action.ok();
    }

}
