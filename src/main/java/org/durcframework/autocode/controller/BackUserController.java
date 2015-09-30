package org.durcframework.autocode.controller;

import org.durcframework.autocode.common.AutoCodeContext;
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
	
	 @RequestMapping("/updateUserPassword.do")
	    public @ResponseBody
		Object updateUserPassword(
	    		String oldPswd
	    		,String newPswd
	    		,String newPswd2
	    		){
	    	
	    	if(!newPswd.equals(newPswd2)){
	    		return error("两次输入的新密码不一样");
	    	}
	    	
	    	BackUser user = AutoCodeContext.getInstance().getUser();
	    	
	    	if(!oldPswd.equals(user.getPassword())){
	    		return error("原密码输入有误");
	    	}
	    	
	    	user.setPassword(newPswd);
	    	
	    	this.update(user);
	    	
	    	return success();
	    }

}
