package org.durcframework.autocode.controller;

import java.util.List;

import org.durcframework.autocode.entity.CodeFile;
import org.durcframework.autocode.entity.DataSourceConfig;
import org.durcframework.autocode.entity.GeneratorParam;
import org.durcframework.autocode.service.DataSourceConfigService;
import org.durcframework.autocode.service.GeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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
	public @ResponseBody
	Object generatFile(GeneratorParam generatorParam) {
		DataSourceConfig dataSourceConfig = 
				dataSourceConfigService.get(generatorParam.getDcId());

		List<CodeFile> resultList = 
				generatorService.generate(generatorParam,dataSourceConfig);

		return resultList;
	}
}
