package com.okmindmap.action;

/**
 * interface Action의 메소드들을 구현한다.
 * 모든 action은 이 클래스를 extends 하도록 한다.
 */

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import com.okmindmap.model.Node;


public abstract class ActionAdapter implements Action {
	private Node node = null;
	private int mapId = 0;
	
	public Node getNode() {
		return this.node;
	}
	
	public void setNode(Node node) {
		this.node = node;
	}
	
	public int getMapId() {
		return this.mapId;
	}
	
	public void setMapId(int id) {
		this.mapId = id;
	}
	
	@SuppressWarnings("rawtypes")
	public Map<String, Class> getAttributes() {
		HashMap<String, Class> attrs = new HashMap<String, Class>();
		
		Field fieldlist[] = this.getClass().getDeclaredFields();
		for (int i = 0; i < fieldlist.length; i++) {
			Field fld = fieldlist[i];
			attrs.put(fld.getName(), fld.getType());
        }
		
		return attrs;
	}
	
	public String getAttribute(String name) {
		String value = null;
		
		try {
			Field field = this.getClass().getDeclaredField(name);
			value = (String)field.get(this);
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		
		return value;
	}
}
