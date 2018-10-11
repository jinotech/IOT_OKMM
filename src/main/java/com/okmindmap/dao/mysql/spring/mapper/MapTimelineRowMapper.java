package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.MapTimeline;

public class MapTimelineRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {

		MapTimeline timeline = new MapTimeline();
		timeline.setId(rs.getLong("id"));
		timeline.setMapId(rs.getInt("map_id"));
		timeline.setXml(rs.getString("xml"));
		timeline.setSaved(rs.getLong("saved"));
		
		return timeline;
	}

}
