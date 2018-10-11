package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Edge;

public class EdgeRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Edge edge = new Edge();
		edge.setColor(rs.getString("color"));
		edge.setId(rs.getInt("id"));
		edge.setNodeId(rs.getInt("node_id"));
		edge.setStyle(rs.getString("style"));
		edge.setWidth(rs.getString("width"));
		
		return edge;
	}

}
