package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Attribute;

public class AttributeRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Attribute attr = new Attribute();
		attr.setId(rs.getInt("id"));
		attr.setName(rs.getString("name"));
		attr.setNodeId(rs.getInt("node_id"));
		attr.setValue(rs.getString("value"));
		
		return attr;
	}

}
