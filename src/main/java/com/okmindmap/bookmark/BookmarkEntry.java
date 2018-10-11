package com.okmindmap.bookmark;

import java.net.URL;
import java.util.Date;

import com.okmindmap.util.EscapeUnicode;

public class BookmarkEntry extends Bookmark {

	private URL location;
	private Date created;
	private Date lastVisited;
	
	public BookmarkEntry() {
		this(null);
	}
	
	public BookmarkEntry(String name) {
		super(name);
	}
	
	public void setLocation(URL location) {
		this.location = location;
	}
	public URL getLocation() {
		return location;
	}
	public void setCreated(Date created) {
		this.created = created;
	}
	public Date getCreated() {
		return created;
	}
	public void setLastVisited(Date lastVisited) {
		this.lastVisited = lastVisited;
	}
	public Date getLastVisited() {
		return lastVisited;
	}

	@Override
	public String toXML() {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<bookmark>");
		buffer.append("<name>" + EscapeUnicode.text(getName()) + "</name>");
		buffer.append("<location>"+ EscapeUnicode.text(getLocation().toString()) + "</location>");
//		buffer.append("<name>" + getName() + "</name>");
//		buffer.append("<location>"+ getLocation().toString() + "</location>");
//		buffer.append("<created>"+ (getCreated().getTime()/1000l) + "</created>");
//		buffer.append("<last-visited>"+ (getLastVisited().getTime()/1000l) + "</last-visited>");
		buffer.append("</bookmark>");
		
		return buffer.toString();
	}
	
	public String toJSON() {
		StringBuffer buffer = new StringBuffer();
		
//		buffer.append("\"bookmark\":");
		buffer.append("{");
		buffer.append("\"name\":\"" + EscapeUnicode.text(getName()) + "\"" );
		buffer.append(",");
		buffer.append("\"location\":\"" + EscapeUnicode.text(getLocation().toString()) + "\"" );
		buffer.append("}");
		
		return buffer.toString();
	}
	
}
