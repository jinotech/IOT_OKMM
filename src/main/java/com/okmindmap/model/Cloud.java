package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Cloud implements Serializable {
	private String color;
	
	private int id;
	private int nodeId;

	public void setColor(String color) {
		this.color = color;
	}
	public String getColor() {
		return color;
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
	
	public String toXml() {
		StringBuffer buffer = new StringBuffer();
		
		buffer.append("<cloud");
		if(color != null) {
			buffer.append(" COLOR=\"" + this.color + "\"");
		}
		buffer.append("/>\n");
		
		return buffer.toString();
	}
}
