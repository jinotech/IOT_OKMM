package com.okmindmap.dao.mysql.spring;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.dao.BoardMemoDAO;
import com.okmindmap.dao.mysql.spring.mapper.board.BoardMemoRowMapper;
import com.okmindmap.model.BoardMemo;

public class SpringBoardMemoDAO extends SpringDAOBase implements BoardMemoDAO {

	@SuppressWarnings("unchecked")
	public List<BoardMemo> getList(int boardId) throws DataAccessException {
		String sql = "SELECT * FROM mm_board_memo where boardId = ? order by memoId desc";
		return (List<BoardMemo>)getJdbcTemplate().query(sql, 
				new Object[]{boardId},
				new BoardMemoRowMapper());
	}
	
	
	public int insert(BoardMemo memo) throws DataAccessException {
		int num = createNewID("mm_board_memo");
		String query = " INSERT INTO mm_board_memo (memoId, boardId, content, insertdate, userId, username2, userIp, userpassword) VALUES (?,?,?,?,?,?,?,?)";
		long created = new Date().getTime();
		getJdbcTemplate().update(query,new Object[]{
				num, memo.getBoardId(), memo.getContent(),new Timestamp(created),memo.getUserId(), memo.getUsername2(), memo.getUserIp(), memo.getUserpassword()});
		
		return num;
	}

	@Override
	public int update(BoardMemo memo) throws DataAccessException {
		String sql = "UPDATE mm_board_memo SET" +
				" content = ?," +
				" insertdate = ? WHERE memoId = ? ";
		return getJdbcTemplate().update(sql,
				new Object[]{
				memo.getContent(),
				new Timestamp(new Date().getTime()),
				memo.getMemoId()
		});
	}

	@Override
	public int delete(int memoId) throws DataAccessException {
		String sql = "DELETE FROM mm_board_memo " +
				"WHERE memoId = ?";
		
		return getJdbcTemplate().update(sql,
				new Object[]{
				memoId
				});
	}

	@Override
	public BoardMemo select(int memoId) throws DataAccessException {
		String sql = "SELECT * FROM mm_board_memo WHERE memoId = ?";
		 
		BoardMemo memo = (BoardMemo)getJdbcTemplate().queryForObject(sql, 
				new Object[] {memoId},new BoardMemoRowMapper());
		return memo;
	}
	
	
}
