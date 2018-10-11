package com.okmindmap.web.spring.group;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.GroupService;
import com.okmindmap.web.spring.BaseAction;

public class MemberListAction extends BaseAction {

	private GroupService groupService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		int groupId = (Integer) getRequiredParam(request, "id", Integer.class);
		
		int totalMembers =  0;
		int page = ServletRequestUtils.getIntParameter(request, "page", 1);
		
		int pagelimit = 10;
		String search = ServletRequestUtils.getStringParameter(request, "search");
		String searchfield = ServletRequestUtils.getStringParameter(request, "searchfield");
		String sort = ServletRequestUtils.getStringParameter(request, "sort", "created");
		boolean isAsc = ServletRequestUtils.getBooleanParameter(request, "isAsc", false);
		
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/group/member/list.do?id=" + groupId);
			return new ModelAndView("user/login", "data", data);
		}
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("group", this.groupService.getGroup(groupId ));
		data.put("members", this.groupService.getGroupMembers(groupId,  page, pagelimit, searchfield, search, sort, isAsc));
		totalMembers = this.groupService.countGroupMembers(groupId,  searchfield, search);
		
		data.put("searchfield", searchfield);
		data.put("search", search);
		data.put("sort", sort);
		data.put("isAsc", isAsc);		
		data.put("totalMembers", totalMembers);
		data.put("page", page);		
		data.put("pagelimit", pagelimit);		
		data.put("plPageRange", 10 );	 // 페이지출력 범위
		
		int tempA = ((page-1)*pagelimit);

		data.put("startnum", (totalMembers-tempA));
		
		
		return new ModelAndView("/group/member/index", "data", data);
	}

}
