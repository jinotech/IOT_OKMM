package com.okmindmap.dao;


import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.BoardMemo;

public interface BoardMemoDAO {
	
	public List<BoardMemo> getList(int boardId) throws DataAccessException;
	public int insert(BoardMemo memo) throws DataAccessException;
	public int update(BoardMemo memo) throws DataAccessException;
	public int delete(int memoId) throws DataAccessException;
	public BoardMemo select(int memoId) throws DataAccessException;
	
}
