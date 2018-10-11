package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.ForeignObject;
import com.okmindmap.util.EscapeUnicode;

public class ForeignObjectRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		ForeignObject content = new ForeignObject();
		
		content.setContent(EscapeUnicode.richcontent(rs.getString("content")));	// 어차피 richcontent와 같은 로직의 Escape한다.
		content.setId(rs.getInt("id"));
		content.setNodeId(rs.getInt("node_id"));
		content.setHeight(rs.getString("height"));
		content.setWidth(rs.getString("width"));
		
		return content;
	}

	
}
