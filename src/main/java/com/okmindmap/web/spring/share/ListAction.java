package com.okmindmap.web.spring.share;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.ShareService;
import com.okmindmap.web.spring.BaseAction;

public class ListAction extends BaseAction {

	private GroupService groupService;
	private ShareService shareService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/share/list.do");
			return new ModelAndView("user/login", "data", data);
		}
		
		String map_id = (String)getOptionalParam(request, "map_id", "0");

		HashMap<String, Object> data = new HashMap<String, Object>();
		if(map_id.equals("0"))
			data.put("sharedMaps", this.shareService.getSharedMaps(user.getId()));
		else{
			data.put("sharedMaps", this.shareService.getSharedMaps(user.getId(),map_id));
			
		}
		data.put("map_id", map_id);
		// TODO Auto-generated method stub
		return new ModelAndView("share/index", "data", data);
	}

}
