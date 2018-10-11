package com.okmindmap.dao.mysql.spring;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.okmindmap.sync.LockObjectManager;

public class SpringDAOBase {
	protected JdbcTemplate jdbcTemplate;
	@Autowired
	protected DataSource dataSource;
	protected static String TABLE_SCHEMA = null;
	
	
	public DataSource getDataSource() {
		return dataSource;
	}

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}
	
	public void setTableSchema(String schema) {
		SpringDAOBase.TABLE_SCHEMA =schema ;
	}
	
	protected JdbcTemplate getJdbcTemplate() {
		if(this.jdbcTemplate == null) {
			this.jdbcTemplate = new JdbcTemplate(getDataSource());
		}
		
		return this.jdbcTemplate;
	}
	
	
	protected int createNewID(String tableName) {
		if(SpringDAOBase.TABLE_SCHEMA == null) {
			try {
				SpringDAOBase.TABLE_SCHEMA = this.dataSource.getConnection().getCatalog();
			} catch (SQLException e) {
				SpringDAOBase.TABLE_SCHEMA = "okmindmap";
				
				e.printStackTrace();
			}
		}
		
		String query = "SELECT AUTO_INCREMENT" +
			" FROM information_schema.TABLES" +
			" WHERE TABLE_SCHEMA = '" + SpringDAOBase.TABLE_SCHEMA + "'" +
			" AND TABLE_NAME = ?";
		
		int id = -1;
		
		String key = "lock_create_table_id_" + tableName;
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			id = getJdbcTemplate().queryForInt(query, new Object[]{tableName});
		}
		LockObjectManager.getInstance().unlock(key);
		
		return id;
	}

}
