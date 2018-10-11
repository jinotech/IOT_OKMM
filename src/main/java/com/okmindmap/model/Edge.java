package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Edge implements Serializable {
	private String color;
	private String style;
	private String width;
	
	//DB
	private int id;
	private int nodeId;
	
	public void setColor(String color) {
		this.color = color;
	}
	public String getColor() {
		return color;
	}
	public void setStyle(String style) {
		this.style = style;
	}
	public String getStyle() {
		return style;
	}
	public void setWidth(String width) {
		try {
			Integer.parseInt(width);
			this.width = width;
		} catch (Exception e) {
			this.width = "1";
		}
		
	}
	public String getWidth() {
		return width;
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
		
		buffer.append("<edge");
		if(color != null) {
			buffer.append(" COLOR=\"" + this.color + "\"");
		}
		if(style != null) {
			buffer.append(" STYLE=\"" + this.style + "\"");
		}
		if(width != null) {
			buffer.append(" WIDTH=\"" + this.width + "\"");
		}
		buffer.append("/>\n");
		
		return buffer.toString();
	}
}
