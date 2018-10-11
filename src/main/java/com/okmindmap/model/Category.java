package com.okmindmap.model;

public class Category {
	private int id;
	private String name;
	private int left;
	private int right;
	private int parentId;
	private int depth;
	private boolean leaf;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getLeft() {
		return left;
	}
	public void setLeft(int left) {
		this.left = left;
	}
	public int getRight() {
		return right;
	}
	public void setRight(int right) {
		this.right = right;
	}
	public int getParentId() {
		return parentId;
	}
	public void setParentId(int parentId) {
		this.parentId = parentId;
	}
	public void setDepth(int depth) {
		this.depth = depth;
	}
	public int getDepth() {
		return depth;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	public boolean isLeaf() {
		return leaf;
	}
}
