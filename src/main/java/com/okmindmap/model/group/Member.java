package com.okmindmap.model.group;

import java.sql.Timestamp;

import com.okmindmap.model.User;

public class Member {
	private int id;
	private int groupId;
	private User user;
	private Timestamp created;
	private MemberStatus memberStatus;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getGroupId() {
		return groupId;
	}
	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Timestamp getCreated() {
		return created;
	}
	public void setCreated(Timestamp created) {
		this.created = created;
	}
	public MemberStatus getMemberStatus() {
		return memberStatus;
	}
	public void setMemberStatus(MemberStatus memberStatus) {
		this.memberStatus = memberStatus;
	}
}
