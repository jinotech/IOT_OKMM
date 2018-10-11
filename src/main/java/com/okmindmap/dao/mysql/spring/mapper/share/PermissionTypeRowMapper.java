package com.okmindmap.dao.mysql.spring.mapper.share;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.share.PermissionType;

public class PermissionTypeRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int rownum) throws SQLException {
		PermissionType type = new PermissionType();
		type.setId(rs.getInt("id"));
		type.setName(rs.getString("name"));
		type.setShortName(rs.getString("shortname"));
		return type;
	}

}
