package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Cloud;

public class CloudRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Cloud cloud = new Cloud();
		
		cloud.setColor(rs.getString("color"));
		cloud.setId(rs.getInt("id"));
		cloud.setNodeId(rs.getInt("node_id"));
		
		return cloud;
	}

}
