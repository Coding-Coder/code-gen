package com.gitee.generator.service;

import com.gitee.generator.entity.DatasourceConfig;
import com.gitee.generator.mapper.DatasourceConfigMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author tanghc
 */
@Service
public class DatasourceConfigService {

    @Autowired
    private DatasourceConfigMapper datasourceConfigMapper;

    public DatasourceConfig getById(int id) {
        return datasourceConfigMapper.getById(id);
    }

    public List<DatasourceConfig> listAll() {
        return datasourceConfigMapper.listAll();
    }

    public void insert(DatasourceConfig templateConfig) {
        templateConfig.setIsDeleted(0);
        datasourceConfigMapper.insert(templateConfig);
    }

    public void update(DatasourceConfig templateConfig) {
        datasourceConfigMapper.update(templateConfig);
    }

    public void delete(DatasourceConfig templateConfig) {
        datasourceConfigMapper.delete(templateConfig);
    }
}
