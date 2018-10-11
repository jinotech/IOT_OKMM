package com.okmindmap.dao;

import org.springframework.dao.DataAccessException;



public interface OKMindmapDAO {
	
	public String getSetting(String key) throws DataAccessException;
	
}
