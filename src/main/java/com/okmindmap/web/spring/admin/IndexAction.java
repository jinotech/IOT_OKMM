package com.okmindmap.web.spring.admin;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.web.spring.BaseAction;

public class IndexAction extends BaseAction {

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User adminuser = getUser(request);
		if(adminuser.getRoleId()!=1){
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
		}
		
		return new ModelAndView("admin/index");
	}

}
