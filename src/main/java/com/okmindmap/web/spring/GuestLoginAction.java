package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.UserService;

public class GuestLoginAction extends BaseAction {
	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String url = request.getParameter("url");
		
		userService.loginAsGuest(request);
				
		if(url == null) {
			url = request.getContextPath();
		}
		
		response.sendRedirect(url);
		
		return null;
	}

}
