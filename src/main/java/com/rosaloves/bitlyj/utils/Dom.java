package com.rosaloves.bitlyj.utils;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/** 
 * 
 * $Id: Dom.java 123 2010-07-20 12:01:48Z chris@rosaloves.com $
 * 
 * @author clewis Jul 18, 2010
 *
 */
public final class Dom {
	
	/* Android support (dalvik doesn't support Node#getTextContent) */
	public static String getTextContent(Node n) {
		StringBuffer sb = new StringBuffer(); 
		NodeList nl = n.getChildNodes(); 
		for (int i = 0; i < nl.getLength(); i++) { 
		    Node child = nl.item(i); 
		    if (child.getNodeType() == Node.TEXT_NODE) 
		    	sb.append(child.getNodeValue()); 
		}
		return sb.toString();
	}
	
}
