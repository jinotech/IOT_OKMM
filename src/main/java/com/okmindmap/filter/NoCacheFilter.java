package com.okmindmap.filter;

import java.io.IOException;
import java.util.Date;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

public class NoCacheFilter implements Filter {

	@Override
	public void destroy() {
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
	
		HttpServletResponse httpResponse = (HttpServletResponse)response;
		httpResponse.setHeader("Pragma", "No-cache");
		httpResponse.setDateHeader("Expires", 0);
		httpResponse.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
		httpResponse.setHeader("Last-Modified", Long.toString(new Date().getTime()));
		
		chain.doFilter(request, response);
	}

	@Override
	public void init(FilterConfig cfg) throws ServletException {
	}

}
