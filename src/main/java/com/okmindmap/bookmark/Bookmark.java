package com.okmindmap.bookmark;


abstract class Bookmark {

	private Bookmark parent;
	
	private String name;
	
	public Bookmark(String name) {
		this.name = name;
	}
	
	public Bookmark getParent() {
		return this.parent;
	}
	
	public void setParent(Bookmark parent) {
		this.parent = parent;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
	public abstract String toXML();
	public abstract String toJSON();
}
