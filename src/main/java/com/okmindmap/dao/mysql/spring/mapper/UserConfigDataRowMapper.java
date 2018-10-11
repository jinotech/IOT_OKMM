package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.UserConfigData;

public class UserConfigDataRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		UserConfigData data = new UserConfigData();
		
		data.setId(rs.getInt("id"));
		data.setUserid(rs.getInt("userid"));
		data.setFieldid(rs.getInt("fieldid"));
		data.setData(rs.getString("data"));
		data.setFieldname(rs.getString("field"));
		data.setData(rs.getString("data"));
		
		return data;
	}

}
