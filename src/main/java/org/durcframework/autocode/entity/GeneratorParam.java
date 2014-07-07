package org.durcframework.autocode.entity;

import java.util.List;

public class GeneratorParam {
	private int dcId;
	private List<String> tableNames;
	private List<Integer> tcIds;
	

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

}
