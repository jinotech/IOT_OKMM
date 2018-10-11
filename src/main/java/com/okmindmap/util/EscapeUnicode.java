package com.okmindmap.util;

public class EscapeUnicode {

	public static String text(String text) {
		if(text == null) {
			return null;
		}
		
		int len = text.length();
		StringBuffer result = new StringBuffer(len);
		int intValue;
		char myChar;
//		boolean previousSpace = false;
//		boolean spaceOccured = false;
		for (int i = 0; i < len; ++i) {
			myChar = text.charAt(i);
			intValue = (int) text.charAt(i);
			if (intValue > 128) {
				if(Character.isLetter(myChar)) {
					result.append("&#x").append( Integer.toHexString(intValue) ).append(';');
				}
			} else {
//				spaceOccured = false;
				switch (myChar) {
					case '&':
						result.append("&amp;");
						break;
					case '<':
						result.append("&lt;");
						break;
					case '>':
						result.append("&gt;");
						break;
					case '"':
						result.append("&quot;");
						break;
					default:
						result.append(myChar);
				}
//				previousSpace = spaceOccured;
			}
		}
		
		return result.toString();
    }
	
	// 이미지 링크에 "&"가 있는 경우 "&amp;" 로 바꾼다.
	public static String richcontent(String text) {
		if(text == null) {
			return null;
		}
		
		int len = text.length();
			StringBuffer result = new StringBuffer(len);
			char myChar;
			for (int i = 0; i < len; ++i) {
				myChar = text.charAt(i);
				// 다음 글자가 #인 경우 유니코드임.
				if(myChar == '&' && i+1 < len && text.charAt(i+1) != '#') {
					result.append("&amp;");
				} else {
					result.append(myChar);
				}
	       }
	       return result.toString();
    };
}
