package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Parameter implements Serializable {
	private String reminduserat;
	
	private int id;
	private int hookId;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getHookId() {
		return hookId;
	}

	public void setHookId(int hookId) {
		this.hookId = hookId;
	}

	public void setReminduserat(String reminduserat) {
		this.reminduserat = reminduserat;
	}

	public String getReminduserat() {
		return reminduserat;
	}
}
