package com.okmindmap.model.admin;

import java.io.Serializable;

import com.okmindmap.model.User;

@SuppressWarnings("serial")
public class RecommendList  implements Serializable {
	private String name;
	private String version;
	private String mapstyle;
	private String lazyloading;
	private String pt_sequence;
	private String usernamestring;
	private int recommend_id;
	private String map_id;
	private long added;
	private String imagepath;

	public int getRecommend_id() {
		return recommend_id;
	}

	public void setRecommend_id(int recommend_id) {
		this.recommend_id = recommend_id;
	}

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
	
	public String getMap_id() {
		return map_id;
	}

	public void setMap_id(String map_id) {
		this.map_id = map_id;
	}

	public long getAdded() {
		return added;
	}

	public void setAdded(long added) {
		this.added = added;
	}

	public String getImagepath() {
		return imagepath;
	}

	public void setImagepath(String imagepath) {
		this.imagepath = imagepath;
	}

	/**
	 * 구글 크롤링을 위하여 Text만 가져오는 메소드 생성
	 * @return
	 */

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