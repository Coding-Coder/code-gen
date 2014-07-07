package org.durcframework.autocode.controller;

import org.durcframework.autocode.common.UserContext;
import org.durcframework.autocode.entity.BackUser;
import org.durcframework.autocode.entity.TemplateConfig;
import org.durcframework.autocode.entity.TemplateConfigSch;
import org.durcframework.autocode.service.TemplateConfigService;
import org.durcframework.controller.CrudController;
import org.durcframework.entity.SearchEntity;
import org.durcframework.expression.ExpressionQuery;
import org.durcframework.expression.subexpression.ValueExpression;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class TemplateConfigController extends
		CrudController<TemplateConfig, TemplateConfigService> {
	
	@RequestMapping("/addTemplate.do")
	public ModelAndView addTemplate(TemplateConfig templateConfig) {
		BackUser user = UserContext.getInstance().getUser();
		templateConfig.setBackUser(user.getUsername());
		return this.save(templateConfig);
	}

	@RequestMapping("/listTemplate.do")
	public ModelAndView listTemplate(SearchEntity searchEntity) {
		return this.queryByEntity(searchEntity);
	}

	@RequestMapping("/updateTemplate.do")
	public ModelAndView updateTemplate(TemplateConfig templateConfig) {
		return this.update(templateConfig);
	}

	@RequestMapping("/delTemplate.do")
	public ModelAndView delTemplate(TemplateConfig templateConfig) {
		return this.delete(templateConfig);
	}

	// 查询当前用户的所有模板
	@RequestMapping("/listUserTepmlate.do")
	public ModelAndView listUserTepmlate(TemplateConfigSch searchEntity) {
		ExpressionQuery query = this.buildExpressionQuery(searchEntity);
		BackUser user = UserContext.getInstance().getUser();
		query.add(new ValueExpression("back_user", user.getUsername()));
		return this.query(query);
	}

}
