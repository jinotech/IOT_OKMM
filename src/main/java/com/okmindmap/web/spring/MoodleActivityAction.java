package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.moodle.MoodleService;
import org.json.*;
import java.util.ArrayList;

public class MoodleActivityAction extends BaseAction {
	private OKMindmapService okmindmapService;
	private MindmapService mindmapService;
	private ShareService shareService;
	
	public void setOkmindmapService(OKMindmapService okmindmapService) {
		this.okmindmapService = okmindmapService;
	}
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User user = getUser(request);
		MoodleService moodleService = new MoodleService(user, this.okmindmapService, this.mindmapService);
		JSONObject moodleConfig =  moodleService.getMoodleConfig();
		HashMap<String, Object> data = new HashMap<String, Object>();
		String mapId = request.getParameter("mapid");
		String mapKey = request.getParameter("mapkey");
		String module = request.getParameter("addModule");
		String message = "";
		
		if(mapId != null && moodleConfig != null) {
			int map = Integer.parseInt(mapId);
			if(module != null) {
				JSONObject result = moodleService.add_module(map, 0, module, "new " + module);
				if(result != null) response.getOutputStream().write(result.toString().getBytes());
				return null;
			}else {
				JSONObject modules = moodleService.getMoodleActivities(map);
				if(modules != null) {
					data = moodleService.toHashMap(modules);
				}else {
					message = "Oops! You can not use this function. OKMM is not connected to Moodle.";
				}
			}
		}else {
			message = "Oops! You can not use this function. OKMM is not connected to Moodle.";
		}
		data.put("message", message);
		
		return new ModelAndView("moodle/activities", "data", data);
	}
}
