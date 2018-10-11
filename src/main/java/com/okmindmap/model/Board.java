package com.okmindmap.model;

import java.io.Serializable;
import java.util.Date;

public class Board implements Serializable{

	private static final long serialVersionUID = 1L;
	private int boardType;// 寃뚯떆��醫낅쪟 1.怨듭��ы빆 2.Q&A 3. �붿껌�ы빆
	private int boardId;
	private String title;
	private int visited;
	
	private String htmlyn;
	private int recom;	
	private Date insertDate;
	private Date updateDate;
	private String content;
	private int userId;
	private Category category;
	private String userIp;
	private String username2;
	private String userpassword;
	private String lang;
	
	public String getLang() {
		return lang;
	}
	public void setLang(String lang) {
		this.lang = lang;
	}
	private int number; 
	
	
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
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
	public int getVisited() {
		return visited;
	}
	public void setVisited(int visited) {
		this.visited = visited;
	}
	public String getUserIp() {
		return userIp;
	}
	public void setUserIp(String userIp) {
		this.userIp = userIp;
	}
	public String getHtmlyn() {
		return htmlyn;
	}
	public void setHtmlyn(String htmlyn) {
		this.htmlyn = htmlyn;
	}
	public int getBoardType() {
		return boardType;
	}
	public void setBoardType(int boardType) {
		this.boardType = boardType;
	}
	public int getBoardId() {
		return boardId;
	}
	public void setBoardId(int boardId) {
		this.boardId = boardId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getRecom() {
		return recom;
	}
	public void setRecom(int recom) {
		this.recom = recom;
	}
	public Date getInsertDate() {
		return insertDate;
	}
	public void setInsertDate(Date insertDate) {
		this.insertDate = insertDate;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	public Category getCategory() {
		return category;
	}
	public void setCategory(Category category) {
		this.category = category;
	}	
	
	
	
}