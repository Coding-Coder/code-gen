package com.gitee.gen.controller;

import com.gitee.gen.common.Action;
import com.gitee.gen.common.Result;
import com.gitee.gen.entity.TemplateConfig;
import com.gitee.gen.service.TemplateConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author tanghc
 */
@RestController
@RequestMapping("template")
public class TemplateConfigController {

    @Autowired
    private TemplateConfigService templateConfigService;

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
    public Result list() {
        return Action.ok(templateConfigService.listAll());
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

}
