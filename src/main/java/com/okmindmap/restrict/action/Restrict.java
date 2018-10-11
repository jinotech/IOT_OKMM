package com.okmindmap.restrict.action;

import java.util.ArrayList;
import java.util.Map;

import javax.servlet.ServletContext;

import com.okmindmap.service.helper.RestrictServiceHelper;


public abstract class Restrict {
	private int userId = -1;
	private String key = "";
	private ServletContext servletContext = null;	
	
	public Restrict(int userid, ServletContext ctx, String key){
		this.userId = userid;
		this.servletContext = ctx;
		this.key = key;
	}
	
	protected int getUserId() {
		return userId;
	}
	protected void setUserId(int userId) {
		this.userId = userId;
	}
	
	public String getPermissible() {
		Map map = executeSelectQuery("permissible");
		return (String) map.get("permissible"); 
	}
	public void setPermissible(String permissible) {
		int count = ((Long)executeSelectQuery("count(*) AS count").get("count")).intValue();
		
//		if(count == 0) {
//			insert
//		}
		
		String sql = "UPDATE mm_restrict SET permissible = ? WHERE userid = ? AND type = ? ";
		
		ArrayList<Object> params = new ArrayList<Object>();
		params.add(permissible);
		params.add(getUserId());
		params.add(getKey());
		
//		RestrictServiceHelper.getMindMapService(servletContext).executeUpdateQuery(sql, params);
	}
	
	protected String getKey() {
		return key;
	}
	protected void setKey(String key) {
		this.key = key;
	}
	
	protected ServletContext getServletContext() {
		return servletContext;
	}
	protected void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}
	
	private Map executeSelectQuery(String select) {
		String sql = "SELECT " + select + " FROM mm_restrict "
				+ "WHERE userid = ? AND type = ? ";

		ArrayList<Object> params = new ArrayList<Object>();
		params.add(getUserId());
		params.add(getKey());

		return RestrictServiceHelper.getMindMapService(servletContext).executeSelectQuery(sql, params);
	}
	
	public abstract boolean isAvailable();
	
	
	
}