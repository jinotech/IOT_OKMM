package com.okmindmap.service;

import java.util.ArrayList;
import java.util.Map;

public interface RestrictService {
	@SuppressWarnings("rawtypes")
	public Map executeSelectQuery(String sql, ArrayList<Object> params);
}
