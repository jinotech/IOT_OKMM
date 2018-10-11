package com.okmindmap.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.okmindmap.model.ArrowLink;
import com.okmindmap.model.Attribute;
import com.okmindmap.model.Cloud;
import com.okmindmap.model.Edge;
import com.okmindmap.model.Font;
import com.okmindmap.model.ForeignObject;
import com.okmindmap.model.Hook;
import com.okmindmap.model.Icon;
import com.okmindmap.model.Map;
import com.okmindmap.model.MapTimeline;
import com.okmindmap.model.Node;
import com.okmindmap.model.Parameter;
import com.okmindmap.model.RichContent;
import com.okmindmap.model.Slide;
import com.okmindmap.model.User;
import com.okmindmap.model.admin.RecommendList;
import com.okmindmap.model.share.Share;


public interface MindmapDAO {
	public int insertMapTimeline(MapTimeline timeline);
	public int deleteMapTimeline(int id);
	public int deleteAllMapTimeline(int map_id);
	public MapTimeline getMapTimeline(int id);
	public List<MapTimeline> getMapTimelines(int mapId);
	
// Insert
	public int insertMap(Map map);
	public int insertNode(Node node, int map_id, int parent_id);
	public int insertNodeBeforeSibling(Node node, int map_id, int parent_id, int next_id);
	public int insertNodeAfterSibling(Node node, int map_id, int parent_id, int before_id);
	public int insertAttribute(Attribute attr, int node_id, int map_id);
	public int insertArrowLink(ArrowLink link, int node_id, int map_id);
	public int insertCloud(Cloud cloud, int node_id, int map_id);
	public int insertEdge(Edge edge, int node_id, int map_id);
	public int insertFont(Font font, int node_id, int map_id);
	public int insertHook(Hook hook, int node_id, int map_id);
	public int insertParameter(Parameter parameter, int hookId);
	public int insertIcon(Icon icon, int node_id, int map_id);
	public int insertRichContent(RichContent content, int node_id, int map_id);
	public int insertForeignObject(ForeignObject content, int node_id, int map_id);
// End of Insert
	
	/**
	 * 중복된 이름이 있는지를 확인하기 위하여 count를 가져옴
	 */
	 
	public int countDuplicateMapName(int userid, String mapName);
	
// Update
	/**
	 * 이름 변경
	 * @param mapId
	 * @param name
	 * @return
	 * @throws DataAccessException
	 */
	public int updateMapTitle(int mapId, String name);
	public int updateMapStyle(int mapId, String style);
	public int updateMapLazyloading(int mapId, int lazyloading);
	public int updateQueueing(int mapId, int queueing);
	public int updatePresentationSequence(int mapId, String pt_sequence);	
	public int updateNode(Node node, int map_id);
	public int updateArrowLink(ArrowLink link);
	public int updateAttribute(Attribute attr);
	public int updateCloud(Cloud cloud);
	public int updateEdge(Edge edge);
	public int updateFont(Font font);
	public int updateIcon(Icon icon);
	public int updateRichContent(RichContent content);
	public int updateShortUrl(int mapId, String short_url);
// End of Update
	
	
// Delete
	public int deleteMap(int id);
	public int deleteMapOwner(int mapid, int userid);
	public int deleteNode(int id, int map_id);
	public int deleteArrowLink(int id);
	public int deleteArrowLinkByNodeId(int node_id);
	public int deleteAttribute(int id);
	public int deleteAttributeByNodeId(int node_id);
	public int deleteCloud(int id);
	public int deleteCloudByNodeId(int node_id);
	public int deleteEdge(int id);
	public int deleteEdgeByNodeId(int node_id);
	public int deleteFont(int id);
	public int deleteFontByNodeId(int node_id);
	public int deleteIcon(int id);
	public int deleteIconByNodeId(int node_id);
	public int deleteRichContent(int id);
	public int deleteRichContentByNodeId(int node_id);
// End of Delete
	
	
// Get
	public Map getMap(int id);
	public Map getMap(int id, boolean allchildren);
	public Map getMap(String key);
	public Map getMap(String key, boolean allchildren);
	public Map getMapInfo(String key);
	public List<Node> getAllNodes(int map_id);
	public Node getRootNode(int map_id);
	public Node getNode(int id);
	public Node getNode(int id, boolean withChildren);
	public Node getNode(String identity, int map_id);
	public Node getNode(String identity, int map_id, boolean withChildren);
	public List<Node> getChildNodes(int id, boolean alldescendant);
	public List<Node> getPathToRoot(int id, int map_id);
	
