package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class RichContent implements Serializable {
	public static String TYPE_NODE = "NODE";
	public static String TYPE_NOTE = "NOTE";
	
//	private Html html;
	private String type;
	private String content;
	
	//DB
	private int id;
	private int nodeId;
	
//	public Html getHtml() {
//		return html;
//	}
//	public void setHtml(Html html) {
//		this.html = html;
//	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	public String getContent() {
		return this.content;
	}
	public void setContent(String content) {
		this.content = content;
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
		buffer.append("<richcontent");
		buffer.append(" TYPE=\"" + this.type + "\">");
//		if(html != null) {
//			buffer.append(html.toXml());
//		}
		buffer.append(this.getContent());
		buffer.append("</richcontent>\n");
		return buffer.toString();
	}
	
}
