package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class UserMenu  implements Serializable {

	private int id;
	private int seq;
	private String name;
	private String bgroup;
	private String bgroup_name;
	private String mgroup;
	private String mgroup_name;
	private String order_num;
	private String useyn;
	private String imgurl;
	private String message;
	private String script;
	
	
	
	public String getImgurl() {
		return imgurl;
	}
	public void setImgurl(String imgurl) {
		this.imgurl = imgurl;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getScript() {
		return script;
	}
	public void setScript(String script) {
		this.script = script;
	}
	public String getUseyn() {
		return useyn;
	}
	public void setUseyn(String useyn) {
		this.useyn = useyn;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getSeq() {
		return seq;
	}
	public void setSeq(int seq) {
		this.seq = seq;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBgroup() {
		return bgroup;
	}
	public void setBgroup(String bgroup) {
		this.bgroup = bgroup;
	}
	public String getBgroup_name() {
		return bgroup_name;
	}
	public void setBgroup_name(String bgroup_name) {
		this.bgroup_name = bgroup_name;
	}
	public String getMgroup() {
		return mgroup;
	}
	public void setMgroup(String mgroup) {
		this.mgroup = mgroup;
	}
	public String getMgroup_name() {
		return mgroup_name;
	}
	public void setMgroup_name(String mgroup_name) {
		this.mgroup_name = mgroup_name;
	}
	public String getOrder_num() {
		return order_num;
	}
	public void setOrder_num(String order_num) {
		this.order_num = order_num;
	}
	
	
}
