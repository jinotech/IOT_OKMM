package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;

public class MapRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Map map = new Map();
		map.setName(rs.getString("name"));
		map.setVersion(rs.getString("version"));
		map.setMapStyle(rs.getString("map_style"));
		map.setLazyloading(rs.getString("lazyloading"));
		map.setPt_sequence(rs.getString("pt_sequence"));
		map.setCreated(rs.getLong("created"));
		map.setId(rs.getInt("id"));
		map.setKey(rs.getString("map_key"));
		map.setShort_url(rs.getString("short_url"));
		map.setRecommend_point(rs.getInt("recommend_point"));
		
		
		try{map.setSharetype(rs.getInt("sharetype"));}catch(Exception e){}
		try{map.setEmail(rs.getString("email"));}catch(Exception e){}
		try{map.setViewcount(rs.getInt("viewcount"));}catch(Exception e){}
		try{map.setQueueing(rs.getInt("queueing"));}catch(Exception e){}
		
		
		try{
			User ownser = new User();
			ownser.setFirstname(rs.getString("firstname"));
			String lastname = rs.getString("lastname");
//			if(lastname == null) {
//				lastname = rs.getString("email");
//			}
			ownser.setLastname(lastname);
			map.setOwner(ownser);
		}catch (Exception e) {
		}
		return map;
	}

}
