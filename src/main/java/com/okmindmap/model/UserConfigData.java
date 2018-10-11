package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class UserConfigData  implements Serializable {
	private int id;
	private int userid;
	private int fieldid;
	private String data;
	private String fieldname;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public int getFieldid() {
		return fieldid;
	}
	public void setFieldid(int fieldid) {
		this.fieldid = fieldid;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String getFieldname() {
		return fieldname;
	}
	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}
	
		
}
