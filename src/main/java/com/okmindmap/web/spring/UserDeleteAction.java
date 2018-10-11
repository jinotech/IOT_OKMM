package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.UserService;
import com.okmindmap.util.PasswordEncryptor;

/**
 * 회원 탈퇴
 * @author jinhoon
 *
 */
public class UserDeleteAction extends BaseAction {
	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String confirmed = request.getParameter("confirmed");
		String password = ServletRequestUtils.getStringParameter(request, "password");

		User user = getUser(request);
		
		if(user == null || user.getUsername().equals("guest")) {
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("message", getMessage("error.pleaselogin", null));
			data.put("url", "/");
			
			return new ModelAndView("error/index", "data", data);
		}
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("user", user);
		
		if(confirmed != null && Integer.parseInt(confirmed) == 1) {
			String encrypted = PasswordEncryptor.encrypt(password);
			if(!user.getPassword().equals(encrypted)) {
				data.put("error", getMessage("error.passwordincorrect"));
				
				return new ModelAndView("user/delete", "data", data);
			}
			
			if(userService.deleteUser(user.getId())) {
				userService.logout(request, response);
				
				return new ModelAndView("user/delete_complete");
			} else {
				data.put("error", getMessage("user.membershipwithrawal.failed"));
				
				return new ModelAndView("user/delete", "data", data);
			}
		} else {
			data.put("error", "");
			
			return new ModelAndView("user/delete", "data", data);
		}
	}
}
