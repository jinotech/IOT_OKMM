package com.okmindmap.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

public class XFrameFilter implements Filter {
	private String options = null;
	
    protected FilterConfig filterConfig = null;

	    public void destroy() {
	        this.options = null;
	        this.filterConfig = null;
	    }

	    public void doFilter(ServletRequest request, ServletResponse response,
	            FilterChain chain) throws IOException, ServletException {

	        if (this.options != null) {
	        	HttpServletResponse res = (HttpServletResponse)response;
	        	res.setHeader("X-Frame-Options", options);
	        }

	        chain.doFilter(request, response);
	    }

	    public void init(FilterConfig filterConfig) throws ServletException {
	        this.filterConfig = filterConfig;
	        this.options = filterConfig.getInitParameter("options");
	    }

	    public FilterConfig getFilterConfig() {
	        return this.filterConfig;
	    }

	    public void setFilterConfig(FilterConfig cfg) {
	        this.filterConfig = cfg;
	    }

}
