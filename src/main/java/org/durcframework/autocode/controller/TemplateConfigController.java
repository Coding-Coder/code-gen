package org.durcframework.autocode.controller;

import org.durcframework.autocode.common.AutoCodeContext;
import org.durcframework.autocode.entity.BackUser;
import org.durcframework.autocode.entity.TemplateConfig;
import org.durcframework.autocode.entity.TemplateConfigSch;
import org.durcframework.autocode.service.TemplateConfigService;
import org.durcframework.core.controller.CrudController;
import org.durcframework.core.expression.ExpressionQuery;
import org.durcframework.core.expression.subexpression.ValueExpression;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TemplateConfigController extends
		CrudController<TemplateConfig, TemplateConfigService> {
	
	@RequestMapping("/addTemplate.do")
	public @ResponseBody
	Object addTemplate(TemplateConfig templateConfig) {
		BackUser user = AutoCodeContext.getInstance().getUser();
		templateConfig.setBackUser(user.getUsername());
		return this.save(templateConfig);
	}

	@RequestMapping("/listTemplate.do")
	public @ResponseBody
	Object listTemplate(TemplateConfigSch searchEntity) {
		BackUser user = AutoCodeContext.getInstance().getUser();
		searchEntity.setSortname("`name`");
		ExpressionQuery query = this.buildExpressionQuery(searchEntity);
		query.add(new ValueExpression("back_user", user.getUsername()));
		return this.query(query);
	}

	@RequestMapping("/updateTemplate.do")
	public @ResponseBody
	Object updateTemplate(TemplateConfig templateConfig) {
		return this.update(templateConfig);
	}

	@RequestMapping("/delTemplate.do")
	public @ResponseBody
	Object delTemplate(TemplateConfig templateConfig) {
		return this.delete(templateConfig);
	}

	// 查询当前用户的所有模板
	@RequestMapping("/listUserTepmlate.do")
	public @ResponseBody
	Object listUserTepmlate(TemplateConfigSch searchEntity) {
		searchEntity.setSortname("`name`");
		BackUser user = AutoCodeContext.getInstance().getUser();
		ExpressionQuery query = this.buildExpressionQuery(searchEntity);
		query.add(new ValueExpression("back_user", user.getUsername()));
		return this.query(query);
	}

}
