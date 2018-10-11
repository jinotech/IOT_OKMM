package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Notice;

public class NoticeRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Notice notice = new Notice();
		
		notice.setId(rs.getInt("id"));
		notice.setTitle(rs.getString("title"));
		notice.setContent_ko(rs.getString("content_ko"));
		notice.setContent_en(rs.getString("content_en"));
		notice.setLink_ko(rs.getString("link_ko"));
		notice.setLink_en(rs.getString("link_en"));
		notice.setPriority(rs.getInt("priority"));
		notice.setHide(rs.getString("hide"));
		notice.setRegid(rs.getString("regid"));
		notice.setCreated(rs.getString("created"));
		notice.setUpdtid(rs.getString("updtid"));
		notice.setUpdated(rs.getString("updated"));
		
		return notice;
	}

}
