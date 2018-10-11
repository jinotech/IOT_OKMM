package com.okmindmap.model.admin;

import java.io.Serializable;

import com.okmindmap.model.User;

@SuppressWarnings("serial")
public class RecommendNode  implements Serializable {
	private int id;
	private int viewcount;
	private int rcount;
	private int ncount;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getViewcount() {
		return viewcount;
	}
	public void setViewcount(int viewcount) {
		this.viewcount = viewcount;
	}
	public int getRcount() {
		return rcount;
	}
	public void setRcount(int rcount) {
		this.rcount = rcount;
	}
	public int getNcount() {
		return ncount;
	}
	public void setNcount(int ncount) {
		this.ncount = ncount;
	}


}