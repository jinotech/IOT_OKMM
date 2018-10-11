package com.okmindmap.web.spring.discuss;

import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.DiscussService;
import com.okmindmap.web.spring.BaseAction;

public class DiscussUserInsertAction extends BaseAction {

	private DiscussService discussService;
	
	public void setDiscussService(DiscussService discussService) {
		this.discussService = discussService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String discuss_seq = request.getParameter("discuss_seq");
		String userid = request.getParameter("userid");
				
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		
		int result = discussService.insertUser(discuss_seq, userid, "N", user.getId());
		
		resultMap.put("result", result);
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(resultMap).toString().getBytes("UTF-8"));
		out.close();
		
		return null;
	}

}
