package com.okmindmap.restrict.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import com.okmindmap.service.helper.RestrictServiceHelper;



public class CreateMapRestrict  extends Restrict {

	final static String key = "CreateMap";
	private int defaultMaps = 999;
	
	public CreateMapRestrict(int userid, ServletContext ctx) {
		super(userid, ctx, key);
		
		if(getDefaultMaps() != null) {
			defaultMaps = Integer.parseInt(getDefaultMaps());
		}		
	}
	@Override
	public boolean isAvailable() {
		int userMaps = -1;
		int permissibleMaps = defaultMaps;
		
		userMaps = countUserMaps();
		if(getPermissible() != null)
			permissibleMaps = Integer.parseInt(getPermissible());
		
		return (userMaps < permissibleMaps);		
	}
	
	private int countUserMaps() {
		String sql = "SELECT COUNT(m.id) AS count " + "FROM mm_map m "
				+ "JOIN mm_map_owner o ON m.id = o.mapid "
				+ "WHERE o.userid = ? ";

		ArrayList<Object> params = new ArrayList<Object>();
		params.add(getUserId());

		Map map = RestrictServiceHelper.getMindMapService(getServletContext()).executeSelectQuery(sql, params);
		int count = -1;		
		if(map.containsKey("count")) {
			count = ((Long)map.get("count")).intValue();
		}
			
		return count;
	}
	
	private String getDefaultMaps() {
		String sql = "SELECT setting_value FROM mm_okm_setting "				
				+ "WHERE setting_key = ?";
		
		ArrayList<Object> params = new ArrayList<Object>();
		params.add("create_max_map");
		
		Map map = RestrictServiceHelper.getMindMapService(getServletContext()).executeSelectQuery(sql, params);
		
		return (String) map.get("setting_value");
	}
	
}
