package com.okmindmap.web.spring.share;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.util.PasswordEncryptor;
import com.okmindmap.web.spring.BaseAction;

public class UpdateAction extends BaseAction {

	private GroupService groupService;
	private ShareService shareService;
	private MindmapService mindmapService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		int shareId = (Integer)getRequiredParam(request, "id", Integer.class);
		int confirmed = getOptionalParam(request, "confirmed", 0);
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/share/update.do?id=" + shareId);
			return new ModelAndView("user/login", "data", data);
		}
		
		if(confirmed == 0) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("groups", this.groupService.getGroups(user.getId()));
			data.put("maps", this.mindmapService.getUserMaps(user.getId()));
			data.put("shareTypes", this.shareService.getShareTypes());
			data.put("permissionTypes", this.shareService.getPermissionTypes());
			data.put("share", this.shareService.getShare(shareId));
			
			return new ModelAndView("share/edit", "data", data);
		}
		
		
		Share share = this.shareService.getShare(shareId);
		
		int map_id = (Integer)getRequiredParam(request, "map_id", Integer.class);
		ShareMap map = new ShareMap();
		map.setId(map_id);
		share.setMap(map);
		
		String shareType = (String)getRequiredParam(request, "sharetype", String.class);
		share.setShareType(this.shareService.getShareType(shareType));
		if(shareType.equals("group")) {
			int groupid = (Integer)getRequiredParam(request, "groupid", Integer.class);
			Group group = new Group();
			group.setId(groupid);
			share.setGroup(group);
		} else if(shareType.equals("password")) {
			String password = (String)getRequiredParam(request, "password", String.class);
			share.setPassword(PasswordEncryptor.encrypt(password));
		}
		
		List<Permission> permissions = share.getPermissions();//new ArrayList<Permission>();
		for(Permission permission : permissions) {
			PermissionType permissionType = permission.getPermissionType();
			int permited = getOptionalParam(request, "permission_" + permissionType.getShortName(), 0);
			permission.setPermissionType(permissionType);
			permission.setPermited(permited == 1);
//			permissions.add(permission);
		}
		share.setPermissions(permissions);
		
		this.shareService.updateShare(share);
		
		response.sendRedirect(request.getContextPath() + "/share/list.do?map_id="+map_id);
		
		return null;
	}

}
