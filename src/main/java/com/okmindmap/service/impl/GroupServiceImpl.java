package com.okmindmap.service.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import com.okmindmap.dao.CategoryDAO;
import com.okmindmap.dao.GroupDAO;
import com.okmindmap.dao.ShareDAO;
import com.okmindmap.model.Category;
import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.group.Member;
import com.okmindmap.model.group.MemberStatus;
import com.okmindmap.model.group.Policy;
import com.okmindmap.model.share.Share;
import com.okmindmap.service.GroupService;
import com.okmindmap.util.PasswordEncryptor;

public class GroupServiceImpl implements GroupService {
	private GroupDAO groupDAO;
	private CategoryDAO categoryDAO;
	private ShareDAO shareDAO;
	
	public void setGroupDAO(GroupDAO groupDAO) {
		this.groupDAO = groupDAO;
	}
	public void setCategoryDAO(CategoryDAO categoryDAO) {
		this.categoryDAO = categoryDAO;
	}
	public void setShareDAO(ShareDAO shareDAO) {
		this.shareDAO = shareDAO;
	}
	
	@Override
	public int addGroup(Group group) {
		return this.addGroup(group, 1);
	}
	
	@Override
	public int addGroup(Group group, int parentId) {
		// 카테고리 생성
		int categoryId = this.categoryDAO.insertCategory(group.getName(), parentId);
		group.setCategory(this.categoryDAO.getCategory(categoryId));
		
		Timestamp current = new Timestamp(new Date().getTime());
		group.setCreated(current);
		group.setModified(current);
		
		// 그룹 생성
		int groupId = this.groupDAO.insertGroup(group);
		
		if(group.getPolicy().getShortName().equals("password")) {
			try {
				group.setPassword( PasswordEncryptor.encrypt(group.getPassword()) );
			} catch (Exception e) {
				e.printStackTrace();
			}
			this.groupDAO.insertGroupPassword(groupId, group.getPassword() );
		}
		
		return groupId;
	}

