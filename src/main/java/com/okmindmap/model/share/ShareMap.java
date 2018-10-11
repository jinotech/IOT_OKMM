package com.okmindmap.model.share;

import java.util.List;

import com.okmindmap.model.User;

public class ShareMap {
	private int id;
	private String name;
	private String key;
	private List<Share> shares;
	private User user;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getKey() {
		return key;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<Share> getShares() {
		return shares;
	}
	public void setShares(List<Share> shares) {
		this.shares = shares;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public User getUser() {
		return user;
	}
}
