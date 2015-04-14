package org.durcframework.autocode.service;

import org.durcframework.autocode.dao.DataSourceConfigDao;
import org.durcframework.autocode.entity.DataSourceConfig;
import org.durcframework.core.service.CrudService;
import org.springframework.stereotype.Service;

@Service
public class DataSourceConfigService extends CrudService<DataSourceConfig, DataSourceConfigDao> {

}
