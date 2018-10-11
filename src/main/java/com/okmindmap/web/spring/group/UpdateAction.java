package com.okmindmap.web.spring.group;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.service.GroupService;
import com.okmindmap.web.spring.BaseAction;

public class UpdateAction extends BaseAction {

	private GroupService groupService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		int confirm = getOptionalParam(request, "confirmed", 0);
		int groupId = (Integer)getRequiredParam(request, "id", Integer.class);
		int setAdmin = getOptionalParam(request, "admin", 0);
		
		User user = null;
		User admin = getUser(request);
		
		if(admin.getRoleId()==1 && setAdmin == 1 && confirm == 1){
			Group group = this.groupService.getGroup(groupId);
			
			String name = (String)getRequiredParam(request, "name", String.class);
			String summary = getOptionalParam(request, "summary", "");
			String password = getOptionalParam(request, "password", "");
			int parentId = getOptionalParam(request, "parent", 1);
			String policy = (String)getRequiredParam(request, "policy", String.class);
			
			group.setName(name);
			group.setSummary(summary);
			if(!"".equals(password)) {
				group.setPassword(password);
			}
			group.setPolicy(this.groupService.getPolicy( policy ));
			group.getCategory().setParentId(parentId);
			Timestamp current = new Timestamp(new Date().getTime());
			group.setModified(current);
			
			this.groupService.updateGroup(group);
			
			response.sendRedirect(request.getContextPath() + "/mindmap/admin/users/group.do");
			return null;
		}
		
		
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/group/update.do?id=" + groupId);
			return new ModelAndView("user/login", "data", data);
		}
		
		if(confirm == 0) {
			// form 전송
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("policies", this.groupService.getPolicies());
			data.put("categories", this.groupService.getUserCategoryTree(user.getId()) );
			data.put("group", this.groupService.getGroup(groupId));
			data.put("category", this.groupService.getUserCategoryTree(groupId));
			data.put("setAdmin", setAdmin);
			
			return new ModelAndView("group/edit", "data", data);
		} else {
			Group group = this.groupService.getGroup(groupId);
			
			// group 추가
			String name = (String)getRequiredParam(request, "name", String.class);
			String summary = getOptionalParam(request, "summary", "");
			String password = getOptionalParam(request, "password", "");
			int parentId = getOptionalParam(request, "parent", 1);
			String policy = (String)getRequiredParam(request, "policy", String.class);
			
			
//			group.setName(new String(name.getBytes("ISO-8859-1"), "UTF-8"));
			group.setName(name);
			group.setSummary(summary);
			if(!"".equals(password)) {
				group.setPassword(password);
			}
			group.setUser(user);
			group.setPolicy(this.groupService.getPolicy( policy ));
			group.getCategory().setParentId(parentId);
			Timestamp current = new Timestamp(new Date().getTime());
			group.setModified(current);
			
			this.groupService.updateGroup(group);
			
			response.sendRedirect(request.getContextPath() + "/group/list.do");
		}
		
		return null;
	}
	
}
