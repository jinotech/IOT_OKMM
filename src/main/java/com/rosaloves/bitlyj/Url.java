package com.rosaloves.bitlyj;

/**
 * 
 * $Id: Url.java 135 2010-07-26 17:33:10Z chris@rosaloves.com $
 * 
 * @author clewis Jul 17, 2010
 * 
 */
public class Url {
	
	private String shortBase;
	
	private String globalHash;

	private String userHash;

	private String shortUrl;

	private String longUrl;
	
	Url() {}
	
	Url(String shortBase, String globalHash, String userHash, String shortUrl, String longUrl) {
		super();
		this.shortBase = shortBase;
		this.globalHash = globalHash;
		this.userHash = userHash;
		this.shortUrl = shortUrl;
		this.longUrl = longUrl;
		
		if(this.shortUrl.length() == 0)
			this.shortUrl = shortBase + userHash;
	}

	public String getGlobalHash() {
		return globalHash;
	}

	public String getUserHash() {
		return userHash;
	}

	public String getShortUrl() {
		return shortUrl;
	}

	public String getLongUrl() {
		return longUrl;
	}

	@Override
	public String toString() {
		return "Url [shortBase=" + shortBase + ", globalHash=" + globalHash
			+ ", longUrl=" + longUrl + ", shortUrl=" + shortUrl
			+ ", userHash=" + userHash + "]";
	}

}
