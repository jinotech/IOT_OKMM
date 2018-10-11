package com.okmindmap.dao.mysql.spring.mapper.discuss;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Discuss;

@SuppressWarnings("rawtypes")
public class DiscussContentRowMapper implements RowMapper{

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Discuss discuss = new Discuss();
		
		discuss.setDiscuss_content_seq(rs.getInt("discuss_content_seq"));
		discuss.setDiscuss_seq(rs.getInt("discuss_seq"));
		discuss.setContent(rs.getString("content"));
		discuss.setCreated(rs.getString("created"));
		discuss.setFirstname(rs.getString("firstname"));
		
		return discuss;
	}

}
