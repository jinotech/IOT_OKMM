package com.okmindmap.auth;

import com.okmindmap.model.User;

public interface Auth {
	public boolean create(User user);
	public boolean update(User user);
	public boolean delete(User user);
	public boolean updatePassword();
	
	public boolean login(String username, String password);
	
	public User getUserInfo(String username);
	
	public boolean canSignup();
	public boolean canResetPassword();
}
