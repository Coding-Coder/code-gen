package org.durcframework.autocode;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.transaction.TransactionConfiguration;

@ContextConfiguration(locations={"classpath:applicationContext.xml"})
@TransactionConfiguration(defaultRollback=false)
public class TestBase extends AbstractTransactionalJUnit4SpringContextTests{

	@Override
	@Resource(name="dataSource") 
	public void setDataSource(DataSource dataSource) {
		super.setDataSource(dataSource);
	}

}
