package com.okmindmap.service;

import java.util.List;

import com.okmindmap.model.Category;

public interface CategoryService {
	/**
	 * 카테고리를 만든다.
	 * @param tableid	사용할 테이블의 id 필드 값
	 * @param parentid	부모 카테고리 아이디. 루트 카테고리일 경우 0을 입력한다.
	 * @return
	 */
	public int addCategory(String name, int parentid);
	
	/**
	 * 카테고리를 삭제한다. 
	 * @param id		카테고리 아이디
	 * @return
	 */
	public int deleteCategory(int id);
	
	/**
	 * 카테고리의 부모를 바꾼다.
	 * @param id			카테고리 아이디
	 * @param new_parentid	부모가될 카테고리 아이디
	 * @return
	 */
	public int moveCategory(int id, int new_parentid);
	
	/**
	 * 두 카테고리의 위치를 바꾼다.
	 * @param id1		카테고리 아이디
	 * @param id2		카테고리 아이디
	 * @return
	 */
	public int swapCategory(int id1, int id2);
	
	public Category getCategory(int id);
	public Category getCategory(String name);
	public List<Category> getCategoryTree(int id);
	public List<Category> getPath(int id);
	public int getDepth(int id);
}
