package com.okmindmap.web.spring.discuss;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Discuss;
import com.okmindmap.model.User;
import com.okmindmap.service.DiscussService;
import com.okmindmap.web.spring.BaseAction;

import net.sf.json.JSONArray;

public class DiscussContentListAction extends BaseAction {

	private DiscussService discussService;
	
	public void setDiscussService(DiscussService discussService) {
		this.discussService = discussService;
	}
	
	@SuppressWarnings("static-access")
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String mapid = request.getParameter("mapid");
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		data.put("leaderid", discussService.leaderUserId(mapid));
		data.put("discussmemberyn", discussService.discussMemberYn(mapid, user.getId()));
		
		String discuss_seq = request.getParameter("discuss_seq");
		
		List<Discuss> discussList =  discussService.contentList(discuss_seq);
		JSONArray jsonArray = new JSONArray();
		data.put("discussListJson", jsonArray.fromObject(discussList));
		data.put("discussList", discussList);
		
		/*OutputStream out = response.getOutputStream();
		out.write(new JSONObject(data).toString().getBytes("UTF-8"));
		out.close();
		return null;*/
		return new ModelAndView("discuss/discussContentList", "data", data);
	}

}
