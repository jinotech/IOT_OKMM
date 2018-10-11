package com.okmindmap.service.impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.okmindmap.dao.UserDAO;
import com.okmindmap.model.User;
import com.okmindmap.model.UserConfigData;
import com.okmindmap.service.UserService;
import com.okmindmap.util.PasswordEncryptor;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDAO userDAO;
	
	public void setUserDAO(UserDAO userDAO) {
		this.userDAO = userDAO;
	}
	
	@Override
	public int add(User user) throws DataAccessException {
		return this.userDAO.insert(user);
	}
	
	public int updateLastAccess(int userid) {
		return this.userDAO.updateLastAccess(userid);
	}
	
	public int updateLastMap(int userid, int mapid) {
		return this.userDAO.updateLastMap(userid, mapid);
	}
	
	public int update(User user) {
		return this.userDAO.update(user);
	}

	public int update(String firstname, String username, String email, String self, int id) {
		return this.userDAO.update(firstname, username, email, self, id);
	}
	
	public int update(String pw, int id) {
		return this.userDAO.update(pw, id);
	}
	
	@Override
	public User get(String username) {
		try {
			return this.userDAO.select(username);
		} catch (Exception e) {
			return null;
		}
	}
	
	public User getByEmail(String email) {
		try {
			return this.userDAO.selectByEmail(email);
		} catch (Exception e) {
			return null;
		}
	}
	
	@Override
	public User get(int id) {
		try {
			return this.userDAO.select(id);
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public User login(HttpServletRequest request, HttpServletResponse response, String username,
			String password, boolean isPersistent) throws Exception {
		User user = this.get(username);
		
		String encrypted = PasswordEncryptor.encrypt(password);
		if(user.getPassword().equals(encrypted)) {
			HttpSession session = request.getSession();
			session.setAttribute("user", user);
			//session.setMaxInactiveInterval(-1);
			
			if(isPersistent) {
				String persistent = setPersistentCookie(request, response, user.getUsername());
				this.userDAO.insertPersistent(user.getId(), persistent);
			}
			
			this.updateLastAccess(user.getId());
			
			return user;
		} else {
			throw new Exception("Invalid password or username.");
		}
	}
	
//	@Override
//	public User login(HttpServletRequest request, HttpServletResponse response, String username,
//			String password, String fb_token) throws Exception {
//		User user = this.get(username);
//		
//		String encrypted = PasswordEncryptor.encrypt(password);
//		if(user.getPassword().equals(encrypted)) {
//			HttpSession session = request.getSession();
//			session.setAttribute("user", user);
//			session.setMaxInactiveInterval(-1);
//			
//			if(fb_token != null && !"".equals(fb_token)) {
//				this.userDAO.insertFacebook(user.getId(), fb_token);
//			}
//			
//			return user;
//		} else {
//			throw new Exception("Invalid password or username.");
//		}
//	}
	
	public User loginFromPersistent(HttpServletRequest request, HttpServletResponse response, String persistent) throws Exception {
		try {
			User user = this.userDAO.getUserFromPersistent(persistent);
			
			if(user == null) {
				return null;
			}
			
			HttpSession session = request.getSession();
			session.setAttribute("user", user);
			session.setMaxInactiveInterval(-1);
			
			persistent = setPersistentCookie(request, response, user.getUsername());
			this.userDAO.updatePersistent(user.getId(), persistent);
			
			this.updateLastAccess(user.getId());
			
			return user;
		} catch (Exception e) {
			Logger logger = Logger.getLogger(UserServiceImpl.class);
			logger.error(e);
		}
		
		return null;
	}
	
	public User loginFromFacebook(HttpServletRequest request, HttpServletResponse response, String access_token) throws Exception {
		try {
			User user = this.userDAO.getUserFromFacebook(access_token);
			
			if(user == null) {
				return null;
			}
			
			HttpSession session = request.getSession();
			session.setAttribute("user", user);
			session.setMaxInactiveInterval(-1);
			
			this.updateLastAccess(user.getId());
			
			return user;
		} catch (Exception e) {
			Logger logger = Logger.getLogger(UserServiceImpl.class);
			logger.error(e);
		}
		
		return null;
	}
	
	public User loginFromMoodle(HttpServletRequest request, HttpServletResponse response, String username) throws Exception {
		try {
			User user = this.userDAO.select(username);
			
			if(user == null) {
				return null;
			}
			
			HttpSession session = request.getSession();
			session.setAttribute("user", user);
			session.setMaxInactiveInterval(-1);
			
			this.updateLastAccess(user.getId());
			
			return user;
		} catch (Exception e) {
			Logger logger = Logger.getLogger(UserServiceImpl.class);
			logger.error(e);
		}
		
		return null;
	}
	
	@Override
	public User loginAsGuest(HttpServletRequest request) throws Exception {
		User user = this.get("guest");
		
		HttpSession session = request.getSession();
		session.setAttribute("user", user);
		
		return user;
	}

	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		if(user != null) {
			session.removeAttribute("user");
			
			this.userDAO.deletePersistent(user.getId());
			
			deletePersistentCookie(request, response);
		}
	}

	
	private String setPersistentCookie(HttpServletRequest request, HttpServletResponse response, String username) {
		String persistent = null;
		try {
			persistent = PasswordEncryptor.encrypt(username + new Date().getTime());
			Cookie cookie1 = new Cookie(UserService.PERSISTENT_COOKIE_NAME, persistent);
			
			String domain = request.getServerName();
//			if(domain.startsWith("www.")) {
//				domain = domain.substring(3);
//			} else {
//				domain = "." + domain;
//			}
			cookie1.setDomain(domain);
			
			cookie1.setPath(request.getContextPath() + "/");
	        cookie1.setMaxAge(365 * 24 * 60 * 60);
	        
	        response.addCookie(cookie1);
	    } catch (Exception e) {
	    	e.printStackTrace();
		}
	    
	    return persistent;
	}
	
	private void deletePersistentCookie(HttpServletRequest request, HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	      for (int i = 0; i < cookies.length; i++) {
	        if (cookies[i].getName().equals(UserService.PERSISTENT_COOKIE_NAME)) {
	          Cookie cookie = cookies[i];
	          cookie.setMaxAge(0);
	          cookie.setPath("/");
	          cookie.setValue(null);
	          response.addCookie(cookie);
	        }
	      }
	    }
	}
	
	
	public List<User> getAdmins() {
		return this.userDAO.getAdmins();
	}
	
	public void setAdminAuth(int userid, boolean isAdmin) {
		this.userDAO.setAdminAuth(userid, isAdmin);
	}

	@Override
	public List<User> getAllUsers(int page, int pageSize, String searchfield, String search, String sort, boolean isAsc) {
		return this.userDAO.getAllUsers(page, pageSize,searchfield,  search, sort, isAsc);
	}

	@Override
	public int countAllUsers(String search) {
		return this.userDAO.countAllUsers(search);
	}
	
	
	public List<UserConfigData> getUserConfigData(int userid)  throws Exception {
		return this.userDAO.getUserConfigData(userid);
	}
	public void setUserConfigData(int userid, String field, String data)  throws Exception {
		this.userDAO.setUserConfigData(userid, field, data);
	}

	@Override
	public int updateFacebook(int userid, String token) {
		return this.userDAO.updateFacebook(userid, token);
	}

	@Override
	public boolean isUsernameExist(String username) {
		int count = this.userDAO.countUser("username = '" + username + "'");
		
		return count != 0;
	}

	@Override
	public boolean deleteUser(int userid) {
		User user = this.get(userid);
		if(user == null) {
			return false;
		}
		
		Calendar cal = Calendar.getInstance();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        String suffix = "_" + sdf.format(cal.getTime());
        
		String username = user.getUsername() + suffix;
		String email = user.getEmail() + suffix;
		
		user.setUsername(username);
		user.setEmail(email);
		user.setDeleted(1);
		
		this.update(user);
		
		return true;
	}
	
}
