package com.okmindmap.service.impl;

import com.okmindmap.dao.mysql.spring.SpringOKMindmapDAO;
import com.okmindmap.service.OKMindmapService;


public class OKMindmapServiceImpl implements OKMindmapService{
	SpringOKMindmapDAO okmindmapDAO;
	
	public SpringOKMindmapDAO getOkmindmapDAO() {
		return okmindmapDAO;
	}

	public void setOkmindmapDAO(SpringOKMindmapDAO okmindmapDAO) {
		this.okmindmapDAO = okmindmapDAO;
	}


	@Override
	public String getSetting(String key) {		
		return this.okmindmapDAO.getSetting(key);
	}
	
}
