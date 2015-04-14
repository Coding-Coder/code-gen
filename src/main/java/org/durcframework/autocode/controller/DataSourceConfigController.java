package org.durcframework.autocode.controller;

import org.durcframework.autocode.common.AutoCodeContext;
import org.durcframework.autocode.entity.BackUser;
import org.durcframework.autocode.entity.DataSourceConfig;
import org.durcframework.autocode.entity.DatasourceConfigSch;
import org.durcframework.autocode.service.DataSourceConfigService;
import org.durcframework.autocode.util.DBConnect;
import org.durcframework.core.GridResult;
import org.durcframework.core.MessageResult;
import org.durcframework.core.controller.CrudController;
import org.durcframework.core.expression.ExpressionQuery;
import org.durcframework.core.expression.subexpression.ValueExpression;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DataSourceConfigController extends
		CrudController<DataSourceConfig, DataSourceConfigService> {

	@RequestMapping("/addDataSource.do")
	public @ResponseBody
	MessageResult addDataSource(DataSourceConfig dataSourceConfig) {
		BackUser user = AutoCodeContext.getInstance().getUser();
		dataSourceConfig.setBackUser(user.getUsername());
		return this.save(dataSourceConfig);
	}

	@RequestMapping("/listDataSource.do")
	public @ResponseBody
	GridResult listDataSource(DatasourceConfigSch searchEntity) {
		BackUser user = AutoCodeContext.getInstance().getUser();
		ExpressionQuery query = this.buildExpressionQuery(searchEntity);
		
		query.add(new ValueExpression("back_user", user.getUsername()));
		
		return this.query(query);
	}

	@RequestMapping("/updateDataSource.do")
	public @ResponseBody
	MessageResult updateDataSource(DataSourceConfig dataSourceConfig) {
		return this.update(dataSourceConfig);
	}

	@RequestMapping("/delDataSource.do")
	public @ResponseBody
	MessageResult delDataSource(DataSourceConfig dataSourceConfig) {
		return this.delete(dataSourceConfig);
	}

	@RequestMapping("/connectionTest.do")
	public @ResponseBody
	MessageResult connectionTest(DataSourceConfig dataSourceConfig) {
		String connectInfo = DBConnect.testConnection(dataSourceConfig);

		if (StringUtils.hasText(connectInfo)) {
			return error(connectInfo);
		}

		return success();

	}

}
