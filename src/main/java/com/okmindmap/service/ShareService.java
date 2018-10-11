package com.okmindmap.service;

import java.util.List;

import com.okmindmap.model.Map;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareType;

public interface ShareService {
	public List<ShareMap> getSharedMaps(int userId);
	public List<ShareMap> getSharedMaps(int userId, String map_key);
	public List<ShareMap> getSharedMaps(String shareType);
	public List<ShareMap> getGroupSharedMaps(int groupId);
	public List<ShareMap> getGroupSharedMaps(List<String> groupIds);

	public ShareType getShareType(String shareType);
	public List<ShareType> getShareTypes();

	public List<PermissionType> getPermissionTypes();

	public int addShare(Share share);

	public int deleteShare(int shareId);

	public Share getShare(int shareId);
	public List<Share> getShares(String shareType);
	public List<Share> getShares(int groupId);
	public List<Share> getShares(List<String> groupIds);
	public List<Share> getShares(int userId, int page, int pagelimit, String search, String sort);
	
	public List<Share> getAllShares(int page, int pagelimit, String sort);
	public List<Share> getAllShares(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc);
	
	public int countShares(int userId, String search);
	public int countAllShares();
	public int countAllShares(String searchfield, String search);
	
	public ShareMap getSharedMap(int mapId);

	public int updateShare(Share share);
	public List<Share> getSharesByMap(int mapId);
	
}
