package org.durcframework.autocode.entity;

import org.durcframework.autocode.generator.DataBaseConfig;

public class ClientParam {
	// Controller模板主键
	private int tcIdController;
	// Dao模板主键
	private int tcIdDao;
	// Service模板主键
	private int tcIdService;
	// Entity模板主键
	private int tcIdEntity;
	// EntitySch模板主键
	private int tcIdEntitySch;
	// MyBatis模板主键
	private int tcIdMyBatis;

	private String tcId;
	private String tableName;
	private String packageName;
	private String charset = "UTF-8";

	private String dbName;
	private String driverClass;
	private String ip;
	private int port;
	private String username;
	private String password;
	
	public DataBaseConfig buildDataBaseConfig() {
		DataBaseConfig config = new DataBaseConfig();
		config.setDbName(dbName);
		config.setDriverClass(driverClass);
		config.setIp(ip);
		config.setPassword(password);
		config.setPort(port);
		config.setUsername(username);
		
		return config;
	}

	public String getTcId() {
		return tcId;
	}

	public void setTcId(String tcId) {
		this.tcId = tcId;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public String getCharset() {
		return charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
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

	public int getTcIdController() {
		return tcIdController;
	}

	public void setTcIdController(int tcIdController) {
		this.tcIdController = tcIdController;
	}

	public int getTcIdDao() {
		return tcIdDao;
	}

	public void setTcIdDao(int tcIdDao) {
		this.tcIdDao = tcIdDao;
	}

	public int getTcIdService() {
		return tcIdService;
	}

	public void setTcIdService(int tcIdService) {
		this.tcIdService = tcIdService;
	}

	public int getTcIdEntity() {
		return tcIdEntity;
	}

	public void setTcIdEntity(int tcIdEntity) {
		this.tcIdEntity = tcIdEntity;
	}

	public int getTcIdEntitySch() {
		return tcIdEntitySch;
	}

	public void setTcIdEntitySch(int tcIdEntitySch) {
		this.tcIdEntitySch = tcIdEntitySch;
	}

	public int getTcIdMyBatis() {
		return tcIdMyBatis;
	}

	public void setTcIdMyBatis(int tcIdMyBatis) {
		this.tcIdMyBatis = tcIdMyBatis;
	}
	
	

}
