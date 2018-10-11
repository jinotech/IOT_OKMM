package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;

public class GuestMapRowMapper implements RowMapper {

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
		try{
		map.setQueuecount(rs.getInt("queuecount"));
		}catch(Exception e){
			//	e.printStackTrace();
			}
		try{
		map.setUsernamestring(rs.getString("email"));
		}catch(Exception e){
		//	e.printStackTrace();
		}
		map.setCreated(rs.getLong("created"));
		

		User owner = new User();
		owner.setEmail(rs.getString("email"));
		owner.setPassword(rs.getString("password"));
		
		map.setOwner(owner);
		
		return map;
	}

}
