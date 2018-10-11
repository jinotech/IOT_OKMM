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

public class UserUpdateAction extends BaseAction {
	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String confirmed = request.getParameter("confirmed");
		String userid = request.getParameter("userid");

		User user = getUser(request);
		
		if(user.getRoleId() == 1 && userid != null && userid != "") {
			user = userService.get(Integer.parseInt(userid));
		}
		
		if(confirmed != null && Integer.parseInt(confirmed) == 1) {
			String email = ServletRequestUtils.getStringParameter(request, "email");
			String firstname = ServletRequestUtils.getStringParameter(request, "firstname");
			String lastname = ServletRequestUtils.getStringParameter(request, "lastname");
			String password = ServletRequestUtils.getStringParameter(request, "password");
			String password1 = ServletRequestUtils.getStringParameter(request, "password1");
			
			if(user == null ) {
				return new ModelAndView("user/edit", "error", "user_not_exists");
			} else if(user.getUsername().equals("guest")) {
				return new ModelAndView("user/edit", "error", "not_login");
			}
			
			if(email == null || email.trim() == "") {
				return new ModelAndView("user/edit", "required", "email");
			}
			if(firstname == null || firstname.trim() == "") {
				return new ModelAndView("user/edit", "required", "firstname");
			}
			if(lastname == null || lastname.trim() == "") {
				return new ModelAndView("user/edit", "required", "lastname");
			}
			
			
			if(password != null && password.trim().length() > 0) {
				if(!password.equals(password1)) {
					return new ModelAndView("user/new", "error", "password_not_equal");
				} else {
					user.setPassword( PasswordEncryptor.encrypt(password));
				}
			}
			
			user.setEmail(email.trim());
			user.setFirstname( firstname.trim() );
			user.setLastname( lastname.trim() );
			
			userService.update(user);
			
			return new ModelAndView("user/edit_complete");
		} else {
			if(user == null || user.getUsername().equals("guest")) {
				HashMap<String, String> data = new HashMap<String, String>();
				data.put("messag", "not_login");
				data.put("url", "/");
				return new ModelAndView("error/index", "data", data);
			}
			
			return new ModelAndView("user/edit", "user", user);
		}
	}
	
}
