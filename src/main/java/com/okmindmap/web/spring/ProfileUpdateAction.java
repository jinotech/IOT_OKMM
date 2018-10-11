package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.UserService;
import com.okmindmap.util.PasswordEncryptor;

public class ProfileUpdateAction extends BaseAction {
	@Autowired
	private UserService userService;

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		int result = 0;
		
		String gb = request.getParameter("gb");
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		user = userService.get(user.getUsername());
		
		if(!StringUtils.isEmpty(gb)){
			if("1".equals(gb)){
				
				String firstname = request.getParameter("firstname");
				String username = request.getParameter("username");
				String email = request.getParameter("email");
				String self = request.getParameter("self");
				
				result = userService.update(firstname, username, email, self, user.getId());
				
			}else{
				
				String oldpw = request.getParameter("oldpw");
				String newpw = request.getParameter("newpw1");
				
				String encrypted = PasswordEncryptor.encrypt(oldpw);
				
				if(user.getPassword().equals(encrypted)) {	//비밀번호 OK
					
					result = userService.update(PasswordEncryptor.encrypt(newpw), user.getId());
					
				} else {
					result = 99;
				}
				
			}
		}
		
		resultMap.put("result", result);
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(resultMap).toString().getBytes("UTF-8"));
		out.close();
		
		return null;
	}
	
	
}
