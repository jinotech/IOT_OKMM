package com.okmindmap.service.impl;

import java.util.List;

import com.okmindmap.dao.NoticeDAO;
import com.okmindmap.model.Notice;
import com.okmindmap.model.User;
import com.okmindmap.service.NoticeService;

public class NoticeServiceImpl implements NoticeService {

	private NoticeDAO noticeDAO;
	
	public void setNoticeDAO(NoticeDAO noticeDAO) {
		this.noticeDAO = noticeDAO;
	}

	@Override
	public List<Notice> noticeList(String keyword, int page, int pageSize, String bbs_gb) {
		return noticeDAO.noticeList(keyword, page, pageSize, bbs_gb);
	}

	@Override
	public int noticeListCount(String keyword, String bbs_gb) {
		return noticeDAO.noticeListCount(keyword, bbs_gb);
	}

	@Override
	public int insertNotice(String title, String content_ko, int id, String bbs_gb) {
		return noticeDAO.insertNotice(title, content_ko, id, bbs_gb);
	}

	@Override
	public Notice viewNotice(String id) {
		return noticeDAO.viewNotice(id);
	}

	@Override
	public int updateNotice(String nid, String title, String content_ko, String hide, int id) {
		return noticeDAO.updateNotice(nid, title, content_ko, hide, id);
	}

	@Override
	public List<Notice> manualList(String keyword, int page, int pageSize) {
		return noticeDAO.manualList(keyword, page, pageSize);
	}

	@Override
	public int manualListCount(String keyword) {
		return noticeDAO.manualListCount(keyword);
	}

	@Override
	public Notice viewManual(String id) {
		return noticeDAO.viewManual(id);
	}
	
	@Override
	public int insertManual(String title, String content_ko, int id, String filepath) {
		return noticeDAO.insertManual(title, content_ko, id, filepath);
	}
	
	@Override
	public int updateManual(String nid, String title, String content, String hide, int id) {
		return noticeDAO.updateManual(nid, title, content, hide, id);
	}

	@Override
	public int updateManual(String nid, String title, String content, String hide, int id, String filepath) {
		return noticeDAO.updateManual(nid, title, content, hide, id, filepath);
	}
	
	@Override
	public List<User> userMngList(int page, int pageSize) {
		return noticeDAO.userMngList(page, pageSize);
	}

	@Override
	public int userMngListCount() {
		return noticeDAO.userMngListCount();
	}
	
	/* 메인 페이지 사용가이드*/
	@Override
	public List<Notice> frontManualList() {
		return noticeDAO.frontManualList();
	}

	@Override
	public List<Notice> guideMapList() {
		return noticeDAO.guideMaplList();
	}
	
}
