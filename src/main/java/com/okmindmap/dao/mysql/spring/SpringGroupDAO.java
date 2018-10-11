package com.okmindmap.dao.mysql.spring;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.dao.GroupDAO;
import com.okmindmap.dao.mysql.spring.mapper.CategoryRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.UserRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.group.GroupRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.group.MemberRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.group.MemberStatusRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.group.PolicyRowMapper;
import com.okmindmap.model.Category;
import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.group.Member;
import com.okmindmap.model.group.MemberStatus;
import com.okmindmap.model.group.Policy;

public class SpringGroupDAO extends SpringDAOBase implements GroupDAO {
	
	private static final HashMap<String, String> SEARCH_PARAMS = new HashMap<String, String>();
	static {
		SEARCH_PARAMS.put("groupname", " g.name ");
		SEARCH_PARAMS.put("username", " u.username ");
		SEARCH_PARAMS.put("fullname", " CONCAT(lastname, firstname) ");
		SEARCH_PARAMS.put("email", " email ");
		
	}
	
	
	private static final String SQL_GROUP_SELECT_FROM =
		"SELECT g.id, " +
		"   g.name, " +
		"   g.summary, " +
		"   g.userid, " +
		"   g.created, " +
		"   g.modified, " +
		"   g.policy, " +
		"   g.categoryid, " +
		"   gp.password, " +
		"   p.name AS policy_name, " +
		"   p.shortname AS policy_shortname, " +
		"   c.name AS category_name, " +
		"   c.lft AS category_lft, " +
		"   c.rgt AS category_rgt, " +
		"   c.parentid AS category_parentid, " +
		"   c.depth AS category_depty, " +
		"   c.is_leaf AS category_is_leaf, " +
		"   u.username AS user_username, " +
		"   u.email AS user_email, " +
		"   u.firstname AS user_firstname, " +
		"   u.lastname AS user_lastname, " +
		"   u.password AS user_password " +
		"FROM mm_group g " +
		"LEFT JOIN mm_group_password gp ON gp.groupid = g.id " +
		"JOIN mm_group_policy_type p ON p.id = g.policy " +
		"JOIN mm_categories_view c ON c.id = g.categoryid " +
		"JOIN mm_user u ON u.id = g.userid ";
	
	private static final String SQL_GROUP_ORDER_BY =
		"ORDER BY c.lft";
	
	private static final String SQL_POLICY_SELECT_FROM = 
		"SELECT p.id," +
		"   p.name," +
		"   p.shortname " +
		"FROM mm_group_policy_type p ";
	
	private static final String SQL_MEMBER_SELECT_FROM =
		"SELECT m.id, " +
		"       m.groupid, " +
		"       m.userid, " +
		"       m.created, " +
		"       m.status, " +
		"       s.name AS status_name, " +
		"       s.shortname AS status_shortname, " +
		"       u.username AS user_username, " +
		"       u.email AS user_email, " +
		"       u.firstname AS user_firstname, " +
		"       u.lastname AS user_lastname, " +
		"       u.password AS user_password " +
		"FROM mm_group_member m " +
		"JOIN mm_group_member_status_type s ON s.id = m.status " +
		"JOIN mm_user u ON u.id = m.userid ";

	@Override
	public int deleteGroup(int id) throws DataAccessException {
		String sql = "DELETE FROM mm_group WHERE id = ?";
		
		// 멤버 삭제
		this.deleteGroupMemberInGroup(id);
		
		this.deleteGroupPassword(id);
		
		return getJdbcTemplate().update(sql, new Object[]{id});
	}

	@Override
	public Group getGroup(int id) throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM + " WHERE g.id = ?";
		
		return (Group) getJdbcTemplate().queryForObject(sql,
				new Object[]{id},
				new GroupRowMapper());
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Group> getGroups(int page, int pageLimit) throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM;
		
		ArrayList params = new ArrayList();
		
		if(pageLimit>0){
			sql += " LIMIT ? OFFSET ?";
			params.add(pageLimit);
			params.add((page-1)*pageLimit);
		}
		
		//sql += SQL_GROUP_ORDER_BY;
		
