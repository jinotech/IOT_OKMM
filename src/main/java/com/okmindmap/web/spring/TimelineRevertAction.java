package com.okmindmap.web.spring;

import java.io.StringReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.MindmapDigester;
import com.okmindmap.model.Map;
import com.okmindmap.model.MapTimeline;
import com.okmindmap.service.MindmapService;

public class TimelineRevertAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String id = request.getParameter("id");
		
//		User user = getUser(request);
		
		MapTimeline timeline = this.mindmapService.getMapTimeline( Integer.parseInt(id) );
		
		try {
			Map map = this.mindmapService.getMap( timeline.getMapId() );
			
			// 현재 버전을 Timeline으로 만든다.
			mindmapService.makeMapTimeline( timeline.getMapId() );
			
			// Timeline을 현재 버전으로 만든다.
			Map revert = MindmapDigester.parseMap( new StringReader( timeline.getXml() ) );
			revert.setId(map.getId());
			revert.setName(map.getName());
			revert.setKey(map.getKey());
			
			this.mindmapService.updateMap(revert);
			
			return new ModelAndView("redirect:/map/" + map.getKey() );
		} catch (Exception e) {
			throw e;
		}
	}
}
