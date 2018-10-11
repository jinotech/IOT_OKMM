package com.okmindmap.service.impl;

import java.util.List;

import com.okmindmap.dao.mysql.spring.SpringQueueDAO;
import com.okmindmap.service.QueueService;


public class QueueServiceImpl implements QueueService{
	private SpringQueueDAO queueDAO;
	
	
	public SpringQueueDAO getQueueDAO() {
		return queueDAO;
	}


	public void setQueueDAO(SpringQueueDAO queueDAO) {
		this.queueDAO = queueDAO;
	}


	@Override
	public List<String> getQueue(String roomNumber) {
		// TODO Auto-generated method stub
		return this.queueDAO.getQueue(roomNumber);
	}


	@Override
	public void insert(String roomNumber, String textdata) {
		// TODO Auto-generated method stub
		this.queueDAO.insert(roomNumber, textdata);
	}


	@Override
	public void remove(String roomNumber) {
		// TODO Auto-generated method stub
		this.queueDAO.remove(roomNumber);
	}


	@Override
	public boolean isQueueing(String roomNumber) {
		// TODO Auto-generated method stub
		return this.queueDAO.isQueueing(roomNumber.substring(roomNumber.lastIndexOf("/")+1));
	}
	
}
