package com.okmindmap.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.share.ShareMap;
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareType;

public interface ShareDAO {
	public ShareMap getSharedMap(int mapId) throws DataAccessException;
	public List<ShareMap> getUserSharedMaps(int userId) throws DataAccessException;
	public List<ShareMap> getUserSharedMaps(int userId, String map_key) throws DataAccessException;
	public List<ShareMap> getSharedMaps(String shareType) throws DataAccessException;
	public List<ShareMap> getGroupSharedMaps(int groupId) throws DataAccessException;
	public List<ShareMap> getGroupSharedMaps(List<String> groupIds) throws DataAccessException;
	public List<ShareMap> getNotSharedMaps(int userId) throws DataAccessException;
	
	public int insertShare(Share share) throws DataAccessException;
	
//	public List<Share> getShares(int offset, int limit, String search) throws DataAccessException;
//	public int countShares(String search) throws DataAccessException;
	public List<Share> getShares(int userId, int offset, int limit, String search, String sort) throws DataAccessException;
	public List<Share> getAllShares(int page, int pagelimit, String sort) throws DataAccessException;
	public List<Share> getAllShares(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc) throws DataAccessException;
	public int countShares(int userId, String search) throws DataAccessException;
	public int countAllShares() throws DataAccessException;
	public int countAllShares(String searchfield, String search) throws DataAccessException;
	
	/**
	 * 맵에 대한 공유들을 반환
	 * @param mapId
	 * @return
	 * @throws DataAccessException
	 */
	public List<Share> getSharesByMap(int mapId) throws DataAccessException;
	/**
	 * 그룹에 대한 공유들을 반환
	 * @param groupId
	 * @return
	 * @throws DataAccessException
	 */
	public List<Share> getSharesByGroup(int groupId) throws DataAccessException;
	public List<Share> getSharesByGroups(List<String> groupIds) throws DataAccessException;
	/**
	 * 공유 타입에 대한 공유들을 반환
	 * @param type
	 * @return
	 * @throws DataAccessException
	 */
	public List<Share> getSharesByType(String type) throws DataAccessException;
	public Share getShare(int id) throws DataAccessException;
	
	public int updateShare(Share share) throws DataAccessException;
	public int deleteShare(int id) throws DataAccessException;
	
	public int insertPermission(Permission permission) throws DataAccessException;
	public List<Permission> getPermissions(int shareid) throws DataAccessException;
	public Permission getPermission(int id) throws DataAccessException;
	public int updatePermission(Permission permission) throws DataAccessException;
	public int deletePermission(int id) throws DataAccessException;
	public int deletePermissions(int shareid) throws DataAccessException;
	
	public List<PermissionType> getPermissionTypes() throws DataAccessException;
	public PermissionType getPermissionType(int id) throws DataAccessException;
	public PermissionType getPermissionType(String shortname) throws DataAccessException;
	
	public int insertPassword(int shareId, String password) throws DataAccessException;
	public int updatePassword(int shareId, String password) throws DataAccessException;
	public int deletePasswordByShareId(int shareId) throws DataAccessException;
	
	public int insertShareGroup(int shareId, int groupId) throws DataAccessException;
	public int deleteGroupByShareId(int shareId) throws DataAccessException;
	
	public List<ShareType> getShareTypes() throws DataAccessException;
	public ShareType getShareType(String shortName);
	
}
