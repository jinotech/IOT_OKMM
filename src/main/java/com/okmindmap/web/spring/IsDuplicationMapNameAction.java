package com.okmindmap.web.spring;

import java.io.BufferedOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Chat;
import com.okmindmap.model.User;
import com.okmindmap.service.ChatService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.web.spring.BaseAction;

public class IsDuplicationMapNameAction extends BaseAction {

	private MindmapService mindmapService;

	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}


	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		
		BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
		
		String mapTitle = ServletRequestUtils.getStringParameter(request, "mapTitle", "");
		User user = getUser(request);
		
		
		int countDuplicatedMapName = mindmapService.countDuplicateMapName(user.getId(), mapTitle);
		if(countDuplicatedMapName == 0)			
			out.write(toBytes("{\"status\":\"ok\"}"));
		else
			out.write(toBytes("{\"status\":\"duplicated\"}"));
		
		

		out.flush();
		out.close();

		return null;
	}
	
	private byte[] toBytes(String txt) {
		try {
			return txt.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return txt.getBytes();
	}

	// page 갯수 계산 

}
