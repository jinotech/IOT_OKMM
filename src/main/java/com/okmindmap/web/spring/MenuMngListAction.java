package com.okmindmap.web.spring;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.UserMenu;
import com.okmindmap.service.UserMenuService;

public class MenuMngListAction extends BaseAction {

	private UserMenuService userMenuService;
	
	public void setUserMenuService(UserMenuService userMenuService) {
		this.userMenuService = userMenuService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		List<UserMenu> menuList =  userMenuService.menuMngList();
		data.put("menuMngList", menuList);
		
		return new ModelAndView("../menuMngList", "data", data);
	}

}
