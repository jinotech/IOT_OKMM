package com.okmindmap.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("serial")
public class Map implements Serializable {
	private String name;
	private String version;
	private String mapstyle;
	private String lazyloading;
	private String pt_sequence;
	private List<Node> nodes;
	private String usernamestring;
	
	//DB
	private int id;
	private String key;
	private long created = 0l;
	private int queuecount;
	private int revisioncnt;
	private int viewcount;
	private String email;	
	private int sharetype;	
	private User owner;
	private int queueing;
	private String short_url;
	private int recommend_point;
	
	public Map() {
		this.nodes = new ArrayList<Node>();
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getQueuecount() {
		return queuecount;
	}

	public void setQueuecount(int queuecount) {
		this.queuecount = queuecount;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getMapStyle() {
		return mapstyle;
	}
	public void setMapStyle(String style) {
		this.mapstyle = style;
	}
	public String getLazyloading() {
		return lazyloading;
	}
	public void setLazyloading(String lazyloading) {
		this.lazyloading = lazyloading;
	}
	public String getPt_sequence() {
		return pt_sequence;
	}
	public void setPt_sequence(String pt_sequence) {
		this.pt_sequence = pt_sequence;
	}

	public List<Node> getNodes() {
		return nodes;
	}
	public void setNodes(List<Node> nodes) {
		this.nodes = nodes;
	}
	
	public void addChild(Node node) {
		this.nodes.add(node);
	}

	public void setId(int id) {
		this.id = id;
	}
	public int getId() {
		return id;
	}
	
	public void setCreated(long created) {
		this.created = created;
	}

	public long getCreated() {
		return created;
	}
	public void setShort_url(String short_url) {
		this.short_url = short_url;
	}
	public String getShort_url() {
		return short_url;
	}

	public String toXml() {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<map version=\"" + this.version + "\" mapstyle=\"" +  this.mapstyle + "\" lazyloading=\"" +  this.lazyloading + "\">\n");
		for(int i = 0; i < nodes.size(); i++) {
			buffer.append(nodes.get(i).toXml());
		}
		buffer.append("</map>");
		return buffer.toString();
	}
	
	/**
	 * 구글 크롤링을 위하여 Text만 가져오는 메소드 생성
	 * @return
	 */
	
	public String getText(){
		StringBuffer buffer = new StringBuffer();
		for(int i = 0; i < nodes.size(); i++) {
			buffer.append(nodes.get(i).getTextRecursive());
		}
		return buffer.toString();
		
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getKey() {
		return key;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public User getOwner() {
		return owner;
	}


	public String getUsernamestring() {
		if (usernamestring==null) return "";
		return usernamestring;
	}


	public void setUsernamestring(String usernamestring) {
		this.usernamestring = usernamestring;
	}

	public int getRevisioncnt() {
		return revisioncnt;
	}


	public void setRevisioncnt(int revisioncnt) {
		this.revisioncnt = revisioncnt;
	}


	public int getViewcount() {
		return viewcount;
	}


	public void setViewcount(int viewcount) {
		this.viewcount = viewcount;
	}


	public int getSharetype() {
		return sharetype;
	}


	public void setSharetype(int sharetype) {
		this.sharetype = sharetype;
	}

	public int getQueueing() {
		return queueing;
	}

	public void setQueueing(int queueing) {
		this.queueing = queueing;
	}
	
	public int getRecommend_point() {
		return recommend_point;
	}

	public void setRecommend_point(int recommend_point) {
		this.recommend_point = recommend_point;
	}
}
