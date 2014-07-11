package org.durcframework.autocode.controller;

import org.durcframework.autocode.entity.BackUser;
import org.durcframework.autocode.entity.BackUserSch;
import org.durcframework.autocode.service.BackUserService;
import org.durcframework.controller.CrudController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class BackUserController extends
        CrudController<BackUser, BackUserService> {

    @RequestMapping("/addBackUser.do")
    public ModelAndView addBackUser(BackUser entity) {
        return this.save(entity);
    }

    @RequestMapping("/listBackUser.do")
    public ModelAndView listBackUser(BackUserSch searchEntity) {
        return this.queryByEntity(searchEntity);
    }

    @RequestMapping("/updateBackUser.do")
    public ModelAndView updateBackUser(BackUser enity) {
        return this.update(enity);
    }

    @RequestMapping("/delBackUser.do")
    public ModelAndView delDataSource(BackUser enity) {
        return this.delete(enity);
    }
    
}
