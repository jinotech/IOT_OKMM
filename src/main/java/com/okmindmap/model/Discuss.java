package com.okmindmap.model;

import java.io.Serializable;
import java.util.Date;

public class Discuss implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private int discuss_seq;
	private int discuss_content_seq;
	private String title;
	private String content;
	private int viewcount;
	private String useyn;
	private int regid;
	private int contentcount;
	private String created;
	private int updtid;
	private Date updated;
	
	private int id;
	private String leaderyn;
	
	private String username;
	private String firstname;
	private String email;
	
	private String mapid;
	
	
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getMapid() {
		return mapid;
	}
	public void setMapid(String mapid) {
		this.mapid = mapid;
	}
	public int getContentcount() {
		return contentcount;
	}
	public void setContentcount(int contentcount) {
		this.contentcount = contentcount;
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
	public int getDiscuss_content_seq() {
		return discuss_content_seq;
	}
	public void setDiscuss_content_seq(int discuss_content_seq) {
		this.discuss_content_seq = discuss_content_seq;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getLeaderyn() {
		return leaderyn;
	}
	public void setLeaderyn(String leaderyn) {
		this.leaderyn = leaderyn;
	}
	public int getDiscuss_seq() {
		return discuss_seq;
	}
	public void setDiscuss_seq(int discuss_seq) {
		this.discuss_seq = discuss_seq;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getViewcount() {
		return viewcount;
	}
	public void setViewcount(int viewcount) {
		this.viewcount = viewcount;
	}
	public String getUseyn() {
		return useyn;
	}
	public void setUseyn(String useyn) {
		this.useyn = useyn;
	}
	public int getRegid() {
		return regid;
	}
	public void setRegid(int regid) {
		this.regid = regid;
	}
	public String getCreated() {
		return created;
	}
	public void setCreated(String created) {
		this.created = created;
	}
	public int getUpdtid() {
		return updtid;
	}
	public void setUpdtid(int updtid) {
		this.updtid = updtid;
	}
	public Date getUpdated() {
		return updated;
	}
	public void setUpdated(Date updated) {
		this.updated = updated;
	}
	
}
