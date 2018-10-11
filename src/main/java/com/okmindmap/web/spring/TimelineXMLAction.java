package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.MapTimeline;
import com.okmindmap.service.MindmapService;

public class TimelineXMLAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String id = request.getParameter("id");
		
//		User user = getUser(request);
//		if(user == null || user.getUsername().equals("guest")) {
//			String persistent = getPersistentCookie(request);
//			if(persistent != null) {
//				User user2 = this.userService.loginFromPersistent(request, response, persistent);
//				if(user2 != null) {
//					user = user2;
//				}
//			}
//		}
		
		MapTimeline timeline = this.mindmapService.getMapTimeline(Integer.parseInt(id));
//		Map map =  this.mindmapService.getMap((int)timeline.getMapId(), false);
		
		response.getOutputStream().write(timeline.getXml().getBytes());
		
		return null;
	}
}
