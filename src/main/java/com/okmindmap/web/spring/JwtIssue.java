package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.Base64.Encoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtIssue extends BaseAction{

	private static final String SALT =  "okmmSecret";
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String springVersion = org.springframework.core.SpringVersion.getVersion();
		System.out.println("스프링 프레임워크 버전 : " + springVersion);
		
		long nowMillis = System.currentTimeMillis();	//현재 시간
        long iat = nowMillis / 1000L; 					//발행시간 
        long exp = iat + 60L; 							//유효시간(1분)
        
        String compactJws = Jwts.builder()
      		  .setSubject("Joe")
      		  .signWith(SignatureAlgorithm.HS512, this.generateKey())
      		  .claim("iat", iat)
      		  .claim("exp", exp)
      		  .compact();

        byte[] targetBytes = compactJws.getBytes("UTF-8");
        Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode(targetBytes);
        
        System.out.println(new String(encodedBytes));
  		System.out.println("iat : " + iat);
  		System.out.println("exp : " + exp);
  		System.out.println("compactJws : " + compactJws);
  		System.out.println("encoded : " + new String(encodedBytes));
  		
  		Cookie cookie = new Cookie("okmm_jwt", new String(encodedBytes));
  	    cookie.setMaxAge(60*60*24*365);            // 쿠키 유지 기간 - 1년
  	    cookie.setPath("/");                       // 모든 경로에서 접근 가능하도록 
  	    response.addCookie(cookie);                // 쿠키저장
      		
  		OutputStream out = response.getOutputStream();
		out.write(new String(encodedBytes).toString().getBytes("UTF-8"));
		out.close();
		return null;
	}

	private byte[] generateKey(){
        byte[] key = null;
        try {
            key = SALT.getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
        	System.out.println("Making JWT Key Error ::: {}" + e.getMessage());
        }
         
        return key;
    }
}
