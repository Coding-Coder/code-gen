package com.gitee.gen.service;

import com.gitee.gen.entity.TemplateConfig;
import com.gitee.gen.mapper.TemplateConfigMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

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
//        TemplateConfig existObj = templateConfigMapper.getByName(templateConfig.getName());
//        if (existObj != null) {
//            throw new RuntimeException("模板名称已存在");
//        }
        templateConfig.setIsDeleted(0);
        templateConfigMapper.insert(templateConfig);
    }

    public void update(TemplateConfig templateConfig) {
        TemplateConfig existObj = templateConfigMapper.getByName(templateConfig.getName());
        if (existObj != null && !Objects.equals(templateConfig.getId(), existObj.getId())) {
            throw new RuntimeException("模板名称已存在");
        }
        templateConfigMapper.updateIgnoreNull(templateConfig);
    }

    public void delete(TemplateConfig templateConfig) {
        templateConfigMapper.delete(templateConfig);
    }

    public List<TemplateConfig> listByGroupId(String groupId) {
        return templateConfigMapper.listByGroupId(groupId);
    }
}
