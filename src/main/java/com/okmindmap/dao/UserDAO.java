package com.okmindmap.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.User;
import com.okmindmap.model.UserConfigData;

public interface UserDAO {
	public int insert(User user) throws DataAccessException;
	public int update(User user) throws DataAccessException;
	public int update(String firstname, String username, String email, String self, int id);
	public int update(String pw, int id);
	public User select(String username) throws DataAccessException;
	public User selectByEmail(String email) throws DataAccessException;
	public User select(int id) throws DataAccessException;
	
	public User getUserFromPersistent(String persistent) throws DataAccessException;
	public int insertPersistent(int userid, String persistent) throws DataAccessException;
	public int updatePersistent(int userid, String persistent) throws DataAccessException;
	public int deletePersistent(int userid) throws DataAccessException;
	public int updateLastAccess(int userid) throws DataAccessException;
	public int updateLastMap(int userid, int mapid) throws DataAccessException;
	
	public User getUserFromFacebook(String access_token) throws DataAccessException;
	public int insertFacebook(int userid, String access_token) throws DataAccessException;
	public int updateFacebook(int userid, String access_token) throws DataAccessException;
	public int deleteFacebook(int userid) throws DataAccessException;
	
	public List<User> getAdmins()  throws DataAccessException;
	public int setAdminAuth(int userid, boolean isAdmin)  throws DataAccessException;

	public int countAllUsers(String search)  throws DataAccessException;
	public List<User> getAllUsers(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc) throws DataAccessException;
	
	public List<UserConfigData> getUserConfigData(int userid)  throws DataAccessException;
	public int setUserConfigData(int userid, String field, String data)  throws DataAccessException;
	public int insertUserConfigData(int userid, int fieldid, String data)  throws DataAccessException;
	public int deleteUserConfigData(int userid)  throws DataAccessException;
	
	public int countUser(String where);
}
