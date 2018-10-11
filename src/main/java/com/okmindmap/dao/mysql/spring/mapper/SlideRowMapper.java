package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Slide;


public class SlideRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Slide data = new Slide();
		
		data.setNodeid(rs.getString("node_id"));
		data.setX(rs.getDouble("x"));
		data.setY(rs.getDouble("y"));
		data.setScaleX(rs.getDouble("scalex"));
		data.setScaleY(rs.getDouble("scaley"));
		data.setRotate(rs.getDouble("rotate"));
		data.setShowDepths(rs.getInt("showdepths"));
		
		return data;
	}

}