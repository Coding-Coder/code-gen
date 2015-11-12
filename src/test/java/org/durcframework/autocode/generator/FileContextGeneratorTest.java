package org.durcframework.autocode.generator;

import java.io.StringReader;
import java.io.StringWriter;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.durcframework.autocode.TestBase;
import org.durcframework.autocode.entity.DataSourceConfig;
/**
<pre> 
模板:
package ${context.packageName}.entity;

import org.durcframework.entity.BaseEntity;

publc class ${context.javaBeanName} extends BaseEntity {
#foreach($column in $columns) 
	private ${column.javaType} ${column.javaFieldName};
#end
#foreach($column in $columns) 
	public void set${column.javaFieldNameUpperFirstLetter}(${column.javaType} ${column.javaFieldName}){
		this.$column.javaFieldName = $column.javaFieldName;
	}

	public ${column.javaType} get${column.javaFieldNameUpperFirstLetter}(){
		return this.${column.javaFieldName};
	}

#end}

转换后:
publc class DatasourceConfig extends BaseEntity {
	private int dcId;
	private String name;
	private String driverClass;
	private String jdbcUrl;
	private String username;
	private String password;
	private String backUser;
	public void setDcId(int dcId){
		this.dcId = dcId;
	}

	public int getDcId(){
		return this.dcId;
	}

	public void setName(String name){
		this.name = name;
	}

	public String getName(){
		return this.name;
	}

	public void setDriverClass(String driverClass){
		this.driverClass = driverClass;
	}

	public String getDriverClass(){
		return this.driverClass;
	}

	public void setJdbcUrl(String jdbcUrl){
		this.jdbcUrl = jdbcUrl;
	}

	public String getJdbcUrl(){
		return this.jdbcUrl;
	}

	public void setUsername(String username){
		this.username = username;
	}

	public String getUsername(){
		return this.username;
	}

	public void setPassword(String password){
		this.password = password;
	}

	public String getPassword(){
		return this.password;
	}

	public void setBackUser(String backUser){
		this.backUser = backUser;
	}

	public String getBackUser(){
		return this.backUser;
	}

}</pre>
 */
public class FileContextGeneratorTest extends TestBase {
	// 模板
	static String template = 
"package ${context.packageName}.entity;\r\n\r\n" +

"import org.durcframework.entity.BaseEntity;\r\n\r\n" +
	
"publc class ${context.javaBeanName} extends BaseEntity {\r\n" +
// 属性
"#foreach($column in $columns) \r\n" +
	"\tprivate ${column.javaType} ${column.javaFieldName};\r\n" +
"#end" +
"\r\n"+
// get/set
"#foreach($column in $columns) \r\n" +
	"\tpublic void set${column.javaFieldNameUpperFirstLetter}(${column.javaType} ${column.javaFieldName}){\r\n" +
		"\t\tthis.$column.javaFieldName = $column.javaFieldName;\r\n"+
	"\t}\r\n" +
"\r\n"+
	"\tpublic ${column.javaType} get${column.javaFieldNameUpperFirstLetter}(){\r\n" +
		"\t\treturn this.${column.javaFieldName};\r\n"+
	"\t}\r\n"+
"\r\n"+
"#end"+
"}\r\n";
	
	static String template2 = "publc class ${context.javaBeanName} extends BaseEntity {" +
			"\r\n packageName:${context.packageName},tableName:${table.tableName} " +
			"#foreach($column in $columns) $column.javaFieldName #end" +
			"}";
	
	// 数据源
	static DataSourceConfig dataSourceConfig = new DataSourceConfig();
	static {
		dataSourceConfig.setDriverClass("com.mysql.jdbc.Driver");
		//dataSourceConfig.setJdbcUrl("jdbc:mysql://localhost:3306/auto_code");
		dataSourceConfig.setUsername("root");
		dataSourceConfig.setPassword("root");
	}
	
	
	private void doGenerator(SQLContext sqlContext){
		Velocity.init();

		VelocityContext context = new VelocityContext();
		
		context.put("context", sqlContext);
		context.put("table", sqlContext.getTableDefinition());
		context.put("columns", sqlContext.getTableDefinition().getColumnDefinitions());

		StringWriter writer = new StringWriter();
		StringReader reader = new StringReader(template);
		// 不用vm文件
		Velocity.evaluate(context, writer, "mystring", reader);
		System.out.println("模板:\r\n"+template);
		System.out.println(writer.toString());
	}
	
}
