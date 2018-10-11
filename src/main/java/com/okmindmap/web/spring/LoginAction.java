package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.moodle.MoodleService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.UserService;

public class LoginAction extends BaseAction {
	@Autowired
	private UserService userService;
	private OKMindmapService okmindmapService;
	private MindmapService mindmapService;
	
	public void setOkmindmapService(OKMindmapService okmindmapService) {
		this.okmindmapService = okmindmapService;
	}
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String persistent = request.getParameter("persistent");
		String facebook = request.getParameter("facebook");		
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		// Moodle auth request
		String auth = (String) request.getParameter("auth");
		String mdlauth = (String) request.getParameter("mdlauth");
		User authUser = getUser(request);
		MoodleService moodleService = new MoodleService(authUser, this.okmindmapService, this.mindmapService, this.userService);
		if(auth != null && authUser != null && !authUser.getUsername().equals("guest")) {
			data.put("auth_redirect", moodleService.getAuthRedirect(auth));
		}
		
		if(auth == null) data.put("moodle_loginpage_idp", moodleService.getMoodleLoginPageIdp());
		else data.put("moodle_loginpage_idp", "");
		
		if(facebook != null && !"".equals(facebook)) {
			User user = userService.loginFromFacebook(request, response, facebook);
			
			if(user == null) {
//				String url = request.getContextPath() + "/user/joinmethod.jsp";
//				response.getOutputStream().write(url.getBytes());
//				return null;
				response.getOutputStream().write("0".getBytes());
				return null;
			}
			
			String url = getOptionalParam(request, "return_url", null);
			if(url == null || url.trim() == "" || url.indexOf("index") != -1) {
				int mapId = user.getLastmap();
				Map map = this.mindmapService.getMap(mapId);
				if(map == null) {
					url = request.getContextPath() + "/index.do";
				} else {
					url = request.getContextPath() + "/map/" + map.getKey();
				}					
			}
			
			response.getOutputStream().write(url.getBytes());
			return null;
			//response.sendRedirect(url);
		} else  if(username != null && password != null) {
			try {
				User user = null;
				if(persistent != null && "1".equals(persistent)) {
					user = userService.login(request, response, username, password, true);
				} else {
					user = userService.login(request, response, username, password, false);
				}
				
				String fbconnect = getOptionalParam(request, "facebook_connect", null);
				if(fbconnect != null && !"".equals(fbconnect)) {
					userService.updateFacebook(user.getId(), fbconnect);
				}
				
				String url = getOptionalParam(request, "return_url", null);
				if(url == null || url.trim() == "" || url.indexOf("index") != -1) {
					int mapId = user.getLastmap();
					Map map = this.mindmapService.getMap(mapId);
					if(map == null) {
						//url = request.getContextPath() + "/index.do";
						url = request.getContextPath() + "/front.do";
					} else {
						//url = request.getContextPath() + "/map/" + map.getKey();
						url = request.getContextPath() + "/front.do";
					}					
				}
				
				// returnMapkey 있을경우 처리 조동휘 180820
				String returnMapKey = (String) request.getSession().getAttribute("returnMapKey");
				if(returnMapKey != null){					
					String returnUrl = request.getContextPath() + "/map/" + returnMapKey;
					url = returnUrl;
					// 조동휘 180820 remove가 안됨.. 확인 후 수정필요
					request.getSession().removeAttribute("returnMapKey");
				}
				
				response.sendRedirect(url);
			} catch (Exception e) {
				return new ModelAndView("user/login", "message", e.getMessage());
			}
		}else if(mdlauth != null) {
			User mdlUser = moodleService.syncMoodleId(mdlauth);
			
			if(mdlUser !=null) {
				User user = userService.loginFromMoodle(request, response, mdlUser.getUsername());
				
				if(user != null) {
					int mapId = user.getLastmap();
					Map map = this.mindmapService.getMap(mapId);
					if(map == null) {
						response.sendRedirect(request.getContextPath() + "/index.do");
					} else {
						response.sendRedirect(request.getContextPath() + "/map/" + map.getKey());
					}
				}
			}
			return new ModelAndView("user/login", "data", data);
		} else {
			return new ModelAndView("user/login", "data", data);
		}
		
		return null;
	}

}
