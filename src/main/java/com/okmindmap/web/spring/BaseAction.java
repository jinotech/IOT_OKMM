package com.okmindmap.web.spring;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.Controller;

import com.okmindmap.context.AppContext;
import com.okmindmap.model.User;
import com.okmindmap.service.UserService;

@Component
public abstract class BaseAction implements Controller {
	//protected UserService userService;
	protected MessageSourceAccessor msAccessor = null; 
	
	/*public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}*/
	
	protected User getUser(HttpServletRequest request) throws Exception {
		Object obj = request.getSession().getAttribute("user");
		User user = null;
		if(obj != null) {
			user = (User)obj;
		} else {
			//user = this.userService.loginAsGuest(request);
		}
		
		return user;
	}
	
	protected User getRequireLogin(HttpServletRequest request) throws Exception {
		User user = this.getUser(request);
		
		if(user.getUsername().equals("guest")) {
			throw new Exception("Not Logined");
		}
		
		return user;
	}
	
	protected Object getRequiredParam(HttpServletRequest request, String paramName, Class<?> clazz)
		throws Exception {
		String paramValue = request.getParameter(paramName);
		
		if(paramValue == null) {
			throw new NullPointerException();
		}
		
		Object object = null;
		
		
		object = createObjectFromConstructor(clazz, paramValue);
		if(object == null) {
			object = createObjectFromMethod(clazz, "valueOf", paramValue);
		}
		
		return object;
	}
	
	
	protected String getOptionalParam(HttpServletRequest request, String paramName, String defaultValue) {
		String paramValue = request.getParameter(paramName);
		
		if(paramValue == null) {
			return defaultValue;
		}
		
		
		return paramValue;
	}
	
	protected int getOptionalParam(HttpServletRequest request, String paramName, int defaultValue) {
		String paramValue = request.getParameter(paramName);
		
		if(paramValue == null) {
			return defaultValue;
		}
		
		
		return Integer.parseInt(paramValue);
	}
	
	protected String getMessage(String code) {
		return this.getMessage(code, null);
	}
	
	protected String getMessage(String code, Object[] args) {
		if(msAccessor == null) {
			msAccessor = (MessageSourceAccessor)AppContext.getApplicationContext().getBean("messageSourceAccessor");
			
		}
		
		return msAccessor.getMessage(code, args);
	}
	
	protected String getPersistentCookie(HttpServletRequest request) {
		return getCookie(request, UserService.PERSISTENT_COOKIE_NAME);
	}
	
	protected String getCookie(HttpServletRequest request, String name) {
		Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	      for (int i = 0; i < cookies.length; i++) {
	        if (cookies[i].getName().equals(name)) {
	          return cookies[i].getValue();
	        }
	      }
	    }
	    
	    return null;
	}
	
	private Object createObjectFromConstructor(Class<?> clazz, String value) {
		try {
			Constructor<?> constructor = clazz.getConstructor(String.class);
			return constructor.newInstance(value);
		} catch (Exception e) {
		}
		
		return null;
	}
	
	private Object createObjectFromMethod(Class<?> clazz, String methodName, String value) {
		try {
			Method method = clazz.getMethod(methodName, String.class);
			if(method != null) {
				return method.invoke(clazz.newInstance(), value);
			}	
		} catch (Exception e) {
		}
		
		return null;
	}
}
