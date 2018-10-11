package com.okmindmap.service;

import java.util.List;

import com.okmindmap.model.BoardMemo;

public interface BoardMemoService {
	public List<BoardMemo> getList(int boardId); 
	
	public int insert(BoardMemo memo);
	public int update(BoardMemo memo);
	public int delete(int memoId);
	public BoardMemo select(int memoId);
	
}
