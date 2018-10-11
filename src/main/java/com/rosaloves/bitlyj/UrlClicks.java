package com.rosaloves.bitlyj;

/**
 * 
 * $Id: UrlClicks.java 129 2010-07-20 20:16:14Z chris@rosaloves.com $
 * 
 * @author clewis Jul 17, 2010
 *
 */
public class UrlClicks {

	private final long userClicks;
	
	private final long globalClicks;
	
	private final Url url;

	UrlClicks(Url url, long userClicks, long globalClicks) {
		super();
		this.url = url;
		this.userClicks = userClicks;
		this.globalClicks = globalClicks;
	}

	public Url getUrl() {
		return url;
	}

	public long getUserClicks() {
		return userClicks;
	}

	public long getGlobalClicks() {
		return globalClicks;
	}

	@Override
	public String toString() {
		return "UrlClicks [globalClicks=" + globalClicks 
				+ ", userClicks=" + userClicks + ", url=" + url + "]";
	}

}
