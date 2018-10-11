package com.okmindmap.web.spring;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.UserService;

/**
 * 사용자 가입할 때
 * 아이디와 이메일 중복 체크할 때 사용한다.
 */
public class UserAvailableAction extends BaseAction {
	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String what = request.getParameter("what");
		String value = request.getParameter("value");

		
//		response.setHeader("Cache-Control", "no-cache");
//		response.setHeader("Pragma", "no-cache");
//		response.setHeader("Content-Type", "text/javascript");
//		response.setDateHeader("Expires", 0);
		
//		Logger logger = Logger.getLogger(UserAvailableAction.class);
//		logger.info("what:: " + what);
//		logger.info("value:: " + value);
		
		PrintWriter out = new PrintWriter(response.getOutputStream());
//		BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
		
		String status = "ok";
		String message = "";
		
		if(what == null || value == null) {
			status = "error";
			message = "Parameter what or value is null!";
		} else {
			message = value + getMessage("user.new.is_available", null);
		
			if("username".equals(what)) {
				if(this.userService.isUsernameExist(value)) {
					status = "error";
					message = getMessage("user.new.username_exists", null);
				}
			} else if("email".equals(what)) {
				User user = this.userService.getByEmail(value);
				if(user != null) {
					status = "error";
					message = value + getMessage("user.new.is_not_available", null);
				}
			} else {
				status = "error";
				message = what + " is not supported!";
			}
		}
		
//		logger.info("status:: " + status);
		
		out.write("{\"status\":\"" + status + "\", \"message\":\"" + message + "\"}");
		out.flush();
		out.close();
		
		return null;
	}
	
//	private byte[] toBytes(String txt) {
//		try {
//			return txt.getBytes("UTF-8");
//		} catch (UnsupportedEncodingException e) {
//			e.printStackTrace();
//		}
//		
//		return txt.getBytes();
//	}

}
