package com.okmindmap.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.User;
import com.okmindmap.model.UserConfigData;

public interface UserService {
	public final static String PERSISTENT_COOKIE_NAME = "OKMINDMAP_PERSISTENT";
	
	public int add(User user) throws DataAccessException;
	public int update(User user);
	public int update(String firstname, String username, String email, String self, int id);
	public int update(String pw, int id);
	public User get(String username);
	public User getByEmail(String email);
	public User get(int id);
	public int updateLastAccess(int userid);
	public int updateLastMap(int userid, int mapid);	
	public int updateFacebook(int userid, String token);
	
	public List<User> getAdmins();
	public void setAdminAuth(int userid, boolean isAdmin);
	
	public User login(HttpServletRequest request, HttpServletResponse response, String username, String password, boolean isPersistent)  throws Exception;
//	public User login(HttpServletRequest request, HttpServletResponse response, String username, String password, String fb_token)  throws Exception;
	public User loginFromPersistent(HttpServletRequest request, HttpServletResponse response, String persistent) throws Exception;
	public User loginFromFacebook(HttpServletRequest request, HttpServletResponse response, String access_token) throws Exception;
	public User loginFromMoodle(HttpServletRequest request, HttpServletResponse response, String username) throws Exception;
	public User loginAsGuest(HttpServletRequest request) throws Exception;
	public void logout(HttpServletRequest request, HttpServletResponse response) throws Exception;
	
	public int countAllUsers(String search);
	public List<User> getAllUsers(int page, int pageSize, String searchfield, String search, String sort, boolean isAsc);
	
	public List<UserConfigData> getUserConfigData(int userid)  throws Exception;
	public void setUserConfigData(int userid, String field, String data)  throws Exception;
	
	public boolean isUsernameExist(String username);
	
	public boolean deleteUser(int userid);
}
