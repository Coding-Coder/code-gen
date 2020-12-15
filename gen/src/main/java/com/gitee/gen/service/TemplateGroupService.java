package com.gitee.gen.service;

import com.gitee.gen.entity.TemplateGroup;
import com.gitee.gen.mapper.TemplateConfigMapper;
import com.gitee.gen.mapper.TemplateGroupMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author : zsljava
 * @date Date : 2020-12-15 9:50
 * @Description: TODO
 */
@Service
public class TemplateGroupService {

    @Autowired
    private TemplateGroupMapper templateGroupMapper;

    @Autowired
    private TemplateConfigMapper templateConfigMapper;

    /**
     * 查询所有记录
     *
     * @return 返回集合，没有返回空List
     */
    public List<TemplateGroup> listAll() {
        return templateGroupMapper.listAll();
    }


    /**
     * 根据主键查询
     *
     * @param id 主键
     * @return 返回记录，没有返回null
     */
    public TemplateGroup getById(Integer id) {
        return templateGroupMapper.getById(id);
    }

    /**
     * 新增，插入所有字段
     *
     * @param templateGroup 新增的记录
     * @return 返回影响行数
     */
    public int insert(TemplateGroup templateGroup) {
        return templateGroupMapper.insert(templateGroup);
    }

    /**
     * 新增，忽略null字段
     *
     * @param templateGroup 新增的记录
     * @return 返回影响行数
     */
    public int insertIgnoreNull(TemplateGroup templateGroup) {
        templateGroup.setIsDeleted(0);
        return templateGroupMapper.insertIgnoreNull(templateGroup);
    }

    /**
     * 修改，修改所有字段
     *
     * @param templateGroup 修改的记录
     * @return 返回影响行数
     */
    public int update(TemplateGroup templateGroup) {
        return templateGroupMapper.update(templateGroup);
    }

    /**
     * 修改，忽略null字段
     *
     * @param templateGroup 修改的记录
     * @return 返回影响行数
     */
    public int updateIgnoreNull(TemplateGroup templateGroup) {
        return templateGroupMapper.updateIgnoreNull(templateGroup);
    }

    /**
     * 删除记录
     *
     * @param templateGroup 待删除的记录
     * @return 返回影响行数
     */
    public int delete(TemplateGroup templateGroup) {
        return templateGroupMapper.delete(templateGroup);
    }

    public int updateGroup(TemplateGroup templateGroup) {
        int count = updateIgnoreNull(templateGroup);
        templateConfigMapper.updateGroupNameByGroupId(templateGroup.getId(), templateGroup.getGroupName());
        return count;
    }

    public int deleteGroup(TemplateGroup templateGroup) {
        int delete = templateGroupMapper.delete(templateGroup);
        templateConfigMapper.deleteByGroupId(templateGroup.getId());
        return delete;
    }
}