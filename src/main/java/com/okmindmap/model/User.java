package com.okmindmap.model;

import java.io.Serializable;
import java.util.List;

@SuppressWarnings("serial")
public class User  implements Serializable {
	private int id;
	private String scriptSessionId;
	private String username;
	private String email;
	private String firstname;
	private String lastname;
	private int lastaccess;
	private int lastmap;
	private String password;
	private String auth;
	private int confirmed;
	private int deleted;
	private String roleName;
	private String roleShortName;
	private int roleId;
	private int maptotalcnt;
	private String facebookAccessToken;
	private List<UserConfigData> userConfigData;
	
	private String created;
	private String last_access;
	private String self;
	
	
	
	public String getSelf() {
		return self;
	}
	public void setSelf(String self) {
		this.self = self;
	}
	public String getCreated() {
		return created;
	}
	public void setCreated(String created) {
		this.created = created;
	}
	public String getLast_access() {
		return last_access;
	}
	public void setLast_access(String last_access) {
		this.last_access = last_access;
	}
	public boolean equals(Object o){
		if(o instanceof User){
			User tempO = (User)o;
			return tempO.getUsername().equals(this.getUsername());
		}
		return false;
	}
	public String getScriptSessionId() {
		return scriptSessionId;
	}
	public void setScriptSessionId(String scriptSessionId) {
		this.scriptSessionId = scriptSessionId;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public int getLastaccess() {
		return lastaccess;
	}
	public void setLastaccess(int lastaccess) {
		this.lastaccess = lastaccess;
	}
	public int getLastmap() {
		return lastmap;
	}
	public void setLastmap(int lastmap) {
		this.lastmap = lastmap;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getAuth() {
		return auth;
	}
	public void setAuth(String auth) {
		this.auth = auth;
	}
	public int getConfirmed() {
		return confirmed;
	}
	public void setConfirmed(int confirmed) {
		this.confirmed = confirmed;
	}
	public int getDeleted() {
		return deleted;
	}
	public void setDeleted(int deleted) {
		this.deleted = deleted;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public String getRoleShortName() {
		return roleShortName;
	}
	public void setRoleShortName(String roleShortName) {
		this.roleShortName = roleShortName;
	}
	public int getRoleId() {
		return roleId;
	}
	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}
	public int getMaptotalcnt() {
		return maptotalcnt;
	}
	public void setMaptotalcnt(int maptotalcnt) {
		this.maptotalcnt = maptotalcnt;
	}
	public String getFacebookAccessToken() {
		return facebookAccessToken;
	}
	public void setFacebookAccessToken(String facebookAccessToken) {
		this.facebookAccessToken = facebookAccessToken;
	}
	public List<UserConfigData> getUserConfigData() {
		return userConfigData;
	}
	public void setUserConfigData(List<UserConfigData> userConfigData) {
		this.userConfigData = userConfigData;
	}
	public boolean isGuest() {
		return "guest".equals(this.getUsername());
	}
	
}
