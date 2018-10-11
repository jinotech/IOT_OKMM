package com.okmindmap.dao.mysql.spring.mapper.group;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Category;
import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.group.Policy;

public class GroupRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Group group = new Group();
		group.setId(rs.getInt("id"));
		group.setName(rs.getString("name"));
		group.setSummary(rs.getString("summary"));
		group.setCreated(rs.getTimestamp("created"));
		group.setModified(rs.getTimestamp("modified"));
		group.setPassword(rs.getString("password"));
		
		Policy policy = new Policy();
		policy.setId(rs.getInt("policy"));
		policy.setName(rs.getString("policy_name"));
		policy.setShortName(rs.getString("policy_shortname"));
		group.setPolicy(policy);
		
		Category category = new Category();
		category.setId(rs.getInt("categoryid"));
		category.setName(rs.getString("category_name"));
		category.setLeft(rs.getInt("category_lft"));
		category.setRight(rs.getInt("category_rgt"));
		category.setParentId(rs.getInt("category_parentid"));
		category.setDepth(rs.getInt("category_depty"));
		category.setLeaf(rs.getBoolean("category_is_leaf"));
		group.setCategory(category);
		
		User user = new User();
		user.setId(rs.getInt("userid"));
		user.setUsername(rs.getString("user_username"));
		user.setEmail(rs.getString("user_email"));
		user.setFirstname(rs.getString("user_firstname"));
		user.setLastname(rs.getString("user_lastname"));
		user.setPassword(rs.getString("user_password"));
		group.setUser(user);
		
		return group;
	}

}
