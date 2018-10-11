package com.okmindmap.service;

import java.util.List;

import com.okmindmap.model.Discuss;

public interface DiscussService {

	public int insertMaster(String title, int id, String mapid);
	public int insertContent(String discuss_seq, String content, int id);
	public int insertUser(String discuss_seq, String userid, String leaderyn, int id);
	public int insertMapUser(String mapid, String userid, String leaderyn, int id);
	public int insertMapUser(String mapid, String userid, String leaderyn, int id, String email);
	
	public List<Discuss> masterList(int id, String keyword, int page, int pageSize, String mapid); 
	public int masterListCount(int id, String keyword, String mapid);

	public List<Discuss> contentList(String discuss_seq); 
	
	public int updateUser(String mapid, String userid, String useyn, int id);
	
	public List<Discuss> userList(String mapid, int page, int pageSize); 
	public int userListCount(String mapid); 
	
	public List<Discuss> userSearchList(String mapid, String keyword, int page, int pageSize); 
	public int userSearchListCount(String mapid, String keyword); 
	
	public int userMapCount(String mapid);
	
	public String leaderUserId(String mapid);
	
	public String discussMemberYn(String mapid, int id);
}
