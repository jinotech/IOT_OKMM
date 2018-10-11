package com.okmindmap.action;

/**
 * 노드 추가 action
 * @author jinhoon
 *
 */
public class NewAction extends ActionAdapter {
	private String parent;
	private String next;
	
	public String getName() {
		return Action.NEW;
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
