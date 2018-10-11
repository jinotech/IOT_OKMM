package com.okmindmap.util;

import java.util.Iterator;
import java.util.List;

public class ArrayUtil {
	public static String join(List<? extends CharSequence> s, String delimiter) {
		StringBuilder buffer = new StringBuilder();
		Iterator<? extends CharSequence> iter = s.iterator();
		if (iter.hasNext()) {
		    buffer.append(iter.next());
		    while (iter.hasNext()) {
				buffer.append(delimiter);
				buffer.append(iter.next());
		    }
		}
		return buffer.toString();
	}
}
