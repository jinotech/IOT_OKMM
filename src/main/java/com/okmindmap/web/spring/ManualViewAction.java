package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Notice;
import com.okmindmap.service.NoticeService;

public class ManualViewAction extends BaseAction {

	private NoticeService noticeService;
	
	public void setNoticeService(NoticeService noticeService) {
		this.noticeService = noticeService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String id = (String) request.getParameter("id");
		
		Notice notice = noticeService.viewManual(id);
		
		data.put("notice", notice);
		
		return new ModelAndView("../manualView", "data", data);
	}

}