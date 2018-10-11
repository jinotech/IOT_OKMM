package com.okmindmap.web.spring.group;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Member;
import com.okmindmap.service.GroupService;
import com.okmindmap.web.spring.BaseAction;

public class MemberStatusAction extends BaseAction {
	private GroupService groupService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		int id = (Integer)getRequiredParam(request, "id", Integer.class);
		String status = (String)getRequiredParam(request, "status", String.class);
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/group/member/status.do?id=" + id + "&status=" + status);
			return new ModelAndView("user/login", "data", data);
		}
		
		this.groupService.setMemberStatus(id, status);
		
		Member member = this.groupService.getGroupMember(id);
		
		response.sendRedirect(request.getContextPath() + "/group/member/list.do?id=" + member.getGroupId());
		
		
		return null;
	}

}
