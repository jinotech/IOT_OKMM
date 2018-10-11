package com.okmindmap.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Attribute implements Serializable {
	private String name;
	private String value;
	
	private int id;
	private int nodeId;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
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
		buffer.append("<attribute");
		buffer.append(" NAME=\"" + this.name + "\"");
		buffer.append(" VALUE=\"" + escapeUnicode(this.value) + "\"");
		buffer.append("/>\n");
		
		return buffer.toString();
	}
	
	public String escapeUnicode(String text) {
		if(text == null) {
			return null;
		}
		
		int len = text.length();
	       StringBuffer result = new StringBuffer(len);
	       int intValue;
	       char myChar;
	       boolean previousSpace = false;
	       boolean spaceOccured = false;
	       for (int i = 0; i < len; ++i) {
	          myChar = text.charAt(i);
	          intValue = (int) text.charAt(i);
	          if (intValue > 128) {
	             result.append("&#x").append( Integer.toHexString(intValue) ).append(';'); }
	          else {
	             spaceOccured = false;
	             switch (myChar) {
	             case '&':
	                result.append("&amp;");
	                break;
	             case '<':
	                result.append("&lt;");
	                break;
	             case '>':
	                result.append("&gt;");
	                break;
	             case '"':
		                result.append("&quot;");
		                break;
//	             case ' ':
//	                spaceOccured  = true;
//	                if (previousSpace) {
//	                   result.append("&nbsp;"); }
//	                else { 
//	                   result.append(" "); }
//	                break;                
	             case '\n':
	            	 result.append("&#x").append( Integer.toHexString(intValue) ).append(';');
//	                result.append("\n<br>\n");
	                break;
	             default:
	                result.append(myChar); }
	             previousSpace = spaceOccured; }}
	       return result.toString();
    };
}
