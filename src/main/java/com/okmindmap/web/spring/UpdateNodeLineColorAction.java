package com.okmindmap.web.spring;

import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.MindmapService;

public class UpdateNodeLineColorAction extends BaseAction {

	private MindmapService mindmapService;
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String dbid = request.getParameter("dbid");
		String color = request.getParameter("color");
		
		int result = mindmapService.updateNodeLineColor(dbid, color);
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(result).toString().getBytes("UTF-8"));
		out.close();
		
		return null;
	}

}