		return getJdbcTemplate().query(sql, params.toArray(),
				new GroupRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Group> getGroups(int page, int pageLimit, String searchfield, String search, String sort, boolean isAsc) throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM;
	
		ArrayList params = new ArrayList();
		if (search != null && search.trim().length() > 0) {
			sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		sql += " order by g.id desc ";
		
		
		if(pageLimit>0){
			sql += " LIMIT ? OFFSET ?";
			params.add(pageLimit);
			params.add((page-1)*pageLimit);
		}
		//System.out.println(sql);
		return getJdbcTemplate().query(sql, params.toArray(),new GroupRowMapper());

	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Group> getGroups(int userId, int page, int pageLimit, String searchfield, String search, String sort, boolean isAsc) throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM  + " WHERE g.userid = ? ";
	
		ArrayList params = new ArrayList();
		params.add(userId);
		if (search != null && search.trim().length() > 0) {
			sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		sql += " order by g.id desc ";
		
		
		if(pageLimit>0){
			sql += " LIMIT ? OFFSET ?";
			params.add(pageLimit);
			params.add((page-1)*pageLimit);
		}
		//System.out.println(sql);
		return getJdbcTemplate().query(sql, params.toArray(),new GroupRowMapper());

	}
	
	
	

	@SuppressWarnings("unchecked")
	@Override
	public List<Group> getGroups(int userId) throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM + " WHERE g.userid = ? " +
				SQL_GROUP_ORDER_BY;
		
		return getJdbcTemplate().query(sql,
				new Object[]{userId},
				new GroupRowMapper());
	}
	
	
	@Override
	public int countAllGroups()
			throws DataAccessException {
		String sql = "select count(id) from mm_group";
		
		return getJdbcTemplate().queryForInt(sql);
	}
	
	
	@Override
	public int countGroups(int userId, String searchfield, String search)
			throws DataAccessException {
		String sql = "select count(id) from ("+SQL_GROUP_SELECT_FROM  + " WHERE g.userid = ? ";
		
		ArrayList params = new ArrayList();
		params.add(userId);
		if (search != null && search.trim().length() > 0) {
			sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		sql += ") AS tempT";
		
		
		
		return getJdbcTemplate().queryForInt(sql, params.toArray());
	}

	
	
	
	@SuppressWarnings("unchecked")
	public List<Group> getGroupsByPolicy(int policyId) throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM +
				"WHERE g.policy = ? " +
				"ORDER BY g.name ";
		
		return getJdbcTemplate().query(sql,
				new Object[]{policyId},
				new GroupRowMapper());
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Policy> getPolicies() throws DataAccessException {
		String sql = SQL_POLICY_SELECT_FROM;
		
		return getJdbcTemplate().query(sql, 
				new PolicyRowMapper());
	}

	@Override
	public Policy getPolicy(int id) throws DataAccessException {
		String sql = SQL_POLICY_SELECT_FROM + " WHERE p.id = ?";
		
		return (Policy) getJdbcTemplate().queryForObject(sql, 
				new Object[]{id},
				new PolicyRowMapper());
	}
	@Override
	public Policy getPolicy(String shortName) throws DataAccessException {
		String sql = SQL_POLICY_SELECT_FROM + " WHERE p.shortname = ?";
		
		return (Policy) getJdbcTemplate().queryForObject(sql, 
				new Object[]{shortName},
				new PolicyRowMapper());
	}

	@Override
	public int insertGroup(Group group) throws DataAccessException {
		int id = createNewID("mm_group");
		
		String sql = "INSERT INTO mm_group (id, name, summary, userid, created, modified, policy, categoryid) " +
				"VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		
		long created = new Date().getTime();
		getJdbcTemplate().update(sql, 
				new Object[]{
					id,
					group.getName(),
					group.getSummary(),
					group.getUser().getId(),
					new Timestamp(created),
					new Timestamp(created),
					group.getPolicy().getId(),
					group.getCategory().getId()
		});
		
		return id;
	}

	@Override
	public int updateGroup(Group group) throws DataAccessException {
		String sql = "UPDATE mm_group SET name = ?, summary = ?, modified = ?, policy = ?, categoryid = ? " +
				"WHERE id = ?";
		
		return getJdbcTemplate().update(sql,
				new Object[]{ 	group.getName(), 
								group.getSummary(),
								new Timestamp(new Date().getTime()),
								group.getPolicy().getId(),
								group.getCategory().getId(),
								group.getId()
								});
	}

	@Override
	public int insertGroupMember(int groupId, int userId, int status) throws DataAccessException {
		int id = createNewID("mm_group_member");
		
		String sql = "INSERT INTO mm_group_member (id, groupid, userid, created, status) " +
				"VALUES (?, ?, ?, ?, ?)";
		
		getJdbcTemplate().update(sql, 
				new Object[]{
					id,
					groupId,
					userId,
					new Timestamp(new Date().getTime()),
					status
		});
		
		return id;
	}
	
	public int updateGroupMember(Member member) throws DataAccessException {
		String sql = "UPDATE mm_group_member SET status = ? ";
		return getJdbcTemplate().update(sql, 
				new Object[]{ member.getMemberStatus().getId() });
	}

	@Override
	public int deleteGroupMember(int groupId, int userId) throws DataAccessException {
		String sql = "DELETE FROM mm_group_member " +
			"WHERE groupid = ? AND userid = ?";

		return getJdbcTemplate().update(sql, 
			new Object[]{
				groupId,
				userId});
	}

	@Override
	public int deleteGroupMember(int id) throws DataAccessException {
		String sql = "DELETE FROM mm_group_member " +
			"WHERE id = ?";
		
		return getJdbcTemplate().update(sql, 
			new Object[]{id});
	}
	
	@Override
	public int deleteGroupMemberInGroup(int groupId) throws DataAccessException {
		String sql = "DELETE FROM mm_group_member " +
			"WHERE groupid = ?";
		
		return getJdbcTemplate().update(sql, 
			new Object[]{groupId});
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Category> getUserCategoryTree(int userid) throws DataAccessException {
		String sql = 
			"SELECT  c.id,  " +
			"        CASE WHEN g.name IS NULL THEN c.name ELSE g.name END AS NAME, " +
			"        c.lft, " +
			"        c.rgt, " +
			"        c.parentid, " +
			"        c.depth," +
			"        c.is_leaf  " +
			"FROM mm_categories_view c " +
			"LEFT JOIN mm_group g  ON g.categoryid = c.id " +
			"WHERE g.userid = ? " +
			"   OR c.id = 1 " +
			"ORDER BY c.lft";
		
		return getJdbcTemplate().query(sql, new Object[]{userid}, new CategoryRowMapper());
	}

	@Override
	public int insertGroupPassword(int groupId, String password) throws DataAccessException {
		String sql = "INSERT INTO mm_group_password (groupid, password) " +
				"VALUES (?, ?)";
		
		return getJdbcTemplate().update(sql, new Object[]{groupId, password});
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Group> getMemberGroups(int userId) throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM +
				"JOIN mm_group_member m ON g.id = m.groupid " +
				"WHERE m.userid = ? " +
				"ORDER BY g.name ";
		
		return getJdbcTemplate().query(sql, 
				new Object[]{userId},
				new GroupRowMapper());
	}
	
	@Override
	public List<Group> getMemberGroups(int userId, int page, int pageLimit,
			String searchfield, String search, String sort, boolean isAsc)
			throws DataAccessException {
			String sql = SQL_GROUP_SELECT_FROM +
			"JOIN mm_group_member m ON g.id = m.groupid " +
			"WHERE m.userid = ? ";
			ArrayList params = new ArrayList();
			params.add(userId);
			if (search != null && search.trim().length() > 0) {
				sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
				params.add(search.trim());
			}
			if(pageLimit>0){
				sql += " LIMIT ? OFFSET ?";
				params.add(pageLimit);
				params.add((page-1)*pageLimit);
			}
			sql += "ORDER BY g.name ";
			//System.out.println("sql : "+sql);
			
			
	
			return getJdbcTemplate().query(sql, new Object[]{ params.toArray()},new GroupRowMapper());
	}

	@Override
	public int countMemberGroups(int userId, String searchfield, String search)
			throws DataAccessException {
		String sql = "select count(id) from ("+ SQL_GROUP_SELECT_FROM +
		"JOIN mm_group_member m ON g.id = m.groupid " +
		"WHERE m.userid = ? ";
		ArrayList params = new ArrayList();
		params.add(userId);
		if (search != null && search.trim().length() > 0) {
			sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		sql += ") AS tempA ";
		return getJdbcTemplate().queryForInt(sql, params.toArray());
	}

	
	
	@SuppressWarnings("unchecked")
	public List<MemberStatus> getMemberStatuses() throws DataAccessException {
		String sql = "SELECT s.* FROM mm_group_member_status_type s";
		
		return getJdbcTemplate().query(sql, new MemberStatusRowMapper());
	}
	
	public MemberStatus getMemberStatus(String shortname) throws DataAccessException {
		String sql = "SELECT s.* " +
				"FROM mm_group_member_status_type s " +
				"WHERE s.shortname = ? ";
		
		return (MemberStatus) getJdbcTemplate().queryForObject(sql, 
				new Object[]{ shortname},
				new MemberStatusRowMapper());
	}
	
	public MemberStatus getMemberStatus(int groupId, int userId) throws DataAccessException {
		String sql = "SELECT s.* " +
				"FROM mm_group_member m " +
				"JOIN mm_group_member_status_type s ON s.id = m.status " +
				"WHERE m.groupid = ? " +
				"  AND m.userid = ? ";
		
		return (MemberStatus) getJdbcTemplate().queryForObject(sql,
				new Object[]{groupId, userId},
				new MemberStatusRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<Group> getNotMemberGroups(int userId) throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM +
		"WHERE g.userid != ? " +
		"  AND p.shortname != 'closed' " +
		"  AND g.id NOT IN (SELECT m.groupid " +
		"                   FROM mm_group_member m " +
		"                   WHERE m.userid = ? ) " +
		"ORDER BY g.name ";

		return getJdbcTemplate().query(sql, 
				new Object[]{userId, userId},
				new GroupRowMapper());
	}
	
	
	@Override
	public List<Group> getNotMemberGroups(int userId, int page, int pagelimit,
			String searchfield, String search, String sort, boolean isAsc)
			throws DataAccessException {
		String sql = SQL_GROUP_SELECT_FROM +
		"WHERE g.userid != ? " +
		"  AND p.shortname != 'closed' " +
		"  AND g.id NOT IN (SELECT m.groupid " +
		"                   FROM mm_group_member m " +
		"                   WHERE m.userid = ? ) ";
		
		
			ArrayList params = new ArrayList();
			params.add(userId);
			params.add(userId);
			if (search != null && search.trim().length() > 0) {
			sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
			}
			if (SEARCH_PARAMS.containsKey(sort)) {
				sql += " ORDER BY " + SEARCH_PARAMS.get(sort) + (isAsc?" asc ": " desc ");
			}else 
				sql += "ORDER BY g.name ";
			if(pagelimit>0){
			sql += " LIMIT ? OFFSET ?";
			params.add(pagelimit);
			params.add((page-1)*pagelimit);
			}
			
			return getJdbcTemplate().query(sql, 
				params.toArray(), new GroupRowMapper());
	}
	
	@Override
	public int countNotMemberGroups(int userId, String searchfield,	String search) {
		String sql = "select count(id) from ("+SQL_GROUP_SELECT_FROM +
		"WHERE g.userid != ? " +
		"  AND p.shortname != 'closed' " +
		"  AND g.id NOT IN (SELECT m.groupid " +
		"                   FROM mm_group_member m " +
		"                   WHERE m.userid = ? ) ";
		
		
		ArrayList params = new ArrayList();
		params.add(userId);
		params.add(userId);
		if (search != null && search.trim().length() > 0) {
			sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		sql += ") AS tempT";
		
		
		//System.out.println("count:"+sql);
		return getJdbcTemplate().queryForInt(sql, params.toArray());
	}


	@SuppressWarnings("unchecked")
	@Override
	public List<Member> getGroupMembers(int groupId) throws DataAccessException {
		String sql = SQL_MEMBER_SELECT_FROM +
		             "WHERE m.groupid = ? ";
		
		return getJdbcTemplate().query(sql, 
				new Object[]{groupId}, 
				new MemberRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Member> getGroupMembers(int groupId, int status)
			throws DataAccessException {
		String sql = SQL_MEMBER_SELECT_FROM +
        "WHERE m.groupid = ? " +
        "  AND m.status = ? ";
		
		return getJdbcTemplate().query(sql, 
			new Object[]{groupId, status}, 
			new MemberRowMapper());
	}
	
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Member> getGroupMembers(int groupId,  int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc) throws DataAccessException {
		String sql = SQL_MEMBER_SELECT_FROM +
		             "WHERE m.groupid = ? ";
		ArrayList params = new ArrayList();
		params.add(groupId);
		if (search != null && search.trim().length() > 0) {
			sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		if (SEARCH_PARAMS.containsKey(sort)) {
			sql += " ORDER BY " + SEARCH_PARAMS.get(sort) + (isAsc?" asc ": " desc ");
		}
		if(pagelimit>0){
			sql += " LIMIT ? OFFSET ?";
			params.add(pagelimit);
			params.add((page-1)*pagelimit);
		}
		
		return getJdbcTemplate().query(sql, 
				params.toArray(), 
				new MemberRowMapper());
	}
	
	
	@Override
	public int countGroupMembers(int groupId, String searchfield, String search)
			throws DataAccessException {
		
		
		String sql = "select count(id) from ("+SQL_MEMBER_SELECT_FROM +
        "WHERE m.groupid = ? ";
		
		
		ArrayList params = new ArrayList();
		params.add(groupId);
		if (search != null && search.trim().length() > 0) {
			sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		sql += ") AS tempT";
		
		
		//System.out.println("count:"+sql);
		return getJdbcTemplate().queryForInt(sql, params.toArray());
	}
	
	
	
	
	/**
	 * 현재 그룹에 속하지 않은 멤버들을 반환한다. 
	 */
	@SuppressWarnings("unchecked")
	public List<User> getNotGroupMembers(int groupId) throws DataAccessException {
		String sql = "SELECT u.* " +
				"FROM mm_user u " +
				"WHERE u.id NOT IN ( SELECT m.userid " +
				"                    FROM mm_group_member m" +
				"                    WHERE m.groupid = ? ) " +
				"  AND u.id != (SELECT g.userid FROM mm_group g WHERE g.id = ?) " +
				"  AND u.username != 'guest' ";
		
		return getJdbcTemplate().query(sql, 
				new Object[]{ groupId, groupId },
				new UserRowMapper());
	}
	 
	/**
	 * 현재 그룹에 속하지 않은 멤버들을 반환한다.
	 * 검색 및 페이지 기능을 제공한다.
	 * 2012. 2. 9 
	 */
	
	
	 @SuppressWarnings("unchecked")
		public List<User> getNotGroupMembers(int groupId,  int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc) throws DataAccessException {
			String sql = "SELECT u.* " +
					"FROM mm_user u " +
					"WHERE u.id NOT IN ( SELECT m.userid " +
					"                    FROM mm_group_member m" +
					"                    WHERE m.groupid = ? )  AND u.username != 'guest' ";
//			"  AND u.id != (SELECT g.userid FROM mm_group g WHERE g.id = ?) " +
			ArrayList params = new ArrayList();
			params.add(groupId);
			if (search != null && search.trim().length() > 0) {
				sql += " and " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
				params.add(search.trim());
			}
			if (SEARCH_PARAMS.containsKey(sort)) {
				sql += " ORDER BY " + SEARCH_PARAMS.get(sort) + (isAsc?" asc ": " desc ");
			}
			if(pagelimit>0){
				sql += " LIMIT ? OFFSET ?";
				params.add(pagelimit);
				params.add((page-1)*pagelimit);
			}
			
			return getJdbcTemplate().query(sql, 
					params.toArray() ,
					new UserRowMapper());
		}
	 
	 
	 @Override
		public int getNotGroupMembersCount(int groupId, String searchfield,
				String search) throws DataAccessException {
		 String sql = "SELECT count(u.id) " +
			"FROM mm_user u " +
			"WHERE u.id NOT IN ( SELECT m.userid " +
			"                    FROM mm_group_member m" +
			"                    WHERE m.groupid = ? )  AND u.username != 'guest' ";

			ArrayList<Object> params = new ArrayList<Object>();
			params.add(groupId);

			if (search != null && search.trim().length() > 0) {
				sql += " AND " + SEARCH_PARAMS.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
				params.add(search.trim());
			}
			
			return getJdbcTemplate().queryForInt(sql, params.toArray());
			
		}
	
	
	
	public Member getGroupMember(int id) throws DataAccessException {
		String sql = SQL_MEMBER_SELECT_FROM +
        "WHERE m.id = ? ";
		
		return (Member) getJdbcTemplate().queryForObject(sql, 
			new Object[]{id },
			new MemberRowMapper());
	}

	@Override
	public int updateGroupPassword(int groupId, String password) 
			throws DataAccessException {
		String sql = "UPDATE mm_group_password " +
				"  SET password = ? " +
				"WHERE groupid = ? ";
		return getJdbcTemplate().update(sql, 
				new Object[]{
					password,
					groupId
					});
	}
	
	@Override
	public int deleteGroupPassword(int groupId) throws DataAccessException {
		String sql = "DELETE FROM mm_group_password " +
				"WHERE groupid = ? ";
		return getJdbcTemplate().update(sql, 
				new Object[]{groupId});
	}

	@Override
	public boolean isMember(int groupId, int userId) throws DataAccessException {
		String sql = 
			"SELECT CASE " +
			        "WHEN EXISTS (   SELECT m.id " +
			        "                FROM mm_group_member m " +
			        "                JOIN mm_group_member_status_type s ON s.id = m.status " +
			        "                WHERE s.shortname = 'approved' " +
			        "                  AND m.groupid = ? " +
			        "                  AND m.userid = ? ) " +
			        "THEN TRUE  " +
			        "ELSE FALSE END AS is_member ";
		
		return (Boolean) getJdbcTemplate().queryForObject(sql, 
				new Object[]{groupId, userId},
				Boolean.class);
	}

	

	
}
