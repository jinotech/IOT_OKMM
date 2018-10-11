package com.okmindmap.service.helper;

import javax.servlet.ServletContext;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.okmindmap.service.MindmapService;

public class MindmapServiceHelper {
	public static MindmapService getMindMapService(ServletContext ctx) {
    	WebApplicationContext wac = WebApplicationContextUtils
                .getRequiredWebApplicationContext(ctx);
         return (MindmapService) wac.getBean("mindmapService");
    }
}
