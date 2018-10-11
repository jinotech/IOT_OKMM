package com.okmindmap.service;

import java.util.List;

import com.okmindmap.model.UserMenu;

public interface UserMenuService {
	public List<UserMenu> getUserMenuList(String id);
	public List<UserMenu> getMenuList(String id);
	public void deleteUserMenu(String id);
	public void insertUserMenu(String checkedVals, String id);
	
	public List<UserMenu> menuMngList();
	public int menuMngUseynUpdate(String seq, String useyn);
	public int menuMngInsert(String name, String useyn, String imgurl, String message, String script);
}
