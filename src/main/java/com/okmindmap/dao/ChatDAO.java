package com.okmindmap.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.Chat;



public interface ChatDAO {
	
	public void insert(int roomNumber, int userId, String userName,  String message) ;
	
	public boolean isSaving(int roomNumber);
	
	public List<Chat> getMessages(int roomNumber, int lastIdx, int amount);
}
