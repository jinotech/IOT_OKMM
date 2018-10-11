package com.okmindmap.model.group;

import java.sql.Timestamp;

import com.okmindmap.model.Category;
import com.okmindmap.model.User;

public class Group {
	private int id;
	private String name;
	private String summary;
	private String password;
	private Timestamp created;
	private Timestamp modified;
	private User user;
	private Policy policy;
	private Category category;
	private MemberStatus memberStatus;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public String getSummary() {
		return summary;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getPassword() {
		return password;
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
	public Timestamp getModified() {
		return modified;
	}
	public void setModified(Timestamp modified) {
		this.modified = modified;
	}
	public Policy getPolicy() {
		return policy;
	}
	public void setPolicy(Policy policy) {
		this.policy = policy;
	}
	public Category getCategory() {
		return category;
	}
	public void setCategory(Category category) {
		this.category = category;
	}
	public void setMemberStatus(MemberStatus memberStatus) {
		this.memberStatus = memberStatus;
	}
	public MemberStatus getMemberStatus() {
		return memberStatus;
	}
}
