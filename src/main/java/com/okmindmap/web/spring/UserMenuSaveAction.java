package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.UserMenuService;
import com.okmindmap.web.spring.BaseAction;

public class UserMenuSaveAction extends BaseAction {
	private UserMenuService userMenuService;
	
	public void setUserMenuService(UserMenuService userMenuService) {
		this.userMenuService = userMenuService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String id = request.getParameter("id");
		String checkedVals = request.getParameter("checkedVals");
		userMenuService.insertUserMenu(checkedVals,id);
		return null;
	}
	
	
}
