package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Icon implements Serializable {
	private String builtin;

	//DB
	private int id;
	private int nodeId;
	
	public void setBuiltin(String builtin) {
		this.builtin = builtin;
	}

	public String getBuiltin() {
		return builtin;
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
		buffer.append("<icon");
		buffer.append(" BUILTIN=\"" + this.builtin + "\"");
		buffer.append("/>\n");
		
		return buffer.toString();
	}
	
}
