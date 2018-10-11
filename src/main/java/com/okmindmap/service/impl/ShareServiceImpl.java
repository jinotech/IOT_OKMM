package com.okmindmap.service.impl;

import java.util.List;

import com.okmindmap.dao.GroupDAO;
import com.okmindmap.dao.ShareDAO;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareType;
import com.okmindmap.service.ShareService;

public class ShareServiceImpl implements ShareService {
	private GroupDAO groupDAO;
	private ShareDAO shareDAO;
	
	public void setGroupDAO(GroupDAO groupDAO) {
		this.groupDAO = groupDAO;
	}
	public void setShareDAO(ShareDAO shareDAO) {
		this.shareDAO = shareDAO;
	}
	
	@Override
	public List<ShareMap> getSharedMaps(int userId) {
		return this.shareDAO.getUserSharedMaps(userId);
	}
	
	public List<ShareMap> getSharedMaps(int userId, String map_key) {
		return this.shareDAO.getUserSharedMaps(userId, map_key);
	}
	
	@Override
	public ShareType getShareType(String shortName) {
		return this.shareDAO.getShareType(shortName);
	}
	@Override
	public List<ShareType> getShareTypes() {
		return this.shareDAO.getShareTypes();
	}
	
	@Override
	public List<PermissionType> getPermissionTypes() {
		return this.shareDAO.getPermissionTypes();
	}
	@Override
	public int addShare(Share share) {
		return this.shareDAO.insertShare(share);
	}
	@Override
	public int deleteShare(int shareId) {
		return this.shareDAO.deleteShare(shareId);
	}
	@Override
	public Share getShare(int shareId) {
		return this.shareDAO.getShare(shareId);
	}
	@Override
	public List<Share> getShares(String shareType) {
		return this.shareDAO.getSharesByType(shareType);
	}
	@Override
	public List<Share> getShares(int groupId) {
		return this.shareDAO.getSharesByGroup(groupId);
	}
	@Override
	public List<Share> getShares(List<String> groupIds) {
		return this.shareDAO.getSharesByGroups(groupIds);
	}
	@Override
	public ShareMap getSharedMap(int mapId) {
		return this.shareDAO.getSharedMap(mapId);
	}
	@Override
	public List<ShareMap> getGroupSharedMaps(int groupId) {
		return this.shareDAO.getGroupSharedMaps(groupId);
	}
	@Override
	public List<ShareMap> getGroupSharedMaps(List<String> groupIds) {
		return this.shareDAO.getGroupSharedMaps(groupIds);
	}
	@Override
	public List<ShareMap> getSharedMaps(String shareType) {
		return this.shareDAO.getSharedMaps(shareType);
	}
	@Override
	public int updateShare(Share share) {
		return this.shareDAO.updateShare(share);
	}
	@Override
	public List<Share> getSharesByMap(int mapId) {
		return this.shareDAO.getSharesByMap(mapId);
	}
	@Override
	public int countShares(int userId, String search) {
		return this.shareDAO.countShares(userId, search);
	}
	@Override
	public int countAllShares() {
		return this.shareDAO.countAllShares();
	}
	
	public int countAllShares(String searchfield, String search) {
		return this.shareDAO.countAllShares(searchfield, search);
	}
	
	@Override
	public List<Share> getAllShares(int page, int pagelimit, String sort) {
		return this.shareDAO.getAllShares(page, pagelimit, sort);
	}
	
	public List<Share> getAllShares(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc) {
		return this.shareDAO.getAllShares(page, pagelimit, searchfield, search, sort, isAsc);
	}
	
	@Override
	public List<Share> getShares(int userId, int page, int pagelimit,
			String search, String sort) {
		return this.shareDAO.getShares(userId, page, pagelimit, search, sort);
	}
	
	private int offset(int page, int page_size) {
		return (page - 1) * page_size;
	}
}
