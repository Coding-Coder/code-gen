package org.durcframework.autocode.service;

import org.durcframework.autocode.dao.BackUserDao;
import org.durcframework.autocode.entity.BackUser;
import org.durcframework.core.service.CrudService;
import org.springframework.stereotype.Service;

@Service
public class BackUserService extends CrudService<BackUser, BackUserDao> {

}
