package com.okmindmap.dao.mysql.spring;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

import com.okmindmap.dao.UserDAO;
import com.okmindmap.dao.mysql.spring.mapper.UserConfigDataRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.UserRowMapper;
import com.okmindmap.model.User;
import com.okmindmap.model.UserConfigData;

@Repository
public class SpringUserDAO extends SpringDAOBase implements UserDAO {

	private static final HashMap<String, String> SORT_ORDER = new HashMap<String, String>();
	static {
		SORT_ORDER.put("usernamestring", " CONCAT(lastname, firstname) ");
		SORT_ORDER.put("id", " mu.id ");
		SORT_ORDER.put("maptotalcnt", " maptotalcnt ");
		SORT_ORDER.put("rolename", " mr.name ");
		SORT_ORDER.put("username", " mu.username ");
		
	}
	
	@Override
	public int insert(User user) throws DataAccessException {
		String query = "INSERT INTO mm_user (id, username, email, firstname, lastname, password, auth, confirmed, deleted, created)" +
				" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		int id = createNewID("mm_user");
		long created = new Date().getTime();
		getJdbcTemplate().update(query , new Object[] {
				new Integer(id), 
				user.getUsername(),
				user.getEmail(),
				user.getFirstname(),
				user.getLastname(),
				user.getPassword(),
				user.getAuth(),
				user.getConfirmed(),
				user.getDeleted(),
				created
				});
		
		if(user.getFacebookAccessToken() != null && user.getFacebookAccessToken() != "")
			this.insertFacebook(id, user.getFacebookAccessToken());
		
		return id;
	}
	
	public int updateLastAccess(int userid) throws DataAccessException {
		String query = "UPDATE mm_user SET last_access = ? WHERE id = ?";
		long created = new Date().getTime();
		int result = getJdbcTemplate().update(query , new Object[] {
					created,
					userid
				});
		
		return result;
	}
	
	public int updateLastMap(int userid, int mapid) throws DataAccessException {
		String query = "UPDATE mm_user SET last_map = ? WHERE id = ?";
		
		int result = getJdbcTemplate().update(query , new Object[] {
					mapid,
					userid
				});
		
		return result;
	}

	public int update(User user) throws DataAccessException {
		String query = "UPDATE mm_user SET username = ?" +
				", email = ?" +
				", firstname = ?" +
				", lastname = ?" +
				", password = ?" +
				", auth = ?" +
				", confirmed = ?" +
				", deleted = ? " +
				" WHERE id = ?";
		
		int result = getJdbcTemplate().update(query , new Object[] {
				user.getUsername(),
				user.getEmail(),
				user.getFirstname(),
				user.getLastname(),
				user.getPassword(),
				user.getAuth(),
				user.getConfirmed(),
				user.getDeleted(),
				user.getId()
				});
		
		return result;
	}

	public int update(String firstname, String username, String email, String self, int id) throws DataAccessException {
		String query = "UPDATE mm_user SET username = '"+username+"'" +
				", email = '"+email+"'" +
				", firstname = '"+firstname+"'" +
				", self = '"+self+"' " +
				" WHERE id = '"+id+"'";
		
		int result = getJdbcTemplate().update(query);
		
		return result;
	}
	
	public int update(String pw, int id) throws DataAccessException {
		String query = "UPDATE mm_user SET password = '"+pw+"'" +
				" WHERE id = '"+id+"'";
		
		int result = getJdbcTemplate().update(query);
		
		return result;
	}
	
	@Override
	public User select(String username) throws DataAccessException {
		String sql = "SELECT mu.*, mr.id roleid, mr.name rolename, mr.shortname roleshortname " +
				"FROM mm_user mu " +
				"LEFT JOIN mm_role_assignments  mrs ON mu.id = mrs.userid " +
				"LEFT JOIN mm_role mr ON mrs.roleid = mr.id " +
				"WHERE deleted = 0 AND username = ? COLLATE utf8_bin"; // 대소문자 구분을 위해 "COLLATE utf8_bin"를 붙임.
		
		User user = (User)getJdbcTemplate().queryForObject(sql,
				new Object[]{ username },
				new UserRowMapper());
		
		return user;
	}
	
	public User selectByEmail(String email) throws DataAccessException {
		String sql = "SELECT * FROM mm_user WHERE email = ? AND deleted = 0 LIMIT 1";
		
		User user = (User)getJdbcTemplate().queryForObject(sql,
				new Object[]{ email },
				new UserRowMapper());
		
		return user;
	}
	
	@Override
	public User select(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_user WHERE id = ?";
		
		User user = (User)getJdbcTemplate().queryForObject(sql,
				new Object[]{ id },
				new UserRowMapper());
		
		return user;
	}
	
	public User getUserFromPersistent(String persistent) throws DataAccessException {
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_persistent_login WHERE persistent_key = ?",
				new Object[]{persistent});
		
