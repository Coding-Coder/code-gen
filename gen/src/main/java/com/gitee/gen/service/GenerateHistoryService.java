package com.gitee.gen.service;

import com.alibaba.fastjson.JSON;
import com.gitee.gen.common.GeneratorParam;
import com.gitee.gen.entity.GenerateHistory;
import com.gitee.gen.mapper.GenerateHistoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Service
public class GenerateHistoryService {

    @Autowired
    private GenerateHistoryMapper generateHistoryMapper;

    public void saveHistory(GeneratorParam param) {
        String content = JSON.toJSONString(param);
        String md5 = DigestUtils.md5DigestAsHex(content.getBytes(StandardCharsets.UTF_8));
        GenerateHistory history = generateHistoryMapper.getByMd5(md5);
        if (history != null) {
            history.setGenerateTime(new Date());
            generateHistoryMapper.updateIgnoreNull(history);
            return;
        }
        GenerateHistory generateHistory = new GenerateHistory();
        generateHistory.setConfigContent(content);
        generateHistory.setMd5Value(md5);
        generateHistory.setGenerateTime(new Date());
        this.insertIgnoreNull(generateHistory);
    }

    /**
     * 查询所有记录
     *
     * @return 返回集合，没有返回空List
     */
    public List<GenerateHistory> listAll() {
    	return generateHistoryMapper.listAll();
    }


    /**
     * 根据主键查询
     *
     * @param id 主键
     * @return 返回记录，没有返回null
     */
    public GenerateHistory getById(Integer id) {
    	return generateHistoryMapper.getById(id);
    }
	
    /**
     * 新增，插入所有字段
     *
     * @param generateHistory 新增的记录
     * @return 返回影响行数
     */
    public int insert(GenerateHistory generateHistory) {
    	return generateHistoryMapper.insert(generateHistory);
    }
	
    /**
     * 新增，忽略null字段
     *
     * @param generateHistory 新增的记录
     * @return 返回影响行数
     */
    public int insertIgnoreNull(GenerateHistory generateHistory) {
    	return generateHistoryMapper.insertIgnoreNull(generateHistory);
    }
	
    /**
     * 修改，修改所有字段
     *
     * @param generateHistory 修改的记录
     * @return 返回影响行数
     */
    public int update(GenerateHistory generateHistory) {
    	return generateHistoryMapper.update(generateHistory);
    }
	
    /**
     * 修改，忽略null字段
     *
     * @param generateHistory 修改的记录
     * @return 返回影响行数
     */
    public int updateIgnoreNull(GenerateHistory generateHistory) {
    	return generateHistoryMapper.updateIgnoreNull(generateHistory);
    }
	
    /**
     * 删除记录
     *
     * @param generateHistory 待删除的记录
     * @return 返回影响行数
     */
    public int delete(GenerateHistory generateHistory) {
    	return generateHistoryMapper.delete(generateHistory);
    }
	
}