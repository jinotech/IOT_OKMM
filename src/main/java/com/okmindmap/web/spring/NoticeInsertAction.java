package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.NoticeService;

public class NoticeInsertAction extends BaseAction {

	private NoticeService noticeService;
	
	public void setNoticeService(NoticeService noticeService) {
		this.noticeService = noticeService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String bbs_gb = request.getParameter("bbs_gb");
		String title = request.getParameter("title");
		String content_ko = request.getParameter("content_ko");
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		
		int result = noticeService.insertNotice(title, content_ko, user.getId(), bbs_gb);
		
		resultMap.put("result", result);
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(resultMap).toString().getBytes("UTF-8"));
		out.close();	
				
		return null;
	}
	

}
