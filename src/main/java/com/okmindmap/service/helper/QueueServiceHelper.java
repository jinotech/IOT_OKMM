package com.okmindmap.service.helper;

import javax.servlet.ServletContext;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.okmindmap.service.QueueService;

public class QueueServiceHelper {
	public static QueueService getQueueService(ServletContext ctx) {
    	WebApplicationContext wac = WebApplicationContextUtils
                .getRequiredWebApplicationContext(ctx);
         return (QueueService) wac.getBean("queueService");
    }
}
