package com.okmindmap.dao.mysql.spring.mapper.group;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Member;
import com.okmindmap.model.group.MemberStatus;

public class MemberRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int rownum) throws SQLException {
		
		Member member = new Member();
		member.setId(rs.getInt("id"));
		member.setGroupId(rs.getInt("groupid"));
		member.setCreated(rs.getTimestamp("created"));
		
		MemberStatus status = new MemberStatus();
		status.setId(rs.getInt("status"));
		status.setName(rs.getString("status_name"));
		status.setShortName(rs.getString("status_shortname"));
		member.setMemberStatus(status);
		
		User user = new User();
		user.setId(rs.getInt("userid"));
		user.setUsername(rs.getString("user_username"));
		user.setEmail(rs.getString("user_email"));
		user.setFirstname(rs.getString("user_firstname"));
		user.setLastname(rs.getString("user_lastname"));
		user.setPassword(rs.getString("user_password"));
		member.setUser(user);
		
		// TODO Auto-generated method stub
		return member;
	}

}
