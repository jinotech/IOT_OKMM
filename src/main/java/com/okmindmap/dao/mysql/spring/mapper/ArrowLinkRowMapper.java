package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.ArrowLink;

public class ArrowLinkRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		ArrowLink link = new ArrowLink();
		
		link.setColor(rs.getString("color"));
		link.setDestination(rs.getString("destination"));
		link.setEndArrow(rs.getString("endarrow"));
		link.setEndInclination(rs.getString("endinclination"));
		link.setId(rs.getInt("id"));
		link.setIdentity(rs.getString("identity"));
		link.setNodeId(rs.getInt("node_id"));
		link.setStartArrow(rs.getString("startarrow"));
		link.setStartInclination(rs.getString("startinclination"));
		
		return link;
	}

}
