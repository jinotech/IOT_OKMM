package com.okmindmap.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;



public interface QueueDAO {
	
	public List<String> getQueue(String roomNumber) throws DataAccessException;
	
	public void remove(String roomNumber) throws DataAccessException;
	
	public void insert (String roomNumber, String textdata) throws DataAccessException;
	
	public boolean isQueueing(String roomNumber) throws DataAccessException;
}
