package com.okmindmap.dao.mysql.spring;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.SingleColumnRowMapper;

import com.okmindmap.dao.QueueDAO;


 

public class SpringQueueDAO extends SpringDAOBase implements QueueDAO {
 
	@SuppressWarnings("unchecked")
	@Override
	public List<String> getQueue(String roomNumber)	throws DataAccessException {
		String sql = "SELECT textdata FROM mm_queuedata WHERE roomnumber = ? order by created asc";
		return getJdbcTemplate().query(sql, new Object[] { roomNumber.substring(roomNumber.lastIndexOf("/")+1) }, new SingleColumnRowMapper(String.class));
		
	}

	@Override
	public void insert(String roomNumber, String textdata)	throws DataAccessException {
		String query = " insert into mm_queuedata(roomnumber, textdata, created) VALUES (?,?,?)";

		long created = new Date().getTime();
		getJdbcTemplate().update(query,new Object[]{
			roomNumber.substring(roomNumber.lastIndexOf("/")+1),
			textdata,
			new Timestamp(created)
		});

		
	}
	
	
	@Override
	public void remove(String roomNumber) throws DataAccessException {
		String sql = "DELETE FROM mm_queuedata WHERE roomnumber = ?";
		getJdbcTemplate().update(sql, new Object[] { (roomNumber.substring(roomNumber.lastIndexOf("/")+1)) });
	}

	@Override
	public boolean isQueueing(String roomNumber) throws DataAccessException {
		// TODO Auto-generated method stub
		
		String sql = "SELECT queueing FROM mm_map WHERE map_key=?";
		
		int queue = getJdbcTemplate().queryForInt(sql, new Object[] {roomNumber});
		
		return queue>0;
	}


	
	
}
