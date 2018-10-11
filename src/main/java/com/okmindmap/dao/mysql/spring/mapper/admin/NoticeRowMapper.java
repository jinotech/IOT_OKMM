package com.okmindmap.dao.mysql.spring.mapper.admin;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.admin.Notice;

public class NoticeRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Notice notice = new Notice();
		
		notice.setId(rs.getInt("id"));
		notice.setContent_ko(rs.getString("content_ko"));
		notice.setContent_en(rs.getString("content_en"));
		notice.setLink_ko(rs.getString("link_ko"));
		notice.setLink_en(rs.getString("link_en"));
		notice.setPriority(rs.getInt("priority"));
		notice.setCreated(rs.getString("created"));
		notice.setHide(rs.getInt("hide"));
		
		return notice;
	}

}