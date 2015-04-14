package org.durcframework.autocode.service;

import org.durcframework.autocode.dao.TemplateConfigDao;
import org.durcframework.autocode.entity.TemplateConfig;
import org.durcframework.core.service.CrudService;
import org.springframework.stereotype.Service;

@Service
public class TemplateConfigService extends CrudService<TemplateConfig, TemplateConfigDao> {

}
