package com.okmindmap.dao.mysql.spring.mapper.group;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.group.MemberStatus;

public class MemberStatusRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int rownum) throws SQLException {
		MemberStatus status = new MemberStatus();
		status.setId(rs.getInt("id"));
		status.setName(rs.getString("name"));
		status.setShortName(rs.getString("shortname"));
		return status;
	}

}
