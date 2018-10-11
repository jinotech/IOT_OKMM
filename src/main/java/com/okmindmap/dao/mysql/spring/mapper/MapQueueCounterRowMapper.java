package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Map;

public class MapQueueCounterRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Map map = new Map();
		map.setName(rs.getString("name"));
		map.setVersion(rs.getString("version"));
		map.setMapStyle(rs.getString("map_style"));
		map.setLazyloading(rs.getString("lazyloading"));
		map.setPt_sequence(rs.getString("pt_sequence"));
		map.setId(rs.getInt("id"));
		map.setKey(rs.getString("map_key"));
		try{map.setQueuecount(rs.getInt("queuecount"));}catch(Exception e){}
		try{map.setUsernamestring(rs.getString("usernamestring"));}catch(Exception e){}
		map.setCreated(rs.getLong("created"));
		try{map.setRevisioncnt(rs.getInt("revisioncnt"));}catch(Exception e){}
		map.setViewcount(rs.getInt("viewcount"));
		map.setShort_url(rs.getString("short_url"));
		return map;
	}

}
