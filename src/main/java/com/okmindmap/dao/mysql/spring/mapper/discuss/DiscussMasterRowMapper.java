package com.okmindmap.dao.mysql.spring.mapper.discuss;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Discuss;

@SuppressWarnings("rawtypes")
public class DiscussMasterRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Discuss discuss = new Discuss();
		
		discuss.setDiscuss_seq(rs.getInt("discuss_seq"));
		discuss.setTitle(rs.getString("title"));
		discuss.setViewcount(rs.getInt("viewcount"));
		discuss.setContentcount(rs.getInt("contentcount"));
		
		return discuss;
	}

}
