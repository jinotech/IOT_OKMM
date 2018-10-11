package com.rosaloves.bitlyj;

/**
 * ShortenedUrl
 * 
 * $Id: ShortenedUrl.java 136 2010-07-26 21:22:33Z chris@rosaloves.com $
 * 
 * @author clewis Jul 26, 2010
 *
 */
public class ShortenedUrl extends Url {
	
	private final boolean newHash;
	
	ShortenedUrl(String shortBase, String globalHash, String userHash,
			String shortUrl, String longUrl, boolean newHash) {
		super(shortBase, globalHash, userHash, shortUrl, longUrl);
		this.newHash = newHash;
	}

	public boolean isNewHash() {
		return newHash;
	}

	@Override
	public String toString() {
		return "ShortenedUrl [newHash=" + newHash + ", getGlobalHash()="
				+ getGlobalHash() + ", getLongUrl()=" + getLongUrl()
				+ ", getShortUrl()=" + getShortUrl() + ", getUserHash()="
				+ getUserHash() + "]";
	}

}
