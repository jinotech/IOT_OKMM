package com.okmindmap.dao.mysql.spring.mapper.menu;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.okmindmap.model.UserMenu;

public class MenuMngRowMapper implements RowMapper {

	@Override
	public Object mapRow(ResultSet rs, int arg1) throws SQLException {
		UserMenu menu = new UserMenu();
		menu.setSeq(rs.getInt("seq"));
		menu.setName(rs.getString("name"));
		menu.setBgroup(rs.getString("bgroup"));
		menu.setBgroup_name(rs.getString("bgroup_name"));
		menu.setMgroup(rs.getString("mgroup"));
		menu.setMgroup_name(rs.getString("mgroup_name"));
		menu.setOrder_num(rs.getString("order_num"));
		menu.setUseyn(rs.getString("useyn"));
		menu.setImgurl(rs.getString("imgurl"));
		menu.setMessage(rs.getString("message"));
		menu.setScript(rs.getString("script"));
		return menu;
	}
}
