package com.okmindmap.web.spring.share;

import java.util.ArrayList;
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

public class AddAction extends BaseAction {

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
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/share/add.do");
			return new ModelAndView("user/login", "data", data);
		}
		
		int confirmed = getOptionalParam(request, "confirmed", 0);
		if(confirmed == 0) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("groups", this.groupService.getGroups(user.getId()));
			data.put("maps", this.mindmapService.getUserMaps(user.getId()));
			data.put("shareTypes", this.shareService.getShareTypes());
			data.put("permissionTypes", this.shareService.getPermissionTypes());
			
			int map_id = (int)getOptionalParam(request, "map_id", 0);
			if(map_id!=0){
				data.put("map", this.mindmapService.getMap(map_id));
			}
				
			
			
			return new ModelAndView("share/add", "data", data);
		}
		
		
		Share share = new Share();
		
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
		
		List<Permission> permissions = new ArrayList<Permission>();
		List<PermissionType> permissionTypes = this.shareService.getPermissionTypes();
		for(PermissionType permissionType : permissionTypes) {
			int permited = getOptionalParam(request, "permission_" + permissionType.getShortName(), 0);
			Permission permission = new Permission();
			permission.setPermissionType(permissionType);
			permission.setPermited(permited == 1);
			permissions.add(permission);
		}
		share.setPermissions(permissions);
		
		this.shareService.addShare(share);
		
		response.sendRedirect(request.getContextPath() + "/share/list.do?map_id="+map_id);
		
		return null;
	}

}
