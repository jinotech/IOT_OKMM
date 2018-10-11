
/**
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/copyleft/lesser.html).
 */

package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.service.MindmapService;

public class MapPreferenceAction extends BaseAction {
	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String mapId = request.getParameter("mapid");
		String returnType = request.getParameter("returntype");
		
		if(mapId != null) {
			int map_id = Integer.parseInt(mapId);
			Map map = this.mindmapService.getMap(map_id);
			data.put("lazyloading", map.getLazyloading());
			data.put("pt_sequence", map.getPt_sequence());
			data.put("queueing", map.getQueueing()>0);
		}
				
		if(returnType != null && "json".equals(returnType.toLowerCase())) {
			JSONArray json = JSONArray.fromObject(data);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		} else {	// 환경설정 페이지로 이동
			data.put("preference_type", "map_preference");
			return new ModelAndView("preference", "data", data);
		}
		
	}
}
