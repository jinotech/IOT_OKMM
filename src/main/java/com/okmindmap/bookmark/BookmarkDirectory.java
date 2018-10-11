package com.okmindmap.bookmark;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.okmindmap.util.ArrayUtil;
import com.okmindmap.util.EscapeUnicode;

public class BookmarkDirectory extends Bookmark {
	private Date created;
	
	private List<Bookmark> children;
	
	public BookmarkDirectory(String name) {
		super(name);
		
		this.children = new ArrayList<Bookmark>();
	}
	
	public void setCreated(Date created) {
		this.created = created;
	}
	public Date getCreated() {
		return created;
	}
	
	public void add(Bookmark child) {
		children.add(child);
		child.setParent(this);
	}
	
	public List<Bookmark> getChildren() {
		return this.children;
	}

	@Override
	public String toXML() {
		StringBuffer buffer = new StringBuffer();
		for(Bookmark bookmark: getChildren()) {
			buffer.append( bookmark.toXML() );
		}
		
		if(getParent() == null) {
			return "<bookmarks>" + buffer.toString() + "</bookmarks>";
		} else {
			return "<directory><name>" + EscapeUnicode.text(getName()) + "</name>" + buffer.toString() + "</directory>";
		}
	}
	
	public String toJSON() {
		StringBuffer buffer = new StringBuffer();
		
		buffer.append("{");
		buffer.append("\"name\":\"" + EscapeUnicode.text(getName()) + "\"" );
		
		if(getChildren().size() > 0) {
			
			ArrayList<String> list = new ArrayList<String>();
			for(Bookmark bookmark: getChildren()) {
				list.add( bookmark.toJSON() );
			}
			
			buffer.append(",");
			buffer.append("\"children\":[");
			buffer.append( ArrayUtil.join(list, ",") );
			buffer.append("]");
		}
		
		buffer.append("}");
		
		return buffer.toString();
	}
	
}
