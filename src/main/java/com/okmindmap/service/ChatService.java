package com.okmindmap.service;

import java.util.ArrayList;
import java.util.List;

import com.okmindmap.model.Chat;


public interface ChatService {
	public void insert(int roomNumber, int userId, String userName,  String message) ;
	
	public boolean isSaving(int roomNumber);
	
	public List<Chat> getMessages(int roomNumber, int lastIdx, int amount);
}
