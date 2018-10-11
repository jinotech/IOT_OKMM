package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Notice;
import com.okmindmap.service.NoticeService;

public class NoticeWriteAction extends BaseAction {

	private NoticeService noticeService;
	
	public void setNoticeService(NoticeService noticeService) {
		this.noticeService = noticeService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String id = (String) request.getParameter("id");
		
		if(!StringUtils.isEmpty(id)){
			Notice notice = noticeService.viewNotice(id);
			data.put("notice", notice);
		}
		
		return new ModelAndView("../noticeWrite", "data", data);
	}
	
}
