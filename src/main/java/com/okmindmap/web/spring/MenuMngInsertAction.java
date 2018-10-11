package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.UserMenuService;

public class MenuMngInsertAction extends BaseAction {

	private UserMenuService userMenuService;
	
	public void setUserMenuService(UserMenuService userMenuService) {
		this.userMenuService = userMenuService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String name = request.getParameter("name");
		String useyn = request.getParameter("useyn");
		String imgurl = request.getParameter("imgurl");
		String message = request.getParameter("message");
		String script = request.getParameter("script");
		
		int result = userMenuService.menuMngInsert(name, useyn, imgurl, message, script);
		
		resultMap.put("result", result);
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(resultMap).toString().getBytes("UTF-8"));
		out.close();	
				
		return null;
	}

}