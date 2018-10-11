package com.okmindmap.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class EncodingFilter implements Filter {
	
	 private String encoding = null;
	 private boolean forceEncoding = false;
    protected FilterConfig filterConfig = null;

	    public void destroy() {
	        this.encoding = null;
	        this.filterConfig = null;
	    }

	    public void doFilter(ServletRequest request, ServletResponse response,
	            FilterChain chain) throws IOException, ServletException {

	        if (this.encoding != null && (this.forceEncoding || request.getCharacterEncoding() == null)) {
                request.setCharacterEncoding(this.encoding);
	        }

	        chain.doFilter(request, response);
	    }

	    public void init(FilterConfig filterConfig) throws ServletException {
	        this.filterConfig = filterConfig;
	        this.encoding = filterConfig.getInitParameter("encoding");
	        this.forceEncoding = Boolean.valueOf(filterConfig.getInitParameter("forceEncoding"));
	    }

	    public FilterConfig getFilterConfig() {
	        return this.filterConfig;
	    }

	    public void setFilterConfig(FilterConfig cfg) {
	        this.filterConfig = cfg;
	    }

}
