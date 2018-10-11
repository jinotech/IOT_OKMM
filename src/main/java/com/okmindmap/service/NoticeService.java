package com.okmindmap.service;

import java.util.List;

import com.okmindmap.model.Notice;
import com.okmindmap.model.User;

public interface NoticeService {

	public List<Notice> noticeList(String keyword, int page, int pageSize, String bbs_gb); 
	public int noticeListCount(String keyword, String bbs_gb);
	
	public int insertNotice(String title, String content_ko, int id, String bbs_gb);
	public int updateNotice(String nid, String title, String content_ko, String hide, int id);
	
	public Notice viewNotice(String id); 
	
	public List<Notice> manualList(String keyword, int page, int pageSize);
	

	
	public int manualListCount(String keyword);
	
	public Notice viewManual(String id); 
	
	public int insertManual(String title, String content, int id, String filepath);
	public int updateManual(String nid, String title, String content, String hide, int id);
	public int updateManual(String nid, String title, String content, String hide, int id, String filepath);
	
	public List<User> userMngList(int page, int pageSize); 
	public int userMngListCount();	
	
	/* 조동휘 메인 페이지 사용가이드*/
	public List<Notice> frontManualList();
	/*사용자가이드 페이지 ajax*/
	public List<Notice> guideMapList();
	
	
}
