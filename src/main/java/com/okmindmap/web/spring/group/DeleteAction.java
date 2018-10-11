package com.okmindmap.web.spring.group;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.service.GroupService;
import com.okmindmap.web.spring.BaseAction;

public class DeleteAction extends BaseAction {

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
			this.groupService.deleteGroup(groupId);
			response.sendRedirect(request.getContextPath() + "/mindmap/admin/users/group.do");
			return null;			
		}
		
		
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/group/delete.do?id=" + groupId);
			return new ModelAndView("user/login", "data", data);
		}
		
		if(confirm == 0) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			Group group = this.groupService.getGroup(groupId);
			data.put("group", group);
			data.put("categories", this.groupService.getCategoryTree(group.getCategory().getId()));
			
			return new ModelAndView("group/delete", "data", data);
		} else {
			this.groupService.deleteGroup(groupId);
			
			response.sendRedirect(request.getContextPath() + "/group/list.do");
		}
		return null;
	}
}
