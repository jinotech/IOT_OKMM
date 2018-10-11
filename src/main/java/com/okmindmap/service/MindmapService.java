package com.okmindmap.service;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.dao.MindmapDAO;
import com.okmindmap.model.Map;
import com.okmindmap.model.MapTimeline;
import com.okmindmap.model.Node;
import com.okmindmap.model.Slide;
import com.okmindmap.model.User;
import com.okmindmap.model.admin.RecommendList;
import com.okmindmap.model.share.Share;

// Spring Framework
public interface MindmapService {
	public MindmapDAO getMindmapDAO();
	
	/**
	 * 맵 Timeline을 만든다.
	 * @param mapId
	 * @return
	 */
	public int makeMapTimeline(int mapId);
	public MapTimeline getMapTimeline(int id);
	public List<MapTimeline> getMapTimelines(int mapId);
	
	/**
	 * 중복된 이름이 있는지를 확인하기 위하여 count를 가져옴
	 */
	 
	public int countDuplicateMapName(int userid, String mapName);
	
	
//	public List<Map> getAllMaps();
	public List<Map> getAllMaps(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc);
	public List<Map> getUserMaps(int userid);
	public List<Map> getUserMaps(int userid, String searchMapName);
	public List<Map> getUserMaps(int userid, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public List<Share> getMyShares(int userid);
	public List<Share> getMyShares(int userid, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public List<Map> getPublicMaps(int sharetype);
	public List<Map> getPublicMaps(int sharetype, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public List<Map> getAllMaps(int sharetype, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public List<Map> getGuestMaps(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc);
	
	public int countUserMaps(int userid, String searchfield, String search);
	public int countGuestMaps(String searchfield, String search);
	public int countAllMaps(String searchfield, String search);
	
	public int countMyShares(int userId, String searchfield, String search) ;
	public int countPublicMaps(int sharetype, String searchfield, String search);
	public int countAllMaps(int sharetype, String searchfield, String search);
	
	public Map getMap(int mapId);
	public Map getMap(int mapId, boolean allChild);
	public Map getMap(String key);
	public Map getMap(String key, boolean allChild);
	public Map getMapInfo(String key);
	
	public Node getNode(int id, boolean withChildren);
	public Node getNode(String identity, int map_id, boolean withChildren);
	public List<Node> getChildNodes(int nodeId, boolean alldescendant);
	public List<Node> getPathToRoot(Node node);
	
	
	public int saveMap(Map map);
	public int saveMap(Map map, int userid);
	public int saveMap(Map map, String email, String password);
	
	public int updateMap(Map map);
	
	/** 맵 정보 변경 **/
	public int updateshortUrl(int mapId, String short_url);
	public String updateMapTitle(int mapId, String title);
	public String updateMapStyle(int mapId, String style);
	public String updateMapLazyloading(int mapId, int lazyloading);
	public String updatePresentationSequence(int mapId, String pt_sequence);
	public String updateQueueing(int mapId, int queueing);
	
	public void setOwner(int mapid, int userid);
	public void setOwnerInfo(int mapid, String email, String password);
	public User getMapOwner(int mapId);
	
	public int deleteMap(int mapId);
	
	public int newMap(String text);
	public int newMap(String text, int userid);
	public int newMap(String text, String email, String password);
	
	/**
	 * 실시간 저장을 위해 추가
	 */
	public int updateNode(int mapId, Node node);
	public int deleteNode(int mapId, Node node);
	public int moveNode(int mapId, Node node, String parent, String next);
	public int newNodeBeforeSibling(int mapId, Node node, String parent, String next);
	public int newNodeAfterSibling(int mapId, Node node, String parent, String before);
	
	public int getMapofMapId(int userid);
	public int insertMapofMap(int userid, int mapId);
	public int deleteMapofMap(int mapId);
	
	public int increaseViewCount(String mapKey);
	public int increaseViewCount(int mapId);
	
	/**
	 * Presentation
	 */
	public Slide getSlide(int nodeId);
	public int insertSlide(int nodeId, double x, double y, double scalex, double scaley, double rotate, int showdepths);
	public int updateSlide(int nodeId, double x, double y, double scalex, double scaley, double rotate,  int showdepths);
	public int deleteSlide(int nodeId);
	
	/*
	 * admin 추천맵
	 */
	
	public List<Map> getMapRecommend(int page, int pagelimit, String searchfield, String search) throws DataAccessException;
	public int countAllRecommendMaps(String searchfield, String search) throws DataAccessException;
	public int deleteRecommendList(int mapId ) throws DataAccessException;

	int insertRecommendMap(int mapId, long added, String imgURL);
	public List<RecommendList> getRecommendManagementList(int page, int pagelimit, String searchfield, String search) throws DataAccessException;
	public int countAllRecommendManagementList(String searchfield, String search) throws DataAccessException;
	public int deleteRecommendManagementList(int recommendId ) throws DataAccessException;

	public List getRecommendFilePath(int recommendId);
	
	public int updateNodeLineColor(String dbid, String color);
}
