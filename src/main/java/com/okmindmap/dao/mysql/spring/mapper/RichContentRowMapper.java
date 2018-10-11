package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.RichContent;
import com.okmindmap.util.EscapeUnicode;

public class RichContentRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		RichContent content = new RichContent();
		
		content.setType(rs.getString("type"));
		content.setContent(EscapeUnicode.richcontent(rs.getString("content")));
		content.setId(rs.getInt("id"));
		content.setNodeId(rs.getInt("node_id"));
		
		return content;
	}

	
}
