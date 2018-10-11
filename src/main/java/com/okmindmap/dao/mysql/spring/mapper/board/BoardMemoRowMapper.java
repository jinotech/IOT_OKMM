package com.okmindmap.dao.mysql.spring.mapper.board;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.BoardMemo;



public class BoardMemoRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		BoardMemo memo = new BoardMemo();
		memo.setMemoId(rs.getInt("memoId"));
		memo.setBoardId(rs.getInt("boardId"));
		memo.setContent(rs.getString("content"));
		memo.setInsertDate(rs.getDate("insertdate"));
		memo.setUserId(rs.getInt("userid"));
		memo.setUserIp(rs.getString("userip"));
		memo.setUsername2(rs.getString("username2"));
		memo.setUserpassword(rs.getString("userpassword"));

		return memo;
	}

}
