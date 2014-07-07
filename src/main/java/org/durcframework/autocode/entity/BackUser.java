package org.durcframework.autocode.entity;

import java.util.Date;

import org.durcframework.entity.BaseEntity;

public class BackUser extends BaseEntity {
	private String username;
	private String password;
	private Date addTime;
	
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

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

}
