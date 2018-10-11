package com.okmindmap.service.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.okmindmap.dao.UserMenuDAO;
import com.okmindmap.model.UserMenu;
import com.okmindmap.service.UserMenuService;

public class UserMenuServiceImpl implements UserMenuService {

	private UserMenuDAO userMenuDAO;
	
	public void setUserMenuDAO(UserMenuDAO userMenuDAO) {
		this.userMenuDAO = userMenuDAO;
	}
	
	@Override
	public List<UserMenu> getUserMenuList(String id) {
		return this.userMenuDAO.getUserMenuList(id);
	}
	
	@Override
	public List<UserMenu> getMenuList(String id) {
		return this.userMenuDAO.getMenuList(id);
	}
	
	@Override
	public void deleteUserMenu(String id) {
		this.userMenuDAO.deleteUserMenu(id);
	}
	
	@Override
	public void insertUserMenu(String checkedVals, String id) {
		this.userMenuDAO.deleteUserMenu(id);
		if(!StringUtils.isEmpty(checkedVals)){
			String[] v =  checkedVals.split(",");
			if(v != null && v.length > 0) {
				for (int j = 0; j < v.length; j++) {
					if(!StringUtils.isEmpty(v[j])) {
						this.userMenuDAO.insertUserMenu(v[j],id);	
					}	
				}
				
			}
		}
	}

	@Override
	public List<UserMenu> menuMngList() {
		return userMenuDAO.menuMngList();
	}

	@Override
	public int menuMngUseynUpdate(String seq, String useyn) {
		return userMenuDAO.menuMngUseynUpdate(seq, useyn);
	}

	@Override
	public int menuMngInsert(String name, String useyn, String imgurl, String message, String script) {
		return userMenuDAO.menuMngInsert(name, useyn, imgurl, message, script);
	}

}
