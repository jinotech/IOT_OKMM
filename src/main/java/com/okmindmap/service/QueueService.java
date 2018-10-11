package com.okmindmap.service;

import java.util.List;


public interface QueueService {
	public List<String> getQueue(String roomNumber);
	
	public void insert (String roomNumber, String textdata) ;
	
	public void remove(String roomNumber);
	
	public boolean isQueueing(String roomNumber);
}
