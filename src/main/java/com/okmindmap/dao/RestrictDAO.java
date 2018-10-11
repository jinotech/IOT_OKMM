package com.okmindmap.dao;

import java.util.ArrayList;
import java.util.Map;

public interface RestrictDAO {
	@SuppressWarnings("rawtypes")
	public Map executeSelectQuery(String sql, ArrayList<Object> params);
}
