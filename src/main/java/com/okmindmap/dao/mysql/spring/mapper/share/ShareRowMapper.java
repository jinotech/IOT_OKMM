package com.okmindmap.dao.mysql.spring.mapper.share;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.User;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareType;

public class ShareRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int rownum) throws SQLException {
		Share share = new Share();
		try{share.setId(rs.getInt("id"));}catch (Exception e) {}
		try{share.setPassword(rs.getString("password"));}catch (Exception e) {}
		
		ShareMap map = new ShareMap();
		map.setId(rs.getInt("map_id"));
		map.setName(rs.getString("map_name"));
		map.setKey(rs.getString("map_key"));
		
		User user = new User();
		user.setId(rs.getInt("user_id"));
		user.setUsername(rs.getString("user_username"));
		user.setEmail(rs.getString("user_email"));
		user.setFirstname(rs.getString("user_firstname"));
		user.setLastname(rs.getString("user_lastname"));
		map.setUser(user);
		
		share.setMap(map);
		
		Group group = new Group();
		try{group.setId(rs.getInt("group_id"));}catch (Exception e) {}
		try{group.setName(rs.getString("group_name"));}catch (Exception e) {}
		share.setGroup(group);
		
		ShareType shareType = new ShareType();
		try{shareType.setId(rs.getInt("sharetype"));}catch (Exception e) {}
		try{shareType.setName(rs.getString("type_name"));}catch (Exception e) {}
		try{shareType.setShortName(rs.getString("type_shortname"));}catch (Exception e) {}
		share.setShareType(shareType);
		
		return share;
	}

}
