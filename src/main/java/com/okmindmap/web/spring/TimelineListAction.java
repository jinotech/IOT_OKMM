package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.MapTimeline;
import com.okmindmap.service.MindmapService;

public class TimelineListAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
//		String mapId = request.getParameter("id");
		String mapKey = request.getParameter("key");
		
		Map map =  this.mindmapService.getMapInfo(mapKey);
		List<MapTimeline> timelines = this.mindmapService.getMapTimelines(map.getId());
		
		JSONArray json = JSONArray.fromObject(timelines);
		OutputStream out = response.getOutputStream();
		out.write(json.toString().getBytes("UTF-8"));
		out.close();
				
		return null;
	}
}
