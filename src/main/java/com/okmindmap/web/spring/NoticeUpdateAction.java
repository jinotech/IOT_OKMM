package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.NoticeService;

public class NoticeUpdateAction extends BaseAction {

	private NoticeService noticeService;
	
	public void setNoticeService(NoticeService noticeService) {
		this.noticeService = noticeService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String id = request.getParameter("id");
		String title = request.getParameter("title");
		String content_ko = request.getParameter("content_ko");
		String hide = request.getParameter("hide");
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		
		int result = 0;
		
		if(!StringUtils.isEmpty(id)){
			result = noticeService.updateNotice(id, title, content_ko, hide, user.getId());
		}
		
		resultMap.put("result", result);
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(resultMap).toString().getBytes("UTF-8"));
		out.close();	
				
		return null;
	}

}
