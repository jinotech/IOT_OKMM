package com.okmindmap.web.spring;

import java.io.StringReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.MindmapDigester;
import com.okmindmap.model.Map;
import com.okmindmap.model.MapTimeline;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;

public class TimelineSaveAsAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String timelineId = request.getParameter("id");
		String name = request.getParameter("name");
		
		User user = getUser(request);
		
		MapTimeline timeline = this.mindmapService.getMapTimeline( Integer.parseInt(timelineId) );
		
		StringReader in = null;
		in = new StringReader( timeline.getXml() );
		
		Map map = MindmapDigester.parseMap(in);
		
		if(name == null) {
			Map m = this.mindmapService.getMap( timeline.getMapId(), false);
			name = m.getName();
		} else {
			name = new String(name.getBytes("ISO-8859-1"), "UTF-8");
		}
		map.setName(name);
		
		int mapId = 0;
		if(user.getUsername().endsWith("guest")) {
			mapId = this.mindmapService.saveMap(map);
		} else {
			mapId = this.mindmapService.saveMap(map, user.getId());
		}
		
		// map key 때문에 다시 불러와야 함.
		map = this.mindmapService.getMap(mapId);
		
		return new ModelAndView("redirect:/map/" + map.getKey() );
	}
}
