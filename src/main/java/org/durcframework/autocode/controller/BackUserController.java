package org.durcframework.autocode.controller;

import org.durcframework.autocode.entity.BackUser;
import org.durcframework.autocode.entity.BackUserSch;
import org.durcframework.autocode.service.BackUserService;
import org.durcframework.core.GridResult;
import org.durcframework.core.MessageResult;
import org.durcframework.core.controller.CrudController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class BackUserController extends
		CrudController<BackUser, BackUserService> {

	@RequestMapping("/addBackUser.do")
	public @ResponseBody
	MessageResult addBackUser(BackUser entity) {
		return this.save(entity);
	}

	@RequestMapping("/listBackUser.do")
	public @ResponseBody
	GridResult listBackUser(BackUserSch searchEntity) {
		return this.query(searchEntity);
	}

	@RequestMapping("/updateBackUser.do")
	public @ResponseBody
	MessageResult updateBackUser(BackUser enity) {
		return this.update(enity);
	}

	@RequestMapping("/delBackUser.do")
	public @ResponseBody
	MessageResult delDataSource(BackUser enity) {
		return this.delete(enity);
	}

}
