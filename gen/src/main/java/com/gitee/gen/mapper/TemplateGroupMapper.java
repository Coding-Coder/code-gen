package com.gitee.gen.mapper;

import com.gitee.gen.entity.TemplateGroup;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author : zsljava
 * @date Date : 2020-12-15 9:50
 * @Description: TODO
 */
@Mapper
public interface TemplateGroupMapper {

    /**
     * 查询所有记录
     *
     * @return 返回集合，没有返回空List
     */
    List<TemplateGroup> listAll();


    /**
     * 根据主键查询
     *
     * @param id 主键
     * @return 返回记录，没有返回null
     */
    TemplateGroup getById(Integer id);

    /**
     * 新增，插入所有字段
     *
     * @param templateGroup 新增的记录
     * @return 返回影响行数
     */
    int insert(TemplateGroup templateGroup);

    /**
     * 新增，忽略null字段
     *
     * @param templateGroup 新增的记录
     * @return 返回影响行数
     */
    int insertIgnoreNull(TemplateGroup templateGroup);

    /**
     * 修改，修改所有字段
     *
     * @param templateGroup 修改的记录
     * @return 返回影响行数
     */
    int update(TemplateGroup templateGroup);

    /**
     * 修改，忽略null字段
     *
     * @param templateGroup 修改的记录
     * @return 返回影响行数
     */
    int updateIgnoreNull(TemplateGroup templateGroup);

    /**
     * 删除记录
     *
     * @param templateGroup 待删除的记录
     * @return 返回影响行数
     */
    int delete(TemplateGroup templateGroup);

}