	@Override
	public int updateGroup(Group group) {
		
		Group oldGroup = this.groupDAO.getGroup(group.getId());
		if(oldGroup.getCategory().getParentId() != group.getCategory().getParentId()) {
			this.categoryDAO.moveCategory(group.getCategory().getId(), group.getCategory().getParentId());
		}
		
		if(oldGroup.getPolicy().getShortName().equals("password") 
				&& !group.getPolicy().getShortName().equals("password") ) {
			this.groupDAO.deleteGroupPassword(group.getId());
		} else if(group.getPolicy().getShortName().equals("password")) {
			try {
				group.setPassword( PasswordEncryptor.encrypt(group.getPassword()) );
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			if(oldGroup.getPolicy().getShortName().equals("password")) {
				this.groupDAO.updateGroupPassword(group.getId(), group.getPassword());
			} else {
				this.groupDAO.insertGroupPassword(group.getId(), group.getPassword());
			}
		}
		
		return this.groupDAO.updateGroup(group);
	}
	
	@Override
	public int deleteGroup(int id) {
		Group group = this.getGroup(id);
		
		if(!group.getCategory().isLeaf()) {
			throw new RuntimeException("This Group is not leaf :" + group.getName() );
		}
		
		// 공유 삭제
		List<Share> shares = this.shareDAO.getSharesByGroup(id);
		for(Share share : shares) {
			this.shareDAO.deleteShare(share.getId());
		}
		
		// 카테고리 삭제
		this.categoryDAO.deleteCategory(group.getCategory().getId());
		
		return this.groupDAO.deleteGroup(id);
	}

	@Override
	public int addMember(int groupId, int userId, boolean isApproved) {
		MemberStatus status = isApproved ? this.groupDAO.getMemberStatus("approved") :
			this.groupDAO.getMemberStatus("waiting");
		
		return this.groupDAO.insertGroupMember(groupId, userId, status.getId());
	}
	
	public int updateMember(Member member) {
		return this.groupDAO.updateGroupMember(member);
	}
	
	@Override
	public int removeMember(int groupId, int userId) {
		return this.groupDAO.deleteGroupMember(groupId, userId);
	}
	
	public Group getGroup(int id) {
		return this.groupDAO.getGroup(id);
	}
	
	@Override
	public List<Group> getGroups(int page, int pageLimit) {
		return this.groupDAO.getGroups(page, pageLimit);
	}
	@Override
	public List<Group> getGroups(int page, int pageLimit, String searchfield, String search, String sort, boolean isAsc) {
		return this.groupDAO.getGroups(page, pageLimit, searchfield, search, sort, isAsc);
	}
	@Override
	public List<Group> getGroups(int userId) {
		return this.groupDAO.getGroups(userId);
	}
	public List<Group> getGroupsByPolicy(int policyId) {
		return this.groupDAO.getGroupsByPolicy(policyId);
	}
	@Override
	public List<Policy> getPolicies() {
		return this.groupDAO.getPolicies();
	}
	@Override
	public Policy getPolicy(int id) {
		return this.groupDAO.getPolicy(id);
	}
	@Override
	public Policy getPolicy(String shortName) {
		return this.groupDAO.getPolicy(shortName);
	}
	
	public Category getCategory(int id) {
		return this.categoryDAO.getCategory(id);
	}
	
	public List<Category> getCategoryTree(int id) {
		return this.categoryDAO.getCategoryTree(id);
	}
	
	@Override
	public List<Category> getUserCategoryTree(int userid) {
		return this.groupDAO.getUserCategoryTree(userid);
	}
	
	public List<Group> getMemberGroups(int userId) {
		List<Group> groups = this.groupDAO.getMemberGroups(userId);
		
		for(Group group : groups) {
			group.setMemberStatus(this.groupDAO.getMemberStatus(group.getId(), userId));
		}
		
		return groups;
	}
	
	public List<Group> getNotMemberGroups(int userId){
		return this.groupDAO.getNotMemberGroups(userId);
	}
	
	@Override
	public List<Group> getNotMemberGroups(int userId, int page, int pagelimit,
			String searchfield, String search, String sort, boolean isAsc) {
		return this.groupDAO.getNotMemberGroups(userId,  page, pagelimit, searchfield, search, sort, isAsc);
	}
	
	@Override
	public int countNotMemberGroups(int userId, String searchfield,
			String search) {
		return this.groupDAO.countNotMemberGroups(userId, searchfield, search);
	}
	
	
	
	
	public List<User> getNotGroupMembers(int groupId) {
		return this.groupDAO.getNotGroupMembers(groupId);
	}
	
	public List<User> getNotGroupMembers(int groupId,  int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc) {
		return this.groupDAO.getNotGroupMembers(groupId, page, pagelimit, searchfield, search, sort, isAsc);
	}
	
	@Override
	public List<Member> getGroupMembers(int groupId) {
		return this.groupDAO.getGroupMembers(groupId);
	}
	
	@Override
	public List<Member> getGroupMembers(int groupId, int status) {
		return this.groupDAO.getGroupMembers(groupId, status);
	}
	
	@Override
	public List<Member> getGroupMembers(int groupId, int page, int pageLimit,
			String searchfield, String search, String sort, boolean isAsc) {

		return this.groupDAO.getGroupMembers(groupId, page, pageLimit, searchfield, search, sort, isAsc);
	}
	@Override
	public int countGroupMembers(int groupId, String searchfield, String search) {
		return this.groupDAO.countGroupMembers(groupId, searchfield, search);
	}
	
	
	public Member getGroupMember(int id) {
		return this.groupDAO.getGroupMember(id);
	}
	
	@Override
	public int setMemberStatus(int id, String status) {
		Member member = this.getGroupMember(id);
		MemberStatus memberStatus = this.groupDAO.getMemberStatus(status);
		
		member.setMemberStatus(memberStatus);
		
		return this.groupDAO.updateGroupMember(member);
	}
	@Override
	public boolean isMember(int groupId, int userId) {
		return this.groupDAO.isMember(groupId, userId);
	}
	@Override
	public List<Group> getGroups(int userId, int page, int pageLimit, String searchfield, String search, String sort, boolean isAsc) {
		return this.groupDAO.getGroups(userId, page, pageLimit, searchfield, search, sort, isAsc);
	}
	@Override
	public int getNotGroupMembersCount(int groupId, String searchfield,
			String search) {
		return this.groupDAO.getNotGroupMembersCount(groupId, searchfield, search);
	}
	
	
	@Override
	public int  countAllGroups() {
		return this.groupDAO.countAllGroups();
	}
	@Override
	public int  countGroups(int userId, String searchfield, String search) {
		return this.groupDAO.countGroups(userId,searchfield, search);
	}
	@Override
	public List<Group> getMemberGroups(int userId, int page, int pageLimit,
			String searchfield, String search, String sort, boolean isAsc) {
		return this.groupDAO.getMemberGroups(userId, page, pageLimit, searchfield, search, sort, isAsc);
	}
	@Override
	public int countMemberGroups(int userId, String searchfield,
			String search) {
		return this.groupDAO.countMemberGroups(userId, searchfield, search);
	}
	
	
	
}
