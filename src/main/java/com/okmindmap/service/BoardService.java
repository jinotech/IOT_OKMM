package com.okmindmap.service;

import java.util.List;

import com.okmindmap.model.Board;

public interface BoardService {
	
	public List<Board> getList(int boardType, int page, int pageSize, String currentLang, int roleid); 
	public List<Board> getList(int boardType, String searchKey, String searchVal, int page, int pageSize, String currentLang, int roleid);
	public int insert(Board board);
	public int update(Board board);
	public int delete(int boardId);
	public Board select(int boardId);
	public int getListCount(int boardType, String searchKey, String searchVal);
}
