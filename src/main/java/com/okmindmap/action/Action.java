package com.okmindmap.action;

/**
 * 실시간 저장시 사용한다.
 * 클라이언트에서 오는 xml 데이터를 action 클래스로 파싱한다.
 */

import java.util.Map;

import com.okmindmap.model.Node;

public interface Action { 
	public static String NEW = "new";
	public static String EDIT = "edit";
	public static String DELETE = "delete";
	public static String MOVE = "move";
	
	/**
	 * action의 이름을 리턴한다.
	 * static으로 선언된 NEW, EDIT, DELETE, MOVE 중 하나를 리턴한다.
	 * @return
	 */
	public String getName();
	
	public Node getNode();
	public void setNode(Node node);
	
	public int getMapId();
	public void setMapId(int id);
	
	/**
	 * action에 포함되어 있는 attribute들의 이름과 class 타입을 반환한다.
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public Map<String, Class> getAttributes();
	
	/**
	 * attribute들 중에 name 에 해당하는 attribute 값을 리턴한다.
	 * name에 해당하는 attribute가 없을 경우 null을 반환한다.
	 * 
	 * @param name
	 * @return
	 */
	public String getAttribute(String name);
}
