package com.okmindmap.web.spring.group;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.service.GroupService;
import com.okmindmap.web.spring.BaseAction;

public class NewAction extends BaseAction {

	private GroupService groupService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/group/new.do");
			return new ModelAndView("user/login", "data", data);
		}
		
		int confirm = getOptionalParam(request, "confirmed", 0);
		if(confirm == 0) {
			// form 전송
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("policies", this.groupService.getPolicies());
			data.put("categories", this.groupService.getUserCategoryTree(user.getId()) );
			
			return new ModelAndView("group/new", "data", data);
		} else {
			// group 추가
			String name = (String)getRequiredParam(request, "name", String.class);
			String summary = getOptionalParam(request, "summary", "");
			String password = getOptionalParam(request, "password", "");
			int parentId = getOptionalParam(request, "parent", 1);
			String policy = (String)getRequiredParam(request, "policy", String.class);
			
			Group group = new Group();
//			group.setName(new String(name.getBytes("ISO-8859-1"), "UTF-8"));
			group.setName(name);
			group.setSummary(summary);
			group.setPassword(password);
			group.setUser(user);
			group.setPolicy(this.groupService.getPolicy( policy ));
			
			int groupId = this.groupService.addGroup(group, parentId);
			
			response.sendRedirect(request.getContextPath() + "/group/member/list.do?id=" + groupId );
		}
		
		return null;
	}

}
