package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class ForeignObject implements Serializable {
	
	private String content;
	private String width;
	private String height;
	
	//DB
	private int id;
	private int nodeId;
	
	public String getContent() {
		return this.content;
	}
	public void setContent(String content) {
		this.content = content;
	}	
	public void setWidth(String width) {
		this.width = width;
	}
	public String getWidth() {
		return width;
	}
	public void setHeight(String height) {
		this.height = height;
	}
	public String getHeight() {
		return height;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getNodeId() {
		return nodeId;
	}
	public void setNodeId(int nodeId) {
		this.nodeId = nodeId;
	}
	
	public Object toXml() {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<foreignObject");
		buffer.append(" WIDTH=\"" + this.width + "\" HEIGHT=\"" + this.height + "\">");
		buffer.append(this.getContent());
		buffer.append("</foreignObject>\n");
		return buffer.toString();
	}
	
}
