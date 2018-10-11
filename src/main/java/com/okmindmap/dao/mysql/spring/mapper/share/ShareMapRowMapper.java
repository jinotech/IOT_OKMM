package com.okmindmap.dao.mysql.spring.mapper.share;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.User;
import com.okmindmap.model.share.ShareMap;

public class ShareMapRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int rownum) throws SQLException {
		ShareMap map = new ShareMap();
		map.setId(rs.getInt("id"));
		map.setKey(rs.getString("map_key"));
		map.setName(rs.getString("name"));
		
		
		
		User user = new User();
		user.setId(rs.getInt("userid"));
		user.setUsername(rs.getString("username"));
		user.setFirstname(rs.getString("firstname"));
		user.setLastname(rs.getString("lastname"));
		user.setEmail(rs.getString("email"));
		map.setUser(user);
		
		return map;
	}

}
