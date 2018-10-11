package com.okmindmap.service.helper;

import javax.servlet.ServletContext;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.okmindmap.service.RestrictService;


public class RestrictServiceHelper {
	public static RestrictService getMindMapService(ServletContext ctx) {
    	WebApplicationContext wac = WebApplicationContextUtils
                .getRequiredWebApplicationContext(ctx);
         return (RestrictService) wac.getBean("restrictService");
    }
}
