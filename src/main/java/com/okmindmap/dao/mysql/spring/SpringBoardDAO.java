package com.okmindmap.dao.mysql.spring;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.dao.BoardDAO;
import com.okmindmap.dao.mysql.spring.mapper.board.BoardRowMapper;
import com.okmindmap.model.Board;

public class SpringBoardDAO extends SpringDAOBase implements BoardDAO {

	@SuppressWarnings("unchecked")
	public List<Board> getList(int boardType, int page, int pageSize, String lang, int roleid) throws DataAccessException {
		if(roleid == 1){
			String sql = "SELECT * FROM mm_board where boardType = ? order by boardId desc  limit ?, ?";
			return getJdbcTemplate().query(sql, 
					new Object[]{boardType, (page-1)*pageSize, pageSize},
					new BoardRowMapper());
		}else {
			String sql = "SELECT * FROM mm_board where boardType = ? and lang = ? order by boardId desc  limit ?, ?";
			return getJdbcTemplate().query(sql, 
					new Object[]{boardType, lang, (page-1)*pageSize, pageSize},
					new BoardRowMapper());
		}
	}
	
	
	@SuppressWarnings("unchecked")
	public List<Board> getList(int boardType, String searchKey, String searchVal, int page, int pageSize, String lang, int roleid) throws DataAccessException {
		if(roleid == 1){
			String sql = "SELECT * FROM mm_board where boardType = ? and title like ? order by boardId desc  limit ?, ?";
			return getJdbcTemplate().query(sql, 
					new Object[]{boardType, "%"+searchVal+"%", (page-1)*pageSize, pageSize},
					new BoardRowMapper());
		}else{
			String sql = "SELECT * FROM mm_board where boardType = ? and lang = ? and title like ? order by boardId desc  limit ?, ?";
			return getJdbcTemplate().query(sql, 
					new Object[]{boardType, lang, "%"+searchVal+"%", (page-1)*pageSize, pageSize},
					new BoardRowMapper());
			
		}
	}
	
	
	public int insert(Board board) throws DataAccessException {
		int num = createNewID("mm_board");
		String query = " INSERT INTO mm_board (boardType, title, recom,visited, userid,content,insertdate, " +
					   " updatedate, userip, username2, userpassword, lang) VALUES (?,?,0, 0,?,?,?,?,?,?,?,?)";
		
		long created = new Date().getTime();
		getJdbcTemplate().update(query,new Object[]{
				board.getBoardType(),
				board.getTitle(),
				board.getUserId(),
				board.getContent(),
				new Timestamp(created),
				new Timestamp(created),
				board.getUserIp(),
				board.getUsername2(),
				board.getUserpassword(),
				board.getLang()
		});
		
		return num;
	}

	@Override
	public int update(Board board) throws DataAccessException {
		String sql = "UPDATE mm_board SET" +
				" title = ?," +
				" content = ?," +
				" updatedate = ? WHERE boardId = ? ";
		return getJdbcTemplate().update(sql,
				new Object[]{
				board.getTitle(),
				board.getContent(),
				new Timestamp(new Date().getTime()),
				board.getBoardId()
		});
	}

	@Override
	public int delete(int boardId) throws DataAccessException {
		String sql = "DELETE FROM mm_board " +
				"WHERE boardId = ?";
		
		return getJdbcTemplate().update(sql,
				new Object[]{
				boardId
				});
	}

	@Override
	public Board select(int boardId) throws DataAccessException {
		String sql = "SELECT * FROM mm_board WHERE boardId = ?";
		
		Board board = (Board)getJdbcTemplate().queryForObject(sql, 
				new Object[] {boardId},new BoardRowMapper());
		return (Board) board;
	}
	
	@Override
	public int getListCount(int boardType, String searchKey, String searchVal) throws DataAccessException {
		Object[] param = null;
		String sql = "SELECT count(boardId)  FROM mm_board WHERE boardType = ?";
		if(searchVal!=null && searchVal.length()>0){
			sql +="  and title like ?";
			param = new Object[] {boardType, "%"+searchVal+"%"};
		}
		else 
			param = new Object[] {boardType};
		
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql,param );
		
		return listCount;
	}
	
	
	
	
	
}
