package org.durcframework.autocode.controller;

import org.durcframework.autocode.common.UserContext;
import org.durcframework.autocode.entity.BackUser;
import org.durcframework.autocode.entity.DataSourceConfig;
import org.durcframework.autocode.entity.DatasourceConfigSch;
import org.durcframework.autocode.service.DataSourceConfigService;
import org.durcframework.autocode.util.DBConnect;
import org.durcframework.controller.CrudController;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class DataSourceConfigController extends
		CrudController<DataSourceConfig, DataSourceConfigService> {

	@RequestMapping("/addDataSource.do")
	public ModelAndView addDataSource(DataSourceConfig dataSourceConfig) {
		BackUser user = UserContext.getInstance().getUser();
		dataSourceConfig.setBackUser(user.getUsername());
		return this.save(dataSourceConfig);
	}

	@RequestMapping("/listDataSource.do")
	public ModelAndView listDataSource(DatasourceConfigSch searchEntity) {
		return this.queryByEntity(searchEntity);
	}

	@RequestMapping("/updateDataSource.do")
	public ModelAndView updateDataSource(DataSourceConfig dataSourceConfig) {
		return this.update(dataSourceConfig);
	}

	@RequestMapping("/delDataSource.do")
	public ModelAndView delDataSource(DataSourceConfig dataSourceConfig) {
		return this.delete(dataSourceConfig);
	}

	@RequestMapping("/connectionTest.do")
	public ModelAndView connectionTest(DataSourceConfig dataSourceConfig) {
		String connectInfo = DBConnect.testConnection(dataSourceConfig);

		if (StringUtils.hasText(connectInfo)) {
			return error(connectInfo);
		}

		return success();

	}

}
