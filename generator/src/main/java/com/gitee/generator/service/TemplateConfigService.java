package com.gitee.generator.service;

import com.gitee.generator.entity.TemplateConfig;
import com.gitee.generator.mapper.TemplateConfigMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author tanghc
 */
@Service
public class TemplateConfigService {

    @Autowired
    private TemplateConfigMapper templateConfigMapper;

    public TemplateConfig getById(int id) {
        return templateConfigMapper.getById(id);
    }

    public List<TemplateConfig> listAll() {
        return templateConfigMapper.listAll();
    }

    public void insert(TemplateConfig templateConfig) {
        templateConfig.setIsDeleted(0);
        templateConfigMapper.insert(templateConfig);
    }

    public void update(TemplateConfig templateConfig) {
        templateConfigMapper.update(templateConfig);
    }

    public void delete(TemplateConfig templateConfig) {
        templateConfigMapper.delete(templateConfig);
    }

}
