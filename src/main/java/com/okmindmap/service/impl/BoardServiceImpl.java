package com.okmindmap.service.impl;

import java.util.Arrays;
import java.util.List;

import com.okmindmap.dao.BoardDAO;
import com.okmindmap.model.Board;
import com.okmindmap.report.DateCount;
import com.okmindmap.service.BoardService;
import com.okmindmap.service.MailService;


public class BoardServiceImpl implements BoardService{
	public BoardDAO boardDAO;
	protected List<String> emails;
	private MailService mailService;
		
	public void setBoardDAO(BoardDAO boardDAO) {
		this.boardDAO = boardDAO;
	}
	
	public void setReportTo(String to) {
		this.emails =  Arrays.asList(to.split(","));
	}
	
	public void setMailService(MailService mailService) {
		this.mailService = mailService;
	}
	
	public int insert(Board board) {
		report(board);
		return this.boardDAO.insert(board);
		
	}
	public int update(Board board){
		return this.boardDAO.update(board);
		
	}

	@Override
	public int delete(int boardId) {
		Board board = this.select(boardId);
		// TODO Auto-generated method stub
		return this.boardDAO.delete(boardId);
	}

	@Override
	public Board select(int boardId) {
		// TODO Auto-generated method stub
		return this.boardDAO.select(boardId);
	}
	


	@Override
	public List<Board> getList(int boardType, int page, int pageSize, String lang, int roleid) {
		// TODO Auto-generated method stub
		return this.boardDAO.getList(boardType, page, pageSize, lang, roleid);
	}


	@Override
	public List<Board> getList(int boardType, String searchKey, String searchVal, int page, int pageSize, String lang, int roleid) {
		// TODO Auto-generated method stub
		return this.boardDAO.getList(boardType, searchKey, searchVal, page, pageSize, lang, roleid);
	}


	@Override
	public int getListCount(int boardType, String searchKey, String searchVal) {
		// TODO Auto-generated method stub
		return this.boardDAO.getListCount(boardType, searchKey, searchVal);
	}
	
	public void report(Board board) {
		StringBuffer message = new StringBuffer();
		
		message.append("이름 :  " + board.getUsername2());
		message.append("\t");
		message.append("언어 : " + board.getLang());
		message.append("\n");
		message.append("=============================================================== ");
		message.append("\n");
		message.append("제목 : " + board.getTitle());
		message.append("\n");
		message.append("=============================================================== ");
		message.append("\n");
		message.append("내용 : " + board.getContent());
		message.append("\n");
		
		this.mailService.sendMail(emails, "OKMindmap Q&A에 새로 등록된 글이 있습니다.", message.toString());
	}
	

}
