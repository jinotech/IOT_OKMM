package com.okmindmap.dao.mysql.spring;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataAccessException;

import com.okmindmap.dao.RestrictDAO;



public class SpringRestrictDAO extends SpringDAOBase implements RestrictDAO {

	@Override
	@SuppressWarnings({ "rawtypes", "unchecked" })	
	public Map executeSelectQuery(String sql, ArrayList<Object> params) {
		try {
			Map map = getJdbcTemplate().queryForMap(sql, params.toArray());
			return map;
		} catch (DataAccessException e) {
			return new HashMap();
		} catch (Exception e) {
			return new HashMap();
		}		 
	}

}
