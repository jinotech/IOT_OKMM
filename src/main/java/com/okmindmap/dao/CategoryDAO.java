package com.okmindmap.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.Category;

public interface CategoryDAO {
	public int insertCategory(String name, int parentid) throws DataAccessException;
	public int deleteCategory(int id) throws DataAccessException;
	public int moveCategory(int id, int new_parentid) throws DataAccessException;
	public int swapCategory(int id1, int id2) throws DataAccessException;
	
	public Category getCategory(int id) throws DataAccessException;
	public Category getCategory(String name) throws DataAccessException;
	public List<Category> getCategoryTree(int id) throws DataAccessException;
	public List<Category> getCategoryTree(String talbeName, String categoryIdFied) throws DataAccessException;
	public List<Category> getCategoryTree(int id, String talbeName, String categoryIdFied) throws DataAccessException;
	
	public List<Category> getPath(int id) throws DataAccessException;
	public int getDepth(int id) throws DataAccessException;
}
