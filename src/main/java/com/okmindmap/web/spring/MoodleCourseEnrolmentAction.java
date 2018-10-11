package com.okmindmap.web.spring;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;
import com.okmindmap.moodle.MoodleService;
import java.net.URLDecoder;
import org.json.*;
import java.util.ArrayList;

public class MoodleCourseEnrolmentAction extends BaseAction {
	@Autowired
	private UserService userService;
	private OKMindmapService okmindmapService;
	private MindmapService mindmapService;
	private ShareService shareService;
	private GroupService groupService;
	
	public void setOkmindmapService(OKMindmapService okmindmapService) {
		this.okmindmapService = okmindmapService;
	}
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		String mapId = request.getParameter("mapid");
		String tabType = request.getParameter("tabtype");
		String search = request.getParameter("search");
		String page = request.getParameter("page");
		String perpage = request.getParameter("perpage");
		String action = request.getParameter("action");
		String userId = request.getParameter("userid");
		
		if(tabType == null) tabType = "moodleusers";
		
		int curPage = 0;
		if(page != null) curPage = Integer.parseInt(page);
		
		String message = "";
		
		User user = getUser(request);
		MoodleService moodleService = new MoodleService(user, this.okmindmapService, this.mindmapService, this.userService, this.shareService, this.groupService);
		JSONObject moodleConfig =  moodleService.getMoodleConfig();
		
		if(mapId != null && moodleConfig != null) {
			JSONObject enroluser = null;
			if(action != null) {
				if("moodleusers".equals(tabType)) {
					enroluser = new JSONObject();
					enroluser.put("id", userId);
				}else if("okmmusers".equals(tabType)){
					User u = this.userService.get(Integer.parseInt(userId));
					
					if(u != null) {
						enroluser = new JSONObject();
						enroluser.put("okmmauth", 1);
						enroluser.put("username", moodleService.getIdEncrypt(u));
						enroluser.put("firstname", u.getFirstname());
						enroluser.put("lastname", u.getLastname());
						enroluser.put("email", u.getEmail());
					}
				}
			}
			
			int map = Integer.parseInt(mapId);
			JSONObject courseEnrolment = moodleService.courseEnrolment(map, search, page, perpage, action, enroluser, true);
			if(courseEnrolment != null) {
				if(action != null) {
					moodleService.syncShareMap(map);
				}
				
				data = moodleService.toHashMap(courseEnrolment);
				if("okmmusers".equals(tabType)) {
					List<Object> okmmusers = new ArrayList<Object>();
					List<User> users = this.userService.getAllUsers(curPage+1, 25, "usernamestring", search, null, true);
					
					JSONObject okmmauth = moodleService.getOKMMEnrolment(map, users);
					for (User i : users) {
						if(!"guest".equals(i.getUsername()) && !"moodle".equals(i.getAuth())) {
							HashMap<String, Object> u = new HashMap<String, Object>();
							u.put("id", i.getId());
							u.put("username", i.getUsername());
							u.put("firstname", i.getFirstname());
							u.put("lastname", i.getLastname());
							u.put("email", i.getEmail());
							
							String _id = moodleService.getIdEncrypt(i);
							if(okmmauth.has(_id)) {
								u.put("is_enrolled", okmmauth.getString(_id));
							}else {
								u.put("is_enrolled", 0);
							}
							
							if(okmmauth.has(_id + "_is_teacher")) {
								u.put("is_teacher", okmmauth.getString(_id + "_is_teacher"));
							}else {
								u.put("is_teacher", 0);
							}
							
							okmmusers.add(u);
						}
					}
					data.put("users", okmmusers);
				}
			}else {
				message = "Oops! You can not use this function. OKMM is not connected to Moodle.";
			}
		}else {
			message = "Oops! You can not use this function. OKMM is not connected to Moodle.";
		}
		
		data.put("mapId", mapId);
		data.put("tabType", tabType);
		data.put("message", message);
		data.put("search", search);
		data.put("page", curPage);
		
		return new ModelAndView("moodle/courseEnrolment", "data", data);
	}
}
