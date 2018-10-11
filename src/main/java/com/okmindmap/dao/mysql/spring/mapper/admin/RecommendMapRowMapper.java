package com.okmindmap.dao.mysql.spring.mapper.admin;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.admin.RecommendList;

public class RecommendMapRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		RecommendList recommendList = new RecommendList();
		
		recommendList.setRecommend_id(rs.getInt("recommend_id"));
		recommendList.setMap_id(rs.getString("map_id"));
		recommendList.setAdded(rs.getLong("added"));
		recommendList.setImagepath(rs.getString("imagepath"));
		
		recommendList.setName(rs.getString("name"));
		recommendList.setVersion(rs.getString("version"));
		recommendList.setMapStyle(rs.getString("map_style"));
		recommendList.setLazyloading(rs.getString("lazyloading"));
		recommendList.setPt_sequence(rs.getString("pt_sequence"));
		recommendList.setCreated(rs.getLong("created"));
		recommendList.setId(rs.getInt("id"));
		recommendList.setKey(rs.getString("map_key"));
		recommendList.setShort_url(rs.getString("short_url"));
		recommendList.setRecommend_point(rs.getInt("recommend_point"));
		
		return recommendList;
	}

}