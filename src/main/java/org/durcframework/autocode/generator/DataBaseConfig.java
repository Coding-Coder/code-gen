package org.durcframework.autocode.generator;

import java.util.HashMap;
import java.util.Map;


public class DataBaseConfig {
	
	private static Map<String, String> jdbcUrlMap = new HashMap<String,String>();
	static {
		// com.mysql.jdbc.Driver
		// net.sourceforge.jtds.jdbc.Driver
		// com.microsoft.sqlserver.jdbc.SQLServerDriver
		jdbcUrlMap.put("com.mysql.jdbc.Driver", "jdbc:mysql://%s:%s/%s?useUnicode=true&characterEncoding=UTF-8");
		jdbcUrlMap.put("net.sourceforge.jtds.jdbc.Driver", "jdbc:jtds:sqlserver://%s:%s;databaseName=%s");
	}
	
	private String dbName;
	private String driverClass;
	private String ip;
	private int port;
	private String username;
	private String password;
	
	public String getJdbcUrl() {
		String url = jdbcUrlMap.get(driverClass);
		return String.format(url, ip,port,dbName);
	}
	
	public String getDbName() {
		return dbName;
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}

	public String getDriverClass() {
		return driverClass;
	}

	public void setDriverClass(String driverClass) {
		this.driverClass = driverClass;
	}
	
	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
