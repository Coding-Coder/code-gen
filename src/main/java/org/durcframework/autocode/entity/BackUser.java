package org.durcframework.autocode.entity;

import java.util.Date;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.durcframework.core.IUser;

public class BackUser implements IUser{
	@Pattern(regexp="\\w+",message="用户名只能由数字,字母,下划线组成")
	@Size(min=4,max=20,message="用户名长度范围在4-20之间")
	private String username;
	@Size(min=6,max=20,message="密码长度范围在6-20之间")
	private String password;
	private Date addTime = new Date();

	@Override
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Override
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