	public ArrowLink getArrowLink(int id);
	public List<ArrowLink> getArrowLinks(int node_id);
	public Attribute getAttribute(int id);
	public List<Attribute> getAttributes(int node_id);
	public Cloud getCloud(int id);
	public Cloud getCloudByNodeId(int node_id);
	public Edge getEdge(int id);
	public Edge getEdgeByNodeId(int node_id);
	public Font getFont(int id);
	public Font getFontByNodeId(int node_id);
	public Icon getIcon(int id);
	public List<Icon> getIcons(int node_id);
	public RichContent getRichContent(int id);
	public RichContent getRichContentByNodeId(int node_id);

	
	public List<Map> getAllMaps(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc);
	public List<Map> getUserMaps(int user_id);
	public List<Map> getUserMaps(int userid, String searchMapName);
	public List<Map> getUserMaps(int userid, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public List<Map> getGuestMaps(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc);
	
	//나에게 공개된 맵
	public List<Share> getMyShares(int userid);
	public List<Share> getMyShares(int userid, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	//전체 공개맵
	public List<Map> getPublicMaps(int sharetype);
	public List<Map> getPublicMaps(int sharetype, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	public List<Map> getAllMaps(int sharetype, int page, int pagelimit,  String searchfield, String search, String sort, boolean isAsc);
	
	
	public int countAllMaps(String searchfield, String search) ;
	public int countUserMaps(int userId, String searchfield, String search) ;
	public int countGuestMaps(String searchfield, String search) ;
	
	public int countMyShares(int userId, String searchfield, String search) ;
	public int countPublicMaps(int sharetype, String searchfield, String search) ;
	public int countAllMaps(int sharetype, String searchfield, String search) ;
	
// End of Get
	
	
	
// Etc
	public int moveNode(int node_id, int parent_id, int map_id);
	public int moveNodeAfterSibling(int node_id, int before_id, int parent_id, int map_id);
	public int moveNodeBeforeSibling(int node_id, int next_id, int parent_id, int map_id);
	
	public int insertMapOwner(int mapid, int userid);
	public int insertMapOwnerInfo(int mapid, String email, String password);
	public User getMapOwner(int mapid);
	public int deleteMapOwnerInfo(int mapid);
	
	
	public int increaseViewCount(String mapKey);
	public int increaseViewCount(int mapId);
	
	public int getMapofMapId(int userid)  throws DataAccessException;
	public int insertMapofMap(int userid, int mapId)  throws DataAccessException;
	public int deleteMapofMap(int mapId) throws DataAccessException;
	
	public Slide getSlide(int nodeId) throws DataAccessException;
	public int insertSlide(int nodeId, double x, double y, double scalex, double scaley, double rotate, int showdepths) throws DataAccessException;
	public int updateSlide(int nodeId, double x, double y, double scalex, double scaley, double rotate, int showdepths) throws DataAccessException;
	public int deleteSlide(int nodeId) throws DataAccessException;
	
	public List<Map> getMapRecommend(int page, int pagelimit, String searchfield, String search) throws DataAccessException;
	public int countAllRecommendMaps(String searchfield, String search) throws DataAccessException;
	public int deleteRecommendList(int mapId) throws DataAccessException;
	public int insertRecommendMap(int mapId, long added, String imgURL);
	public List<RecommendList> getRecommendManagementList(int page, int pagelimit, String searchfield, String search) throws DataAccessException;
	public int countAllRecommendManagementList(String searchfield, String search) throws DataAccessException;
	public int deleteRecommendManagementList(int recommendId ) throws DataAccessException;
	public List getRecommendFilePath(int recommendId);
	
	public int updateNodeLineColor(String dbid, String color);
}