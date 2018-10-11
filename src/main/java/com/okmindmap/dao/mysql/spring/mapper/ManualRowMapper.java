package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Notice;

public class ManualRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Notice notice = new Notice();
		
		notice.setId(rs.getInt("id"));
		notice.setTitle(rs.getString("title"));
		notice.setContent(rs.getString("content"));
		notice.setHide(rs.getString("hide"));
		notice.setRegid(rs.getString("regid"));
		notice.setCreated(rs.getString("created"));
		notice.setUpdtid(rs.getString("updtid"));
		notice.setUpdated(rs.getString("updated"));
		notice.setFilepath(rs.getString("filepath"));
		
		return notice;
	}
}
