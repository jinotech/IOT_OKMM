package com.okmindmap.dao.mysql.spring.mapper.discuss;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Discuss;

@SuppressWarnings("rawtypes")
public class DiscussUserSearchRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Discuss discuss = new Discuss();
		
		discuss.setId(rs.getInt("id"));
		discuss.setUsername(rs.getString("username"));
		discuss.setFirstname(rs.getString("firstname"));
		discuss.setEmail(rs.getString("email"));
		discuss.setMapid(rs.getString("mapid"));
		
		return discuss;
	}
}
