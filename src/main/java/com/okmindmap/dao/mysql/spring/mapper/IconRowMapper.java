package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Icon;

public class IconRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Icon icon = new Icon();
		icon.setBuiltin(rs.getString("builtin"));
		icon.setId(rs.getInt("id"));
		icon.setNodeId(rs.getInt("node_id"));
		
		return icon;
	}

}
