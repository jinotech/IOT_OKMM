package com.okmindmap.model.share;

public class Permission {
	private int id;
	private int shareId;
	private PermissionType permissionType;
	private boolean permited;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getShareId() {
		return shareId;
	}
	public void setShareId(int shareId) {
		this.shareId = shareId;
	}
	public PermissionType getPermissionType() {
		return permissionType;
	}
	public void setPermissionType(PermissionType permissionType) {
		this.permissionType = permissionType;
	}
	public boolean isPermited() {
		return permited;
	}
	public void setPermited(boolean permited) {
		this.permited = permited;
	}
}
