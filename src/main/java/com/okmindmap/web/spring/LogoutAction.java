package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.UserService;

public class LogoutAction extends BaseAction {
	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			userService.logout(request, response);
			
			String url = getOptionalParam(request, "return_url", null);
			if(url == null || url.trim() == "") {
				url = request.getContextPath() + "/";
			}
			
			response.sendRedirect(url);
		} catch (Exception e) {
			return new ModelAndView("error/index", "message", e.getMessage());
		}
		
		return null;
	}

}
