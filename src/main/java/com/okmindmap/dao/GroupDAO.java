package com.okmindmap.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.Category;
import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.group.Member;
import com.okmindmap.model.group.MemberStatus;
import com.okmindmap.model.group.Policy;

public interface GroupDAO {
	public int insertGroup(Group group) throws DataAccessException;
	public int updateGroup(Group group) throws DataAccessException;
	public int deleteGroup(int id) throws DataAccessException;
	
	/**
	 * 생성되어 있는 그룹 정보를 반환한다.
	 * @param id
	 * @return
	 */
	public Group getGroup(int id) throws DataAccessException;
	
	/**
	 * 그룹 정책 정보를 반환한다.
	 * @param id
	 * @return
	 */
	public Policy getPolicy(int id) throws DataAccessException;
	public Policy getPolicy(String shortName) throws DataAccessException;
	
	/**
	 * 모든 그룹을 반환한다.
	 * @return
	 */
	public List<Group> getGroups(int page, int pageLimit) throws DataAccessException;
	public List<Group> getGroups(int page, int pageLimit, String searchfield, String search, String sort, boolean isAsc) throws DataAccessException;
	
	public int countAllGroups() throws DataAccessException;
	
	
	/**
	 * 페이지 기능이 추가 되면서.. 모든 그룹을 반환한다.
	 * 
	 * @return
	 */
	public List<Group> getGroups(int userId, int page, int pageLimit, String searchfield, String search, String sort, boolean isAsc) throws DataAccessException;
	
	public int countGroups(int userId,String searchfield, String search) throws DataAccessException;
	
	
	
	/**
	 * 사용자가 관리하는 그룹 목록을 반환한다.
	 * @param userId
	 * @return
	 */
	public List<Group> getGroups(int userId) throws DataAccessException;
	
	/**
	 * 그룹 정책에 해당하는 그룹 목록을 반환한다.
	 * @param policyId
	 * @return
	 * @throws DataAccessException
	 */
	public List<Group> getGroupsByPolicy(int policyId) throws DataAccessException;
	
	/**
	 * 그룹 정책들을 반환한다.
	 * @return
	 */
	public List<Policy> getPolicies() throws DataAccessException;
	
	public int insertGroupMember(int groupId, int userId, int status) throws DataAccessException;
	public int updateGroupMember(Member member) throws DataAccessException;
	public int deleteGroupMember(int groupId, int userId) throws DataAccessException;
	public int deleteGroupMember(int id) throws DataAccessException;
	public int deleteGroupMemberInGroup(int groupId) throws DataAccessException;
	
	public List<Category> getUserCategoryTree(int userid) throws DataAccessException;
	
	public int insertGroupPassword(int groupId, String password) throws DataAccessException;
	public int updateGroupPassword(int groupId, String password) throws DataAccessException;
	public int deleteGroupPassword(int groupId) throws DataAccessException;
	
	/**
	 * 사용자가 가입되어 있는 그룹 목록을 반환한다.
	 * @param userId
	 * @return
	 */
	public List<Group> getMemberGroups(int userId) throws DataAccessException;
	
	public List<Group> getMemberGroups(int userId, int page, int pageLimit,
			String searchfield, String search, String sort, boolean isAsc) throws DataAccessException;
	
	public int countMemberGroups(int userId, String searchfield, String search) throws DataAccessException;
	
	/**
	 * 사용자가 가입 가능한 그룹 목록을 반환한다. (전체 그룹명 조회 - 그룹가입을 위하여)
	 * 이미 가입된 그룹, 가입 정책이 closed 인 그룹은 제외된다.
	 * @param userId
	 * @return
	 * @throws DataAccessException
	 */
	public List<Group> getNotMemberGroups(int userId) throws DataAccessException;
	public List<Group> getNotMemberGroups(int userId, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc) throws DataAccessException;
	public int countNotMemberGroups(int userId, String searchfield, String search);
	
	public List<MemberStatus> getMemberStatuses() throws DataAccessException;
	public MemberStatus getMemberStatus(String shortname) throws DataAccessException;
	/**
	 * 사용자의 그룹 승인 상태를 반환한다.
	 * @param groupId
	 * @param userId
	 * @return 승인이 된 경우 1, 승인이 안된 경우 0 를 반환한다.
	 * @throws DataAccessException
	 */
	public MemberStatus getMemberStatus(int groupId, int userId) throws DataAccessException;
	
	
	
	public List<User> getNotGroupMembers(int groupId) throws DataAccessException;
	public List<User> getNotGroupMembers(int groupId, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc) throws DataAccessException;
	public int getNotGroupMembersCount(int groupId,  String searchfield, String search) throws DataAccessException;
	
	public List<Member> getGroupMembers(int groupId) throws DataAccessException;
	public List<Member> getGroupMembers(int groupId, int status) throws DataAccessException;
	public List<Member> getGroupMembers(int groupId, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc) throws DataAccessException;
	public int countGroupMembers(int groupId, String searchfield, String search) throws DataAccessException;
	
	
	public Member getGroupMember(int id) throws DataAccessException;
	
	public boolean isMember(int groupId, int userId) throws DataAccessException;
}
