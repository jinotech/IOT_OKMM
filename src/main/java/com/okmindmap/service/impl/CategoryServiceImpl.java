package com.okmindmap.service.impl;

import java.util.List;

import com.okmindmap.dao.CategoryDAO;
import com.okmindmap.model.Category;
import com.okmindmap.service.CategoryService;

public class CategoryServiceImpl implements CategoryService {
	private CategoryDAO categoryDAO;
	
	
	public CategoryDAO getCategoryDAO() {
		return categoryDAO;
	}

	public void setCategoryDAO(CategoryDAO categoryDAO) {
		this.categoryDAO = categoryDAO;
	}

	
	@Override
	public int addCategory(String name, int parentId) {
		return this.addCategory(name, parentId);
	}

	@Override
	public int deleteCategory(int id) {
		return this.deleteCategory(id);
	}

	@Override
	public Category getCategory(int id) {
		return this.categoryDAO.getCategory(id);
	}

	@Override
	public Category getCategory(String name) {
		return this.categoryDAO.getCategory(name);
	}

	@Override
	public List<Category> getCategoryTree(int id) {
		return this.categoryDAO.getCategoryTree(id);
	}

	@Override
	public int getDepth(int id) {
		return this.categoryDAO.getDepth(id);
	}

	@Override
	public List<Category> getPath(int id) {
		return this.categoryDAO.getPath(id);
	}

	@Override
	public int moveCategory(int id, int newParentid) {
		return this.categoryDAO.moveCategory(id, newParentid);
	}

	@Override
	public int swapCategory(int id1, int id2) {
		return this.categoryDAO.swapCategory(id1, id2);
	}

}
