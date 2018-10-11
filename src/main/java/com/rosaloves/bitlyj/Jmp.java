package com.rosaloves.bitlyj;

import com.rosaloves.bitlyj.Bitly.Provider;

/**
 * 
 * $Id: Jmp.java 135 2010-07-26 17:33:10Z chris@rosaloves.com $
 * 
 * @author clewis Jul 17, 2010
 *
 */
public class Jmp {
	
	public static Provider as(String user, String apiKey) {
		return new SimpleProvider("http://j.mp/", user, apiKey, "http://api.j.mp/v3/");
	}
	
}
