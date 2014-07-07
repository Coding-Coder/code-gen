package org.durcframework.autocode.common;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.durcframework.common.WebContext;

public class BackUserFilter implements Filter {

	private static final List<String> NEED_NOT_LOGGIN = new ArrayList<String>();

	// 不需要登陆验证的
	static {
		NEED_NOT_LOGGIN.add("");
		NEED_NOT_LOGGIN.add("index.jsp");
		NEED_NOT_LOGGIN.add("login.jsp");
		NEED_NOT_LOGGIN.add("needLogin.html");
		NEED_NOT_LOGGIN.add("login.do");
	}

	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest arg0, ServletResponse arg1,
			FilterChain arg2) throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) arg0;
		HttpServletResponse response = (HttpServletResponse) arg1;

		WebContext.getInstance().setRequest(request);

		if (isLogin(request)) {
			arg2.doFilter(arg0, arg1);
		} else {
			response.sendRedirect(request.getContextPath() + "/needLogin.html");
		}
	}

	protected boolean isLogin(HttpServletRequest request) {
		String uri = request.getRequestURI();
		
		uri = uri.substring(uri.lastIndexOf("/") + 1);

		boolean isNeedNotLoginUrl = NEED_NOT_LOGGIN.contains(uri);

		if (isNeedNotLoginUrl) {
			return true;
		}
		
		return UserContext.getInstance().getUser() != null;
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}

}
