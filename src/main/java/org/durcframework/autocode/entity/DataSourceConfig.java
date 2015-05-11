package org.durcframework.autocode.entity;

import org.durcframework.autocode.generator.DataBaseConfig;

public class DataSourceConfig extends DataBaseConfig {
	private int dcId;
	private String name;
	private String backUser;

	public int getDcId() {
		return dcId;
	}

	public void setDcId(int dcId) {
		this.dcId = dcId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBackUser() {
		return backUser;
	}

	public void setBackUser(String backUser) {
		this.backUser = backUser;
	}

}
