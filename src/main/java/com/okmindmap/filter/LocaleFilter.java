package com.okmindmap.filter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.propertyeditors.LocaleEditor;
import org.springframework.context.ApplicationContext;
import org.springframework.web.servlet.LocaleResolver;

import com.okmindmap.context.AppContext;

/**
 * 사용자 언어를 자동으로 선택하기 위한 필터
 * web.xml 파일에 아래처럼 설정을 해야 한다.
 * 
 * 	<filter>
 *		<filter-name>LocaleFilter</filter-name>
 *		<filter-class>com.okmindmap.filter.LocaleFilter</filter-class>
 *		<init-param>
 *			<param-name>cookieName</param-name>
 *			<param-value>locale</param-value>
 *		</init-param>
 *		<init-param>
 *			<param-name>localeResolver</param-name>
 *			<param-value>localeResolver</param-value>
 *		</init-param>
 *		<init-param>
 *			<param-name>locales</param-name>
 *			<param-value>en,ko</param-value>
 *		</init-param>
 *	</filter>
 *	<filter-mapping>
 *		<filter-name>LocaleFilter</filter-name>
 *		<url-pattern>/*</url-pattern>
 *	</filter-mapping>
 */

public class LocaleFilter implements Filter {
	private String cookieName = null;
	private String localeResolver = null;
	private List<String> locales = null;
	
	private LocaleResolver resolver = null;
	
	@Override
	public void destroy() {
		this.cookieName = null;
		this.localeResolver = null;
		this.locales = null;
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest request = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)res;
		
		String localeName = null;
		
		if(this.cookieName == null) {
			this.cookieName = "locale";
		}
		
		// cookie에서 locale 값을 얻어 온다.
		Cookie[] cookies = request.getCookies();
		if(cookies != null) {
			for(Cookie cookie : cookies) {
				if(this.cookieName.equals(cookie.getName())) {
					localeName = cookie.getValue();
					break;
				}
			}
		}
		
		/*
		// IP를 알아 낸다.
		// IP로 Language를 선택할 때 활용하자.
		String ipAddress = null;
		if (request.getHeader("X-Forwarded-For") == null) {
		   ipAddress = request.getRemoteAddr();
		} else { 
		   ipAddress = request.getHeader("X-Forwarded-For");
		}
		String countryCode = getCountryCode(ipAddress);
		*/
		
		// cookie가 설정 안되어 있는 경우 언어를 자동으로 선택한다.
		if(localeName == null) {
			// 사용자 언어 알아내기
			//Returns the preferred Locale that the client will accept content in, based on the Accept-Language header
			localeName = request.getLocale().getLanguage();
			
			if(resolver != null) {
				if(locales != null && !locales.contains(localeName)) {
					localeName = locales.get(0);
				}
				
	            LocaleEditor localeEditor = new LocaleEditor();
	            localeEditor.setAsText(localeName);
	
	            // set the new locale
	            Locale locale = (Locale) localeEditor.getValue();
	            
	            resolver.setLocale(request, response, locale);
	        	
	            // cookie에 값을 쓴다.
	            Cookie cookie = new Cookie("locale", localeName);
	            cookie.setPath("/");
	        	response.addCookie(cookie);
			}
		}
		
		chain.doFilter(request, response);
	}

	@Override
	/**
	 * web.xml 파일에 선언된 초기값들을 가져온다.
	 */
	public void init(FilterConfig cfg) throws ServletException {
		this.cookieName = cfg.getInitParameter("cookieName");
		this.localeResolver = cfg.getInitParameter("localeResolver");

		String locales = cfg.getInitParameter("locales");
		
		ApplicationContext actx = AppContext.getApplicationContext();
		this.resolver = (LocaleResolver) actx.getBean(localeResolver);
		
		if(locales != null) {
			this.locales = Arrays.asList(locales.split(","));
		}
	}
/*
	private String getCountryCode(String IPAddress){
		// Chop off everything from the comma onwards
		StringBuffer buffer = new StringBuffer(IPAddress);
		int index = buffer.indexOf(",");
		// See if there is  comma
		if(index > 0){
		   int length = buffer.length();
		   buffer = buffer.delete(index, length);
		}
		StringTokenizer tokens = new StringTokenizer(buffer.toString(), ".", false);
		long answer = 0L;
		int counter = 3;
		while(tokens.hasMoreTokens() && counter >= 0){
			long read = new Long(tokens.nextToken()).longValue();
			long calculated = new Double(read *(Math.pow(256, counter))).longValue();
			answer += calculated;
			counter --;		
		}
		Long IPValue = new Long(answer);
		System.out.println(IPValue.toString());
		return null;
//		try {
//			IP2CountryCMPLocalHome ip2countryLocalHome = IP2CountryCMPUtil.getLocalHome();
//			return ip2countryLocalHome.getCountryCode(IPValue);
//		}
//		catch (NamingException e) {
//			return "US";
//		}
	}
	*/
	
	public static void main(String[] args) throws Exception {
//		String countryCode = getCountryCode("211.216.235.32");

		Date date = new Date();
		// 아래 코드를 실행하면 KR 이 출력됨
		// KR 어떻게 Locale 로 바꿀 수 있나?
		URL url = new URL("http://api.hostip.info/country.php?ip=210.222.227.212");
		URLConnection connection = url.openConnection();
		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
		while(reader.ready()) {
			System.out.println(reader.readLine());
		}
		//System.out.println("duration:: " + (new Date().getTime() - date.getTime()));
	}
}
