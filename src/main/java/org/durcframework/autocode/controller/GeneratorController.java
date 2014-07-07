package org.durcframework.autocode.controller;

import java.util.List;

import org.durcframework.autocode.entity.CodeFile;
import org.durcframework.autocode.entity.DataSourceConfig;
import org.durcframework.autocode.entity.GeneratorParam;
import org.durcframework.autocode.service.DataSourceConfigService;
import org.durcframework.autocode.service.GeneratorService;
import org.durcframework.util.JsonUtil;
import org.durcframework.util.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * 代码生成
 * 
 * @author hc.tang
 * 
 */
@Controller
public class GeneratorController {
	@Autowired
	private GeneratorService generatorService;
	@Autowired
	private DataSourceConfigService dataSourceConfigService;

	@RequestMapping("/generatFile.do")
	public ModelAndView generatFile(GeneratorParam generatorParam) {
		DataSourceConfig dataSourceConfig = dataSourceConfigService
				.get(generatorParam.getDcId());
		
		List<CodeFile> resultList = generatorService.generate(generatorParam.getTableNames(),
				generatorParam.getTcIds(), dataSourceConfig);
		
		String json = JsonUtil.toJsonString(resultList);
		
		return ResultUtil.buildModelAndView(json);
	}
}
