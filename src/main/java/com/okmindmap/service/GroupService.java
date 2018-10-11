package com.okmindmap.service;

import java.util.List;

import com.okmindmap.model.Category;
import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.group.Member;
import com.okmindmap.model.group.Policy;

public interface GroupService {
	public int addGroup(Group group);
	public int addGroup(Group group, int parentId);
	public int updateGroup(Group group);
	public int deleteGroup(int id);
	
	public int addMember(int groupId, int userId, boolean isApproved);
	public int updateMember(Member member);
	public int removeMember(int groupId, int userId);
	
	public Group getGroup(int id);
	public List<Group> getGroups(int page, int pageLimit);
	public List<Group> getGroups(int page, int pageLimit, String searchfield, String search, String sort, boolean isAsc);
	
	public List<Group> getGroups(int userId);
	
	public List<Group> getGroups(int userId, int page, int pageLimit, String searchfield, String search, String sort, boolean isAsc);
	public int countAllGroups();
	public int countGroups(int userId, String searchfield, String search);
	
	/**
	 * 그룹 정책별 group목록을 반환
	 * @param policyId
	 * @return
	 */
	public List<Group> getGroupsByPolicy(int policyId);
	
	public List<Policy> getPolicies();
	public Policy getPolicy(int id);
	
	public Category getCategory(int id);
	public List<Category> getCategoryTree(int id);
	public List<Category> getUserCategoryTree(int userid);
	
	/**
	 * 사용자가 가입한 그룹 목록은 반환한다.
	 * @param userId
	 * @return
	 */
	public List<Group> getMemberGroups(int userId);
	public List<Group> getMemberGroups(int userId, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public int countMemberGroups(int userId,   String searchfield, String search);
	
	/**
	 * 가입되지 않은 그룹 목록을 반환한다. (전체 그룹의 명단)
	 * 자신이 관리자인 그룹, 이미 가입된 그룹, 그룹 정책이 closed 인 그룹은 제외된다.
	 * @param userId
	 * @return
	 */
	public List<Group> getNotMemberGroups(int userId);
	public List<Group> getNotMemberGroups(int userId, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public int countNotMemberGroups(int userId, String searchfield, String search);
	
	
	/**
	 * 그룹의 멤버가 아닌 사용자를 반환한다.
	 * @param groupId
	 * @return
	 */
	public List<User> getNotGroupMembers(int groupId);
	public List<User> getNotGroupMembers(int groupId, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public int getNotGroupMembersCount(int groupId,  String searchfield, String search);

	// 	그룹에 속한 사용자를 가져온다.
	public List<Member> getGroupMembers(int groupId);
	public List<Member> getGroupMembers(int groupId, int status);
	public List<Member> getGroupMembers(int groupId,  int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public int countGroupMembers(int groupId,   String searchfield, String search);
	
	public Member getGroupMember(int id);
	public int setMemberStatus(int id, String status);
	public Policy getPolicy(String shortName);
	
	public boolean isMember(int groupId, int userId);
}
