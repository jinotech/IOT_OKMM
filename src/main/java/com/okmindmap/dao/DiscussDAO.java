package com.okmindmap.dao;

import java.util.List;

import com.okmindmap.model.Discuss;

public interface DiscussDAO {

	public int insertMaster(String title, int id);
	public int insertContent(String discuss_seq, String content, int id);
	public int insertUser(String discuss_seq, String userid, String leaderyn, int id);
	public int insertMapUser(String mapid, String userid, String leaderyn, int id);
	public int insertMap(String discuss_seq, String mapid, int id);
	
	public List<Discuss> masterList(int id, String keyword, int page, int pageSize, String mapid); 
	public int masterListCount(int id, String keyword, String mapid);
	
	public List<Discuss> contentList(String discuss_seq);
	
	public int updateUser(String mapid, String userid, String useyn, int id);
	public int userCount(String discuss_seq, String userid);
	public int updateMapUser(String mapid, String userid, String useyn, int id);
	public int userMapCount(String mapid);
	public int userMapCount(String mapid, String userid);
	public int userMapCount(String mapid, String userid, String email);
	
	public List<Discuss> userList(String mapid, int page, int pageSize); 
	public int userListCount(String mapid); 
	
	public List<Discuss> userSearchList(String mapid, String keyword, int page, int pageSize); 
	public int userSearchListCount(String mapid, String keyword); 
	
	public String getUserId(String email);
	
	public String leaderUserId(String mapid);
	
	public String discussMemberYn(String mapid, int id);
}
