package com.rosaloves.bitlyj;

/**
 * 
 * $Id: BitlyException.java 123 2010-07-20 12:01:48Z chris@rosaloves.com $
 * 
 * @author clewis Jul 17, 2010
 *
 */
public class BitlyException extends RuntimeException {

	private static final long serialVersionUID = 8300631062123036696L;
	
	BitlyException(String message) {
		super(message);
	}
	
	BitlyException(String message, Throwable cause) {
		super(message, cause);
	}
	
}
