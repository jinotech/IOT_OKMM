package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.UserMenuService;

public class MenuMngUseynUpdateAction extends BaseAction {

	private UserMenuService userMenuService;
	
	public void setUserMenuService(UserMenuService userMenuService) {
		this.userMenuService = userMenuService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String seq = request.getParameter("seq");
		String useyn = request.getParameter("useyn");
		
		int result = userMenuService.menuMngUseynUpdate(seq, useyn);
		
		resultMap.put("result", result);
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(resultMap).toString().getBytes("UTF-8"));
		out.close();	
				
		return null;
	}

}
