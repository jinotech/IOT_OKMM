package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.UserMenu;
import com.okmindmap.service.UserMenuService;

import net.sf.json.JSONArray;

public class MenuListAction  extends BaseAction{
	private UserMenuService userMenuService;
	
	public void setUserMenuService(UserMenuService userMenuService) {
		this.userMenuService = userMenuService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String id = request.getParameter("id");
		List<UserMenu> menuList = userMenuService.getMenuList(id);		

		JSONArray jsonArray = new JSONArray();
		data.put("menuList", jsonArray.fromObject(menuList));
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(data).toString().getBytes("UTF-8"));
		out.close();
		return null;
	}
	
	
}
