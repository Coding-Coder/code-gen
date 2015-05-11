package org.durcframework.autocode.entity;

public class CodeFile {
	public CodeFile(String tableName, String templateName, String content) {
		this.tableName = tableName;
		this.templateName = templateName;
		this.content = content;
	}

	private String tableName;
	private String templateName;
	private String content;

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTemplateName() {
		return templateName;
	}

	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
