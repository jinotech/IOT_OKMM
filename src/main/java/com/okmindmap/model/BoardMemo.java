package com.okmindmap.model;

import java.util.Date;

public class BoardMemo {
	private int memoId;
	private int boardId;
	private String content;
	private Date insertDate;
	private int userId;
	private String userIp;
	private String username2;
	private String userpassword;
	
	
	
	public String getUsername2() {
		return username2;
	}
	public void setUsername2(String username2) {
		this.username2 = username2;
	}

	public String getUserpassword() {
		return userpassword;
	}
	public void setUserpassword(String userpassword) {
		this.userpassword = userpassword;
	}
	public int getMemoId() {
		return memoId;
	}
	public void setMemoId(int memoId) {
		this.memoId = memoId;
	}
	public int getBoardId() {
		return boardId;
	}
	public void setBoardId(int boardId) {
		this.boardId = boardId;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getInsertDate() {
		return insertDate;
	}
	public void setInsertDate(Date insertDate) {
		this.insertDate = insertDate;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getUserIp() {
		return userIp;
	}
	public void setUserIp(String userIp) {
		this.userIp = userIp;
	}
}
