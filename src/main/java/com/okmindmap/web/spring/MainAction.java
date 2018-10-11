package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.UserService;

public class MainAction extends BaseAction {
	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		User user = getUser(request);
		
		// 페이스북 앱에 대응		
		String fb_canvas = request.getParameter("fb_canvas");
		if(fb_canvas != null && "1".equals(fb_canvas)) {
			String fb_token = request.getParameter("fb_token");
			user = this.userService.loginFromFacebook(request, response, fb_token);
			if(user == null || user.getUsername().equals("guest")) {
				return new ModelAndView("user/facebook_login");
			}
		}
		
		if(user == null || user.getUsername().equals("guest")) {
			String persistent = getPersistentCookie(request);
			String fb_token = request.getParameter("fb_token");
			if(persistent != null) {
				User user_ps = this.userService.loginFromPersistent(request, response, persistent);
				if(user_ps != null) {
					user = user_ps;
				}
			} else if(fb_token != null && !"".equals(fb_token)) {
				User user_fb = this.userService.loginFromFacebook(request, response, fb_token);
				if(user_fb != null) {
					user = user_fb;
				} else {
					return new ModelAndView("../main", "data", data);
				}
			} else {
				// 메인페이지로 (시작페이지. OKM 루트페이지가 아닌 일반 메인페이지)
				return new ModelAndView("../main", "data", data);
			}
		}
		data.put("user", user);
		
		// Mobile 식별을 위한 값
		String userAgent = request.getHeader("user-agent");
		if(userAgent.indexOf("iPhone") != -1 || userAgent.indexOf("iPod") != -1){
			data.put("mobile", "iPhone");
		}else if(userAgent.indexOf("iPad") != -1){
			data.put("mobile", "iPad");
		}else if(userAgent.indexOf("Android") != -1){
			data.put("mobile", "Android");
		}
		
		if(data.get("mobile") != null) {
			request.setAttribute("menu", "off");
		}
		
		// 로그인이 된상태이므로 OKM 루트페이지로..
		return new ModelAndView("../index", "data", data);
		
	}

}
