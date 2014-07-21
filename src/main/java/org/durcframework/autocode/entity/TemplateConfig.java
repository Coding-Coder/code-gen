package org.durcframework.autocode.entity;


public class TemplateConfig {
	private int tcId;
	private String name;
	private String savePath;
	private String content;
	private String backUser;

	public int getTcId() {
		return tcId;
	}

	public void setTcId(int tcId) {
		this.tcId = tcId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSavePath() {
		return savePath;
	}

	public void setSavePath(String savePath) {
		this.savePath = savePath;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getBackUser() {
		return backUser;
	}

	public void setBackUser(String backUser) {
		this.backUser = backUser;
	}

}
