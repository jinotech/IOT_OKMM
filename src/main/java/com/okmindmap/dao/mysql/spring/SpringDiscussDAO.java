package com.okmindmap.dao.mysql.spring;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.util.StringUtils;

import com.okmindmap.dao.DiscussDAO;
import com.okmindmap.dao.mysql.spring.mapper.discuss.DiscussContentRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.discuss.DiscussMasterRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.discuss.DiscussUserRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.discuss.DiscussUserSearchRowMapper;
import com.okmindmap.model.Discuss;

public class SpringDiscussDAO  extends SpringDAOBase implements DiscussDAO {

	@Override
	public int insertMaster(String title, int id) {
		
		long created = new Date().getTime();
		
		final String query = "insert into mm_discuss_master (title, useyn, regid, created, updtid, updated) values ('"+title+"' , 'Y' , '"+id+"' , '"+ created +"' , '"+id+"' , '"+ created +"')";
		
		GeneratedKeyHolder holder = new GeneratedKeyHolder();
		getJdbcTemplate().update(new PreparedStatementCreator() {
		    @Override
		    public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
		        PreparedStatement statement = con.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
		        return statement;
		    }
		}, holder);

		long primaryKey = holder.getKey().longValue();
		
		return (int) primaryKey;
	}

	@Override
	public int insertContent(String discuss_seq, String content, int id) {
		
		long created = new Date().getTime();
		
		String query =	"insert into mm_discuss_content (discuss_seq, content, useyn, regid, created, updtid, updated) values ('"+discuss_seq+"' , '"+content+"' , 'Y' , '"+id+"' , '"+ created +"' , '"+id+"' , '"+ created +"')";
		return getJdbcTemplate().update(query);
		
	}
	
	@Override
	public int insertMap(String discuss_seq, String mapid, int id) {
		
		String query =	"insert into mm_discuss_map (discuss_seq, mapid) values ('"+discuss_seq+"' , '"+mapid+"' ) ";
		return getJdbcTemplate().update(query);
		
	}
	
	@Override
	public int insertUser(String discuss_seq, String userid, String leaderyn, int id) {
		
		long created = new Date().getTime();
		
		String query =	"insert into mm_discuss_user (discuss_seq, id, leaderyn, useyn, regid, created, updtid, updated) values ('"+discuss_seq+"' , '"+userid+"' , '"+leaderyn+"' , 'Y' , '"+id+"' , '"+ created +"' , '"+id+"' , '"+ created +"') ";
		return getJdbcTemplate().update(query);
		
	}

	@Override
	public int insertMapUser(String mapid, String userid, String leaderyn, int id) {
		
		long created = new Date().getTime();
		
		String query =	"insert into mm_discuss_map_user (mapid, id, leaderyn, useyn, regid, created, updtid, updated) values ('"+mapid+"' , '"+userid+"' , '"+leaderyn+"' , 'Y' , '"+id+"' , '"+ created +"' , '"+id+"' , '"+ created +"') ";
		return getJdbcTemplate().update(query);
		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Discuss> masterList(int id, String keyword, int page, int pageSize, String mapid) {
		String sql = "SELECT a.*, IFNULL((SELECT COUNT(*) FROM mm_discuss_content WHERE discuss_seq = a.discuss_seq GROUP BY discuss_seq ),0) AS contentcount FROM mm_discuss_master a WHERE a.discuss_seq IN( SELECT a.discuss_seq FROM mm_discuss_map a where a.mapid = '"+mapid+"' ) and useyn  = 'Y' order by created desc limit "+(page-1)*pageSize+", "+pageSize+"";
		
		if(!StringUtils.isEmpty(keyword)) {
			sql = "SELECT a.*, IFNULL((SELECT COUNT(*) FROM mm_discuss_content WHERE discuss_seq = a.discuss_seq GROUP BY discuss_seq ),0) AS contentcount FROM mm_discuss_master a WHERE a.discuss_seq IN( SELECT a.discuss_seq FROM mm_discuss_map a WHERE a.mapid = '"+mapid+"' ) and useyn  = 'Y' and title like '%"+keyword+"%' order by created desc limit "+(page-1)*pageSize+", "+pageSize+"";
		}
		
		return getJdbcTemplate().query(sql, new DiscussMasterRowMapper());
	}

	@SuppressWarnings("deprecation")
	@Override
	public int masterListCount(int id, String keyword , String mapid) {
		String sql = "SELECT count(discuss_seq) FROM mm_discuss_master WHERE discuss_seq IN( SELECT a.discuss_seq FROM mm_discuss_map a where a.mapid = '"+mapid+"' ) and useyn  = 'Y'";
		
		if(!StringUtils.isEmpty(keyword)) {
			sql = "SELECT count(discuss_seq) FROM mm_discuss_master WHERE discuss_seq IN( SELECT a.discuss_seq FROM mm_discuss_map a where a.mapid = '"+mapid+"' ) and useyn  = 'Y' and title like '%"+keyword+"%' ";
		}
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		
		return listCount;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Discuss> contentList(String discuss_seq) {
		String sql = "SELECT a.discuss_content_seq, a.discuss_seq, a.content, FROM_UNIXTIME(a.created/1000, '%Y-%m-%d') AS created, b.firstname FROM mm_discuss_content a inner join mm_user b on a.regid = b.id WHERE a.discuss_seq = '"+discuss_seq+"' and a.useyn  = 'Y' order by a.created desc";
		return getJdbcTemplate().query(sql, new DiscussContentRowMapper());
	}

	@Override
	public int updateUser(String mapid, String userid, String useyn, int id) {
		
		long created = new Date().getTime();
		
		String query =	"update mm_discuss_map_user set useyn = '"+useyn+"', updtid = '"+id+"' , updated = '"+created+"' where mapid='"+mapid+"' and id='"+userid+"' ";
		return getJdbcTemplate().update(query);
	}

	@Override
	public int updateMapUser(String mapid, String userid, String useyn, int id) {
		
		long created = new Date().getTime();
		
		String query =	"update mm_discuss_map_user set useyn = '"+useyn+"', updtid = '"+id+"' , updated = '"+created+"' where mapid='"+mapid+"' and id='"+userid+"' ";
		return getJdbcTemplate().update(query);
	}
	
	@SuppressWarnings("deprecation")
	@Override
	public int userCount(String discuss_seq, String userid) {
		String sql = "SELECT count(discuss_seq) FROM mm_discuss_user WHERE discuss_seq = '"+discuss_seq+"' AND id = '"+userid+"' ";
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		return listCount;
	}

	@SuppressWarnings("deprecation")
	@Override
	public int userMapCount(String mapid) {
		String sql = "SELECT count(mapid) FROM mm_discuss_map_user WHERE mapid = '"+mapid+"' and useyn = 'Y' ";
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		return listCount;
	}
	
	@SuppressWarnings("deprecation")
	@Override
	public int userMapCount(String mapid, String userid) {
		String sql = "SELECT count(mapid) FROM mm_discuss_map_user WHERE mapid = '"+mapid+"' and id = '"+userid+"' ";
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		return listCount;
	}
	
	@SuppressWarnings("deprecation")
	@Override
	public int userMapCount(String mapid, String userid, String email) {
		String sql = "SELECT count(mapid) FROM mm_discuss_map_user WHERE mapid = '"+mapid+"' and id = (select id from mm_user where email = '"+email+"') ";
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		return listCount;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Discuss> userList(String mapid, int page, int pageSize) {
		String sql = "SELECT a.id, b.firstname, b.email, a.leaderyn FROM mm_discuss_map_user a inner join mm_user b on a.id = b.id WHERE a.mapid = '"+mapid+"' and a.useyn  = 'Y' order by a.created desc";
		return getJdbcTemplate().query(sql, new DiscussUserRowMapper());
	}

	@SuppressWarnings("deprecation")
	@Override
	public int userListCount(String mapid) {
		String sql = "SELECT count(a.mapid) FROM mm_discuss_map_user a inner join mm_user b on a.id = b.id WHERE a.mapid = '"+mapid+"' and a.useyn  = 'Y' ";
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		return listCount;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Discuss> userSearchList(String mapid, String keyword, int page, int pageSize) {
		String sql = "SELECT a.id, a.username, a.firstname, a.email, b.mapid FROM mm_user a left outer join mm_discuss_map_user b on a.id = b.id and b.useyn = 'Y' WHERE ( a.username like '%"+keyword+"%' or a.email like '%"+keyword+"%' ) and a.id != (SELECT id FROM mm_discuss_map_user WHERE mapid='"+mapid+"' AND leaderyn = 'Y' ) order by a.username desc";
		return getJdbcTemplate().query(sql, new DiscussUserSearchRowMapper());
	}

	@SuppressWarnings("deprecation")
	@Override
	public int userSearchListCount(String mapid, String keyword) {
		String sql = "SELECT count(a.id) FROM mm_user a left outer join mm_discuss_map_user b on a.id = b.id and b.useyn = 'Y' WHERE ( a.username like '%"+keyword+"%' or a.email like '%"+keyword+"%' ) and a.id != (SELECT id FROM mm_discuss_map_user WHERE mapid='"+mapid+"' AND leaderyn = 'Y' ) ";
		int listCount = (Integer)getJdbcTemplate().queryForInt(sql);
		return listCount;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public String getUserId(String email) {
		String sql = "SELECT id FROM mm_user WHERE email = '"+email+"' ";
		try {
			Map map = getJdbcTemplate().queryForMap(sql);
			if(map != null && map.containsKey("id")) {
				return map.get("id").toString();
			}else {
				return "0";
			}
		} catch (EmptyResultDataAccessException e) {
			return "0";
		}
	}

	@SuppressWarnings("rawtypes")
	@Override
	public String leaderUserId(String mapid) {
		String sql = "SELECT id FROM mm_discuss_map_user WHERE leaderyn = 'Y' and mapid = '"+mapid+"' ";
		try {
			Map map = getJdbcTemplate().queryForMap(sql);
			if(map != null && map.containsKey("id")) {
				return map.get("id").toString();
			}else {
				return "0";
			}
		} catch (EmptyResultDataAccessException e) {
			return "0";
		}
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public String discussMemberYn(String mapid, int id) {
		String sql = "SELECT id FROM mm_discuss_map_user WHERE mapid = '"+mapid+"' and id='"+id+"' and useyn = 'Y' ";
		try {
			Map map = getJdbcTemplate().queryForMap(sql);
			if(map != null && map.containsKey("id")) {
				return "Y";
			}else {
				return "N";
			}
		} catch (EmptyResultDataAccessException e) {
			return "N";
		}
	}
}
