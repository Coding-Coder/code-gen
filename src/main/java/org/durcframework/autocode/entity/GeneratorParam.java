package org.durcframework.autocode.entity;

import java.util.List;

public class GeneratorParam {
	private int dcId;
	private List<String> tableNames;
	private List<Integer> tcIds;
	private String packageName;
	private String charset = "UTF-8";

	public int getDcId() {
		return dcId;
	}

	public void setDcId(int dcId) {
		this.dcId = dcId;
	}

	public List<String> getTableNames() {
		return tableNames;
	}

	public void setTableNames(List<String> tableNames) {
		this.tableNames = tableNames;
	}

	public List<Integer> getTcIds() {
		return tcIds;
	}

	public void setTcIds(List<Integer> tcIds) {
		this.tcIds = tcIds;
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

}
