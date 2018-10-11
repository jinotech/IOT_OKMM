package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

public class UsageAction extends BaseAction {

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String usageType = getOptionalParam(request, "usageType", "mindmap");
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("usageType", usageType);
		
		return new ModelAndView("/help/usage", "data", data);
	}

}
