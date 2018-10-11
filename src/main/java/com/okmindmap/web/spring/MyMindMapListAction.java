package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;

import net.sf.json.JSONArray;

public class MyMindMapListAction extends BaseAction {

	private MindmapService mindmapService;
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		
		String searchMapName = request.getParameter("searchMapName");
		List<Map> list = null;
		
		if(StringUtils.isEmpty(searchMapName)){
			list = mindmapService.getUserMaps(user.getId());
		}else{
			list = mindmapService.getUserMaps(user.getId(), searchMapName);
		}
		
		JSONArray jsonArray = new JSONArray();
		data.put("mapList", jsonArray.fromObject(list));
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(data).toString().getBytes("UTF-8"));
		out.close();
		
		return null;
	}

}
