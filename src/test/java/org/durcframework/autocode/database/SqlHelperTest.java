package org.durcframework.autocode.database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.durcframework.autocode.TestBase;
import org.durcframework.autocode.entity.DataSourceConfig;
import org.durcframework.autocode.util.SqlHelper;
import org.junit.Test;
import org.springframework.util.Assert;

public class SqlHelperTest extends TestBase{

	@Test
	public void testSql(){
		String sql = "SHOW TABLES";
		DataSourceConfig dataSourceConfig = new DataSourceConfig();
		dataSourceConfig.setDriverClass("com.mysql.jdbc.Driver");
		dataSourceConfig.setJdbcUrl("jdbc:mysql://localhost:3306/auto_code");
		dataSourceConfig.setUsername("root");
		dataSourceConfig.setPassword("root");
		
		List<Map<String, Object>> map = SqlHelper.runSql(dataSourceConfig, sql);
		
		Assert.notEmpty(map);
		
	}
	
	@Test
	public void testSqlParam(){
		String sql = "SELECT * FROM datasource_config WHERE dc_id=${id}";
		DataSourceConfig dataSourceConfig = new DataSourceConfig();
		dataSourceConfig.setDriverClass("com.mysql.jdbc.Driver");
		dataSourceConfig.setJdbcUrl("jdbc:mysql://localhost:3306/auto_code");
		dataSourceConfig.setUsername("root");
		dataSourceConfig.setPassword("root");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", 2);
		
		List<Map<String, Object>> map = SqlHelper.runSql(dataSourceConfig, sql,params);
		
		Assert.notEmpty(map);
		
	}
	
	@Test
	public void testSqlserverTable(){
		String tableName = "back_user_opt_rec";
		StringBuilder sb = new StringBuilder();
		sb
		.append("SELECT")
		.append("	SCHEMA_NAME(bt.schema_id) AS [schema]")
		.append("	, col.name AS COLUMN_NAME")
		.append("	, bt.name AS type")
		.append("	, col.is_identity")
		.append("	,(")
		.append("		SELECT COUNT(1) FROM sys.indexes IDX ")
		.append("		INNER JOIN sys.index_columns IDXC ")
		.append("		ON IDX.[object_id]=IDXC.[object_id] ")
		.append("		AND IDX.index_id=IDXC.index_id ")
		.append("		LEFT JOIN sys.key_constraints KC ")
		.append("		ON IDX.[object_id]=KC.[parent_object_id] ")
		.append("		AND IDX.index_id=KC.unique_index_id ")
		.append("		INNER JOIN sys.objects O ")
		.append("		ON O.[object_id]=IDX.[object_id] ")
		.append("		WHERE O.[object_id]=col.[object_id] ")
		.append("		AND O.type='U' ")
		.append("		AND O.is_ms_shipped=0 ")
		.append("		AND IDX.is_primary_key=1 ")
		.append("		AND IDXC.Column_id=col.column_id ")
		.append("	) AS is_pk ")
		.append("FROM sys.columns col ")
		.append("LEFT OUTER JOIN sys.types bt on bt.user_type_id = col.system_type_id ")
		.append("WHERE col.object_id = object_id('").append(tableName).append("') ")
		.append("ORDER BY [schema] ASC,table_name ASC ");
		
		DataSourceConfig dataSourceConfig = new DataSourceConfig();
		dataSourceConfig.setDriverClass("net.sourceforge.jtds.jdbc.Driver");
		dataSourceConfig.setJdbcUrl("jdbc:jtds:sqlserver://192.168.9.31:1433;databaseName=fire");
		dataSourceConfig.setUsername("sa");
		dataSourceConfig.setPassword("isp#123");
		
		List<Map<String, Object>> resultList = SqlHelper.runSql(dataSourceConfig, sb.toString());
		
		
		
		Assert.notEmpty(resultList);
	}
}
