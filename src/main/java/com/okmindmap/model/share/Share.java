package com.okmindmap.model.share;

import java.util.List;

import com.okmindmap.model.group.Group;

public class Share {
	private int id;
	private ShareMap map;
	private ShareType shareType;
	private Group group;
	private List<Permission> permissions;
	private String password;
	
	public int getId() {
		return id;
	}
	public Group getGroup() {
		return group;
	}
	public void setGroup(Group group) {
		this.group = group;
	}
	public List<Permission> getPermissions() {
		return permissions;
	}
	public void setPermissions(List<Permission> permissions) {
		this.permissions = permissions;
	}
	public Permission getPermission(String permissionType) {
		for(Permission permission : this.permissions) {
			if(permission.getPermissionType().getShortName().equals(permissionType)) {
				return permission;
			}
		}
		
		return null;
	}
	public void setId(int id) {
		this.id = id;
	}
	public ShareMap getMap() {
		return this.map;
	}
	public void setMap(ShareMap map) {
		this.map = map;
	}
	public ShareType getShareType() {
		return shareType;
	}
	public void setShareType(ShareType shareType) {
		this.shareType = shareType;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getPassword() {
		return password;
	}
}
