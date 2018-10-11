package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.User;

public class UserRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		User user = new User();
		user.setAuth(rs.getString("auth"));
		user.setConfirmed(rs.getInt("confirmed"));
		user.setDeleted(rs.getInt("deleted"));
		user.setEmail(rs.getString("email"));
		user.setFirstname(rs.getString("firstname"));
		user.setLastname(rs.getString("lastname"));
		user.setId(rs.getInt("id"));
		user.setLastmap(rs.getInt("last_map"));
		
		user.setPassword(rs.getString("password"));
		user.setUsername(rs.getString("username"));
		try{
		user.setLastaccess(rs.getInt("last_access"));
		user.setCreated(rs.getString("created"));	
		user.setLast_access(rs.getString("last_access"));
		user.setRoleId(rs.getInt("roleid"));
		user.setRoleName(rs.getString("rolename"));
		user.setRoleShortName(rs.getString("roleshortname"));
		user.setSelf(rs.getString("self"));
		}catch (Exception e) {
			// TODO: handle exception
		}
		
		try{
		user.setMaptotalcnt(rs.getInt("maptotalcnt"));
		}catch (Exception e) {
		}
		
		return user;
	}

}
