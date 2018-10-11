package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.UserService;
import com.okmindmap.util.PasswordEncryptor;

public class UserAddAction extends BaseAction {
	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String confirmed = request.getParameter("confirmed");

		if(confirmed != null && Integer.parseInt(confirmed) == 1) {
			String username = request.getParameter("username");
			String email = request.getParameter("email");
			String firstname = request.getParameter("firstname");
			String lastname = request.getParameter("lastname");
			String password = request.getParameter("password");
			String password1 = request.getParameter("password1");
			String facebook = request.getParameter("facebook");
			
			if(username == null || username.trim() == "") {
				return new ModelAndView("user/new", "required", "username");
			}
			if(email == null || email.trim() == "") {
				return new ModelAndView("user/new", "required", "email");
			}
			if(firstname == null || firstname.trim() == "") {
				return new ModelAndView("user/new", "required", "firstname");
			}
			if(lastname == null || lastname.trim() == "") {
				//return new ModelAndView("user/new", "required", "lastname");
			}
			if(password == null || password1 == null || !password.equals(password1)) {
				return new ModelAndView("user/new", "required", "password");
			}
			
			User user = new User();
			user.setUsername(username.trim());
			user.setEmail(email.trim());
			user.setPassword( PasswordEncryptor.encrypt(password));
//			user.setFirstname( new String(firstname.trim().getBytes("ISO-8859-1"), "UTF-8") );
//			user.setLastname(new String(lastname.trim().getBytes("ISO-8859-1"), "UTF-8"));
			user.setFirstname( firstname.trim() );
			user.setLastname( lastname.trim() );
			user.setAuth("manual");
			user.setConfirmed(1);
			user.setDeleted(0);
			
			// 패북으로 가입시 가입후 바로 로그인.
			// 이미 페북으로 가입되어 있음 바로 로그인.
			if(facebook != null && facebook != "") {
				user.setFacebookAccessToken(facebook);
				
				User facebookMan = userService.loginFromFacebook(request, response, facebook);
				
				if(facebookMan == null) {
					userService.add(user);
					facebookMan = userService.loginFromFacebook(request, response, facebook);
				}
				
				if(facebookMan != null) {	// 성공
//					String url = getOptionalParam(request, "return_url", null);
//					if(url == null || url.trim() == "") {
//						url = request.getContextPath() + "/index.do";
//					}
//					response.getOutputStream().write(url.getBytes());
					response.getOutputStream().write("1".getBytes());
				} else {					// 실패
					response.getOutputStream().write("0".getBytes());
				}
				return null;
			} else {
				User chkuser = userService.get(user.getUsername());
				String isUser = "N";
				String addUser = "N";
				
				if(chkuser == null) {
					userService.add(user);
					addUser = "Y";
				}else {
					isUser = "Y";
				}
				
				String kakaojoin = request.getParameter("kakaojoin");
				String googlejoin = request.getParameter("googlejoin");
				
				if(!StringUtils.isEmpty(kakaojoin) && "Y".equals(kakaojoin)) {
					//return new ModelAndView("redirect:/user/login.do?username="+username+"&password=kakao");
					return new ModelAndView("redirect:/?kakaojoin="+kakaojoin+"&isUser="+isUser);
				}else if(!StringUtils.isEmpty(googlejoin) && "Y".equals(googlejoin)){
					return new ModelAndView("redirect:/?googlejoin="+googlejoin+"&isUser="+isUser);
				}else {
					return new ModelAndView("redirect:/?addUser="+addUser);	
				}
				
				
			}
			
		} else {
			return new ModelAndView("user/new");
		}
	}
	
}
