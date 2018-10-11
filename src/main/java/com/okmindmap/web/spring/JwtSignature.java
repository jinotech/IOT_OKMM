package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.Base64;
import java.util.Base64.Decoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import io.jsonwebtoken.ClaimJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

public class JwtSignature  extends BaseAction{

	private static final String SALT =  "okmmSecret";
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String decodedString = "";
		String code = "";
		
		try {

			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
			    for (Cookie cookie : cookies) {
			        if("okmm_jwt".equals(cookie.getName())){
			        	code = cookie.getValue();
			        }
			    }
			}
	        
			Decoder decoder = Base64.getDecoder();
			byte[] decodedBytes = decoder.decode(code);
			decodedString = new String(decodedBytes, "UTF-8");

			Jwts.parser().setSigningKey(SALT.getBytes("UTF-8")).parseClaimsJws(decodedString);
			
		    //OK, we can trust this JWT
			System.out.println("64 code : " + code);
			System.out.println("decoded : " + decodedString);
			
			
			

		} catch (SignatureException se) {
			System.out.println("인증 실패");
		} catch (MalformedJwtException mje) {
			System.out.println("구조적 문제 JWT");			
		} catch (ExpiredJwtException eje) {
			System.out.println("유효기간이 지남");			
		} catch (UnsupportedJwtException uje) {
			System.out.println("JWT 형식이 맞지 않음");			
		} catch (ClaimJwtException cje) {
			System.out.println("JWT 권한claim 검사가 실패");			
		} catch (IllegalArgumentException iae) {
			System.out.println("encode 조작");			
		}
		
		OutputStream out = response.getOutputStream();
		out.write(decodedString.getBytes("UTF-8"));
		out.close();
		return null;
	}

	
}
