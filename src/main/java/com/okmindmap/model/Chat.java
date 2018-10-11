package com.okmindmap.model;

public class Chat {
	private int id;
	private int roomnumber;
	private int userid;
	private String username;
	private String message;
	private String timecreated;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getRoomnumber() {
		return roomnumber;
	}
	public void setRoomnumber(int roomnumber) {
		this.roomnumber = roomnumber;
	}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getTimecreated() {
		return timecreated;
	}
	public void setTimecreated(String timecreated) {
		this.timecreated = timecreated;
	}
	
	
}
