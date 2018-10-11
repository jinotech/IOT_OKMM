package com.okmindmap.dao;

import com.okmindmap.model.Repository;

public interface RepositoryDAO {
	
	public int insertRepository(int mapid, int userid, String fileName, String path, String contentType, long fileSize);
	public Repository withdrawRepository(int repoid);
	
}