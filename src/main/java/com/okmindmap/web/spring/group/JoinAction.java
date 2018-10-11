package com.okmindmap.web.spring.group;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.service.GroupService;
import com.okmindmap.util.PasswordEncryptor;
import com.okmindmap.web.spring.BaseAction;

public class JoinAction extends BaseAction {
	private GroupService groupService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		int groupId = getOptionalParam(request, "groupid", 0);
		String password = getOptionalParam(request, "password", null);
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/group/join.do?groupid=" + groupId);
			return new ModelAndView("user/login", "data", data);
		}
		
		if(groupId != 0) {
			//그룹에 join
			boolean approved = true;
			Group group = this.groupService.getGroup(groupId);
			if(group.getPolicy().getShortName().equals("password")) {
				if(password == null) {
					HashMap<String, Object> data = new HashMap<String, Object>();
					data.put("group", group);
					data.put("wrongPassword", false);
					
					return new ModelAndView("group/join_confirm", "data", data);
				} else if(!PasswordEncryptor.encrypt(password).equals(group.getPassword())) {
					HashMap<String, Object> data = new HashMap<String, Object>();
					data.put("group", group);
					data.put("wrongPassword", true);
					
					return new ModelAndView("group/join_confirm", "data", data);
				}
			} else if(group.getPolicy().getShortName().equals("approval")) {
				approved = false;
			}
			
			this.groupService.addMember(groupId, user.getId(), approved);

			response.sendRedirect(request.getContextPath() + "/group/list.do");
		} else {
			// join할 수 있는 group 목록
			int totalGroups =  0;
			int page = ServletRequestUtils.getIntParameter(request, "page", 1);
			
			int pagelimit = 10;
			String search = ServletRequestUtils.getStringParameter(request, "search");
			String searchfield = ServletRequestUtils.getStringParameter(request, "searchfield");
			String sort = ServletRequestUtils.getStringParameter(request, "sort", "created");
			boolean isAsc = ServletRequestUtils.getBooleanParameter(request, "isAsc", false);
			
			HashMap<String, Object> data = new HashMap<String, Object>();
			
			
			totalGroups = this.groupService.countNotMemberGroups(user.getId(), searchfield, search);
			data.put("groups", this.groupService.getNotMemberGroups(user.getId(), page,  pagelimit, searchfield, search, sort, isAsc));
			//System.out.println(totalGroups);
			
			data.put("searchfield", searchfield);
			data.put("search", search);
			data.put("sort", sort);
			data.put("isAsc", isAsc);		
			data.put("totalGroups", totalGroups);
			data.put("page", page);		
			data.put("pagelimit", pagelimit);		
			data.put("plPageRange", 10 );	 // 페이지출력 범위
			
			int tempA = ((page-1)*pagelimit);

			data.put("startnum", (totalGroups-tempA));
			
			
			return new ModelAndView("group/join", "data", data);
		}
		
		// TODO Auto-generated method stub
		return null;
	}

}
