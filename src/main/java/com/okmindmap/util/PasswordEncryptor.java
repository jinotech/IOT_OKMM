package com.okmindmap.util;

import java.security.MessageDigest;

public class PasswordEncryptor {
	public static String encrypt(String password) throws Exception {
		 
		MessageDigest digest = MessageDigest.getInstance("SHA-256");
		digest.reset();
		digest.update(password.getBytes());
		
		StringBuffer buffer = new StringBuffer();
		for(byte b : digest.digest()) {
			String hex = Integer.toHexString(0xFF & b);
			
			if(hex.length()==1) buffer.append('0');
			buffer.append(hex);
		}
		
		return buffer.toString();
	}
	
	public static String encrypt(String password, String salt) throws Exception {
		return encrypt(password + salt);
	}
}
