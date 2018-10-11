package com.okmindmap.web.spring.group;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.moodle.MoodleService;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;
import com.okmindmap.web.spring.BaseAction;

public class MemberAddAction extends BaseAction {
	@Autowired
	private UserService userService;
	private OKMindmapService okmindmapService;
	private MindmapService mindmapService;
	private ShareService shareService;
	private GroupService groupService;
	
	public void setOkmindmapService(OKMindmapService okmindmapService) {
		this.okmindmapService = okmindmapService;
	}

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		int groupId = (Integer) getRequiredParam(request, "groupid", Integer.class);
		int userId = getOptionalParam(request, "userid", 0);
		
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
			data.put("url", "/group/member/add.do?groupid=" + groupId + "&userid=" + userId);
			return new ModelAndView("user/login", "data", data);
		}
		Group group = this.groupService.getGroup(groupId);
		if(userId > 0 && group.getUser().getId() == user.getId()) {
			this.groupService.addMember(groupId, userId, true);
			
			MoodleService moodleService = new MoodleService(user, this.okmindmapService, this.mindmapService, this.userService, this.shareService, this.groupService);
			moodleService.groupAction("enrol", groupId, userId);
			
			response.sendRedirect(request.getContextPath() + "/group/member/list.do?id=" + groupId);
		} else {
			HashMap<String, Object> data = new HashMap<String, Object>();
			
			
			data.put("page", page);		
			data.put("pagelimit", pagelimit);		
			data.put("plPageRange", 10 );	 // 페이지출력 범위
			data.put("sort", sort);
			data.put("isAsc", isAsc);
			data.put("searchfield", searchfield);
			data.put("search", search);
			
			
			data.put("group",group );
//group/member/add.jsp에서 사용하는 부분이 없어서 삭제 한다. 2012.2.8 박기원
//			data.put("members", this.groupService.getGroupMembers(groupId));
			data.put("notMembers", this.groupService.getNotGroupMembers(groupId, page, pagelimit, searchfield, search, sort, isAsc));
			
			data.put("totalMembers",this.groupService.getNotGroupMembersCount(groupId,searchfield, search));
			return new ModelAndView("group/member/add", "data", data);
		}
		
		return null;
	}
}
