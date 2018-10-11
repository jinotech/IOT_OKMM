package com.okmindmap.dao.mysql.spring;

import java.util.List;

import com.okmindmap.dao.UserMenuDAO;
import com.okmindmap.dao.mysql.spring.mapper.menu.MenuMngRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.menu.UserMenuRowMapper;
import com.okmindmap.model.UserMenu;

public class SpringUserMenuDAO  extends SpringDAOBase implements UserMenuDAO {

	@Override
	@SuppressWarnings("unchecked")
	public List<UserMenu> getUserMenuList(String id) {
		String query =	"SELECT b.*, a.id FROM mm_menu_user a INNER JOIN mm_menu b ON a.seq = b.seq and b.useyn = 'Y' WHERE a.id = '"+ id + "' ORDER BY b.bgroup, b.order_num";
		return getJdbcTemplate().query(query,new UserMenuRowMapper());
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<UserMenu> getMenuList(String id) {
		String query =	"SELECT a.*, b.id FROM mm_menu a left outer join mm_menu_user b on a.seq = b.seq and b.id = '"+id+"' where a.useyn='Y' ORDER BY a.bgroup, a.mgroup, a.order_num";
		return getJdbcTemplate().query(query,new UserMenuRowMapper());
	}
	
	@Override
	public void deleteUserMenu(String id) {
		String query =	"delete FROM mm_menu_user where id = '"+id+"'";
		getJdbcTemplate().update(query);
	}
	
	@Override
	public void insertUserMenu(String seq, String id) {
		String query =	"insert into mm_menu_user (seq, id) values ('"+seq+"' , '"+id+"')";
		getJdbcTemplate().update(query);
	}

	@Override
	public List<UserMenu> menuMngList() {
		String query =	"SELECT * FROM mm_menu ORDER BY seq ";
		return getJdbcTemplate().query(query,new MenuMngRowMapper());
	}

	@Override
	public int menuMngUseynUpdate(String seq, String useyn) {
		String query =	"update mm_menu set useyn = '"+useyn+"' where seq = '"+seq+"' ";
		return getJdbcTemplate().update(query);
	}

	@Override
	public int menuMngInsert(String name, String useyn, String imgurl, String message, String script) {
		String query =	"insert into mm_menu (name, useyn, imgurl, message, script) values ('"+name+"' , '"+useyn+"' , '"+imgurl+"' , '"+message+"' , '"+script+"')";
		return getJdbcTemplate().update(query);
	}

}
