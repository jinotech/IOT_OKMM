package com.okmindmap.dao.mysql.spring;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.dao.ShareDAO;
import com.okmindmap.dao.mysql.spring.mapper.share.PermissionRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.share.PermissionTypeRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.share.ShareMapRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.share.ShareRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.share.ShareTypeRowMapper;
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.model.share.ShareType;
import com.okmindmap.util.ArrayUtil;

public class SpringShareDAO extends SpringDAOBase implements ShareDAO {
	private static final String SQL_SHARE_SELECT_FROM =
		"SELECT s.id, " +
		"       s.sharetype, " +
		"       sg.groupid AS group_id, " +
		"       g.name AS group_name, " +
		"       p.password, " +
		"       t.name AS type_name, " +
		"       t.shortname AS type_shortname, " +
		"       s.mapid AS map_id, " +
		"       m.name AS map_name, " +
		"       m.map_key AS map_key, " +
		"       m.created AS map_created, " +
		"       u.id AS user_id, " +
		"       u.username AS user_username, " +
		"       u.email AS user_email, " +
		"       u.firstname AS user_firstname, " +
		"       u.lastname AS user_lastname " +
		"FROM mm_share s " +
		"JOIN mm_share_type t ON t.id = s.sharetype " +
		"LEFT JOIN mm_share_group sg ON sg.shareid = s.id " +
		"LEFT JOIN mm_group g ON g.id = sg.groupid " +
		"LEFT JOIN mm_share_password p ON p.shareid = s.id " +
		"LEFT JOIN mm_map m ON m.id = s.mapid " +
		"JOIN mm_map_owner o ON o.mapid = m.id " +
		"JOIN mm_user u ON u.id = o.userid ";

	private static final String SQL_SHARE_COUNT_FROM =
		"SELECT count(*) " +
		"FROM mm_share s " +
		"JOIN mm_share_type t ON t.id = s.sharetype " +
		"LEFT JOIN mm_share_group sg ON sg.shareid = s.id " +
		"LEFT JOIN mm_group g ON g.id = sg.groupid " +
		"LEFT JOIN mm_share_password p ON p.shareid = s.id " +
		"LEFT JOIN mm_map m ON m.id = s.mapid " +
		"JOIN mm_map_owner o ON o.mapid = m.id " +
		"JOIN mm_user u ON u.id = o.userid ";

	private static final String SQL_PERMISSION_SELECT_FROM =
		"SELECT CASE WHEN p.id IS NULL THEN 0 ELSE p.id END AS id, " +
		"       CASE WHEN p.shareid IS NULL THEN 0 ELSE p.shareid END AS shareid,  " +
		"       t.id AS permissiontype, " +
		"       CASE WHEN p.permited IS NULL THEN 0 ELSE p.permited END AS permited, " +
		"       t.name AS type_name, " +
		"       t.shortname AS type_shortname " +
		"FROM mm_share_permission_type t " +
		"LEFT JOIN mm_share_permission p ON t.id = p.permissiontype ";
	
	private static final String SQL_SHARED_MAP_SELECT_FROM =
		"SELECT DISTINCT " +
		"       m.id, " +
		"       m.name, " +
		"       m.map_key, " +
		"       o.userid, " +
		"       u.username, " +
		"       u.firstname, " +
		"       u.lastname, " +
		"       u.email " +
		"FROM mm_share s " +
		"JOIN mm_map m ON m.id = s.mapid " +
		"JOIN mm_map_owner o ON o.mapid = m.id " +
		"JOIN mm_user u ON u.id = o.userid ";
	
	private static final HashMap<String, String> SORT_ORDER = new HashMap<String, String>();
	static {
		SORT_ORDER.put("map", " m.name ");
		SORT_ORDER.put("username", " u.username ");
		SORT_ORDER.put("user", " CONCAT(u.lastname, u.firstname) ");
		SORT_ORDER.put("date", " m.created ");
		SORT_ORDER.put("group", " g.name ");
		SORT_ORDER.put("type", " t.name ");
	}
	
	private static final HashMap<String, String> SEARCH_FIELD = new HashMap<String, String>();
	static {
		SEARCH_FIELD.put("title", " m.name ");
//		SEARCH_FIELD.put("username", " u.username ");
		SEARCH_FIELD.put("username", " CONCAT(u.lastname, u.firstname) ");
	}
	
