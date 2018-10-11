package com.okmindmap.action;

/**
 * 노드의 부모를 바꾸는 action
 * @author jinhoon
 *
 */
public class MoveAction extends ActionAdapter {
	private String parent;
	private String next;
	
	public String getName() {
		return Action.MOVE;
	} 
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	
	public String getNext() {
		return next;
	}
	public void setNext(String next) {
		this.next = next;
	}
}
