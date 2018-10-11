package com.okmindmap.dao.mysql.spring.mapper.share;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.share.ShareType;

public class ShareTypeRowMapper  implements RowMapper {
	public Object mapRow(ResultSet rs, int rownum) throws SQLException {
		ShareType shareType = new ShareType();
		shareType.setId(rs.getInt("id"));
		shareType.setName(rs.getString("name"));
		shareType.setShortName(rs.getString("shortname"));
		
		return shareType;
	}
}