	@Override
	public int deletePermission(int id) throws DataAccessException {
		String sql = "DELETE FROM mm_share_permission " +
				"WHERE id = ? ";
		
		return getJdbcTemplate().update(sql, new Object[]{id});
	}

	public int deletePermissions(int shareid) throws DataAccessException {
		String sql = "DELETE FROM mm_share_permission " +
		"WHERE shareid = ? ";

		return getJdbcTemplate().update(sql, new Object[]{shareid});
	}
	
	@Override
	public int deleteShare(int id) throws DataAccessException {
		String sql = "DELETE FROM mm_share " +
				"WHERE id = ? ";
		
		Share share = this.getShare(id);
		// 
		if(share.getShareType().getShortName().equals("password")) {
			this.deletePasswordByShareId(id);
		} else if(share.getShareType().getShortName().equals("group")) {
			this.deleteGroupByShareId(id);
		}
		
		// 
		this.deletePermissions(id);
		
		return getJdbcTemplate().update(sql, new Object[]{id});
	}

	@Override
	public List<ShareMap> getNotSharedMaps(int userId) throws DataAccessException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Permission getPermission(int id) throws DataAccessException {
		String sql = SQL_PERMISSION_SELECT_FROM +
		"WHERE p.id = ? ";

		return (Permission) getJdbcTemplate().queryForObject(sql, 
				new Object[]{id},
				new PermissionRowMapper());
	}

	@Override
	public PermissionType getPermissionType(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_share_permission_type " +
				"WHERE id = ? ";
		
		return (PermissionType) getJdbcTemplate().queryForObject(sql, 
				new Object[]{id},
				new PermissionTypeRowMapper());
	}
	
