package com.okmindmap.web.spring.group;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.service.GroupService;
import com.okmindmap.web.spring.BaseAction;

public class ListAction extends BaseAction {
	private GroupService groupService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			data.put("url", "/group/list.do");
			return new ModelAndView("user/login", "data", data);
		}
		
		String groupType = ServletRequestUtils.getStringParameter(request, "grouptype");
		if(groupType == null){
			groupType = user.getUsername().equals("guest")?"public":"user";
		}
		int totalGroups =  0;
		int page = ServletRequestUtils.getIntParameter(request, "page", 1);
		
		int pagelimit = 10;
		String search = ServletRequestUtils.getStringParameter(request, "search");
		String searchfield = ServletRequestUtils.getStringParameter(request, "searchfield");
		String sort = ServletRequestUtils.getStringParameter(request, "sort", "created");
		boolean isAsc = ServletRequestUtils.getBooleanParameter(request, "isAsc", false);
		
		
		
//		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("groupType", groupType);
		
		if(groupType.equals("user")){		//내 그룹	
			List<Group>	groups = this.groupService.getGroups(user.getId(), page, pagelimit, searchfield, search, sort, isAsc);
			totalGroups = this.groupService.countGroups(user.getId(),  searchfield, search);
			data.put("myGroups", groups);
		}else if(groupType.equals("myshares")){  //소속된 그룹
			List<Group> joinGroups = this.groupService.getMemberGroups(user.getId());
			totalGroups = this.groupService.countMemberGroups(user.getId(),  searchfield, search);
			data.put("joinGroups", joinGroups);
		}
		
		data.put("searchfield", searchfield);
		data.put("search", search);
		data.put("groupType", groupType);
		data.put("sort", sort);
		data.put("isAsc", isAsc);		
		data.put("totalGroups", totalGroups);
		data.put("page", page);		
		data.put("pagelimit", pagelimit);		
		data.put("plPageRange", 10 );	 // 페이지출력 범위
		
		int tempA = ((page-1)*pagelimit);

		data.put("startnum", (totalGroups-tempA));
		
		
		
		
		return new ModelAndView("group/index", "data", data);
	}

}
