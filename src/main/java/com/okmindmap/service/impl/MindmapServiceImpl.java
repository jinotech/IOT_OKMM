package com.okmindmap.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.apache.commons.codec.binary.Base64;
import org.springframework.dao.DataAccessException;

import com.okmindmap.MindmapDigester;
import com.okmindmap.dao.MindmapDAO;
import com.okmindmap.model.Map;
import com.okmindmap.model.MapTimeline;
import com.okmindmap.model.Node;
import com.okmindmap.model.Slide;
import com.okmindmap.model.User;
import com.okmindmap.model.admin.RecommendList;
import com.okmindmap.model.share.Share;
import com.okmindmap.service.MindmapService;
import com.okmindmap.util.PasswordEncryptor;

// Spring Framework
public class MindmapServiceImpl implements MindmapService {
	private MindmapDAO mindmapDAO;
	
	public int makeMapTimeline(int mapId) {
		Map map = this.mindmapDAO.getMap(mapId, true);
		
		MapTimeline timeline = new MapTimeline();
		timeline.setMapId(mapId);
		timeline.setXml(map.toXml());
		timeline.setSaved(System.currentTimeMillis());
		
		return this.mindmapDAO.insertMapTimeline(timeline);
	}
	
	public MapTimeline getMapTimeline(int id) {
		return this.mindmapDAO.getMapTimeline(id);
	}
	
	public List<MapTimeline> getMapTimelines(int mapId) {
		return this.mindmapDAO.getMapTimelines(mapId);
	}

	public void setMindmapDAO(MindmapDAO mindmapDAO) {
		this.mindmapDAO = mindmapDAO;
	}

	public MindmapDAO getMindmapDAO() {
		return mindmapDAO;
	}
	
	
	public List<Map> getUserMaps(int userid) {
		return this.mindmapDAO.getUserMaps(userid);
	}

	public List<Map> getUserMaps(int userid, String searchMapName) {
		return this.mindmapDAO.getUserMaps(userid, searchMapName);
	}

	public int countUserMaps(int userId,String searchfield, String search) {
		return this.mindmapDAO.countUserMaps(userId, searchfield, search);
	}
	
	public int countGuestMaps(String searchfield, String search) {
		return this.mindmapDAO.countGuestMaps(searchfield, search);
	}
	
	public Map getMap(int mapId) {
		try {
			return this.getMap(mapId, true);
		} catch (Exception e) {
			return null;
		}
		
	}
	
	public Map getMap(int mapId, boolean allChild) {
		return this.mindmapDAO.getMap(mapId, allChild);
	}
	
	public Map getMap(String key) {
		return this.getMap(key, true);
	}
	
	public Map getMap(String key, boolean allChild) {
		return this.mindmapDAO.getMap(key, allChild);
	}
	
	public Map getMapInfo(String key) {
		return this.mindmapDAO.getMapInfo(key);
	}
	
	public Node getNode(int id, boolean withChildren) {
		return this.mindmapDAO.getNode(id, withChildren);
	}
	
	public List<Node> getChildNodes(int nodeId, boolean alldescendant) {
		return this.mindmapDAO.getChildNodes(nodeId, alldescendant);
	}
	
	public Node getNode(String identity, int map_id, boolean withChildren){
		return this.mindmapDAO.getNode(identity, map_id, withChildren);
	}
	
	public int saveMap(Map map) {
		map.setKey(generateKey());
		map.setCreated(System.currentTimeMillis());
		
		return this.mindmapDAO.insertMap(map);
	}
	
	public int saveMap(Map map, int userid) {
		int mapid = saveMap(map);
		
		if(mapid > 0) {
			setOwner(mapid, userid);
		}
		
		return mapid;
	}
	
	public int saveMap(Map map, String email, String password) {
		int mapid = saveMap(map);
		
		if(mapid > 0) {
			setOwnerInfo(mapid, email, password);
		}
		
		return mapid;
	}
	
	public int updateMap(Map map) {
		
		Map origin = this.getMap(map.getId());
		int mapId = origin.getId();
		
		// 현재 맵의 모든 노드들을 지운다.
		List<Node> nodes = origin.getNodes();
		for(Node node : nodes) {
			// this.mindmapDAO.deleteNode(node.getId(), mapId);
			this.deleteNode(mapId, node);
		}
		
		// 새로운 노드들을 넣는다.
		nodes = map.getNodes();
		for(Node node : nodes) {
			this.mindmapDAO.insertNode(node, mapId, 0);
		}
		
		return mapId;
	}
	
