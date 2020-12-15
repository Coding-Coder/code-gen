package com.gitee.gen.common;

import java.util.List;

public class GeneratorParam {
	/** datasource_config主键 */
	private int datasourceConfigId;

	/** 表名 */
	private List<String> tableNames;

	/** template_config主键 */
	private List<Integer> templateConfigIdList;

	private String packageName;

	private String delPrefix;

	private String charset = "UTF-8";

	public int getDatasourceConfigId() {
		return datasourceConfigId;
	}

	public void setDatasourceConfigId(int datasourceConfigId) {
		this.datasourceConfigId = datasourceConfigId;
	}

	public List<String> getTableNames() {
		return tableNames;
	}

	public void setTableNames(List<String> tableNames) {
		this.tableNames = tableNames;
	}

	public List<Integer> getTemplateConfigIdList() {
		return templateConfigIdList;
	}

	public void setTemplateConfigIdList(List<Integer> templateConfigIdList) {
		this.templateConfigIdList = templateConfigIdList;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public String getDelPrefix() {
		return delPrefix;
	}

	public void setDelPrefix(String delPrefix) {
		this.delPrefix = delPrefix;
	}

	public String getCharset() {
		return charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}

}
