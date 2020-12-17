package com.gitee.gen.entity;


import java.util.Date;

public class GenerateHistory {
	private Integer id;
	private String configContent;
	private String md5Value;
	private Date generateTime;

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getId() {
		return this.id;
	}

	public void setConfigContent(String configContent) {
		this.configContent = configContent;
	}

	public String getConfigContent() {
		return this.configContent;
	}

	public void setMd5Value(String md5Value) {
		this.md5Value = md5Value;
	}

	public String getMd5Value() {
		return this.md5Value;
	}

	public Date getGenerateTime() {
		return generateTime;
	}

	public void setGenerateTime(Date generateTime) {
		this.generateTime = generateTime;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) { return true; }
		if (o == null || getClass() != o.getClass()) {return false;}
		GenerateHistory that = (GenerateHistory) o;
		return id.equals(that.id);
	}

	@Override
	public int hashCode() {
		return java.util.Objects.hash(id);
	}

	@Override
	public String toString() {
		return "GenerateHistory{" +
				"id=" + id +
				",configContent='" + configContent + "'" +
				",md5Value='" + md5Value + "'" +
				",generateTime='" + generateTime + "'" +
				'}';
	}

}