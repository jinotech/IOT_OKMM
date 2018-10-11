package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class ArrowLink implements Serializable {
	private String color;
	private String destination;
	private String endArrow;
	private String endInclination;
	private String identity;
	private String startArrow;
	private String startInclination;
	
	private int id;
	private int nodeId;
	
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getDestination() {
		return destination;
	}
	public void setDestination(String destination) {
		this.destination = destination;
	}
	public String getEndArrow() {
		return endArrow;
	}
	public void setEndArrow(String endArrow) {
		this.endArrow = endArrow;
	}
	public String getEndInclination() {
		return endInclination;
	}
	public void setEndInclination(String endInclination) {
		this.endInclination = endInclination;
	}
	public String getIdentity() {
		return identity;
	}
	public void setIdentity(String identity) {
		this.identity = identity;
	}
	public String getStartArrow() {
		return startArrow;
	}
	public void setStartArrow(String startArrow) {
		this.startArrow = startArrow;
	}
	public String getStartInclination() {
		return startInclination;
	}
	public void setStartInclination(String startInclination) {
		this.startInclination = startInclination;
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
		buffer.append("<arrowlink");
		buffer.append(" DESTINATION=\"" + this.destination + "\"");
		if(endArrow != null) {
			buffer.append(" ENDARROW=\"" + this.endArrow + "\"");
		}
		if(endInclination != null) {
			buffer.append(" ENDINCLINATION=\"" + this.endInclination + "\"");
		}
		if(identity != null) {
			buffer.append(" ID=\"" + this.identity + "\"");
		}
		if(startArrow != null) {
			buffer.append(" STARTARROW=\"" + this.startArrow + "\"");
		}
		if(startInclination != null) {
			buffer.append(" STARTINCLINATION=\"" + this.startInclination + "\"");
		}
		buffer.append("/>\n");
		return buffer.toString();
	}
}
