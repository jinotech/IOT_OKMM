package com.okmindmap.dao.mysql.spring;

import com.okmindmap.dao.RepositoryDAO;
import com.okmindmap.dao.mysql.spring.mapper.RepositoryRowMapper;
import com.okmindmap.model.Repository;


public class SpringRepositoryDAO extends SpringDAOBase implements RepositoryDAO {

	@Override
	public int insertRepository(int mapid, int userid, String fileName, String path, String contentType, long fileSize) {
		String query = "INSERT INTO mm_repository (id, mapid, userid, filename, path, mime, filesize)"
				+ " VALUES (?, ?, ?, ?, ?, ?, ?)";
		int id = createNewID("mm_repository");

		getJdbcTemplate().update(
				query,
				new Object[] { id, mapid, userid, fileName, path, contentType, fileSize });

		return id;
	}
	
	@Override
	public Repository withdrawRepository(int repoid) {
		String sql =	"SELECT * " +
							"FROM mm_repository " +
							"WHERE id = ?";
		
		return (Repository)getJdbcTemplate().queryForObject(sql, new Object[] { repoid },
					new RepositoryRowMapper());
	}
	
}