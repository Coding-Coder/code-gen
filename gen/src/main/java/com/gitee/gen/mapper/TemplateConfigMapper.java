package com.gitee.gen.mapper;

import java.util.List;

import com.gitee.gen.entity.TemplateConfig;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TemplateConfigMapper {

    /**
     * 查询所有记录
     *
     * @return 返回集合，没有返回空List
     */
    List<TemplateConfig> listAll();


    /**
     * 根据主键查询
     *
     * @param id 主键
     * @return 返回记录，没有返回null
     */
    TemplateConfig getById(Integer id);

    /**
     * 新增，插入所有字段
     *
     * @param templateConfig 新增的记录
     * @return 返回影响行数
     */
    int insert(TemplateConfig templateConfig);

    /**
     * 新增，忽略null字段
     *
     * @param templateConfig 新增的记录
     * @return 返回影响行数
     */
    int insertIgnoreNull(TemplateConfig templateConfig);

    /**
     * 修改，修改所有字段
     *
     * @param templateConfig 修改的记录
     * @return 返回影响行数
     */
    int update(TemplateConfig templateConfig);

    /**
     * 修改，忽略null字段
     *
     * @param templateConfig 修改的记录
     * @return 返回影响行数
     */
    int updateIgnoreNull(TemplateConfig templateConfig);

    /**
     * 删除记录
     *
     * @param templateConfig 待删除的记录
     * @return 返回影响行数
     */
    int delete(TemplateConfig templateConfig);

}