package com.okmindmap.web.spring.admin.setting;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;
import com.okmindmap.web.spring.BaseAction;

public class AdminManagerAction extends BaseAction {
	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		User Me = getUser(request);
		if(Me.getRoleId()!=1){
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
		}
		
		String func = request.getParameter("func");
		
		if("search".equals(func)) {
			String username = request.getParameter("username");
			ArrayList<HashMap<String, String>> us = new ArrayList<HashMap<String,String>>();
			
			if(username.trim().length() > 0) {
				List<User> users = userService.getAllUsers(1, 0, "username", username, "username", true);
				
				for( User user : users) {
					HashMap<String, String> u = new HashMap<String, String>();
					u.put("userid", String.valueOf(user.getId()));
					u.put("username", user.getUsername());
					u.put("roleid", String.valueOf(user.getRoleId()));
					
					us.add(u);
				}
			}

			JSONArray json = JSONArray.fromObject(us);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		} else if("authadmin".equals(func)) {
			int userid = Integer.parseInt(request.getParameter("userid"));
			boolean auth = ("1".equals(request.getParameter("auth")))?true : false;
			userService.setAdminAuth(userid, auth);
		}
		
		
//		String userid = request.getParameter("userid");
//		User user = null;
//		if(adminUser.getRoleId() == 1 && userid != null && userid != "") {
//			user = getUserService().get(Integer.parseInt(userid));
//		}
		
		List<User> admins = userService.getAdmins();
		
		int adminCount = admins.size();
		
		User admin = userService.get("admin");
		if(admin != null) admins.remove(admin);
		admins.remove(Me);
		
		data.put("admins", admins);
		data.put("adminCount", adminCount);
		data.put("superuser", admin);
		data.put("adminme", Me);
		
		return new ModelAndView("admin/setting/adminManager", "data", data);
	}

}
