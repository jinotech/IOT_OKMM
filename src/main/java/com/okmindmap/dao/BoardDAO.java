package com.okmindmap.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.Board;

public interface BoardDAO {
	
/*	Board getBoardByBoardId(int boardId) throws DataAccessException;	
	List getBoardList() throws DataAccessException;	
	List getBoardListByUserId(String userId) throws DataAccessException;	
	List getBoardListByUserName(String userName) throws DataAccessException;
	List getBoardListByTitle(String title) throws DataAccessException;
	void insertBoard(Board board) throws DataAccessException;
	void updateBoard(Board board) throws DataAccessException;
	void deleteBoard(int boardId) throws DataAccessException;
	*/	
	
	public List<Board> getList(int boardType, int page, int pageSize, String lang, int roleid) throws DataAccessException;
	public List<Board> getList(int boardType, String searchKey, String searchVal, int page, int pageSize, String lang, int roleid) throws DataAccessException;
	public int insert(Board board) throws DataAccessException;
	public int update(Board board) throws DataAccessException;
	public int delete(int boardId) throws DataAccessException;
	public Board select(int boardId) throws DataAccessException;
	public int getListCount(int boardType, String searchKey, String searchVal) throws DataAccessException;

	

	
}
