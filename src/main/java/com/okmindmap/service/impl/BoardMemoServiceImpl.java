package com.okmindmap.service.impl;

import java.util.List;

import com.okmindmap.dao.BoardMemoDAO;
import com.okmindmap.model.BoardMemo;
import com.okmindmap.service.BoardMemoService;


public class BoardMemoServiceImpl implements BoardMemoService{
	public BoardMemoDAO boardMemoDAO;
	
	
	
	public BoardMemoDAO getBoardMemoDAO() {
		return boardMemoDAO;
	}

	public void setBoardMemoDAO(BoardMemoDAO boardMemoDAO) {
		this.boardMemoDAO = boardMemoDAO;
	}

	@Override
	public List<BoardMemo> getList(int boardId) {
		// TODO Auto-generated method stub
		return this.boardMemoDAO.getList(boardId);
	}

	@Override
	public int insert(BoardMemo memo) {
		// TODO Auto-generated method stub
		return this.boardMemoDAO.insert(memo);
	}

	@Override
	public int update(BoardMemo memo) {
		// TODO Auto-generated method stub
		return this.boardMemoDAO.update(memo);
	}

	@Override
	public int delete(int memoId) {
		// TODO Auto-generated method stub
		return this.boardMemoDAO.delete(memoId);
	}

	@Override
	public BoardMemo select(int memoId) {
		// TODO Auto-generated method stub
		return this.boardMemoDAO.select(memoId);
	}
	

}
