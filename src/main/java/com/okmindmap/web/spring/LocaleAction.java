package com.okmindmap.web.spring;

import java.util.Locale;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.propertyeditors.LocaleEditor;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

/**
 * 사용자의 요청을 받아 언어를 바꾼다.
 * @author jinhoon
 *
 */
public class LocaleAction implements Controller {

	LocaleResolver localeResolver= null;
	Logger logger = Logger.getLogger(LocaleAction.class);
	
	public void setLocaleResolver(LocaleResolver localeResolver){
		this.localeResolver = localeResolver;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		// 언어를 바꾼 후 이동할 페이지, 요청이 없으면 "/"로 이동한다.
		String page = request.getParameter("page");
		if(page == null) {
			page = "/";
		}
		
		if (localeResolver != null) {
			// 바꾸고자 하는 언어. en, ko 등
			// TODO 사용 가능한 언어인지 확인하는 것이 필요하다.
            String newLocaleName = request.getParameter("locale");
            
            if (newLocaleName != null) {
                LocaleEditor localeEditor = new LocaleEditor();
                localeEditor.setAsText(newLocaleName);

                // set the new locale
                Locale locale = (Locale) localeEditor.getValue();
                
            	localeResolver.setLocale(request, response, locale);
            	
           	 	Cookie cookie = new Cookie("locale", newLocaleName);
 	            cookie.setPath("/");
 	        	response.addCookie(cookie);
            }
        }
		
		return new ModelAndView("redirect:" + page);
	}

}
