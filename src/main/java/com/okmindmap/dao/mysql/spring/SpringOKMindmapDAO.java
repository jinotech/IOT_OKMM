package com.okmindmap.dao.mysql.spring;

import org.springframework.dao.DataAccessException;

import com.okmindmap.dao.OKMindmapDAO;

 

public class SpringOKMindmapDAO extends SpringDAOBase implements OKMindmapDAO {

	@Override
	public String getSetting(String key) throws DataAccessException {
		String sql = "SELECT setting_value FROM mm_okm_setting WHERE setting_key = ?";
		
		return (String) getJdbcTemplate().queryForObject(sql, new Object[] {key}, String.class);
	}

	
	
}
