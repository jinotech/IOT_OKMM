package com.okmindmap.web.spring.group;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Member;
import com.okmindmap.service.GroupService;
import com.okmindmap.moodle.MoodleService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;
import com.okmindmap.web.spring.BaseAction;

public class MemberRemoveAction extends BaseAction {
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
		
		int id = (Integer)getRequiredParam(request, "id", Integer.class);
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/group/member/remove.do?id=" + id);
			return new ModelAndView("user/login", "data", data);
		}
		
		Member member = this.groupService.getGroupMember(id);
		if(member != null) {
			this.groupService.removeMember(member.getGroupId(), member.getUser().getId());
		
			MoodleService moodleService = new MoodleService(user, this.okmindmapService, this.mindmapService, this.userService, this.shareService, this.groupService);
			moodleService.groupAction("unenrol", member.getGroupId(), member.getUser().getId());
		}
		
		response.sendRedirect(request.getContextPath() + "/group/member/list.do?id=" + member.getGroupId());
		
		return null;
	}
}
