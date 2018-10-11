package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Font;

public class FontRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Font font = new Font();
		font.setBold(rs.getString("bold"));
		font.setItalic(rs.getString("italic"));
		font.setName(rs.getString("name"));
		font.setSize(rs.getString("size"));
		font.setId(rs.getInt("id"));
		font.setNodeId(rs.getInt("node_id"));
		
		return font;
	}

}