	public String updateMapTitle(int mapId, String name) {
//		if(!name.toLowerCase().endsWith(".mm")) {
//			name = name + ".mm";
//		}
		
		this.mindmapDAO.updateMapTitle(mapId, name);
		
		return name;
	}
	
	public String updateMapStyle(int mapId, String style) {
		this.mindmapDAO.updateMapStyle(mapId, style);
		return style;
	}
	
	public String updateMapLazyloading(int mapId, int lazyloading) {
		this.mindmapDAO.updateMapLazyloading(mapId, lazyloading);
		return Integer.toString(lazyloading);
	}
	
	public String updatePresentationSequence(int mapId, String pt_sequence) {
		this.mindmapDAO.updatePresentationSequence(mapId, pt_sequence);
		return pt_sequence;
	}
	
	public void setOwner(int mapid, int userid) {
		//
		this.mindmapDAO.insertMapOwner(mapid, userid);
		
		// owner info 삭제
		this.mindmapDAO.deleteMapOwnerInfo(mapid);
	}
	
	public void setOwnerInfo(int mapid, String email, String password) {
		try {
			password = PasswordEncryptor.encrypt(password);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		this.mindmapDAO.insertMapOwnerInfo(mapid, email, password);
	}
	
	public User getMapOwner(int mapId) {
		return this.mindmapDAO.getMapOwner(mapId);
	}
	
	
	
	public int deleteMap(int mapId) {
		User owner = this.getMapOwner(mapId);
		
		// owner info 삭제
		if(this.getMapOwner(mapId).getUsername().equals("guest")) {
			this.mindmapDAO.deleteMapOwnerInfo(mapId);
		}
		
		// 맵에 대한 사용자 정보 삭제
		this.mindmapDAO.deleteMapOwner(mapId, owner.getId());
		
		return this.mindmapDAO.deleteMap(mapId);
	}
	
	public int newMap(String text) {
		String id = "ID_" + Integer.toString(new Random().nextInt(2000000000));
		long created = new Date().getTime();
		String xml = "<map version=\"0.9.0\">\n"
			+ "<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->\n"
			+ "<node CREATED=\""+ created + "\" ID=\""+ id +"\" MODIFIED=\""+ created +"\" TEXT=\""+ (text) +"\"/>\n"
			+ "</map>";
		
		try {
			Map map = MindmapDigester.parseMap(xml);
			map.setName(text);
			
			return saveMap(map);
			
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
	public int newMap(String text, int userid) {
		int mapId = newMap(text);
		
		if(mapId > 0) {
			setOwner(mapId, userid);
		}
		
		return mapId;
	}
	
	public int newMap(String text, String email, String password) {
		int mapId = newMap(text);
		
		if(mapId > 0) {
			setOwnerInfo(mapId, email, password);
		}
		
		return mapId;
	}
	
//	private String escapeUnicode(String text) {
//		if(text == null) {
//			return null;
//		}
//		
//        int len = text.length();
//        StringBuffer result = new StringBuffer(len);
//        int intValue;
//        char myChar;
//        for (int i = 0; i < len; ++i) {
//            myChar = text.charAt(i);
//            intValue = (int) text.charAt(i);
//            if (intValue > 128) {
//                result.append("&#").append( intValue ).append(';');
//            } else {
//                result.append(myChar);
//            }
//        }
//        
//        return result.toString();
//    }
	
	private String generateKey() {
		return Base64.encodeBase64String(UUID.randomUUID().toString().getBytes()).trim();
	}
	
	@Override
	public int countAllMaps(String searchfield, String search) {
		return this.mindmapDAO.countAllMaps(searchfield , search);
	}
	
	@Override
	public int updateNode(int mapId, Node node) {
		Node orgNode = this.mindmapDAO.getNode(node.getIdentity(), mapId, false);
		if(orgNode != null) {
			node.setId(orgNode.getId());
			node.setMapId(orgNode.getMapId());
			
			return this.mindmapDAO.updateNode(node, mapId);
		}
		
		return -1;
	}

	@Override
	public int deleteNode(int mapId, Node node) {
		Node orgNode = this.mindmapDAO.getNode(node.getIdentity(), mapId, false);
		if(orgNode != null) {
			return this.mindmapDAO.deleteNode(orgNode.getId(), mapId);
		}
		
		return -1;
	}

	@Override
	public int moveNode(int mapId, Node node, String parent, String next) {
		int result = -1;
		
		Node orgNode = this.mindmapDAO.getNode(node.getIdentity(), mapId, false);
		Node parentNode = this.mindmapDAO.getNode(parent, mapId, false);
		Node nextNode = null;
		if(next != null) {
			nextNode = this.mindmapDAO.getNode(next, mapId, false); 
		}
		if(orgNode != null) {
			// 우선 parentNode의 끝으로 보낸다.
			result = this.mindmapDAO.moveNode(orgNode.getId(), parentNode.getId(), mapId);
			
			// nextNode가 있는 경우 nextNode 앞으로 이동한다.
			if(result > 0 && nextNode != null) {
				return this.mindmapDAO.moveNodeBeforeSibling(orgNode.getId(), nextNode.getId(), parentNode.getId(), mapId);
			}
		}
		
		return result;
	}

	@Override
	public int newNodeBeforeSibling(int mapId, Node node, String parent, String next) {
		Node parentNode = null;
		try {
			parentNode = this.mindmapDAO.getNode(parent, mapId);
		} catch (Exception e) {
			return -1;
		}
		
		if(parentNode == null) 
			return -1;
		
		if(next != null && next.trim().length() > 0) {
			Node nextNode = this.mindmapDAO.getNode(next, mapId);
		
			return this.mindmapDAO.insertNodeBeforeSibling(node, mapId, parentNode.getId(), nextNode.getId());
		} else {
			return this.mindmapDAO.insertNode(node, mapId, parentNode.getId());
		}
	}
	
	public int newNodeAfterSibling(int mapId, Node node, String parent, String before) {
		Node parentNode = null;
		try {
			parentNode = this.mindmapDAO.getNode(parent, mapId);
		} catch (Exception e) {
			return -1;
		}
		
		if(parentNode == null) 
			return -1;
		
		if(before != null && before.trim().length() > 0) {
			Node beforeNode = this.mindmapDAO.getNode(before, mapId);
		
			return this.mindmapDAO.insertNodeAfterSibling(node, mapId, parentNode.getId(), beforeNode.getId());
		} else {
			return this.mindmapDAO.insertNode(node, mapId, parentNode.getId());
		}
	}

	@Override
	public List<Map> getAllMaps(int page, int pagelimit, String searchfield,
			String search, String sort, boolean isAsc) {
		return this.mindmapDAO.getAllMaps(page, pagelimit, searchfield, search, sort, isAsc);
	}

	@Override
	public List<Map> getUserMaps(int userid, int page, int pagelimit,
			String searchfield, String search, String sort, boolean isAsc) {
		return this.mindmapDAO.getUserMaps(userid, page, pagelimit, searchfield, search, sort, isAsc);
	}

	@Override
	public List<Map> getGuestMaps(int page, int pagelimit, String searchfield,
			String search, String sort, boolean isAsc) {
		return this.mindmapDAO.getGuestMaps(page, pagelimit, searchfield, search, sort, isAsc);
	}

	@Override
	public int increaseViewCount(String mapKey) {
		return this.mindmapDAO.increaseViewCount(mapKey); 
	}
	@Override
	public int increaseViewCount(int mapId) {
		return this.mindmapDAO.increaseViewCount(mapId); 
	}
	
	/**
	 * 해당 userid의 mapofmap 의 mapkey를 반환한다.
	 */
	@Override
	public int getMapofMapId(int userid) {
		return this.mindmapDAO.getMapofMapId(userid);
		
	}

	@Override
	public int insertMapofMap(int userid, int mapId) {
		return this.mindmapDAO.insertMapofMap(userid, mapId);
	}

	@Override
	public int deleteMapofMap(int mapId) {
		return this.mindmapDAO.deleteMapofMap( mapId);
	}

	@Override
	public List<Share> getMyShares(int userid) {
		return this.mindmapDAO.getMyShares(userid);
	}
	
	@Override
	public List<Share> getMyShares(int userid, int page, int pagelimit,
			String searchfield, String search, String sort, boolean isAsc) {
		return this.mindmapDAO.getMyShares(userid, page, pagelimit, searchfield, search, sort, isAsc);
	}

	@Override
	public List<Map> getPublicMaps(int sharetype) {
		return this.mindmapDAO.getPublicMaps( sharetype);
	}
	
	@Override
	public List<Map> getPublicMaps(int sharetype, int page, int pagelimit, String searchfield,
			String search, String sort, boolean isAsc) {
		return this.mindmapDAO.getPublicMaps( sharetype,page, pagelimit, searchfield, search, sort, isAsc);
	}
	
	@Override
	public List<Map> getAllMaps(int sharetype, int page, int pagelimit, String searchfield,
			String search, String sort, boolean isAsc) {
		return this.mindmapDAO.getAllMaps( sharetype,page, pagelimit, searchfield, search, sort, isAsc);
	}

	@Override
	public int countMyShares(int userId, String searchfield, String search) {
		return this.mindmapDAO.countMyShares(userId, searchfield, search);
	}

	@Override
	public int countPublicMaps(int sharetype, String searchfield, String search) {
		return this.mindmapDAO.countPublicMaps( sharetype,searchfield, search);
	}
	
	@Override
	public int countAllMaps(int sharetype, String searchfield, String search) {
		return this.mindmapDAO.countAllMaps( sharetype,searchfield, search);
	}
	
	public List<Node> getPathToRoot(Node node) {
		return this.mindmapDAO.getPathToRoot(node.getId(), node.getMapId());
	}

	@Override
	public String updateQueueing(int mapId, int queueing) {
		this.mindmapDAO.updateQueueing(mapId, queueing);
		return queueing+"";
	}
	
	
	public Slide getSlide(int nodeId) {
		return this.mindmapDAO.getSlide(nodeId);
	}
	public int insertSlide(int nodeId, double x, double y, double scalex, double scaley, double rotate, int showdepths) {
		return this.mindmapDAO.insertSlide(nodeId, x, y, scalex, scaley, rotate, showdepths);
	}
	public int updateSlide(int nodeId, double x, double y, double scalex, double scaley, double rotate, int showdepths) {		
		return this.mindmapDAO.updateSlide(nodeId, x, y, scalex, scaley, rotate, showdepths);
	}
	public int deleteSlide(int nodeId) {
		return this.mindmapDAO.deleteSlide(nodeId);
	}

	@Override
	public int countDuplicateMapName(int userid, String mapName) {
		return this.mindmapDAO.countDuplicateMapName(userid, mapName);

	}

	@Override
	public int updateshortUrl(int mapId, String short_url) {
		return this.mindmapDAO.updateShortUrl(mapId, short_url);
	}

//	@Override
//	public List<Map> getAllMaps() {
//		return this.mindmapDAO.getAllMaps();
//	}
	
	@Override
	public List<Map> getMapRecommend(int page, int pagelimit, String searchfield, String search) throws DataAccessException {
		return this.mindmapDAO.getMapRecommend(page, pagelimit, searchfield, search);
	}
	
	@Override
	public int countAllRecommendMaps(String searchfield, String search) {
		return this.mindmapDAO.countAllRecommendMaps(searchfield , search);
	}
	
	@Override
	public int deleteRecommendList(int mapId) {
		return this.mindmapDAO.deleteRecommendList(mapId);
	}
	
	@Override
	public int insertRecommendMap(int mapId, long added, String imgURL) {
		return this.mindmapDAO.insertRecommendMap(mapId, added, imgURL);
	}
	
	@Override
	public List<RecommendList> getRecommendManagementList(int page, int pagelimit, String searchfield, String search) throws DataAccessException {
		return this.mindmapDAO.getRecommendManagementList(page, pagelimit, searchfield, search);
	}
	
	@Override
	public int countAllRecommendManagementList(String searchfield, String search) {
		return this.mindmapDAO.countAllRecommendManagementList(searchfield , search);
	}
	
	@Override
	public int deleteRecommendManagementList(int recommendId ) throws DataAccessException{
		return this.mindmapDAO.deleteRecommendManagementList(recommendId);
	}

	@Override
	public List getRecommendFilePath(int recommendId) {
		return this.mindmapDAO.getRecommendFilePath(recommendId);
		
	}

	@Override
	public int updateNodeLineColor(String dbid, String color) {
		this.mindmapDAO.updateNodeLineColor(dbid, color);
		return 0;
	}
}
