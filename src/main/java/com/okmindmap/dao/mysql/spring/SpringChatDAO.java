package com.okmindmap.dao.mysql.spring;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.SingleColumnRowMapper;

import com.okmindmap.dao.ChatDAO;
import com.okmindmap.dao.QueueDAO;
import com.okmindmap.dao.mysql.spring.mapper.ChatRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.MapRowMapper;
import com.okmindmap.model.Chat;


 

public class SpringChatDAO extends SpringDAOBase implements ChatDAO {
 
	
	
	@Override
	public void insert(int roomNumber, int userId, String userName, String message) throws DataAccessException  {
		String query = " insert into mm_chatting(roomnumber, userid, username, message, timecreated) VALUES (?,?,?,?,?)";

		long created = new Date().getTime();
		
		
		try{
		getJdbcTemplate().update(query,new Object[]{roomNumber,userId,userName, message,
				new Timestamp(created)
		});
		}catch(Exception e){e.printStackTrace();}
		
	}

	@Override
	public boolean isSaving(int roomNumber) throws DataAccessException  {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public List<Chat> getMessages(int roomNumber, int lastIdx, int amount) {
		// TODO Auto-generated method stub
		
		ArrayList params = new ArrayList();
		String sql = "SELECT * FROM mm_chatting WHERE roomnumber=? ORDER BY id DESC LIMIT 0, ? ";
		params.add(roomNumber);
		if(lastIdx > 0){
			sql = "SELECT * FROM mm_chatting WHERE roomnumber=? and id<? ORDER BY id DESC LIMIT 0, ? ";
			params.add(lastIdx);
		}
		params.add(amount);
		
		
		return getJdbcTemplate().query(sql, params.toArray(), new ChatRowMapper());
		
		
		
	}


	
	
}
