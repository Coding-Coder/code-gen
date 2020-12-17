package com.gitee.gen.service;

import com.gitee.gen.entity.DatasourceConfig;
import com.gitee.gen.gen.DbType;
import com.gitee.gen.mapper.DatasourceConfigMapper;
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
        DbType dbType = DbType.of(templateConfig.getDbType());
        if (dbType != null) {
            templateConfig.setDriverClass(dbType.getDriverClass());
        }
        datasourceConfigMapper.insert(templateConfig);
    }

    public void update(DatasourceConfig templateConfig) {
        datasourceConfigMapper.update(templateConfig);
    }

    public void delete(DatasourceConfig templateConfig) {
        datasourceConfigMapper.delete(templateConfig);
    }
}