	@Override
	public PermissionType getPermissionType(String shortName) throws DataAccessException {
		String sql = "SELECT * FROM mm_share_permission_type " +
				"WHERE shortname = ? ";
		
		return (PermissionType) getJdbcTemplate().queryForObject(sql, 
				new Object[]{shortName},
				new PermissionTypeRowMapper());
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PermissionType> getPermissionTypes() throws DataAccessException {
		String sql = "SELECT * FROM mm_share_permission_type ORDER BY sortorder";

		return getJdbcTemplate().query(sql, 
				new PermissionTypeRowMapper());
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Permission> getPermissions(int shareid) throws DataAccessException {
		String sql = SQL_PERMISSION_SELECT_FROM +
				"AND p.shareid = ? " + // 2014.12.22, Jinhoon, copynode 추가한 것 나오게 하기위해 WHERE를 AND로 바꿈
				"ORDER BY t.sortorder ";
		
		return getJdbcTemplate().query(sql, 
				new Object[]{shareid},
				new PermissionRowMapper());
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<Share> getShares(int userId, int page, int pagelimit, String search, String sort) throws DataAccessException {
		String sql = SQL_SHARE_SELECT_FROM +
			"WHERE (   t.shortname = 'open' " +
			"       OR t.shortname = 'password' " +
			"       OR g.id IN (SELECT groupid FROM mm_group_member gm WHERE gm.userid = ?) ) " +
			"  AND o.userid != ? ";
		//System.out.println(sql);
		ArrayList params = new ArrayList();
		params.add(userId);
		params.add(userId);
		
		if(search != null && search.trim().length() > 0) {
			sql += " AND m.name LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		if(sort == null) {
			sort = "map";
		}
		if(SORT_ORDER.containsKey(sort) ) {
			sql += " ORDER BY " + SORT_ORDER.get(sort);
		}
		
		//if(offset > 0 && limit > 0) {
			sql += " LIMIT ? OFFSET ?";
			params.add(pagelimit);
			params.add((page-1)*pagelimit);
		//}
	
	
		List<Share> shares = getJdbcTemplate().query(sql, 
				params.toArray(),
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}
		
		return shares;
	}
	
	public List<Share> getAllShares(int page, int pagelimit, String sort) throws DataAccessException {
		String sql = SQL_SHARE_SELECT_FROM;

		ArrayList params = new ArrayList();
			
		if(sort == null) {
			sort = "map";
		}
		if(SORT_ORDER.containsKey(sort) ) {
			sql += " ORDER BY " + SORT_ORDER.get(sort);
		}
		
		//if(offset > 0 && limit > 0) {
			sql += " LIMIT ? OFFSET ?";
			params.add(pagelimit);
			params.add((page-1)*pagelimit);
		//}
	
	
		List<Share> shares = getJdbcTemplate().query(sql, 
				params.toArray(),
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}
		
		return shares;
	}
	
	public List<Share> getAllShares(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc) throws DataAccessException {
		String sql = SQL_SHARE_SELECT_FROM;
		
		ArrayList params = new ArrayList();
		
		if(searchfield != null && search != null) {
			if(SEARCH_FIELD.containsKey(searchfield)) {
				sql += " WHERE " + SEARCH_FIELD.get(searchfield) + " LIKE '%" + search + "%'";
			}
		}
		
		if(sort == null) {
			sort = "map";
		}
		if(SORT_ORDER.containsKey(sort) ) {
			sql += " ORDER BY " + SORT_ORDER.get(sort);
		}
		
		sql += " LIMIT ? OFFSET ?";
		params.add(pagelimit);
		params.add((page-1)*pagelimit);
		
		List<Share> shares = getJdbcTemplate().query(sql, 
				params.toArray(),
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}
		
		return shares;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public int countShares(int userId, String search) throws DataAccessException {
		String sql = SQL_SHARE_COUNT_FROM +
		"WHERE (   t.shortname = 'open' " +
		"       OR t.shortname = 'password' " +
		"       OR g.id IN (SELECT groupid FROM mm_group_member gm WHERE gm.userid = ?) ) " +
		"  AND o.userid != ? ";
		
		ArrayList params = new ArrayList();
		params.add(userId);
		params.add(userId);
		
		if(search != null && search.trim().length() > 0) {
			sql += " AND m.name LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		return getJdbcTemplate().queryForInt(sql, params.toArray());
	}
	
	public int countAllShares() throws DataAccessException {
		String sql = SQL_SHARE_COUNT_FROM;
		
		return getJdbcTemplate().queryForInt(sql);
	}
	
	public int countAllShares(String searchfield, String search) throws DataAccessException {
		String sql = SQL_SHARE_COUNT_FROM;
		
		if(searchfield != null && search != null) {
			if(SEARCH_FIELD.containsKey(searchfield)) {
				sql += " WHERE " + SEARCH_FIELD.get(searchfield) + " LIKE '%" + search + "%'";
			}
		}
		
		return getJdbcTemplate().queryForInt(sql);
	}
	
	@Override
	public Share getShare(int id) throws DataAccessException {
		String sql = SQL_SHARE_SELECT_FROM +
		"WHERE s.id = ? ";
		
		Share share = (Share) getJdbcTemplate().queryForObject(sql, 
				new Object[]{id}, 
				new ShareRowMapper());
		
		share.setPermissions(this.getPermissions(share.getId()));
		
		return share;
	}

	@Override
	public ShareMap getSharedMap(int mapId) throws DataAccessException {
		String sql = SQL_SHARED_MAP_SELECT_FROM +
		"WHERE m.id = ? ";
		
		ShareMap map = (ShareMap) getJdbcTemplate().queryForObject(sql, 
				new Object[]{mapId},
				new ShareMapRowMapper());
		
		if(map != null) {
			map.setShares(this.getSharesByMap(map.getId()));
		}
		
		return map;
	}
	@SuppressWarnings("unchecked")
	@Override
	public List<ShareMap> getSharedMaps(String shareType)
			throws DataAccessException {
		String sql = SQL_SHARED_MAP_SELECT_FROM +
		"JOIN mm_share_type st ON st.id = s.sharetype " +
		"WHERE st.shortname = ? ";

		List<ShareMap> sharedMaps = getJdbcTemplate().query(sql, 
				new Object[]{shareType}, 
				new ShareMapRowMapper());
		
		for(ShareMap map : sharedMaps) {
			map.setShares(this.getSharesByMap(map.getId()));
		}
		
		return sharedMaps;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ShareMap> getUserSharedMaps(int userId) throws DataAccessException {
		String sql = SQL_SHARED_MAP_SELECT_FROM +
				"WHERE o.userid = ? ";
		
		List<ShareMap> sharedMaps = getJdbcTemplate().query(sql, 
				new Object[]{userId}, 
				new ShareMapRowMapper());
		
		for(ShareMap map : sharedMaps) {
			map.setShares(this.getSharesByMap(map.getId()));
		}
		
		return sharedMaps;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<ShareMap> getUserSharedMaps(int userId, String map_key) throws DataAccessException {
		String sql = SQL_SHARED_MAP_SELECT_FROM +
				"WHERE o.userid = ? and m.id = ? ";
		
		
		List<ShareMap> sharedMaps = getJdbcTemplate().query(sql, 
				new Object[]{userId, map_key}, 
				new ShareMapRowMapper());
		
		for(ShareMap map : sharedMaps) {
			map.setShares(this.getSharesByMap(map.getId()));
		}
		
		return sharedMaps;
	}
	
	
	
	@SuppressWarnings("unchecked")
	@Override
	public List<ShareMap> getGroupSharedMaps(int groupId) throws DataAccessException {
		String sql = SQL_SHARED_MAP_SELECT_FROM +
				"JOIN mm_share_type st ON st.id = s.sharetype " +
				"JOIN mm_share_group sg ON sg.shareid = s.id " +
				"WHERE st.shortname = 'group' " +
				"  AND sg.groupid = ? ";
		
		List<ShareMap> sharedMaps = getJdbcTemplate().query(sql, 
				new Object[]{groupId}, 
				new ShareMapRowMapper());
		
		for(ShareMap map : sharedMaps) {
			map.setShares(this.getSharesByMap(map.getId()));
		}
		
		return sharedMaps;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<ShareMap> getGroupSharedMaps(List<String> groupIds)
			throws DataAccessException {
		String sql = SQL_SHARED_MAP_SELECT_FROM +
		"JOIN mm_share_type st ON st.id = s.sharetype " +
		"JOIN mm_share_group sg ON sg.shareid = s.id " +
		"WHERE st.shortname = 'group' " +
		"  AND sg.groupid IN (" + ArrayUtil.join(groupIds, ",") + ") ";

		List<ShareMap> sharedMaps = getJdbcTemplate().query(sql, 
				new ShareMapRowMapper());
		
		for(ShareMap map : sharedMaps) {
			map.setShares(this.getSharesByMap(map.getId()));
		}
		
		return sharedMaps;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Share> getSharesByMap(int mapId) throws DataAccessException {
		String sql = SQL_SHARE_SELECT_FROM +
				"WHERE s.mapid = ? " +
				"ORDER BY s.sharetype DESC ";
		
		List<Share> shares = getJdbcTemplate().query(sql, 
				new Object[]{mapId},
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}
		
		return shares;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Share> getSharesByGroup(int groupId) throws DataAccessException {
		String sql = SQL_SHARE_SELECT_FROM +
				"WHERE sg.groupid = ? " +
				"ORDER BY s.sharetype DESC ";
		
		List<Share> shares = getJdbcTemplate().query(sql, 
				new Object[]{groupId},
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}
		
		return shares;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Share> getSharesByGroups(List<String> groupIds) throws DataAccessException {
		String sql = SQL_SHARE_SELECT_FROM +
				"WHERE sg.groupid IN (" + ArrayUtil.join(groupIds, ",") + 
				") " +
				"ORDER BY sg.groupid, s.sharetype DESC ";
		
		List<Share> shares = getJdbcTemplate().query(sql, 
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}
		
		return shares;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Share> getSharesByType(String type) throws DataAccessException {
		String sql = SQL_SHARE_SELECT_FROM +
		"WHERE t.shortname = ? " +
		"ORDER BY s.sharetype DESC ";

		List<Share> shares = getJdbcTemplate().query(sql, 
				new Object[]{type},
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}

		return shares;
	}
	
	@Override
	public int insertPermission(Permission permission) throws DataAccessException {
		String sql = "INSERT INTO mm_share_permission (shareid, permissiontype, permited) " +
				"VALUES (?, ?, ?) ";
		
		int permited = permission.isPermited() ? 1 : 0;
		
		return getJdbcTemplate().update(sql, 
				new Object[]{permission.getShareId(), 
				             permission.getPermissionType().getId(),
				             permited}
				);
	}

	@Override
	public int insertShare(Share share) throws DataAccessException {
		String sql = "INSERT INTO mm_share ( id, mapid, sharetype ) " +
				"VALUES (?, ?, ?) ";
		
		int shareId = createNewID("mm_share");
		
		getJdbcTemplate().update(sql, new Object[]{
				shareId,
				share.getMap().getId(),
				share.getShareType().getId()
		});
		
		if(share.getShareType().getShortName().equals("password")) {
			this.insertPassword(shareId, share.getPassword());
		} else if(share.getShareType().getShortName().equals("group")) {
			this.insertShareGroup(shareId, share.getGroup().getId());
		}
		
		for(Permission p : share.getPermissions()) {
			p.setShareId(shareId);
			this.insertPermission(p);
		}
		
		return shareId;
	}

	@Override
	public int updatePermission(Permission permission) throws DataAccessException {
		if(permission.getId() == 0) {
			return insertPermission(permission);
		}
		
		String sql = "UPDATE mm_share_permission SET " +
				" permissiontype = ?, " +
				" permited = ? " +
				"WHERE id = ? ";

		int permited = permission.isPermited() ? 1 : 0;
		return getJdbcTemplate().update(sql, new Object[]{
				permission.getPermissionType().getId(),
				permited,
				permission.getId()
		});
	}

	@Override
	public int updateShare(Share share) throws DataAccessException {
		String sql = "UPDATE mm_share SET " +
				" mapid = ?, " +
				" sharetype = ? " +
				" WHERE id = ? ";
		
		Share oldShare = this.getShare(share.getId());
		if(oldShare.getShareType().getShortName().equals("password")) {
//			if(share.getShareType().getShortName().equals("password")) {
//				this.updatePassword(share.getId(), share.getPassword());
//			} else {
				this.deletePasswordByShareId(oldShare.getId());
//			}
		} else if(oldShare.getShareType().getShortName().equals("group")) {
			this.deleteGroupByShareId(oldShare.getId());
		}
		
		if(share.getShareType().getShortName().equals("group")) {
			this.insertShareGroup(share.getId(), share.getGroup().getId());
		} else if(share.getShareType().getShortName().equals("password")) {
			this.insertPassword(share.getId(), share.getPassword());
		}
		
//		this.deletePermissions(share.getId());
//		for(Permission p : share.getPermissions()) {
//			p.setShareId(share.getId());
//			this.insertPermission(p);
//		}
		for(Permission p : share.getPermissions()) {
			p.setShareId(share.getId());
			this.updatePermission(p);
		}
		
		return getJdbcTemplate().update(sql, new Object[]{
				share.getMap().getId(),
				share.getShareType().getId(),
				share.getId()
		});
	}

	@Override
	public int deleteGroupByShareId(int shareId) throws DataAccessException {
		String sql = "DELETE FROM mm_share_group " +
				"WHERE shareid = ? ";
		
		return getJdbcTemplate().update(sql, new Object[]{shareId});
	}

	@Override
	public int deletePasswordByShareId(int shareId) throws DataAccessException {
		String sql = "DELETE FROM mm_share_password " +
		"WHERE shareid = ? ";

		return getJdbcTemplate().update(sql, new Object[]{shareId});
	}

	@Override
	public int insertShareGroup(int shareId, int groupId)
			throws DataAccessException {
		String sql = "INSERT INTO mm_share_group (shareid, groupid) " +
				"VALUES (?, ?)";
		
		return getJdbcTemplate().update(sql, new Object[]{shareId, groupId});
	}

	@Override
	public int insertPassword(int shareId, String password)
			throws DataAccessException {
		String sql = "INSERT INTO mm_share_password (shareid, password) " +
				"VALUES (?, ?) ";
		
		return getJdbcTemplate().update(sql, new Object[]{shareId, password});
	}
	
	@Override
	public int updatePassword(int shareId, String password)
			throws DataAccessException {
		String sql = "UPDATE mm_share_password SET password = ? " +
				"WHERE shareid = ? ";
		return getJdbcTemplate().queryForInt(sql,
				new Object[]{password, shareId});
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ShareType> getShareTypes() throws DataAccessException {
		String sql = "SELECT id, name, shortname " +
				"FROM mm_share_type";
		
		return getJdbcTemplate().query(sql, new ShareTypeRowMapper());
	}

	@Override
	public ShareType getShareType(String shortName) {
		String sql = "SELECT id, name, shortname " +
		"FROM mm_share_type " +
		"WHERE shortname = ? ";
		
		return (ShareType) getJdbcTemplate().queryForObject(sql, 
				new Object[]{shortName}, 
				new ShareTypeRowMapper());
	}

	
}
