package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Font implements Serializable {
	private String bold;
	private String italic;
	private String name;
	private String size;
	
	//DB
	private int id;
	private int nodeId;
	
	public String getBold() {
		return bold;
	}
	public void setBold(String bold) {
		this.bold = bold;
	}
	public String getItalic() {
		return italic;
	}
	public void setItalic(String italic) {
		this.italic = italic;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
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
		
		buffer.append("<font");
		buffer.append(" NAME=\"" + this.name + "\"");
		
		if(bold != null) {
			buffer.append(" BOLD=\"" + this.bold + "\"");
		}
		if(italic != null) {
			buffer.append(" ITALIC=\"" + this.italic + "\"");
		}
		if(size != null) {
			buffer.append(" SIZE=\"" + this.size + "\"");
		}
		buffer.append("/>\n");
		
		return buffer.toString();
	}
}
