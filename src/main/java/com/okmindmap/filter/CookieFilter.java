package com.okmindmap.filter;

/**
 * 
 */

import java.io.IOException;
import java.util.UUID;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieFilter implements Filter {
	public final static String COOKIE_NAME = "CLIENT_ID";
	public final static String ATTRIBUTE_NAME = "CLIENT_ID";
    protected FilterConfig filterConfig = null;
    
    public void destroy() {
    	this.filterConfig = null;
    }
    
    public void doFilter(ServletRequest request, ServletResponse response,
	            FilterChain chain) throws IOException, ServletException {

    	HttpServletRequest req = (HttpServletRequest) request;
    	
    	String clientId = this.getCookie(req);
    	if(clientId == null) {
    		clientId = this.generateClientId();
    		
    		HttpServletResponse res = (HttpServletResponse)response;
    		
    		this.setCookie(req, res, clientId);
    	}
    	
    	req.setAttribute(CookieFilter.ATTRIBUTE_NAME, clientId);
    	
    	chain.doFilter(request, response);
    }
    
    private void setCookie(HttpServletRequest request, HttpServletResponse response, String value) {
		try {
			Cookie cookie = new Cookie(CookieFilter.COOKIE_NAME, value);
			
			String domain = request.getServerName();
			int maxAge = 0;
			try{
				maxAge = new Integer(getFilterConfig().getInitParameter("cookie-age")).intValue();
			} catch (Exception e) {
				maxAge = -1;
			}
			
			cookie.setDomain(domain);
			cookie.setPath(request.getContextPath() + "/");
	        cookie.setMaxAge(maxAge);
	        
	        response.addCookie(cookie);
	    } catch (Exception e) {
	    	e.printStackTrace();
		}
	}
    
    private String getCookie(HttpServletRequest request) {
    	Cookie[] cookies = request.getCookies();
    	if (cookies != null) {
    		for(int i = 0; i < cookies.length; i++) {
    			String cookieName = cookies[i].getName();
    			if(CookieFilter.COOKIE_NAME.equals(cookieName)) {
    				return cookies[i].getValue();
    			}
    		}
    	}
    	
    	return null;
    }
    
    private String generateClientId() {
		return UUID.randomUUID().toString();
	}
    
    private FilterConfig getFilterConfig() {
    	return this.filterConfig;
    }
    
    public void init(FilterConfig filterConfig) throws ServletException {
    	this.filterConfig = filterConfig;
    }
}
