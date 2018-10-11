package com.okmindmap.dao.mysql.spring.mapper.group;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.group.Policy;

public class PolicyRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int rownum) throws SQLException {
		Policy policy = new Policy();
		policy.setId(rs.getInt("id"));
		policy.setName(rs.getString("name"));
		policy.setShortName(rs.getString("shortname"));
		
		return policy;
	}

}