		if(count == 1) {
			int userid = getJdbcTemplate().queryForInt("SELECT userid FROM mm_persistent_login WHERE persistent_key = ?", 
				new Object[]{persistent});
		
			if(userid > 0) {
				return this.select(userid);
			}
		}
		
		return null;
	}

	@Override
	public int insertPersistent(int userid, String persistent)
			throws DataAccessException {
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_persistent_login WHERE userid = ? ",
				new Object[]{userid});
		if(count > 0) {
			this.deletePersistent(userid);
		}
		
		String query = "INSERT INTO mm_persistent_login (id, userid, persistent_key)" +
		" VALUES (?, ?, ?)";
		
		int id = createNewID("mm_persistent_login");

		getJdbcTemplate().update(query , new Object[] {
				new Integer(id),
				new Integer(userid),
				persistent
				});

		return id;
	}

	@Override
	public int updatePersistent(int userid, String persistent)
			throws DataAccessException {
		
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_persistent_login WHERE userid = ? ",
				new Object[]{userid});
		
		if(count == 0) {
			return this.insertPersistent(userid, persistent);
		}
		
		String query = "UPDATE mm_persistent_login SET persistent_key = ?, lastlogin = ? WHERE userid = ?";

		return getJdbcTemplate().update(query , new Object[] {
							persistent,
							new Date(),
							userid
							});
	}

	@Override
	public int deletePersistent(int userid) throws DataAccessException {
		String sql = "DELETE FROM mm_persistent_login WHERE userid = ?";

		return getJdbcTemplate().update(sql, new Object[] { userid });
	}
	
	
	public User getUserFromFacebook(String access_token) throws DataAccessException {
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_facebook_login WHERE access_token = ?",
				new Object[]{access_token});
		
		if(count == 1) {
			int userid = getJdbcTemplate().queryForInt("SELECT userid FROM mm_facebook_login WHERE access_token = ?", 
				new Object[]{access_token});
		
			if(userid > 0) {
				return this.select(userid);
			}
		}
		
		return null;
	}
	
	@Override
	public int insertFacebook(int userid, String access_token)
			throws DataAccessException {
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_facebook_login WHERE userid = ? ",
				new Object[]{userid});
		if(count > 0) {
			this.deleteFacebook(userid);
		}
		
		String query = "INSERT INTO mm_facebook_login (id, userid, access_token)" +
		" VALUES (?, ?, ?)";
		
		int id = createNewID("mm_facebook_login");

		getJdbcTemplate().update(query , new Object[] {
				new Integer(id),
				new Integer(userid),
				access_token
				});

		return id;
	}

	@Override
	public int updateFacebook(int userid, String access_token)
			throws DataAccessException {
		
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_facebook_login WHERE userid = ? ",
				new Object[]{userid});
		
		if(count == 0) {
			return this.insertFacebook(userid, access_token);
		}
		
		String query = "UPDATE mm_facebook_login SET access_token = ?, lastlogin = ? WHERE userid = ?";

		return getJdbcTemplate().update(query , new Object[] {
							access_token,
							new Date(),
							userid
							});
	}

	@Override
	public int deleteFacebook(int userid) throws DataAccessException {
		String sql = "DELETE FROM mm_facebook_login WHERE userid = ?";

		return getJdbcTemplate().update(sql, new Object[] { userid });
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<User> getAdmins()  throws DataAccessException {
		String sql = "SELECT u.* FROM mm_user u, mm_role_assignments r WHERE u.id = r.userid AND r.roleid = 1";
		
		return getJdbcTemplate().query(sql, new UserRowMapper());
	}
	
	@Override
	public int setAdminAuth(int userid, boolean isAdmin)  throws DataAccessException {
		int roleid = isAdmin?1:2;
		
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_role_assignments WHERE userid = ?",
				new Object[]{userid});
		
		if(count == 0) {
			String query = "INSERT INTO mm_role_assignments (id, roleid, userid)" +
					" VALUES (?, ?, ?)";

			int id = createNewID("mm_role_assignments");
			
			return getJdbcTemplate().update(query , new Object[] {
				new Integer(id),
				new Integer(roleid),
				new Integer(userid)
			});
		}
		
		String query = "UPDATE mm_role_assignments SET roleid = ? WHERE userid = ?";
		return getJdbcTemplate().update(query , new Object[] { roleid, userid });
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<User> getAllUsers(int page, int pageSize, String searchfield, String search, String sort, boolean isAsc) throws DataAccessException {
		// TODO Auto-generated method stub
		
		String sql = "SELECT mu.id,mu.username, mu.email, mu.firstname, mu.lastname, mu.last_access, mu.last_map, "
				+ " mr.id roleid, mr.name rolename, mr.shortname roleshortname, "
//				+ " mapcnt.cnt maptotalcnt, "
				+ " (SELECT COUNT(id) FROM mm_map_owner mo WHERE mo.userid = mu.id) AS maptotalcnt, "
				+ " mu.auth, mu.confirmed, mu.deleted, mu.password  "
				+ " FROM mm_user mu " 
				+ " LEFT JOIN mm_role_assignments  mrs ON mu.id = mrs.userid "
				+ " LEFT JOIN mm_role mr ON mrs.roleid = mr.id "
//				+ " LEFT JOIN (SELECT userid, COUNT(id) AS cnt FROM mm_map_owner GROUP BY userid) AS mapcnt ON mu.id = mapcnt.userid "
				;
			
	
			ArrayList params = new ArrayList();
			if (search != null && search.trim().length() > 0) {
				sql += " where "+SORT_ORDER.get(searchfield)+" LIKE CONCAT('%', ?, '%')";
				params.add(search.trim());
			}
			if (sort == null) {
				sort = "id";
			}
			
			if (SORT_ORDER.containsKey(sort)) {
				sql += " ORDER BY " + SORT_ORDER.get(sort) + (isAsc?" asc ": " desc ");
			}
		
			
			if(pageSize>0){
				sql += " LIMIT ? OFFSET ?";
				params.add(pageSize);
				params.add((page-1)*pageSize);
			}
			
			return getJdbcTemplate().query(sql, params.toArray(),
					new UserRowMapper());
		}

	@Override
	public int countAllUsers(String search) throws DataAccessException {
		// TODO Auto-generated method stub
		String sql = "SELECT count(*) as count FROM mm_user mu ";

		if (search != null && search.trim().length() > 0) {
			sql += " where mu.lastname LIKE CONCAT('%', ?, '%')";
		
			return getJdbcTemplate().queryForInt(sql, new Object[] { search });
		} else {
			return getJdbcTemplate().queryForInt(sql);
		}
	}
	
	
	
	public List<UserConfigData> getUserConfigData(int userid) throws DataAccessException {
		String query =	"SELECT d.id, d.userid, d.fieldid, d.data, f.field " +
							"FROM mm_user_config_data d " + 
							"JOIN mm_user_config_field f ON f.id = d.fieldid " +
							"WHERE d.userid = ?";
		
		return getJdbcTemplate().query(query, new Object[] { userid },
						new UserConfigDataRowMapper());
	}
	
	public int setUserConfigData(int userid, String field, String data) throws DataAccessException {
		int fieldid = getJdbcTemplate().queryForInt("SELECT id FROM mm_user_config_field WHERE field = ? ",
				new Object[]{field});
		
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_user_config_data WHERE userid = ? AND fieldid =? ",
				new Object[]{userid, fieldid});
		
		if(count == 0) {
			return this.insertUserConfigData(userid, fieldid, data);
		}

		String query = "UPDATE mm_user_config_data SET data = ? WHERE userid = ? AND fieldid = ?";
		return getJdbcTemplate().update(query , new Object[] { data, userid, fieldid });	
	}
	
	public int insertUserConfigData(int userid, int fieldid, String data)  throws DataAccessException {
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_user_config_data WHERE userid = ? AND fieldid=? ",
				new Object[]{userid, fieldid});
		
		if(count > 0) {
			this.deleteUserConfigData(userid);
		}
		
		String query = "INSERT INTO mm_user_config_data (id, userid, fieldid, data)" +
								" VALUES (?, ?, ?, ?)";
		
		int id = createNewID("mm_user_config_data");
		
		getJdbcTemplate().update(query , new Object[] {
				new Integer(id),
				new Integer(userid),
				new Integer(fieldid),
				data
		});

		return id;
	}
	
	public int deleteUserConfigData(int userid)  throws DataAccessException {
		String sql = "DELETE FROM mm_user_config_data WHERE userid = ?";

		return getJdbcTemplate().update(sql, new Object[] { userid });
	}

	@Override
	public int countUser(String where) {
		String sql = "SELECT count(*) FROM mm_user";
		if(where != null) {
			sql += " WHERE " + where;
		}
		
		int count = getJdbcTemplate().queryForInt(sql);
		
		return count;
	}
	
	
	
//	public int updateUserConfig(int userid, String field, String data) {
//		userconfig = getUserConfig(,,);
//		
//		if(userconfig == null) {
//			insertUserConfig();
//		} else {
//			;
//		}
//		
//		int fieldid = getJdbcTemplate().queryForInt("SELECT id FROM mm_user_config_field WHERE field = ? ",
//				new Object[]{field});
//
//		
//		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_user_config_data WHERE userid = ? AND fieldid = ?",
//				new Object[]{userid, fieldid});
//		
//		if(count == 0) {
////			return this.insertUserConfig(userid, field);
//		}
//				
//		String sql = "UPDATE mm_user_config_data SET data = ? WHERE userid = ? AND fieldid = ?";
//		return getJdbcTemplate().update(sql , new Object[] { data, userid, fieldid });
//	}
}
