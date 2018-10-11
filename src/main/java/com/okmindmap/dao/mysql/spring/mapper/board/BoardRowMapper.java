package com.okmindmap.dao.mysql.spring.mapper.board;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Board;



public class BoardRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Board board = new Board();
		board.setBoardId(rs.getInt("boardId"));
		
		board.setTitle(rs.getString("title"));
		board.setRecom(rs.getInt("recom"));
		board.setInsertDate(rs.getDate("insertdate"));
		board.setContent(rs.getString("content"));
		board.setUserId(rs.getInt("userid"));
		board.setUsername2(rs.getString("username2"));
		board.setUserpassword(rs.getString("userpassword"));
		board.setUserIp(rs.getString("userip"));
		board.setLang(rs.getString("lang"));
		return board;
	}

}
