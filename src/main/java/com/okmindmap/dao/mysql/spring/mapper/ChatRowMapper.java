package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Chat;
import com.okmindmap.model.Map;
import com.okmindmap.model.User;

public class ChatRowMapper implements RowMapper {

	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Chat chat = new Chat();
		chat.setId(rs.getInt("id"));
		chat.setRoomnumber(rs.getInt("roomnumber"));
		chat.setUserid(rs.getInt("userid"));
		chat.setUsername(rs.getString("username"));
		chat.setMessage(rs.getString("message"));
		chat.setTimecreated(rs.getString("timecreated"));
		
		return chat;
	}

}
