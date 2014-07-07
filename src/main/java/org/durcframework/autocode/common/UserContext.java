package org.durcframework.autocode.common;

import org.durcframework.autocode.entity.BackUser;
import org.durcframework.common.WebContext;

public enum UserContext {
	INSTANCE;
	
	private static String S_KEY_USER = "S_KEY_USER";
	
	public static UserContext getInstance() {
		return INSTANCE;
	}
	
	public  BackUser getUser(){
	    return (BackUser) WebContext.getInstance().getSession().getAttribute(S_KEY_USER);
	}
	
	public  void setUser(BackUser BackUser) {
		WebContext.getInstance().getSession().setAttribute(S_KEY_USER, BackUser);
	}
}
