package com.okmindmap.web.spring;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Notice;
import com.okmindmap.service.NoticeService;

public class GuideListAction extends BaseAction{
	private NoticeService noticeService;
	
	public void setNoticeService(NoticeService noticeService) {
		this.noticeService = noticeService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		ModelAndView mView= new ModelAndView();
		
		List<Notice> guideList =  noticeService.guideMapList();		 
		
		mView.addObject("guideList", guideList);
		mView.setViewName("../guideList");
		//ModelAndView 객체를 리턴해준다. 
		return mView;

	}

}
