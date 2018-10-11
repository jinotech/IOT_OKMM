package com.okmindmap.model;

import java.io.Serializable;
import java.util.Vector;

@SuppressWarnings("serial")
public class Hook implements Serializable {
	private Vector<Parameter> parameters;
	private Vector<String> text;
	private String name;
	
	private int id;
	private int nodeId;
	
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
	public Vector<Parameter> getParameters() {
		return parameters;
	}
	public void setParameters(Vector<Parameter> parameters) {
		this.parameters = parameters;
	}
	public Vector<String> getText() {
		return text;
	}
	public void setText(Vector<String> text) {
		this.text = text;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}
	
	public String toXml() {
		StringBuffer buffer = new StringBuffer();
		
		return buffer.toString();
	}
}
