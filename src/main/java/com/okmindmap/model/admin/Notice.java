package com.okmindmap.model.admin;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Notice implements Serializable {
	private int id;
	private String content_ko;
	private String content_en;
	private String link_ko;
	private String link_en;
	private int priority;
	private String created;
	private int hide;
	
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
	public int getHide() {
		return hide;
	}
	public void setHide(int hide) {
		this.hide = hide;
	}
}