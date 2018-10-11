package com.okmindmap.model;

import java.io.Serializable;

public class Notice implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private int id;
	private String title;
	private String content;
	private String content_ko;
	private String content_en;
	private String link_ko;
	private String link_en;
	private int priority;
	private String hide;
	private String regid;
	private String created;
	private String updtid;
	private String updated;
	private String filepath;
	
	
	public String getFilepath() {
		return filepath;
	}
	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getRegid() {
		return regid;
	}
	public void setRegid(String regid) {
		this.regid = regid;
	}
	public String getUpdtid() {
		return updtid;
	}
	public void setUpdtid(String updtid) {
		this.updtid = updtid;
	}
	public String getUpdated() {
		return updated;
	}
	public void setUpdated(String updated) {
		this.updated = updated;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getContent_ko() {
		return content_ko;
	}
	public void setContent_ko(String content_ko) {
		this.content_ko = content_ko;
	}
	public String getContent_en() {
		return content_en;
	}
	public void setContent_en(String content_en) {
		this.content_en = content_en;
	}
	public String getLink_ko() {
		return link_ko;
	}
	public void setLink_ko(String link_ko) {
		this.link_ko = link_ko;
	}
	public String getLink_en() {
		return link_en;
	}
	public void setLink_en(String link_en) {
		this.link_en = link_en;
	}
	public int getPriority() {
		return priority;
	}
	public void setPriority(int priority) {
		this.priority = priority;
	}
	public String getCreated() {
		return created;
	}
	public void setCreated(String created) {
		this.created = created;
	}
	public String getHide() {
		return hide;
	}
	public void setHide(String hide) {
		this.hide = hide;
	}
	
}
