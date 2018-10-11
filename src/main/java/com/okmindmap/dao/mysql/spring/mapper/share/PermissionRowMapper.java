package com.okmindmap.dao.mysql.spring.mapper.share;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.PermissionType;

public class PermissionRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int rownum) throws SQLException {
		Permission permission = new Permission();
		permission.setId(rs.getInt("id"));
		permission.setShareId(rs.getInt("shareid"));
		permission.setPermited(rs.getBoolean("permited"));
		
		PermissionType type = new PermissionType();
		type.setId(rs.getInt("permissiontype"));
		type.setName(rs.getString("type_name"));
		type.setShortName(rs.getString("type_shortname"));
		permission.setPermissionType(type);
		
		return permission;
	}

}
