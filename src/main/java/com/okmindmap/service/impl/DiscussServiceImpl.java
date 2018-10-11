package com.okmindmap.service.impl;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.okmindmap.dao.DiscussDAO;
import com.okmindmap.model.Discuss;
import com.okmindmap.service.DiscussService;

public class DiscussServiceImpl implements DiscussService{

	private DiscussDAO discussDAO;
	
	public void setDiscussDAO(DiscussDAO discussDAO) {
		this.discussDAO = discussDAO;
	}
	
	@Transactional
	@Override
	public int insertMaster(String title, int id, String mapid) {
		
		int key = discussDAO.insertMaster(title, id);
		
		if(key > 0) {
			discussDAO.insertMap(String.valueOf(key), mapid, id);
			int userCount = discussDAO.userMapCount(mapid, String.valueOf(id));
			if(userCount == 0) {
				discussDAO.insertMapUser(mapid, String.valueOf(id), "Y", id);
			}
		}else {
			new Exception();
		}
		
		return key;
	}

	@Override
	public int insertContent(String discuss_seq, String content, int id) {
		return discussDAO.insertContent(discuss_seq, content, id);
	}
	
	@Override
	public int insertUser(String discuss_seq, String userid, String leaderyn, int id) {
		
		int userCnt = discussDAO.userCount(discuss_seq, userid);
		int result = 0;
		
		if(userCnt > 0) {
			result = discussDAO.updateUser(discuss_seq, userid, "Y", id);
		}else {
			result = discussDAO.insertUser(discuss_seq, userid, leaderyn, id);
		}
		
		return result;
	}

	@Override
	public int insertMapUser(String mapid, String userid, String leaderyn, int id) {
		
		int userCnt = discussDAO.userMapCount(mapid, userid);
		int result = 0;
		
		if(userCnt > 0) {
			result = discussDAO.updateMapUser(mapid, userid, "Y", id);
		}else {
			result = discussDAO.insertMapUser(mapid, userid, leaderyn, id);
		}
		
		return result;
	}
	
	@Override
	public int insertMapUser(String mapid, String userid, String leaderyn, int id, String email) {
		
		int result = 99;
		userid = discussDAO.getUserId(email);
		
		if(userid != "0") {	//사용자 있음
			int userCnt = discussDAO.userMapCount(mapid, "", email);
			if(userCnt <= 0) {
				result = discussDAO.insertMapUser(mapid, userid, leaderyn, id);
			}else {
				result = discussDAO.updateMapUser(mapid, userid, "Y", id);
			}
		}else {	//사용자 없음
			result = 88;
		}
		
		return result;
	}
	
	@Override
	public List<Discuss> masterList(int id, String keyword, int page, int pageSize, String mapid) {
		return discussDAO.masterList(id, keyword, page, pageSize, mapid);
	}

	@Override
	public int masterListCount(int id, String keyword, String mapid) {
		return discussDAO.masterListCount(id, keyword, mapid);
	}
	
	@Override
	public List<Discuss> contentList(String discuss_seq) {
		return discussDAO.contentList(discuss_seq);
	}

	@Override
	public int updateUser(String mapid, String userid, String useyn, int id) {
		return discussDAO.updateUser(mapid, userid, useyn, id);
	}

	@Override
	public List<Discuss> userList(String mapid, int page, int pageSize) {
		return discussDAO.userList(mapid, page, pageSize);
	}

	@Override
	public int userListCount(String mapid) {
		return discussDAO.userListCount(mapid);
	}

	@Override
	public List<Discuss> userSearchList(String mapid, String keyword, int page, int pageSize) {
		return discussDAO.userSearchList(mapid, keyword, page, pageSize);
	}

	@Override
	public int userSearchListCount(String mapid, String keyword) {
		return discussDAO.userSearchListCount(mapid, keyword);
	}

	@Override
	public int userMapCount(String mapid) {
		return discussDAO.userMapCount(mapid);
	}
	
	@Override
	public String leaderUserId(String mapid) {
		return discussDAO.leaderUserId(mapid);
	}
	
	@Override
	public String discussMemberYn(String mapid, int id) {
		return discussDAO.discussMemberYn(mapid, id);
	}
}
