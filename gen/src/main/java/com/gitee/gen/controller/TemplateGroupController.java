package com.gitee.gen.controller;

import com.gitee.gen.common.Action;
import com.gitee.gen.common.Result;
import com.gitee.gen.entity.TemplateGroup;
import com.gitee.gen.service.TemplateGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

/**
 * @author : zsljava
 * @date Date : 2020-12-15 9:51
 * @Description: TODO
 */
@RestController
@RequestMapping("group")
public class TemplateGroupController {

    @Autowired
    private TemplateGroupService templateGroupService;

    /**
     * 查询所有记录
     *
     * @return 返回集合，没有返回空List
     */
    @RequestMapping("list")
    public Result listAll() {
        List<TemplateGroup> templateGroups = templateGroupService.listAll();
        return Action.ok(templateGroups);
    }


    /**
     * 根据主键查询
     *
     * @param id 主键
     * @return 返回记录，没有返回null
     */
    @RequestMapping("get/{id}")
    public Result get(@PathVariable("id") int id) {
        TemplateGroup group = templateGroupService.getById(id);
        return Action.ok(group);
    }

    /**
     * 新增，忽略null字段
     *
     * @param templateGroup 新增的记录
     * @return 返回影响行数
     */
    @RequestMapping("add")
    public Result insert(@RequestBody TemplateGroup templateGroup) {
        TemplateGroup group = templateGroupService.getByName(templateGroup.getGroupName());
        if (group != null) {
            throw new RuntimeException(templateGroup.getGroupName() + " 已存在");
        }
        templateGroupService.insertIgnoreNull(templateGroup);
        return Action.ok(templateGroup);
    }

    /**
     * 修改，忽略null字段
     *
     * @param templateGroup 修改的记录
     * @return 返回影响行数
     */
    @RequestMapping("update")
    public Result update(@RequestBody TemplateGroup templateGroup) {
        TemplateGroup group = templateGroupService.getByName(templateGroup.getGroupName());
        if (group != null && !Objects.equals(group.getId(), templateGroup.getId())) {
            throw new RuntimeException(templateGroup.getGroupName() + " 已存在");
        }
        templateGroupService.updateIgnoreNull(templateGroup);
        return Action.ok();
    }

    /**
     * 删除记录
     *
     * @param templateGroup 待删除的记录
     * @return 返回影响行数
     */
    @RequestMapping("del")
    public Result delete(@RequestBody TemplateGroup templateGroup) {
        templateGroupService.deleteGroup(templateGroup);
        return Action.ok();
    }

}