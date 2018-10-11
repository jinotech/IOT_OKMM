package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.QueueService;
import com.okmindmap.web.spring.BaseAction;

public class QueueListAction extends BaseAction {
	
	private QueueService queueService;
	

	public QueueService getQueueService() {
		return queueService;
	}


	public void setQueueService(QueueService queueService) {
		this.queueService = queueService;
	}


	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String page = (String)getRequiredParam(request, "page", String.class);
		
		return new ModelAndView("viewqueue", "data", this.queueService.getQueue(page));
	}	
}
