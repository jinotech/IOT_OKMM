package com.rosaloves.bitlyj;

import java.util.Set;

/**
 * Utility functions comprising the DSL.
 * 
 * $Id: Bitly.java 135 2010-07-26 17:33:10Z chris@rosaloves.com $
 * 
 * @author clewis Jul 17, 2010
 *
 */
public final class Bitly {
	
	public static interface Provider {
		
		public <A> A call(BitlyMethod<A> m);
		
		public String getUrl();
		
	}
	
	public static Provider as(String user, String apiKey) {
		return new SimpleProvider("http://bit.ly/", user, apiKey, "http://api.bit.ly/v3/");
	}
	
	public static BitlyMethod<UrlInfo> info(String value) {
		return Methods.info(value);
	}
	
	public static BitlyMethod<Set<UrlInfo>> info(String ... value) {
		return Methods.info(value);
	}
	
	public static BitlyMethod<Url> expand(String value) {
		return Methods.expand(value);
	}
	
	public static BitlyMethod<Set<Url>> expand(String ... value) {
		return Methods.expand(value);
	}
	
	public static BitlyMethod<ShortenedUrl> shorten(String longUrl) {
		return Methods.shorten(longUrl);
	}
	
	public static BitlyMethod<UrlClicks> clicks(String string) {
		return Methods.clicks(string);
	}
	
	public static BitlyMethod<Set<UrlClicks>> clicks(String ... string) {
		return Methods.clicks(string);
	}

}
