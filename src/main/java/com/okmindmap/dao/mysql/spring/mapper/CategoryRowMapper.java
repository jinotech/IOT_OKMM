package com.okmindmap.dao.mysql.spring.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.Category;

public class CategoryRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		Category category = new Category();
		category.setId(rs.getInt("id"));
		category.setName(rs.getString("name"));
		category.setLeft(rs.getInt("lft"));
		category.setRight(rs.getInt("rgt"));
		category.setParentId(rs.getInt("parentid"));
		category.setDepth(rs.getInt("depth"));
		category.setLeaf(rs.getBoolean("is_leaf"));
		
		return category;
	}

}
