package org.durcframework.autocode.config;

import org.durcframework.autocode.TestBase;
import org.durcframework.autocode.entity.DataSourceConfig;
import org.durcframework.autocode.service.DataSourceConfigService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

public class DataSourceConfigServiceTest extends TestBase {

	@Autowired
	private DataSourceConfigService configService;
	
	@Test
	public void testAdd(){
		DataSourceConfig config = new DataSourceConfig();
		config.setBackUser("admin");
		config.setDriverClass("com.mysql.jdbc.Driver");
		config.setPassword("root");
		config.setUsername("root");
		
		configService.save(config);
		
		System.out.println("============="+config.getDcId());
	}
	
	@Test
	public void testGet(){
		DataSourceConfig entity = configService.get(1);
		Assert.notNull(entity);
	}
	
	@Test
	public void testUpdate(){
		DataSourceConfig config = configService.get(1);
		config.setBackUser("admin1");
		config.setDriverClass("com.mysql.jdbc.Driver1");
		config.setPassword("root1");
		config.setUsername("root1");
		
		configService.update(config);
	}
	

}
