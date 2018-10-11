package com.okmindmap.dao.mysql.spring;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.dao.CategoryDAO;
import com.okmindmap.dao.mysql.spring.mapper.CategoryRowMapper;
import com.okmindmap.model.Category;

public class SpringCategoryDAO extends SpringDAOBase implements CategoryDAO {

	@Override
	public int deleteCategory(int id)
			throws DataAccessException {
		String sql = "SELECT mm_categories__delete(?)";
		
		return getJdbcTemplate().queryForInt(sql, new Object[]{id});
	}

	@Override
	public Category getCategory(int id) throws DataAccessException {
		String sql = "SELECT node.* " +
				"FROM mm_categories_view AS node " +
				"WHERE node.id = ? ";
		
		return (Category) getJdbcTemplate().queryForObject(sql,
				new Object[]{id},
				new CategoryRowMapper());
	}
	
	public Category getCategory(String name) throws DataAccessException {
		String sql = "SELECT node.* " +
				"FROM mm_categories_view AS node " +
				"WHERE node.name = ? ";
		
		return (Category) getJdbcTemplate().queryForObject(sql,
				new Object[]{name},
				new CategoryRowMapper());
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Category> getCategoryTree(int id)
			throws DataAccessException {
		String sql = 
		"SELECT node.id, node.name, node.lft, node.rgt, node.parentid, node.depth, node.is_leaf " +
		"FROM mm_categories_view AS node, " +
		"	mm_categories AS parent, " +
		"	mm_categories AS sub_parent, " +
		"	( " +
		"		SELECT node.id, (COUNT(parent.id) - 1) AS depth " +
		"		FROM mm_categories AS node, " +
		"		mm_categories AS parent " +
		"		WHERE node.lft BETWEEN parent.lft AND parent.rgt " +
		"		AND node.id = ? " +
		"		GROUP BY node.id " +
		"		ORDER BY node.lft " +
		"	)AS sub_tree " +
		"WHERE node.lft BETWEEN parent.lft AND parent.rgt " +
		"	AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt " +
		"	AND sub_parent.id = sub_tree.id " +
		"GROUP BY node.id " +
		"ORDER BY node.lft";
		
		return getJdbcTemplate().query(sql, new Object[]{id}, new CategoryRowMapper());
	}
	
	public List<Category> getCategoryTree(String talbeName, String categoryIdFied)
			throws DataAccessException {
		return this.getCategoryTree(1, talbeName, categoryIdFied);
	}
	
	@SuppressWarnings("unchecked")
	public List<Category> getCategoryTree(int id, String talbeName, String categoryIdFied)
			throws DataAccessException {
		String sql = 
			"SELECT node.id, node.name, node.lft, node.rgt, node.parentid, (COUNT(parent.name) - (sub_tree.depth + 1)) AS depth " +
			"FROM mm_categories AS node, " +
			"	mm_categories AS parent, " +
			"	mm_categories AS sub_parent, " +
			"	( " +
			"		SELECT node.id, (COUNT(parent.id) - 1) AS depth " +
			"		FROM mm_categories AS node, " +
			"		mm_categories AS parent " +
			"		WHERE node.lft BETWEEN parent.lft AND parent.rgt " +
			"		AND node.id = ? " +
			"		GROUP BY node.id " +
			"		ORDER BY node.lft " +
			"	)AS sub_tree, " +
			"   " + talbeName + " AS t " +
			"WHERE node.lft BETWEEN parent.lft AND parent.rgt " +
			"	AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt " +
			"	AND sub_parent.id = sub_tree.id " +
			"	AND t." + categoryIdFied + " = node.id " +
			"GROUP BY node.id " +
			"ORDER BY node.lft";
			
		return getJdbcTemplate().query(sql, new Object[]{id}, new CategoryRowMapper());
	}

	@Override
	public int insertCategory(String name, int parentid)
			throws DataAccessException {
		String sql = "SELECT mm_categories__new(?, ?, ?)";
		int id = createNewID("mm_categories");
		
		return getJdbcTemplate().queryForInt(sql, new Object[]{id, name, parentid});
	}

	@Override
	public int moveCategory(int id, int newParentId)
			throws DataAccessException {
		String sql = "SELECT mm_categories__move(?, ?)";
		
		return getJdbcTemplate().queryForInt(sql, new Object[]{id, newParentId});
	}

	@Override
	public int swapCategory(int id1, int id2)
			throws DataAccessException {
		String sql = "SELECT mm_categories__swap(?, ?)";
		
		return getJdbcTemplate().queryForInt(sql, new Object[]{id1, id2});
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Category> getPath(int id)
			throws DataAccessException {
		
		String sql = /*"SELECT parent.* " +
				"FROM mm_categories AS node, mm_categories AS parent " +
				"WHERE node.lft BETWEEN parent.lft AND parent.rgt " +
				"  AND node.id = ? " +
				"ORDER BY parent.lft";*/
		"SELECT parent.*, sub_tree.depth AS depth " +
		"FROM mm_categories AS node, " +
		"        mm_categories AS parent, " +
		"        ( " +
		"                SELECT node.id, (COUNT(parent.id) - 1) AS depth " +
		"                FROM mm_categories AS node, " +
		"                mm_categories AS parent " +
		"                WHERE node.lft BETWEEN parent.lft AND parent.rgt " +
		"                GROUP BY node.id " +
		"                ORDER BY node.lft " +
		"        ) AS sub_tree " +
		"WHERE node.lft BETWEEN parent.lft AND parent.rgt " +
		"  AND parent.id = sub_tree.id " +
		"  AND node.id = ? " +
		"GROUP BY parent.id " +
		"ORDER BY parent.lft";
		
		return getJdbcTemplate().query(sql,
				new Object[]{id},
				new CategoryRowMapper());
	}
	
	public int getDepth(int id)
			throws DataAccessException {
		
		String sql = "SELECT d.depth FROM ( " +
				"		SELECT node.id, (COUNT(parent.id) - 1) AS depth" +
				"		FROM mm_categories AS node, mm_categories AS parent" +
				"		WHERE node.lft BETWEEN parent.lft AND parent.rgt" +
				"		GROUP BY node.id ) AS d " +
				"WHERE d.id = ?";
		
		return getJdbcTemplate().queryForInt(sql, new Object[]{id});
	}

	
}
