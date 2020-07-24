package com.gitee.gen.mapper;

import java.util.List;

import com.gitee.gen.entity.DatasourceConfig;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DatasourceConfigMapper {

    /**
     * 查询所有记录
     *
     * @return 返回集合，没有返回空List
     */
    List<DatasourceConfig> listAll();


    /**
     * 根据主键查询
     *
     * @param id 主键
     * @return 返回记录，没有返回null
     */
    DatasourceConfig getById(Integer id);

    /**
     * 新增，插入所有字段
     *
     * @param datasourceConfig 新增的记录
     * @return 返回影响行数
     */
    int insert(DatasourceConfig datasourceConfig);

    /**
     * 新增，忽略null字段
     *
     * @param datasourceConfig 新增的记录
     * @return 返回影响行数
     */
    int insertIgnoreNull(DatasourceConfig datasourceConfig);

    /**
     * 修改，修改所有字段
     *
     * @param datasourceConfig 修改的记录
     * @return 返回影响行数
     */
    int update(DatasourceConfig datasourceConfig);

    /**
     * 修改，忽略null字段
     *
     * @param datasourceConfig 修改的记录
     * @return 返回影响行数
     */
    int updateIgnoreNull(DatasourceConfig datasourceConfig);

    /**
     * 删除记录
     *
     * @param datasourceConfig 待删除的记录
     * @return 返回影响行数
     */
    int delete(DatasourceConfig datasourceConfig);

}