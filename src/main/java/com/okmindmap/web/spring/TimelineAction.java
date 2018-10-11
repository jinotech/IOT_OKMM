package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.MindmapService;

public class TimelineAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	/**
	 * Map의 Timeline을 만든다.
	 * response로 새로운 Timeline의 아이디를 리턴한다.
	 * 에러가 났을 경우 -1을 리턴한다.
	 */
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String mapId = request.getParameter("mapId");
		
		int timelineId = 0;
		try {
			timelineId = mindmapService.makeMapTimeline(Integer.parseInt(mapId));
		} catch (Exception e) {
			timelineId = -1;
		}
		
		response.getOutputStream().write(Integer.toString(timelineId).getBytes());

		return null;
	}
}
