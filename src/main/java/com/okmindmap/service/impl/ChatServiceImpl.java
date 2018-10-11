package com.okmindmap.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.okmindmap.dao.mysql.spring.SpringChatDAO;
import com.okmindmap.model.Chat;
import com.okmindmap.service.ChatService;


public class ChatServiceImpl implements ChatService{
	private SpringChatDAO chatDAO;
	
	
	


	public SpringChatDAO getChatDAO() {
		return chatDAO;
	}


	public void setChatDAO(SpringChatDAO chatDAO) {
		this.chatDAO = chatDAO;
	}




	@Override
	public void insert(int roomNumber, int userId, String userName,
			String message) {
		this.chatDAO.insert(roomNumber, userId, userName, message);
		// TODO Auto-generated method stub
		
	}


	@Override
	public boolean isSaving(int roomNumber) {
		// TODO Auto-generated method stub
		return true;
	}


	@Override
	public List<Chat> getMessages(int roomNumber, int lastIdx, int amount) {
		// TODO Auto-generated method stub
		return this.chatDAO.getMessages(roomNumber, lastIdx, amount);
	}
	
}
