package com.okmindmap.dao.mysql.spring;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.collections.MapIterator;
import org.apache.commons.collections.map.ListOrderedMap;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.okmindmap.context.AppContext;
import com.okmindmap.dao.MindmapDAO;
import com.okmindmap.dao.mysql.spring.mapper.ArrowLinkRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.AttributeRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.CloudRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.EdgeRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.FontRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.ForeignObjectRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.GuestMapRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.IconRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.MapRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.MapTimelineRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.NodeRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.RichContentRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.SlideRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.admin.RecommendMapRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.share.PermissionRowMapper;
import com.okmindmap.dao.mysql.spring.mapper.share.ShareRowMapper;
import com.okmindmap.filter.CookieFilter;
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
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.Share;
import com.okmindmap.sync.LockObjectManager;
import com.okmindmap.util.ArrayUtil;

public class SpringMindmapDAO extends SpringDAOBase implements MindmapDAO {
	private static final HashMap<String, String> SORT_ORDER = new HashMap<String, String>();
	static {
		SORT_ORDER.put("id", " m.id ");
		SORT_ORDER.put("map", " m.name ");
		SORT_ORDER.put("title", " m.name ");
		SORT_ORDER.put("queuecount", " queuecount ");
		SORT_ORDER.put("viewcount", " viewcount ");
		SORT_ORDER.put("created", " m.created ");
		SORT_ORDER.put("revisioncnt", " revisioncnt ");
		SORT_ORDER.put("usernamestring", " CONCAT(lastname, firstname) ");
	}
	
	
	private static final HashMap<String, String> SORT_ORDER_GUEST = new HashMap<String, String>();
	static {
		SORT_ORDER_GUEST.put("id", " m.id ");
		SORT_ORDER_GUEST.put("title", " m.name ");
		SORT_ORDER_GUEST.put("email", " email ");
		SORT_ORDER_GUEST.put("queuecount", " queuecount ");
		SORT_ORDER_GUEST.put("viewcount", " viewcount ");
		SORT_ORDER_GUEST.put("created", " m.created ");
		SORT_ORDER_GUEST.put("usernamestring", "  CONCAT(lastname, firstname) ");
	}
	
	
	public SpringMindmapDAO() {
	}
	
	public int insertMapTimeline(MapTimeline timeline) {
		String query = "INSERT INTO mm_map_timeline (id, map_id, xml, saved) "
			+ " VALUES (?, ?, ?, ?)";
		
		int id = -1;
		String key = "lock_timeline";
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			id = createNewID("mm_map_timeline");
			
			getJdbcTemplate().update(query,
					new Object[] { id, timeline.getMapId(), timeline.getXml(), timeline.getSaved() });
		}
		LockObjectManager.getInstance().unlock(key);
		
		return id;
	}
	
	public int deleteMapTimeline(int id) {
		String sql = "DELETE FROM mm_map_timeline WHERE id = ?";

		return getJdbcTemplate().update(sql, new Object[] { id });
	}
	public int deleteAllMapTimeline(int map_id) {
		String sql = "DELETE FROM mm_map_timeline WHERE map_id = ?";

		return getJdbcTemplate().update(sql, new Object[] { map_id });
	}
	
	public MapTimeline getMapTimeline(int id) {
		String sql = "SELECT *  FROM mm_map_timeline WHERE id = ?";
		
		return (MapTimeline) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new MapTimelineRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<MapTimeline> getMapTimelines(int mapId) {
		String sql = "SELECT *  FROM mm_map_timeline WHERE map_id = ? ORDER BY saved ASC";
		
		return getJdbcTemplate().query(sql, new Object[] { mapId },
				new MapTimelineRowMapper());
	}

	// Insert
	public int insertMap(Map map) {
		String query = "INSERT INTO mm_map (id, name, version, map_key, created, short_url) VALUES (?, ?, ?, ?, ?, ?)";
		int id = createNewID("mm_map");

		getJdbcTemplate().update(
				query,
				new Object[] { new Integer(id), map.getName(),
						map.getVersion(), map.getKey(), map.getCreated(), map.getShort_url() });

		List<Node> nodes = map.getNodes();
		for (int i = 0; i < nodes.size(); i++) {
			insertNode(nodes.get(i), id, 0);
		}

		return id;
	}

	public int insertNode(Node node, int map_id, int parent_id) {
		String queryInsert = "SELECT mm_node__new(?, ?, ?, ?, ?," +
				" ?, ?, ?, ?," +
				" ?, ?, ?, ?, ?, ?," +
				" ?, ?, ?, ?, ?," +
				" ?, ?, ?)";

		int id = -1;
		
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = requestAttributes.getRequest();
		String clientId = (String) request.getAttribute(CookieFilter.ATTRIBUTE_NAME);
		
		long creator = node.getCreator();
		if(creator == 0) {
			creator = this.getUserId();
		}
		long modifier = node.getModifier();
		if(modifier == 0) {
			modifier = creator;
		}
		String creatorIP = node.getCreatorIP();
		if(creatorIP == null) {
			creatorIP = request.getRemoteAddr();
		}
		String modifierIP = node.getModifierIP();
		if(modifierIP == null) {
			modifierIP = creatorIP;
		}
		long created = node.getCreated();
		if(created == 0) {
			created = System.currentTimeMillis();
		}
		long modified = node.getModified();
		if(modified == 0) {
			modified = created;
		}
		
		String key = createMapLockKey(map_id);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			String identity = node.getIdentity();
			if(identity == null) {
				identity = "ID_" + Integer.toString(new Random().nextInt(2000000000));
			}
			id = getJdbcTemplate().queryForInt(queryInsert, new Object[]{
					map_id, node.getBackgroundColor(), node.getColor(), node.getFolded(), identity,
					node.getLink(), node.getPosition(), node.getStyle(), node.getText(),
					created, creator, creatorIP, modified, modifier, modifierIP,
					node.gethGap(), node.getvGap(), node.getvShift(), node.getEncryptedContent(), node.getExtraData(),
					node.getNodeType(), parent_id, clientId
			});
			
			if(id > 0) {
				node.setId(id);
				node.setMapId(map_id);
				
				insertNodeElements(node);
				
				for(Node child : node.getChildren()) {
					insertNode(child, map_id, id);
				}
			}
		}
		LockObjectManager.getInstance().unlock(key);
		
		return id;
	}
	
	public int insertNodeBeforeSibling(Node node, int map_id, int parent_id, int next_id) {
		int id = insertNode(node, map_id, parent_id);
		
		moveNodeBeforeSibling(id, next_id, parent_id, map_id);
		
		return id;
	}
	
	public int insertNodeAfterSibling(Node node, int map_id, int parent_id, int before_id) {
		int id = insertNode(node, map_id, parent_id);
		
		moveNodeAfterSibling(id, before_id, parent_id, map_id);
		
		return id;
	}

	/**
	 * Attribute, ArrowLink, Cloud, Edge, Font, Hook, Icon, RichContent, ForeignObject 를 입력한다.
	 * @param node
	 */
	private void insertNodeElements(Node node) {
		int id = node.getId();
		int mapId = node.getMapId();
		
		List<ArrowLink> links = node.getArrowLinks();
		for (int i = 0; i < links.size(); i++) {
			insertArrowLink(links.get(i), id, mapId);
		}
		List<Attribute> attr = node.getAttributes();
		for (int i = 0; i < attr.size(); i++) {
			insertAttribute(attr.get(i), id, mapId);
		}
		if (node.getCloud() != null) {
			insertCloud(node.getCloud(), id, mapId);
		}
		if (node.getEdge() != null) {
			insertEdge(node.getEdge(), id, mapId);
		}
		if (node.getFont() != null) {
			insertFont(node.getFont(), id, mapId);
		}
		// Vector<Hook> hooks = node.getHooks();
		// for(int i = 0; i < hooks.size(); i++) {
		// insertHook(hooks.elementAt(i), id);
		// }
		List<Icon> icons = node.getIcons();
		for (int i = 0; i < icons.size(); i++) {
			insertIcon(icons.get(i), id, mapId);
		}
		if (node.getRichContent() != null) {
			insertRichContent(node.getRichContent(), id, mapId);
		}
		if (node.getForeignObject() != null) {
			insertForeignObject(node.getForeignObject(), id, mapId);
		}

//		List<Node> children = node.getChildren();
//		for (int i = 0; i < children.size(); i++) {
//			insertNode(children.get(i), node.getMapId(), id);
//		}
	}

	public int insertAttribute(Attribute attr, int node_id, int map_id) {
		String query = "INSERT INTO mm_attribute (id, node_id, name, value, map_id)"
				+ " VALUES (?, ?, ?, ?, ?)";

		int id = createNewID("mm_attribute");

		getJdbcTemplate().update(query,
				new Object[] { id, node_id, attr.getName(), attr.getValue(), map_id });

		return id;
	}

	public int insertArrowLink(ArrowLink link, int node_id, int map_id) {
		String query = "INSERT INTO mm_arrowlink (id, node_id, color, destination,"
				+ " endarrow, endinclination, identity, startarrow, startinclination, map_id)"
				+ " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

		int id = createNewID("mm_arrowlink");

		getJdbcTemplate().update(
				query,
				new Object[] { id, node_id, link.getColor(),
						link.getDestination(), link.getEndArrow(),
						link.getEndInclination(), link.getIdentity(),
						link.getStartArrow(), link.getStartInclination(),
						map_id });

		return id;
	}

	public int insertCloud(Cloud cloud, int node_id, int map_id) {
		String query = "INSERT INTO mm_cloud (id, node_id, color, map_id)"
				+ " VALUES (?, ?, ?, ?)";

		int id = createNewID("mm_cloud");

		getJdbcTemplate().update(query,
				new Object[] { id, node_id, cloud.getColor(), map_id });

		return id;
	}

	public int insertEdge(Edge edge, int node_id, int map_id) {
		String query = "INSERT INTO mm_edge (id, node_id, color, style, width, map_id)"
				+ " VALUES (?, ?, ?, ?, ?, ?)";

		int id = createNewID("mm_edge");

		getJdbcTemplate().update(
				query,
				new Object[] { id, node_id, edge.getColor(), edge.getStyle(),
						edge.getWidth(), map_id });

		return id;
	}

	public int insertFont(Font font, int node_id, int map_id) {
		String query = "INSERT INTO mm_font (id, node_id, bold, italic, name, size, map_id)"
				+ " VALUES (?, ?, ?, ?, ?, ?, ?)";

		int id = createNewID("mm_font");

		getJdbcTemplate().update(
				query,
				new Object[] { id, node_id, font.getBold(), font.getItalic(),
						font.getName(), font.getSize(), map_id });

		return id;
	}

	public int insertHook(Hook hook, int node_id, int map_id) {
		throw new RuntimeException("not supported");
	}

	@Override
	public int insertParameter(Parameter parameter, int hookId)
			throws DataAccessException {
		throw new RuntimeException("not supported");
	}

	public int insertIcon(Icon icon, int node_id, int map_id) {
		String query = "INSERT INTO mm_icon (id, node_id, builtin, map_id)"
				+ " VALUES (?, ?, ?, ?)";

		int id = createNewID("mm_icon");

		getJdbcTemplate().update(query,
				new Object[] { id, node_id, icon.getBuiltin(), map_id });

		return id;
	}

	public int insertRichContent(RichContent content, int node_id, int map_id) {
		String query = "INSERT INTO mm_richcontent (id, node_id, type, content, map_id)"
				+ " VALUES (?, ?, ?, ?, ?)";
		int id = createNewID("mm_richcontent");

		getJdbcTemplate().update(query,
				new Object[] { id, node_id, content.getType(),
						// content.getHtml().toXml()
						content.getContent(), map_id });

		return id;
	}

	public int insertForeignObject(ForeignObject content, int node_id, int map_id) {
		String query = "INSERT INTO mm_foreignobject (id, node_id, content, width, height, map_id)"
				+ " VALUES (?, ?, ?, ?, ?, ?)";
		int id = createNewID("mm_foreignobject");

		getJdbcTemplate().update(
				query,
				new Object[] { id, node_id, content.getContent(),
						content.getWidth(), content.getHeight(), map_id });

		return id;
	}

	// End of Insert

	// Update
	public int updateMapTitle(int mapId, String name) throws DataAccessException {
		String sql = "UPDATE mm_map SET name = ? " + " WHERE id = ?";
		
		int result = -1;

		String key = createMapLockKey(mapId);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			result = getJdbcTemplate().update(sql, new Object[] { name, mapId });
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}
	
	public int updateMapStyle(int mapId, String style) throws DataAccessException {
		String sql = "UPDATE mm_map SET map_style = ? " + " WHERE id = ?";
		
		int result = -1;

		String key = createMapLockKey(mapId);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			result = getJdbcTemplate().update(sql, new Object[] { style, mapId });
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}
	
	public int updateMapLazyloading(int mapId, int lazyloading) throws DataAccessException {
		String sql = "UPDATE mm_map SET lazyloading = ? " + " WHERE id = ?";
		
		int result = -1;

		String key = createMapLockKey(mapId);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			result = getJdbcTemplate().update(sql, new Object[] { lazyloading, mapId });
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}
	
	public int updatePresentationSequence(int mapId, String pt_sequence) {
		String sql = "UPDATE mm_map SET pt_sequence = ? " + " WHERE id = ?";
		
		int result = -1;

		String key = createMapLockKey(mapId);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			result = getJdbcTemplate().update(sql, new Object[] { pt_sequence, mapId });
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}

	public int updateNode(Node node, int mapId) throws DataAccessException {
		int result = -1;
		
		String sql = "UPDATE mm_node SET  map_id = ?,"
				+ " background_color = ?, color = ?, folded = ?,"
				+ " identity = ?, link = ?, position = ?,"
				+ " style = ?, text = ?,"
				+ " modified = ?, modifier = ?, modifier_ip = ?,"
				+ " hgap = ?, vgap = ?, vshift = ?,"
				+ " encrypted_content = ?, node_type = ?, extra_data = ?"
				+ " WHERE id = ?";
		String key = createMapLockKey(mapId);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			List<Node> children = node.getChildren();
			for (Node child : children) {
				child.setParentId(node.getId());
				updateNode(child, mapId);
			}
		
			deleteArrowLinkByNodeId(node.getId());
			for (ArrowLink link : node.getArrowLinks()) {
				link.setNodeId(node.getId());
				insertArrowLink(link, node.getId(), mapId);
			}
			
			deleteAttributeByNodeId(node.getId());
			for (Attribute attr : node.getAttributes()) {
				attr.setNodeId(node.getId());
				insertAttribute(attr, node.getId(), mapId);
			}
			
			deleteIconByNodeId(node.getId());
			for (Icon icon : node.getIcons()) {
				icon.setNodeId(node.getId());
				insertIcon(icon, node.getId(), mapId);
			}
			
			Cloud cloud = node.getCloud();
			if (cloud != null) {
				cloud.setNodeId(node.getId());
				updateCloud(cloud);
			} else {
				deleteCloudByNodeId(node.getId());
			}
			
			Edge edge = node.getEdge();
			if (edge != null) {
				edge.setNodeId(node.getId());
				try {
					Edge eg = getEdgeByNodeId(node.getId());
					edge.setId(eg.getId());
					edge.setNodeId(node.getId());
					updateEdge(edge);
				} catch (Exception e) {
					insertEdge(edge, node.getId(), mapId);
				}
			} else {
				deleteEdgeByNodeId(node.getId());
			}
			
			Font font = node.getFont();
			if (font != null) {
				font.setNodeId(node.getId());
				try {
					Font f = getFontByNodeId(node.getId());
					font.setId(f.getId());
					font.setNodeId(node.getId());
					updateFont(font);
				} catch (Exception e) {
					insertFont(font, node.getId(), mapId);
				}
			} else {
				deleteFontByNodeId(node.getId());
			}
			
			RichContent richContent = node.getRichContent();
			if (richContent != null) {
				richContent.setNodeId(node.getId());
				try {
					RichContent rc = getRichContentByNodeId(node.getId());
					richContent.setId(rc.getId());
					richContent.setNodeId(node.getId());
					updateRichContent(richContent);
				} catch (Exception e) {
					insertRichContent(richContent, node.getId(), mapId);
				}
			} else {
				deleteRichContentByNodeId(node.getId());
			}
			
			ForeignObject foreignContent = node.getForeignObject();
			if (foreignContent != null) {
				foreignContent.setNodeId(node.getId());
				try {
					ForeignObject fo = getForeignObjectByNodeId(node.getId());
					foreignContent.setId(fo.getId());
					foreignContent.setNodeId(node.getId());
					updateForeignObject(foreignContent);
				} catch (Exception e) {
					insertForeignObject(foreignContent, node.getId(), mapId);
				}
			} else {
				deleteForeignObjectByNodeId(node.getId());
			}
			
			String identity = node.getIdentity();
			if(identity == null) {
				identity = "ID_" + Integer.toString(new Random().nextInt(2000000000));
			}
			result = getJdbcTemplate().update(
					sql,
					new Object[] { node.getMapId(),
							node.getBackgroundColor(), node.getColor(), node.getFolded(),
							identity, node.getLink(), node.getPosition(),
							node.getStyle(), node.getText(),
							node.getModified(), node.getModifier(), node.getModifierIP(),
							node.gethGap(), node.getvGap(), node.getvShift(),
							node.getEncryptedContent(), node.getNodeType(), node.getExtraData(),
							node.getId() });
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}

	public int updateArrowLink(ArrowLink link) throws DataAccessException {
		String sql = "UPDATE mm_arrowlink SET " + " color = ?,"
				+ " destination = ?," + " endarrow = ?,"
				+ " endinclination = ?," + " identity = ?," + " node_id = ?,"
				+ " startarrow = ?," + " startinclination = ?"
				+ " WHERE id = ?";

		return getJdbcTemplate().update(
				sql,
				new Object[] { link.getColor(), link.getDestination(),
						link.getEndArrow(), link.getEndInclination(),
						link.getIdentity(), link.getNodeId(),
						link.getStartArrow(), link.getStartInclination(),
						link.getId() });
	}

	public int updateAttribute(Attribute attr) throws DataAccessException {
		String sql = "UPDATE mm_attribute SET " + " node_id = ?,"
				+ " name = ?," + " value = ?" + " WHERE id = ?";
		return getJdbcTemplate().update(
				sql,
				new Object[] { attr.getNodeId(), attr.getName(),
						attr.getValue(), attr.getId() });
	}

	public int updateCloud(Cloud cloud) throws DataAccessException {
		String sql = "UPDATE mm_cloud SET " + " node_id = ?," + " color = ?"
				+ " WHERE id = ?";

		return getJdbcTemplate().update(
				sql,
				new Object[] { cloud.getNodeId(), cloud.getColor(),
						cloud.getId() });
	}

	public int updateEdge(Edge edge) throws DataAccessException {
		String sql = "UPDATE mm_edge SET " + " node_id = ?," + " color = ?,"
				+ " style = ?," + " width = ?" + " WHERE id = ?";

		return getJdbcTemplate().update(
				sql,
				new Object[] { edge.getNodeId(), edge.getColor(),
						edge.getStyle(), edge.getWidth(), edge.getId() });
	}

	public int updateFont(Font font) throws DataAccessException {
		String sql = "UPDATE mm_font SET " + " node_id = ?," + " bold = ?,"
				+ " italic = ?," + " name = ?," + " size = ?" + " WHERE id = ?";

		return getJdbcTemplate().update(
				sql,
				new Object[] { font.getNodeId(), font.getBold(),
						font.getItalic(), font.getName(), font.getSize(),
						font.getId() });
	}

	public int updateIcon(Icon icon) throws DataAccessException {
		String sql = "UPDATE mm_icon SET " + " node_id = ?" + " builtin = ?"
				+ " WHERE id = ?";

		return getJdbcTemplate().update(
				sql,
				new Object[] { icon.getNodeId(), icon.getBuiltin(),
						icon.getId() });
	}

	public int updateRichContent(RichContent content)
			throws DataAccessException {
		String sql = "UPDATE mm_richcontent SET " + " node_id = ?,"
				+ " type = ?," + " content = ?" + " WHERE id = ?";

		return getJdbcTemplate().update(sql,
				new Object[] { content.getNodeId(), content.getType(),
						// content.getHtml().toXml(),
						content.getContent(), content.getId() });
	}

	public int updateForeignObject(ForeignObject content)
			throws DataAccessException {
		String sql = "UPDATE mm_foreignobject SET " + " node_id = ?,"
				+ " content = ?," + " width = ?," + " height = ?"
				+ " WHERE id = ?";

		return getJdbcTemplate().update(
				sql,
				new Object[] { content.getNodeId(), content.getContent(),
						content.getWidth(), content.getHeight(),
						content.getId() });
	}

	// End of Update

	// Delete
	public int deleteMap(int map_id) throws DataAccessException {
		int result = -1;

		String key = createMapLockKey(map_id);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			// timeline 삭제
			deleteAllMapTimeline(map_id);
			
			Node rootNode = getRootNode(map_id);
			if(rootNode != null) {
				deleteNode(rootNode.getId(), map_id);
			}
	
			result = delete("mm_map", map_id);
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}
	
	public int deleteMapOwner(int mapid, int userid) {
		String sql = "DELETE FROM mm_map_owner WHERE mapid = ? AND userid = ?";
		
		return getJdbcTemplate().update(sql, new Object[] { mapid, userid });
	}

	public int deleteNode(int id, int map_id) throws DataAccessException {
		int result = -1;
		
		ArrayList<String> nodeIds = new ArrayList<String>();
		nodeIds.add(Integer.toString(id));
		
//		Node node = getNode(id);

		String key = createMapLockKey(map_id);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			List<Node> childs = this.getChildNodes(id, true);
			for (Node child : childs) {
				nodeIds.add(Integer.toString(child.getId()));
			}
	
			deleteArrowLinkByNodeIds(nodeIds);
			deleteAttributeByNodeIds(nodeIds);
			deleteCloudByNodeIds(nodeIds);
			deleteEdgeByNodeIds(nodeIds);
			deleteFontByNodeIds(nodeIds);
			deleteIconByNodeIds(nodeIds);
			deleteRichContentByNodeIds(nodeIds);
			deleteForeignObjectByNodeIds(nodeIds);
	
			String sql = "SELECT mm_node__delete(?, ?)";
			result = getJdbcTemplate().queryForInt(sql, new Object[]{id, map_id});
			/*
			// 자식과 자식노드를 전부 지운다.
			String sql = "DELETE FROM mm_node WHERE map_id = ? "
					+ "  AND id IN ( " + ArrayUtil.join(nodeIds, ",") + " )";
			
			result = getJdbcTemplate().update(sql, new Object[] { map_id });
			
			// lft, rgt 값을 다시 계산한다.
			if(result > 0) {
				String sql1 = "UPDATE mm_node SET lft = CASE WHEN lft > " + node.getLft() + " THEN lft - (" + node.getRgt() + " - " + node.getLft() + " + 1) ELSE lft END,  " +
						"                                  rgt = CASE WHEN rgt > " + node.getLft() + " THEN rgt - (" + node.getRgt() + " - " + node.getLft() + " + 1) ELSE rgt END " +
						"       WHERE map_id = ? " +
						"         AND (lft > " + node.getLft() + " OR rgt > " + node.getLft() + ")";
		
				result = getJdbcTemplate().update(sql1, new Object[] { map_id });
			}
			*/
		}
		LockObjectManager.getInstance().unlock(key);

		return result;
	}

	private int deleteRichContentByNodeIds(ArrayList<String> nodeIds) {
		return deleteByNodeIds("mm_richcontent", nodeIds);
	}

	private int deleteForeignObjectByNodeIds(ArrayList<String> nodeIds) {
		return deleteByNodeIds("mm_foreignobject", nodeIds);
	}

	private int deleteIconByNodeIds(ArrayList<String> nodeIds) {
		return deleteByNodeIds("mm_icon", nodeIds);
	}

	private int deleteFontByNodeIds(ArrayList<String> nodeIds) {
		return deleteByNodeIds("mm_font", nodeIds);
	}

	private int deleteEdgeByNodeIds(ArrayList<String> nodeIds) {
		return deleteByNodeIds("mm_edge", nodeIds);
	}

	private int deleteCloudByNodeIds(ArrayList<String> nodeIds) {
		return deleteByNodeIds("mm_cloud", nodeIds);
	}

	private int deleteAttributeByNodeIds(ArrayList<String> nodeIds) {
		return deleteByNodeIds("mm_attribute", nodeIds);
	}

	private int deleteArrowLinkByNodeIds(ArrayList<String> nodeIds) {
		return deleteByNodeIds("mm_arrowlink", nodeIds);
	}

	public int deleteArrowLink(int id) throws DataAccessException {
		return delete("mm_arrowlink", id);
	}

	public int deleteArrowLinkByNodeId(int node_id) throws DataAccessException {
		return deleteByNodeId("mm_arrowlink", node_id);
	}

	public int deleteAttribute(int id) throws DataAccessException {
		return delete("mm_attribute", id);
	}

	public int deleteAttributeByNodeId(int node_id) throws DataAccessException {
		return deleteByNodeId("mm_attribute", node_id);
	}

	public int deleteCloud(int id) throws DataAccessException {
		return delete("mm_cloud", id);
	}

	public int deleteCloudByNodeId(int node_id) throws DataAccessException {
		return deleteByNodeId("mm_cloud", node_id);
	}

	public int deleteEdge(int id) throws DataAccessException {
		return delete("mm_edge", id);
	}

	public int deleteEdgeByNodeId(int node_id) throws DataAccessException {
		return deleteByNodeId("mm_edge", node_id);
	}

	public int deleteFont(int id) throws DataAccessException {
		return delete("mm_font", id);
	}

	public int deleteFontByNodeId(int node_id) throws DataAccessException {
		return deleteByNodeId("mm_font", node_id);
	}

	public int deleteIcon(int id) throws DataAccessException {
		return delete("mm_icon", id);
	}

	public int deleteIconByNodeId(int node_id) throws DataAccessException {
		return deleteByNodeId("mm_icon", node_id);
	}

	public int deleteRichContent(int id) throws DataAccessException {
		return delete("mm_richcontent", id);
	}

	public int deleteRichContentByNodeId(int node_id)
			throws DataAccessException {
		return deleteByNodeId("mm_richcontent", node_id);
	}

	public int deleteForeignObject(int id) throws DataAccessException {
		return delete("mm_foreignobject", id);
	}

	public int deleteForeignObjectByNodeId(int node_id)
			throws DataAccessException {
		return deleteByNodeId("mm_foreignobject", node_id);
	}

	private int delete(String table, int id) throws DataAccessException {
		String sql = "DELETE FROM " + table + " WHERE id = ?";

		return getJdbcTemplate().update(sql, new Object[] { id });
	}

//	private int delete(String table, String where) throws DataAccessException {
//		return getJdbcTemplate().update(
//				"DELETE FROM " + table + " WHERE " + where);
//	}

	private int deleteByNodeId(String table, int node_id)
			throws DataAccessException {
		String sql = "DELETE FROM " + table + " WHERE node_id = ?";

		return getJdbcTemplate().update(sql, new Object[] { node_id });
	}

	private int deleteByNodeIds(String table, List<String> ids)
			throws DataAccessException {
		String sql = "DELETE FROM " + table + " WHERE node_id IN ("
				+ ArrayUtil.join(ids, ",") + ")";

		return getJdbcTemplate().update(sql);
	}

	// End of Delete

	// Get
	public Map getMap(int id) throws DataAccessException {
		return getMap(id, false);
	}

	public Map getMap(int id, boolean allchildren) throws DataAccessException {
		String sql = "SELECT *, 0 queuecount FROM mm_map WHERE id = ?";

		Map map = (Map) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new MapRowMapper());

		map.addChild(getMapNode(map.getId(), allchildren));

		return map;
	}

	public Map getMap(String key) throws DataAccessException {
		return getMap(key, false);
	}

	public Map getMap(String map_key, boolean allchildren)
			throws DataAccessException {
		String sql = "SELECT *, 0 queuecount FROM mm_map " + " WHERE map_key = ?";

		Map map = (Map) getJdbcTemplate().queryForObject(sql,
				new Object[] { map_key }, new MapRowMapper());


		map.addChild(getMapNode(map.getId(), allchildren));

		return map;
	}
	
	public Map getMapInfo(String map_key) {
		String sql = "SELECT *, 0 queuecount FROM mm_map " + " WHERE map_key = ?";

		Map map = (Map) getJdbcTemplate().queryForObject(sql,
				new Object[] { map_key }, new MapRowMapper());

		return map;
	}

	private Node getMapNode(int map_id, boolean allchildren) {
		Node root = null;
		if (allchildren) {
			HashMap<String, Node> nodeMap = new HashMap<String, Node>();
			
			List<Node> nodes = this.getAllNodes(map_id);
			root = nodes.get(0);
			
			nodeMap.put(Integer.toString(root.getId()), root);

			for (int i = 1; i < nodes.size(); i++) {
				Node node = nodes.get(i);
				Node parent = nodeMap.get(Integer.toString(node.getParentId()));
				if (parent != null) {
					parent.addChild(node);
				}
				
				nodeMap.put(Integer.toString(node.getId()), node);
			}

			Node node = null;
			
			// arrowlink
			List<ArrowLink> arrowlinks = getMapArrowLinks(map_id);
			for(ArrowLink arrowlink : arrowlinks) {
				node = nodeMap.get(Integer.toString(arrowlink.getNodeId()));
				if(node != null) node.addArrowLink(arrowlink);
			}
			
			// attribute
			List<Attribute> attributes = getMapAttributes(map_id);
			for(Attribute attribute : attributes) {
				node = nodeMap.get(Integer.toString(attribute.getNodeId()));
				if(node != null) node.addAttribute(attribute);
			}
			// cloud
			List<Cloud> clouds = getMapCloudes(map_id);
			for(Cloud cloud : clouds) {
				node = nodeMap.get(Integer.toString(cloud.getNodeId()));
				if(node != null) node.setCloud(cloud);
			}
			// edge
			List<Edge> edges = getMapEdges(map_id);
			for(Edge edge : edges) {
				node = nodeMap.get(Integer.toString(edge.getNodeId()));
				if(node != null) node.setEdge(edge);
			}
			// font
			List<Font> fonts = getMapFonts(map_id);
			for(Font font : fonts) {
				node = nodeMap.get(Integer.toString(font.getNodeId()));
				if(node != null) node.setFont(font);
			}
			// foreignobject
			List<ForeignObject> foreignobjects = getMapForeignObjects(map_id);
			for(ForeignObject foreignObject : foreignobjects) {
				node = nodeMap.get(Integer.toString(foreignObject.getNodeId()));
				
				if(node != null) node.setForeignObject(foreignObject);
			}
			// icon
			List<Icon> icons = getMapIcons(map_id);
			for(Icon icon : icons) {
				node = nodeMap.get(Integer.toString(icon.getNodeId()));
				if(node != null) node.addIcon(icon);
			}
			// richcontent
			List<RichContent> richcontents = getMapRichContents(map_id);
			for(RichContent richContent : richcontents) {
				node = nodeMap.get(Integer.toString(richContent.getNodeId()));
				if(node != null) node.setRichContent(richContent);
			}
		} else {
			root = getRootNode(map_id);
			List<Node> children = getChildNodes(root.getId(), allchildren);
			for (Node child : children) {
				root.addChild(child);
			}
		}

		return root;
	}

	@SuppressWarnings("unchecked")
	public List<ArrowLink> getMapArrowLinks(int map_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_arrowlink WHERE map_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new ArrowLinkRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<Attribute> getMapAttributes(int map_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_attribute WHERE map_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new AttributeRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<Cloud> getMapCloudes(int map_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_cloud WHERE map_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new CloudRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<Edge> getMapEdges(int map_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_edge WHERE map_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new EdgeRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<Font> getMapFonts(int map_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_font WHERE map_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new FontRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<ForeignObject> getMapForeignObjects(int map_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_foreignobject WHERE map_id = ?";
		
		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new ForeignObjectRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<Icon> getMapIcons(int map_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_icon WHERE map_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new IconRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	public List<RichContent> getMapRichContents(int map_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_richcontent WHERE map_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new RichContentRowMapper());
	}

//	private void escapeUnicode(Node node) {
//		node.setText(EscapeUnicode.text(node.getText()));
//		node.setLink(EscapeUnicode.text(node.getLink()));
//
//		if (node.getRichContent() != null) {
//			RichContent content = node.getRichContent();
//			content.setContent(EscapeUnicode.richcontent(content.getContent()));
//		}
//		
//		if (node.getForeignObject() != null) {
//			ForeignObject content = node.getForeignObject();
//			content.setContent(EscapeUnicode.richcontent(content.getContent()));	// foreignObject도 richContent와 같은 escape 로직이다.
//		}
//
//		for (Node child : node.getChildren()) {
//			escapeUnicode(child);
//		}
//	}


	@SuppressWarnings("unchecked")
	public List<Node> getAllNodes(int map_id) throws DataAccessException {
		String sql = "SELECT *, (rgt - lft - 1) / 2 AS num_of_children FROM mm_node " + "WHERE map_id = ? "
				+ "ORDER BY lft";

		return getJdbcTemplate().query(sql, new Object[] { map_id },
				new NodeRowMapper());
	}

	public Node getRootNode(int map_id) throws DataAccessException {
		String sql = "SELECT *, (rgt - lft - 1) / 2 AS num_of_children FROM mm_node WHERE parent_id = 0 AND map_id = ?";

		Node node = (Node) getJdbcTemplate().queryForObject(sql,
				new Object[] { map_id }, new NodeRowMapper());

		setNode(node);

		return node;
	}

	public Node getNode(int id) throws DataAccessException {
		return getNode(id, false);
	}

	public Node getNode(int id, boolean withChildren)
			throws DataAccessException {
		String sql = "SELECT *, (rgt - lft - 1) / 2 AS num_of_children FROM mm_node WHERE id = ?";

		Node node = (Node) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new NodeRowMapper());

		// Attribute, ArrowLink, Cloud, Edge, Font, Hook, Icon, RichContent,
		// ForeignObject
		setNode(node);

		if (withChildren) {
			List<Node> children = getChildNodes(node.getId(), true);
			node.setChildren(children);
		}

		return node;
	}
	
	public Node getNode(String identity, int map_id) {
		return getNode(identity, map_id, false);
	}
	
	public Node getNode(String identity, int map_id, boolean withChildren) {
		String sql = "SELECT *, (rgt - lft - 1) / 2 AS num_of_children FROM mm_node WHERE map_id = ? AND identity = ?";
		
		try {
			Node node = (Node) getJdbcTemplate().queryForObject(sql,
					new Object[] { map_id, identity }, new NodeRowMapper());
			
			setNode(node);
			
			if (withChildren) {
				List<Node> children = getChildNodes(node.getId(), true);
				node.setChildren(children);
			}
			
			return node;
		} catch (Exception e) {
			return null;
		}
	}
	
	public ArrowLink getArrowLink(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_arrowlink WHERE id = ?";

		return (ArrowLink) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new ArrowLinkRowMapper());
	}

	@SuppressWarnings("unchecked")
	public List<ArrowLink> getArrowLinks(int node_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_arrowlink WHERE node_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { node_id },
				new ArrowLinkRowMapper());
	}

	public Attribute getAttribute(int id) {
		String sql = "SELECT * FROM mm_attribute WHERE id = ?";

		return (Attribute) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new AttributeRowMapper());
	}

	@SuppressWarnings("unchecked")
	public List<Attribute> getAttributes(int node_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_attribute WHERE node_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { node_id },
				new AttributeRowMapper());
	}

	public Cloud getCloud(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_cloud WHERE id = ?";

		return (Cloud) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new CloudRowMapper());
	}

	public Cloud getCloudByNodeId(int node_id) throws DataAccessException {
		String sql = "SELECT * FROM mm_cloud WHERE node_id = ?";

		return (Cloud) getJdbcTemplate().queryForObject(sql,
				new Object[] { node_id }, new CloudRowMapper());
	}

	public Edge getEdge(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_edge WHERE id = ?";

		return (Edge) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new EdgeRowMapper());
	}

	public Edge getEdgeByNodeId(int node_id) throws DataAccessException {
		String sql = "SELECT * FROM mm_edge WHERE node_id = ?";

		return (Edge) getJdbcTemplate().queryForObject(sql,
				new Object[] { node_id }, new EdgeRowMapper());
	}

	public Font getFont(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_font WHERE id = ?";

		return (Font) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new FontRowMapper());
	}

	public Font getFontByNodeId(int node_id) throws DataAccessException {
		String sql = "SELECT * FROM mm_font WHERE node_id = ?";

		return (Font) getJdbcTemplate().queryForObject(sql,
				new Object[] { node_id }, new FontRowMapper());
	}

	public Icon getIcon(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_font WHERE id = ?";

		return (Icon) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new IconRowMapper());
	}

	@SuppressWarnings("unchecked")
	public List<Icon> getIcons(int node_id) throws DataAccessException {
		String sql = "SELECT * FROM mm_icon WHERE node_id = ?";

		return getJdbcTemplate().query(sql, new Object[] { node_id },
				new IconRowMapper());
	}

	public RichContent getRichContent(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_richcontent WHERE id = ?";

		return (RichContent) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new RichContentRowMapper());
	}

	public RichContent getRichContentByNodeId(int node_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_richcontent WHERE node_id = ?";

		return (RichContent) getJdbcTemplate().queryForObject(sql,
				new Object[] { node_id }, new RichContentRowMapper());
	}

	public ForeignObject getForeignObject(int id) throws DataAccessException {
		String sql = "SELECT * FROM mm_foreignobject WHERE id = ?";

		return (ForeignObject) getJdbcTemplate().queryForObject(sql,
				new Object[] { id }, new ForeignObjectRowMapper());
	}

	public ForeignObject getForeignObjectByNodeId(int node_id)
			throws DataAccessException {
		String sql = "SELECT * FROM mm_foreignobject WHERE node_id = ?";

		return (ForeignObject) getJdbcTemplate().queryForObject(sql,
				new Object[] { node_id }, new ForeignObjectRowMapper());
	}

	@SuppressWarnings("unchecked")
	public List<Node> getChildNodes(int id, boolean alldescendant)
			throws DataAccessException {
		String sql = "SELECT *, CONVERT( (rgt - lft - 1) / 2, UNSIGNED) AS num_of_children FROM mm_node WHERE parent_id = ? ORDER BY lft";

		List<Node> nodes = getJdbcTemplate().query(sql.toString(),
				new Object[] { id }, new NodeRowMapper());

		// Attribute, ArrowLink, Cloud, Edge, Font, Hook, Icon, RichContent
		for (Node node : nodes) {
			setNode(node);
			if (alldescendant) {
				node.setChildren(getChildNodes(node.getId(), alldescendant));
			}
		}

		return nodes;
	}

	// End of Get

	// Etc
	public int moveNode(int node_id, int parent_id, int map_id) throws DataAccessException {
		Node node = getNode(node_id);
//		Node oldParent = getNode(node.getParentId());
		Node newParent = getNode(parent_id);

		if (node.getMapId() != newParent.getMapId()) {
			throw new RuntimeException("map_id");
		}

		/*
		String sqlLR = "UPDATE node " + " SET lft = lft + CASE WHEN ? < ? "
				+ "                      THEN CASE WHEN lft BETWEEN ? AND ? "
				+ "                                THEN ? "
				+ "                                WHEN lft BETWEEN ? AND ? "
				+ "                                THEN ? "
				+ "                                ELSE 0 END  "
				+ "                      WHEN ? > ? "
				+ "                      THEN CASE WHEN lft BETWEEN ? AND ? "
				+ "                                THEN ? "
				+ "                                WHEN lft BETWEEN ? AND ? "
				+ "                                THEN ? "
				+ "                                ELSE 0 END  "
				+ "                      ELSE 0 END,  "
				+ "     rgt = rgt + CASE WHEN ? < ? "
				+ "                      THEN CASE WHEN rgt BETWEEN ? AND ? "
				+ "                                THEN ? "
				+ "                                WHEN rgt BETWEEN ? AND ? "
				+ "                                THEN ? "
				+ "                                ELSE 0 END  "
				+ "                      WHEN ? > ? "
				+ "                      THEN CASE WHEN rgt BETWEEN ? AND ? "
				+ "                                THEN ? "
				+ "                                WHEN rgt BETWEEN ? AND ? "
				+ "                                THEN ? "
				+ "                                ELSE 0 END  "
				+ "                      ELSE 0 END "
				+ " WHERE map_id = ?";

		getJdbcTemplate().update(
				sqlLR,
				new Object[] { newParent.getRgt(), oldParent.getLft(),
						oldParent.getLft(), oldParent.getRgt(),
						newParent.getRgt() - oldParent.getLft(),
						newParent.getRgt(), oldParent.getLft() - 1,
						oldParent.getRgt() - oldParent.getLft() + 1,
						newParent.getRgt(), oldParent.getRgt(),
						oldParent.getLft(), oldParent.getRgt(),
						newParent.getRgt() - oldParent.getRgt() - 1,
						oldParent.getRgt() + 1, newParent.getRgt() - 1,
						oldParent.getLft() - oldParent.getRgt() - 1,
						newParent.getRgt(), oldParent.getLft(),
						oldParent.getLft(), oldParent.getRgt(),
						newParent.getRgt() - oldParent.getLft(),
						newParent.getRgt(), oldParent.getLft() - 1,
						oldParent.getRgt() - oldParent.getLft() + 1,
						newParent.getRgt(), oldParent.getRgt(),
						oldParent.getLft(), oldParent.getRgt(),
						newParent.getRgt() - oldParent.getRgt() - 1,
						oldParent.getRgt() + 1, newParent.getRgt() - 1,
						oldParent.getLft() - oldParent.getRgt() - 1,
						node.getMapId() });

		String sqlNode = "UPDATE mm_node " + " SET parent_id = ? "
				+ " WHERE id = ? " + " AND map_id = ?";

		return getJdbcTemplate().update(sqlNode,
				new Object[] { parent_id, node_id, node.getMapId() });
		*/
		
		String sql = "SELECT mm_node__move(?, ?, ?)";
		int result = -1;
		
		String key = createMapLockKey(map_id);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			result = getJdbcTemplate().queryForInt(sql,
					new Object[]{node_id, newParent.getId(), node.getMapId()});
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}
	
	public int moveNodeBeforeSibling(int node_id, int next_id, int parent_id, int map_id) {
		String queryInsert = "SELECT mm_node__move_before_sibling(?, ?, ?, ?)";
		int result = -1;
		
		Node nextNode = getNode(next_id, false);
		if(nextNode.getParentId() != parent_id) {
			return -1;
		}
		
		String key = createMapLockKey(map_id);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			result = getJdbcTemplate().queryForInt(queryInsert, new Object[]{
					node_id,
					next_id,
					parent_id,
					map_id
			});
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}
	
	public int moveNodeAfterSibling(int node_id, int before_id, int parent_id, int map_id) {
		String queryInsert = "SELECT mm_node__move_after_sibling(?, ?, ?, ?)";
		int result = -1;
		
		Node beforeNode = getNode(before_id, false);
		if(beforeNode.getParentId() != parent_id) {
			return -1;
		}
		
		String key = createMapLockKey(map_id);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			result = getJdbcTemplate().queryForInt(queryInsert, new Object[]{
					node_id,
					before_id,
					parent_id,
					map_id
			});
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}


	/**
	 * 노드의 하위 엘리먼트들(arrowlink, edge, font, richconent, foreignobject, icons, cloud)을 셋팅한다.
	 * @param node
	 */
	private void setNode(Node node) {
		node.setArrowLinks(getArrowLinks(node.getId()));
		node.setAttributes(getAttributes(node.getId()));
		node.setIcons(getIcons(node.getId()));

		try {
			node.setCloud(getCloudByNodeId(node.getId()));
		} catch (Exception e) {
		}
		try {
			node.setEdge(getEdgeByNodeId(node.getId()));
		} catch (Exception e) {
		}
		try {
			node.setFont(getFontByNodeId(node.getId()));
		} catch (Exception e) {
		}
		try {
			node.setRichContent(getRichContentByNodeId(node.getId()));
		} catch (Exception e) {
		}
		try {
			node.setForeignObject(getForeignObjectByNodeId(node.getId()));
		} catch (Exception e) {
		}
	}
	
	public int countAllMaps(String searchfield, String search) throws DataAccessException {
		String sql ="SELECT COUNT(m.id) FROM mm_map m LEFT JOIN mm_map_owner o ON m.id = o.mapid "+ 
		" LEFT JOIN mm_user u ON o.userid = u.id "+
		" LEFT JOIN (SELECT roomnumber, COUNT(roomnumber) AS queuecount FROM mm_queuedata GROUP BY roomnumber) q ON m.map_key = q.roomnumber   ";
			
		if (search != null && search.trim().length() > 0) {
			ArrayList<String> params = new ArrayList<String>();
			sql += " where " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
			return getJdbcTemplate().queryForInt(sql, new Object[] { search.trim() });
		} else {
			return getJdbcTemplate().queryForInt(sql);
		}
	}
	

	public int countUserMaps(int userId,String searchfield, String search)
			throws DataAccessException {
		String sql = "SELECT COUNT(m.id) AS count " + "FROM mm_map m "
				+ "JOIN mm_map_owner o ON m.id = o.mapid "
				+ "WHERE o.userid = ? ";

		ArrayList<Object> params = new ArrayList<Object>();
		params.add(userId);

		if (search != null && search.trim().length() > 0) {
			sql += " AND " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		return getJdbcTemplate().queryForInt(sql, params.toArray());

	}
	/**
	 * 관리의 목록에서 전체 갯수를 알기 위해 사용한다. 
	 */
	public int countUserMapsForManager(int userId,String searchfield, String search) throws DataAccessException {
		String sql = "SELECT COUNT(m.id) AS count " + "FROM mm_map m "
				+ "JOIN mm_map_owner o ON m.id = o.mapid "
				+ "WHERE o.userid = ? ";
		
		ArrayList<Object> params = new ArrayList<Object>();
		params.add(userId);
		
		if (search != null && search.trim().length() > 0) {
			sql += " AND " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		return getJdbcTemplate().queryForInt(sql, params.toArray());
	
	}


	public int countGuestMaps(String searchfield, String search) throws DataAccessException {
		String sql = "SELECT count(*) as count " + "FROM mm_map m "
				+ "LEFT JOIN mm_map_owner o ON m.id = o.mapid "
				+ "LEFT JOIN mm_map_owner_info i ON m.id = i.mapid "
				+ "WHERE userid IS NULL ";

		if (search != null && search.trim().length() > 0) {
			sql += " AND " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";

			return getJdbcTemplate().queryForInt(sql, new Object[] { search.trim() });
		} else {
			return getJdbcTemplate().queryForInt(sql);
		}
	}

	@Override
	public int insertMapOwner(int mapid, int userid) throws DataAccessException {
		String sql = "INSERT INTO mm_map_owner (mapid, userid) VALUES (?, ?)";

		return getJdbcTemplate().update(sql, new Object[] { mapid, userid });
	}

	@Override
	public int insertMapOwnerInfo(int mapid, String email, String password)
			throws DataAccessException {
		String sql = "INSERT INTO mm_map_owner_info (mapid, email, password) VALUES (?, ?, ?)";

		return getJdbcTemplate().update(sql,
				new Object[] { mapid, email, password });
	}

	@Override
	public User getMapOwner(int mapid) {
		// mm_map_owner 에 정보가 있는 경우 mm_user의 username, email, password
		// 없는 경우 guest의 username과 mm_map_owner_info의 email, password
		String sql = "SELECT m.id AS mapid" +
				", CASE WHEN o.userid IS NOT NULL THEN u.username ELSE 'guest' END AS username" +
				", CASE WHEN o.userid IS NOT NULL THEN u.email ELSE i.email END AS email" +
				", CASE WHEN o.userid IS NOT NULL THEN u.password ELSE i.password END AS password " +
				", o.userid " +
				" FROM mm_map m " +
				"LEFT JOIN mm_map_owner o ON o.mapid = m.id " +
				"LEFT JOIN mm_map_owner_info i ON i.mapid = m.id " +
				"LEFT JOIN mm_user u ON u.id = o.userid " + 
				"WHERE m.id = ?";

		return (User) getJdbcTemplate().queryForObject(sql,
				new Object[] { mapid }, new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int row)
							throws SQLException {
						User user = new User();
						user.setId(rs.getInt("userid"));
						user.setUsername(rs.getString("username"));
						user.setEmail(rs.getString("email"));
						user.setPassword(rs.getString("password"));

						return user;
					}
				});
	}

	@Override
	public int deleteMapOwnerInfo(int mapid) {
		String sql = "DELETE FROM mm_map_owner_info WHERE mapid = ?";

		return getJdbcTemplate().update(sql, new Object[] { mapid });
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<Map> getAllMaps(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc) {
//		String sql = "SELECT m.*, q.queuecount, m.created created, CONCAT(lastname, firstname) AS usernamestring, username,viewcount,revisioncnt FROM mm_map m LEFT JOIN mm_map_owner o ON m.id = o.mapid "+ 
//			" LEFT JOIN mm_user u ON o.userid = u.id "+
//			" LEFT JOIN (SELECT roomnumber, COUNT(roomnumber) AS queuecount FROM mm_queuedata GROUP BY roomnumber) q ON m.map_key = q.roomnumber   "+
//			" LEFT JOIN (SELECT map_id, COUNT(id) AS revisioncnt FROM mm_map_timeline GROUP BY map_id) rev ON m.id = rev.map_id ";
		String sql = "SELECT *, q.queuecount, revisioncnt " +
				"FROM (SELECT   m.*, u.lastname, u.firstname, u.username " +
				"FROM mm_map m " +
				"LEFT JOIN mm_map_owner o ON m.id = o.mapid " +
				"LEFT JOIN mm_user u ON o.userid = u.id ";
				//"ORDER BY m.name LIMIT 20 ) mm " +
				
		ArrayList params = new ArrayList();
		
		if (search != null && search.trim().length() > 0) {
			sql += " where " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
	
		if (sort == null) {
			sort = "id";
		}
		if (SORT_ORDER.containsKey(sort)) {
			sql += " ORDER BY " + SORT_ORDER.get(sort) + (isAsc?" asc ": " desc ");
		}
		if(pagelimit>0){
			sql += " LIMIT ? OFFSET ? ";
			params.add(pagelimit);
			params.add((page-1)*pagelimit);
		}
		sql += ") mm " +
		"LEFT JOIN (SELECT roomnumber, COUNT(roomnumber) AS queuecount FROM mm_queuedata GROUP BY roomnumber) q ON mm.map_key = q.roomnumber " +
		"LEFT JOIN (SELECT map_id, COUNT(id) AS revisioncnt FROM mm_map_timeline GROUP BY map_id) rev ON mm.id = rev.map_id ";
		return getJdbcTemplate().query(sql, params.toArray(),new MapRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Map> getUserMaps(int userId) throws DataAccessException {
		// slq 쿼리문 변경시 getUserMaps 오버로딩된 함수것도 같이 변경할것
		String sql = "SELECT m.* FROM mm_map m"
				+ " JOIN mm_map_owner o ON m.id = o.mapid"
				+ " WHERE o.userid = ? "
				+ " ORDER BY name ";

		return getJdbcTemplate().query(sql, new Object[] { userId },
				new MapRowMapper());
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Map> getUserMaps(int userId, String searchMapName) throws DataAccessException {
		// slq 쿼리문 변경시 getUserMaps 오버로딩된 함수것도 같이 변경할것
		String sql = "SELECT m.* FROM mm_map m"
				+ " JOIN mm_map_owner o ON m.id = o.mapid"
				+ " WHERE o.userid = ? "
				+ " AND m.name LIKE CONCAT('%', ?, '%')"
				+ " ORDER BY name ";

		return getJdbcTemplate().query(sql, new Object[] { userId, searchMapName },
				new MapRowMapper());
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<Map> getUserMaps(int userid, int page, int pagelimit,
			String searchfield, String search, String sort, boolean isAsc) {
		// slq 쿼리문 변경시 getUserMaps 오버로딩된 함수것도 같이 변경할것
		String sql = "SELECT m.* FROM mm_map m"
			+ " JOIN mm_map_owner o ON m.id = o.mapid"
			+ " WHERE o.userid = ?";

		ArrayList params = new ArrayList();
		params.add(userid);
	
		if (search != null && search.trim().length() > 0) {
			sql += " AND m.name LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
	
		if (sort == null) {
			sort = "id";
		}
		if (SORT_ORDER.containsKey(sort)) {
			sql += " ORDER BY " + SORT_ORDER.get(sort) + (isAsc?" asc ": " desc ");
		}
	
		sql += " LIMIT ? OFFSET ?";
		
		params.add(pagelimit);
		params.add((page-1)*10);

		return getJdbcTemplate().query(sql, params.toArray(), new MapRowMapper());
	}
//	/**
//	 * 마인드맵 관리에서 사용되는 리스트, 공유 상태를 보여지기 위해 공유관련된 것이 추가로 조인되어 있다.
//	 */
//	@SuppressWarnings({ "rawtypes", "unchecked" })
//	@Override
//	public List<Map> getUserMapsForManager(int userid, int page, int pagelimit,
//			String searchfield, String search, String sort, boolean isAsc) {
//		String sql = "SELECT m.* FROM mm_map m"
//			+ " JOIN mm_map_owner o ON m.id = o.mapid"
//			+ " WHERE o.userid = ?";
//
//		ArrayList params = new ArrayList();
//		params.add(userid);
//	
//		if (search != null && search.trim().length() > 0) {
//			sql += " AND m.name LIKE CONCAT('%', ?, '%')";
//			params.add(search.trim());
//		}
//	
//		if (sort == null) {
//			sort = "id";
//		}
//		if (SORT_ORDER.containsKey(sort)) {
//			sql += " ORDER BY " + SORT_ORDER.get(sort) + (isAsc?" asc ": " desc ");
//		}
//	
//		sql += " LIMIT ? OFFSET ?";
//		
//		params.add(pagelimit);
//		params.add((page-1)*10);
//
//		return getJdbcTemplate().query(sql, params.toArray(), new MapRowMapper());
//	}
	

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<Map> getGuestMaps(int page, int pagelimit, String searchfield, String search, String sort, boolean isAsc) {
		String sql = "SELECT m.*, o.userid, i.email, i.password,queuecount "
			+ "FROM mm_map m "
			+ "LEFT JOIN mm_map_owner o ON m.id = o.mapid "
			+ "LEFT JOIN mm_map_owner_info i ON m.id = i.mapid "
			+ "LEFT JOIN (SELECT roomnumber, COUNT(roomnumber) AS queuecount FROM mm_queuedata GROUP BY roomnumber) q ON m.map_key = q.roomnumber "
			+ "WHERE userid IS NULL ";
			ArrayList params = new ArrayList();
		
			if (search != null && search.trim().length() > 0) {
				sql += " and " + SORT_ORDER_GUEST.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
				params.add(search.trim());
			}
		
			if (sort == null || sort.length()<1) {
				sort = "id";
			}
			if (SORT_ORDER_GUEST.containsKey(sort)) {
				sql += " ORDER BY " + SORT_ORDER_GUEST.get(sort) + (isAsc?" asc ": " desc ");
			}
		
			sql += " LIMIT ? OFFSET ?";
			params.add(pagelimit);
			params.add((page-1)*10);
			return getJdbcTemplate().query(sql, params.toArray(),new GuestMapRowMapper());
	}

	@Override
	public int increaseViewCount(String mapKey) {
		String sql = "UPDATE mm_map SET viewcount = (viewcount+1) WHERE map_key = ?";
		return getJdbcTemplate().update(sql,new Object[] { mapKey});
	}
	@Override
	public int increaseViewCount(int mapId) {
		String sql = "UPDATE mm_map SET viewcount = (viewcount+1) WHERE id = ?";
		return getJdbcTemplate().update(sql,new Object[] { mapId});
	}
	
	/**
	 * mapofmap 테이블에서 해당 사용자ID로 조회하여 맵의 ID를 가져온다.
	 */
	@Override
	public int getMapofMapId(int userid)  throws DataAccessException {
		String sql = "SELECT map_id FROM mm_mapofmap WHERE user_id = ? ";
		int mapId = (Integer) getJdbcTemplate().queryForObject(sql,	new Object[] { userid }, Integer.class);
		return mapId;
	}

	@Override
	public int insertMapofMap(int userid, int mapId)
			throws DataAccessException {
			String query = "INSERT INTO mm_mapofmap (user_id, map_id)"
			+ " VALUES (?, ?)";

		

			int resultCnt = getJdbcTemplate().update(query,
			new Object[] { userid, mapId});

		return resultCnt;
	}

	@Override
	public int deleteMapofMap(int mapId ) throws DataAccessException {
		String sql = "delete from mm_mapofmap WHERE map_id = ?";
		return getJdbcTemplate().update(sql,new Object[] { mapId});
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<Share> getMyShares(int userid) {

		// slq 쿼리문 변경시 getMyShares 오버로딩된 함수것도 같이 변경할것
		String sql = "SELECT mm_share.id id, mm_group.name AS group_name, m.id map_id, m.name map_name, m.created, m.map_key, m.viewcount, mm_user.id user_id, mm_user.lastname user_lastname, mm_user.firstname user_firstname, mm_user.username user_username, mm_user.email user_email   FROM mm_group_member "+ 
			" LEFT JOIN mm_group ON mm_group_member.groupid = mm_group.id 	 "+
			" LEFT JOIN  mm_share_group ON mm_group.id = mm_share_group.groupid 	 "+
			" LEFT JOIN mm_share ON mm_share_group.shareid = mm_share.id 	 "+
			" LEFT JOIN mm_map m ON mm_share.mapid= m.id "+
			" LEFT JOIN mm_map_owner ON mm_map_owner.mapid = m.id "+
			" LEFT JOIN mm_user ON mm_map_owner.userid = mm_user.id  "+ 	
			" WHERE  mm_group_member.userid = ?  AND  m.id IS NOT NULL AND  mm_group_member.STATUS = 1";

		ArrayList params = new ArrayList();
		params.add(userid);
		
		String sort = "title";
		boolean isAsc = true;
		if (SORT_ORDER.containsKey(sort)) {
			sql += " ORDER BY " + SORT_ORDER.get(sort) + (isAsc?" asc ": " desc ");
		}
	
		List<Share> shares = getJdbcTemplate().query(sql, 
				params.toArray(),
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}
		
		return shares;

		//return getJdbcTemplate().query(sql, params.toArray(), new ShareMapRowMapper());
	}
	
	/**
	 * 전에는 모든 share 정보를 가져왔으나, 나의 share 정보만 필요하여 사용한다.
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<Share> getMyShares(int userid, int page, int pagelimit,
			String searchfield, String search, String sort, boolean isAsc) {

		// slq 쿼리문 변경시 getMyShares 오버로딩된 함수것도 같이 변경할것
		String sql = "SELECT mm_share.id id, mm_group.name AS group_name, m.id map_id, m.name map_name, m.created, m.map_key, m.viewcount, mm_user.id user_id, mm_user.lastname user_lastname, mm_user.firstname user_firstname, mm_user.username user_username, mm_user.email user_email   FROM mm_group_member "+ 
			" LEFT JOIN mm_group ON mm_group_member.groupid = mm_group.id 	 "+
			" LEFT JOIN  mm_share_group ON mm_group.id = mm_share_group.groupid 	 "+
			" LEFT JOIN mm_share ON mm_share_group.shareid = mm_share.id 	 "+
			" LEFT JOIN mm_map m ON mm_share.mapid= m.id "+
			" LEFT JOIN mm_map_owner ON mm_map_owner.mapid = m.id "+
			" LEFT JOIN mm_user ON mm_map_owner.userid = mm_user.id  "+ 	
			" WHERE  mm_group_member.userid = ?  AND  m.id IS NOT NULL AND  mm_group_member.STATUS = 1";

		ArrayList params = new ArrayList();
		params.add(userid);
	
		if (search != null && search.trim().length() > 0) {
			sql += " AND m.name LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
	
		if (sort == null) {
			sort = "id";
		}
		if (SORT_ORDER.containsKey(sort)) {
			sql += " ORDER BY " + SORT_ORDER.get(sort) + (isAsc?" asc ": " desc ");
		}
	
		sql += " LIMIT ? OFFSET ?";
		params.add(pagelimit);
		params.add((page-1)*10);
		List<Share> shares = getJdbcTemplate().query(sql, 
				params.toArray(),
				new ShareRowMapper());
		
		for(Share share : shares) {
			share.setPermissions( this.getPermissions(share.getId()) );
		}
		
		return shares;

		//return getJdbcTemplate().query(sql, params.toArray(), new ShareMapRowMapper());
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	//shareptye: 공유 방식 0이면 전체 공개, 1이면 비밀번호 
	public List<Map> getPublicMaps(int sharetype) {
			
			// slq 쿼리문 변경시 getPublicMaps 오버로딩된 함수것도 같이 변경할것
			/*String sql = "SELECT m.*, s.sharetype, u.lastname, u.firstname " +
							 "FROM mm_share s " + 
							 "LEFT JOIN mm_map m ON s.mapid = m.id " +
							 "LEFT JOIN mm_map_owner o ON o.mapid = m.id " +
							 "LEFT JOIN mm_user u ON o.userid = u.id " +
							 "WHERE m.id IS NOT NULL " +
							 "AND s.sharetype = 1 ";
			
			if(sharetype == 1) {
				sql += " OR s.sharetype= 3 ";
			}*/
		
			//String sql = "SELECT m.*, s.sharetype, IF (u.lastname IS NULL,  oi.email,  u.lastname) lastname, u.firstname, oi.id " +
			// 쿼리 속도향상을 위해 u.lastname이 null인지 여부는  MapRowMapper 에서 체크함.
		/*
			String sql = "SELECT m.*, s.sharetype, u.lastname, lastname, u.firstname, oi.email, oi.id " +
			" FROM mm_map m " +
			" LEFT OUTER JOIN mm_share s ON s.mapid = m.id" +
			" LEFT JOIN mm_map_owner o ON m.id = o.mapid" +
			" LEFT JOIN mm_map_owner_info oi ON m.id = oi.mapid " +
			" LEFT JOIN mm_user u ON o.userid = u.id ";
						 
	
			if(sharetype == 1) { //비밀번호 포함
				sql += " WHERE (sharetype = 1 OR sharetype = 3 OR oi.id >0  ) ";
			}else { //전체 공개만
				sql += "  where sharetype = 1";
			}
			
			sql+=" group by m.id  ";
			
			ArrayList params = new ArrayList();
		
			String sort = "title";
			boolean isAsc = true;
			if (SORT_ORDER_GUEST.containsKey(sort)) {
				sql += " ORDER BY " + SORT_ORDER_GUEST.get(sort) + (isAsc?" asc ": " desc ");
			}
			*/
		String sql = "SELECT m.*, a.* " +
				"FROM ( " +
				"        SELECT s.mapid, s.sharetype, u.lastname, u.firstname " +
				"        FROM mm_share s " +
				"        JOIN mm_map_owner o ON o.mapid = s.mapid " +
				"        JOIN mm_user u ON u.id = o.userid " +
				"        UNION " +
				"        SELECT oi.mapid, 0 AS sharetype, email AS lastname, '' AS firstname " +
				"        FROM mm_map_owner_info oi) a " +
				"JOIN mm_map m ON m.id = a.mapid ";
		
		if(sharetype == 1) { //비빌번호
			sql += " WHERE sharetype < 3 ";
		}else { //전체 공개만
			sql += " WHERE sharetype = 1 ";
		}
		
		ArrayList params = new ArrayList();

		String sort = "title";
		boolean isAsc = true;
		if (SORT_ORDER_GUEST.containsKey(sort)) {
			sql += " ORDER BY " + SORT_ORDER_GUEST.get(sort) + (isAsc?" asc ": " desc ");
		}
		
			return getJdbcTemplate().query(sql, params.toArray(),new MapRowMapper());
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	//shareptye: 공유 방식 0이면 전체 공개, 1이면 비밀번호 
	//게스트맵은 최근에 (2012년 2월 이후)만든 맵들은 무조건 보기가 공유이다. 그래서 sharetype 1로 뽑아내면 된다. 그러나 이경우 수정을 위해서는 아이디 비번을 입력해야 해서 directView = 1을 넘겨주어서 email, password 입력을 건너띄고, 맵생성시 이점을 발표하자.
	// 게스트맵의 수정은 password 를 체크한경우 나오게 하고 이때는 비번을 체크하게 하자. 게스트맵은 oi.id가 nul 인경우 게스트맵인데.. 이러면 mapper에 또하나의 데이터를 추가해야 하니 firstname = null 인 경우로 정하자.
	public List<Map> getPublicMaps(int sharetype, int page, int pagelimit, String searchfield,
			String search, String sort, boolean isAsc) {
			
			// slq 쿼리문 변경시 getPublicMaps 오버로딩된 함수것도 같이 변경할것
			//String sql = "SELECT m.*, s.sharetype, IF (u.lastname IS NULL,  oi.email,  u.lastname) lastname, u.firstname, oi.id " +
		   // 쿼리 속도향상을 위해 u.lastname이 null인지 여부는  MapRowMapper 에서 체크함.
		/*
		   String sql = "SELECT m.*, s.sharetype, u.lastname, u.firstname, oi.email, oi.id " +
				" FROM mm_map m " +
				" LEFT OUTER JOIN mm_share s ON s.mapid = m.id" +
				" LEFT JOIN mm_map_owner o ON m.id = o.mapid" +
				" LEFT JOIN mm_map_owner_info oi ON m.id = oi.mapid " +
				" LEFT JOIN mm_user u ON o.userid = u.id ";
							 
			
			if(sharetype == 1) { //비빌번호
				sql += " WHERE (sharetype < 3 OR oi.id >0  ) ";
			}else { //전체 공개만
				//sql += " where sharetype = 1 OR (oi.email = \"\" AND oi.password=\"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\")  ";
				sql += " where sharetype = 1";
			}
			ArrayList params = new ArrayList();

			if (search != null && search.trim().length() > 0) {
				sql += " and " + SORT_ORDER_GUEST.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
				params.add(search.trim());
			}
			
			sql+=" group by m.id  ";
		
			if (sort == null || sort.length()<1) {
				sort = "id";
			}
			if (SORT_ORDER_GUEST.containsKey(sort)) {
				sql += " ORDER BY " + SORT_ORDER_GUEST.get(sort) + (isAsc?" asc ": " desc ");
			}
			sql += " LIMIT ? OFFSET ?";
			params.add(pagelimit);
			params.add((page-1)*10);
		*/
		
		/* 2014-12-12
		String sql = "SELECT m.*, a.* " +
				"FROM ( " +
				"        SELECT s.mapid, s.sharetype, u.lastname, u.firstname " +
				"        FROM mm_share s " +
				"        JOIN mm_map_owner o ON o.mapid = s.mapid " +
				"        JOIN mm_user u ON u.id = o.userid " +
				"        UNION " +
				"        SELECT oi.mapid, 0 AS sharetype, email AS lastname, '' AS firstname " +
				"        FROM mm_map_owner_info oi) a " +
				"JOIN mm_map m ON m.id = a.mapid ";
		
		if(sharetype == 1) { //비빌번호
			sql += " WHERE sharetype < 3 ";
		}else { //전체 공개만
			sql += " WHERE sharetype = 1 ";
		}
		*/
		String sql = "SELECT m.* "
				+ "     , CASE WHEN s.sharetype IS NULL THEN 0 "
				+ "            ELSE s.sharetype END AS sharetype "
				+ "     , CASE WHEN o.userid IS NULL THEN oi.email "
				+ "            ELSE u.lastname END AS lastname "
				+ "     , CASE WHEN o.userid IS NULL THEN '' "
				+ "            ELSE u.firstname END AS firstname "
				+ "FROM mm_map m "
				+ "JOIN (SELECT mapid, 0 AS sharetype "
				+ "      FROM mm_map_owner_info "
				+ "      UNION "
				+ "      SELECT mapid, sharetype FROM mm_share "
				+ "      ) s ON s.mapid = m.id "
				+ "LEFT JOIN mm_map_owner o ON o.mapid = m.id "
				+ "LEFT JOIN mm_user u ON u.id = o.userid "
				+ "LEFT JOIN mm_map_owner_info oi ON oi.mapid = m.id ";
		
		if(sharetype == 1) { //비빌번호
			sql += " WHERE sharetype < 3 ";
		}else { //전체 공개만
			sql += " WHERE sharetype = 1 ";
		}
		
		
		ArrayList params = new ArrayList();

		if (search != null && search.trim().length() > 0) {
			sql += " AND " + SORT_ORDER_GUEST.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		if (sort == null || sort.length() < 1) {
			sort = "id";
		}
		if (SORT_ORDER_GUEST.containsKey(sort)) {
			sql += " ORDER BY " + SORT_ORDER_GUEST.get(sort) + (isAsc?" asc ": " desc ");
		}
		
		sql += " LIMIT ? OFFSET ?";
		params.add(pagelimit);
		params.add((page-1)*10);
		
		
			return getJdbcTemplate().query(sql, params.toArray(),new MapRowMapper());
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	//shareptye: 공유 방식 0이면 전체 공개, 1이면 비밀번호 
	public List<Map> getAllMaps(int sharetype, int page, int pagelimit, String searchfield,
			String search, String sort, boolean isAsc) {
		
		String sql = "SELECT "
				+ "     c.id "
				+ "     ,c.firstname "
				+ "     ,m.* "
				+ "     ,FROM_UNIXTIME(m.created/1000, '%Y-%m-%d') AS created "
				+ "     ,d.sharetype "
				+ "FROM mm_map m "
				+ "INNER JOIN mm_map_owner b ON m.id = b.mapid "
				+ "INNER JOIN mm_user c ON b.userid = c.id "
				+ "LEFT OUTER JOIN mm_share d ON m.id = d.mapid "
				+ "WHERE 1=1 ";
		
		ArrayList params = new ArrayList();
		
		if (search != null && search.trim().length() > 0) {
			sql += " AND " + SORT_ORDER_GUEST.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		if (sort == null || sort.length() < 1) {
			sort = "id";
		}
		if (SORT_ORDER_GUEST.containsKey(sort)) {
			sql += " ORDER BY " + SORT_ORDER_GUEST.get(sort) + (isAsc?" asc ": " desc ");
		}
		
		sql += " LIMIT ? OFFSET ?";
		params.add(pagelimit);
		params.add((page-1)*10);
		
		
		return getJdbcTemplate().query(sql, params.toArray(),new MapRowMapper());
	}

	@Override
	public int countMyShares(int userId, String searchfield, String search) throws DataAccessException {
			String sql = "SELECT COUNT(mm_group_member.id)  FROM mm_group_member LEFT JOIN  	mm_group ON mm_group_member.groupid = mm_group.id 	LEFT JOIN  mm_share_group ON mm_group.id = mm_share_group.groupid 	LEFT JOIN mm_share ON mm_share_group.shareid = mm_share.id 	LEFT JOIN mm_map m ON mm_share.mapid= m.id 	WHERE mm_group_member.userid = ? AND mm_group_member.STATUS = 1";

			ArrayList<Object> params = new ArrayList<Object>();
			params.add(userId);

			if (search != null && search.trim().length() > 0) {
				sql += " AND " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
				params.add(search.trim());
			}
			
			return getJdbcTemplate().queryForInt(sql, params.toArray());
	}

	@Override
	//shareptye: 공유 방식 0이면 전체 공개, 1이면 비밀번호 
	public int countPublicMaps(int sharetype, String searchfield, String search) throws DataAccessException { 
		/*
		String sql = "SELECT count(id) from ( " +
		" select m.id id FROM mm_map m " +
		" LEFT OUTER JOIN mm_share s ON s.mapid = m.id" +
		" LEFT JOIN mm_map_owner o ON m.id = o.mapid" +
		" LEFT JOIN mm_map_owner_info oi ON m.id = oi.mapid " +
		" LEFT JOIN mm_user u ON o.userid = u.id ";

		if(sharetype == 1) { //비빌번호
			sql += " WHERE (sharetype < 3 OR oi.id >0  ) ";
		}else { //전체 공개만
			sql += " where sharetype = 1";
		}
		ArrayList params = new ArrayList();
	
		if (search != null && search.trim().length() > 0) {
			sql += " and " + SORT_ORDER_GUEST.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		sql+=" group by m.id ) tempT  ";
		*/
		
		/* 2014-12-12
		String sql = "SELECT count(*) " +
				"FROM ( " +
				"        SELECT s.mapid, s.sharetype, u.lastname, u.firstname " +
				"        FROM mm_share s " +
				"        JOIN mm_map_owner o ON o.mapid = s.mapid " +
				"        JOIN mm_user u ON u.id = o.userid " +
				"        UNION " +
				"        SELECT oi.mapid, 0 AS sharetype, email AS lastname, '' AS firstname " +
				"        FROM mm_map_owner_info oi) a " +
				"JOIN mm_map m ON m.id = a.mapid ";
		
		if(sharetype == 1) { //비빌번호
			sql += " WHERE sharetype < 3 ";
		}else { //전체 공개만
			sql += " WHERE sharetype = 1 ";
		}
		*/
		String sql = "SELECT COUNT(*) "
				+ "FROM mm_map m "
				+ "JOIN (SELECT mapid, 0 AS sharetype "
				+ "      FROM mm_map_owner_info "
				+ "      UNION "
				+ "      SELECT mapid, sharetype FROM mm_share "
				+ "      ) s ON s.mapid = m.id "
				+ "LEFT JOIN mm_map_owner o ON o.mapid = m.id "
				+ "LEFT JOIN mm_user u ON u.id = o.userid "
				+ "LEFT JOIN mm_map_owner_info oi ON oi.mapid = m.id ";
		if(sharetype == 1) { //비빌번호
			sql += " WHERE sharetype < 3 ";
		}else { //전체 공개만
			sql += " WHERE sharetype = 1 ";
		}
		
		ArrayList params = new ArrayList();

		if (search != null && search.trim().length() > 0) {
			sql += " AND " + SORT_ORDER_GUEST.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		return getJdbcTemplate().queryForInt(sql, params.toArray());
		
	}
	
	@Override
	//shareptye: 공유 방식 0이면 전체 공개, 1이면 비밀번호 
	public int countAllMaps(int sharetype, String searchfield, String search) throws DataAccessException { 
		String sql = "SELECT "
				+ "     count(*) "
				+ "FROM mm_map m "
				+ "INNER JOIN mm_map_owner b ON m.id = b.mapid "
				+ "INNER JOIN mm_user c ON b.userid = c.id "
				+ "LEFT OUTER JOIN mm_share d ON m.id = d.mapid "
				+ "WHERE 1=1 ";
		
		ArrayList params = new ArrayList();
		
		if (search != null && search.trim().length() > 0) {
			sql += " AND " + SORT_ORDER_GUEST.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
		
		return getJdbcTemplate().queryForInt(sql, params.toArray());
		
	}
	
	private static final String SQL_PERMISSION_SELECT_FROM =
		"SELECT p.id, " +
		"       p.shareid, " +
		"       p.permissiontype, " +
		"       p.permited, " +
		"       t.name AS type_name, " +
		"       t.shortname AS type_shortname " +
		"FROM mm_share_permission p " +
		"JOIN mm_share_permission_type t ON t.id = p.permissiontype ";
	
	@SuppressWarnings("unchecked")
	public List<Permission> getPermissions(int shareid) throws DataAccessException {
		String sql = SQL_PERMISSION_SELECT_FROM +
				"WHERE p.shareid = ? " +
				"ORDER BY p.id ";
		
		return getJdbcTemplate().query(sql, 
				new Object[]{shareid},
				new PermissionRowMapper());
	}

	@SuppressWarnings("unchecked")
	public List<Node> getPathToRoot(int id, int map_id) throws DataAccessException {
		String sql = "SELECT parent.*, (parent.rgt - parent.lft - 1) / 2 AS num_of_children " +
				    " FROM mm_node AS node," +
				    "      mm_node AS parent" +
				    " WHERE node.lft BETWEEN parent.lft AND parent.rgt" +
				    "   AND parent.map_id = node.map_id" +
				    "   AND node.id = ?" +
				    "   AND node.map_id = ?" +
				    " ORDER BY parent.lft";
		
		return getJdbcTemplate().query(sql, 
				new Object[]{id, map_id},
				new NodeRowMapper());
	}

	
	private String createMapLockKey(int map_id) {
		return "lock_map_" + map_id;
	}

	@Override
	public int updateQueueing(int mapId, int queueing) {
			String sql = "UPDATE mm_map SET queueing = ? " + " WHERE id = ?";
		
		int result = -1;

		String key = createMapLockKey(mapId);
		Object lock = LockObjectManager.getInstance().lock(key);
		synchronized (lock) {
			result = getJdbcTemplate().update(sql, new Object[] { queueing, mapId });
		}
		LockObjectManager.getInstance().unlock(key);
		
		return result;
	}
	
	
	public Slide getSlide(int nodeId) throws DataAccessException {
		String sql =	"SELECT * " +
				"FROM mm_presentation_slide " +
				"WHERE node_id = ?";
		
		try {
			return (Slide)getJdbcTemplate().queryForObject(sql, new Object[] { nodeId },
					new SlideRowMapper());
		} catch (Exception e) {
			return null;
		}		
	}
	
	public int insertSlide(int nodeId, double x, double y, double scalex, double scaley, double rotate, int showdepths) throws DataAccessException {
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_presentation_slide WHERE node_id = ? ",
				new Object[]{nodeId});
		if(count > 0) {
			this.deleteSlide(nodeId);
		}
		
		String query = "INSERT INTO mm_presentation_slide (id, node_id, x, y, scalex, scaley, rotate, showdepths)" +
		" VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		
		int id = createNewID("mm_presentation_slide");

		getJdbcTemplate().update(query , new Object[] {
				id,
				nodeId,
				x,
				y,
				scalex,
				scaley,
				rotate,
				showdepths
			});

		return id;
	}
	
	public int updateSlide(int nodeId, double x, double y, double scalex, double scaley, double rotate, int showdepths) throws DataAccessException {
		int count = getJdbcTemplate().queryForInt("SELECT count(*) FROM mm_presentation_slide WHERE node_id = ? ",
				new Object[]{nodeId});
		
		if(count == 0) {
			return this.insertSlide(nodeId, x, y, scalex, scaley, rotate, showdepths);
		}
		
		String query = "UPDATE mm_presentation_slide SET x = ?, y = ?,  scalex = ?, scaley = ?, rotate = ?, showdepths = ? WHERE node_id = ?";

		return getJdbcTemplate().update(query , new Object[] {
							x,
							y,
							scalex,
							scaley,
							rotate,
							showdepths,
							nodeId
					});
	}
	
	public int deleteSlide(int nodeId) throws DataAccessException {
		String sql = "DELETE FROM mm_presentation_slide WHERE node_id = ?";

		return getJdbcTemplate().update(sql, new Object[] { nodeId });
	}

	@Override
	public int countDuplicateMapName(int userid, String mapName) {
		String sql ="SELECT COUNT(m.id)  FROM mm_map m LEFT JOIN mm_map_owner o ON m. id = o.mapid "+
			"WHERE o.userid = ? AND NAME = ?";
		
		return getJdbcTemplate().queryForInt(sql, new Object[] { userid, mapName });
	}
	@Override
	public int updateShortUrl(int mapId, String short_url) throws DataAccessException {
			String sql = "UPDATE mm_map SET short_url = ? " + " WHERE id = ?";
			
			int result = -1;

			String key = createMapLockKey(mapId);
			Object lock = LockObjectManager.getInstance().lock(key);
			synchronized (lock) {
				result = getJdbcTemplate().update(sql, new Object[] { short_url, mapId });
			}
			LockObjectManager.getInstance().unlock(key);
			
			return result;
	}
	
	private long getUserId() {
		long userid = 0;
		
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
		HttpSession session = requestAttributes.getRequest().getSession();
		User user = (User)session.getAttribute("user");
		if(!user.isGuest()) {
			userid = user.getId();
		}
		
		return userid;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> getMapRecommend(int page, int pagelimit, String searchfield, String search) throws DataAccessException {
		String sql = "SELECT *, q.queuecount, revisioncnt " +
				"FROM (SELECT   m.*, u.lastname, u.firstname, u.username " +
				"FROM mm_map m " +
				"JOIN mm_share sh on m.id = sh.mapid and sh.sharetype = 1 " +
				"LEFT JOIN mm_map_owner o ON m.id = o.mapid " +
				"LEFT JOIN mm_user u ON o.userid = u.id ";
				
		ArrayList params = new ArrayList();
		
		if (search != null && search.trim().length() > 0) {
			sql += " where " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
			
		sql += " ORDER BY recommend_point desc ";
		
		if(pagelimit>0){
			sql += " LIMIT ? OFFSET ? ";
			params.add(pagelimit);
			params.add((page-1)*pagelimit);
		}
		sql += ") mm " +
		"LEFT JOIN (SELECT roomnumber, COUNT(roomnumber) AS queuecount FROM mm_queuedata GROUP BY roomnumber) q ON mm.map_key = q.roomnumber " +
		"LEFT JOIN (SELECT map_id, COUNT(id) AS revisioncnt FROM mm_map_timeline GROUP BY map_id) rev ON mm.id = rev.map_id ";
		
		return getJdbcTemplate().query(sql, params.toArray(),new MapRowMapper());
		
	}
	
	public int countAllRecommendMaps(String searchfield, String search) throws DataAccessException {
		String sql ="SELECT COUNT(m.id) FROM mm_map m LEFT JOIN mm_map_owner o ON m.id = o.mapid "+ 
		" LEFT JOIN mm_user u ON o.userid = u.id "+
		" LEFT JOIN (SELECT roomnumber, COUNT(roomnumber) AS queuecount FROM mm_queuedata GROUP BY roomnumber) q ON m.map_key = q.roomnumber   ";
			
		if (search != null && search.trim().length() > 0) {
			ArrayList<String> params = new ArrayList<String>();
			sql += " where " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
			return getJdbcTemplate().queryForInt(sql, new Object[] { search.trim() });
		} else {
			return getJdbcTemplate().queryForInt(sql);
		}
	}
	
	public int deleteRecommendList(int mapId ) throws DataAccessException {
		String sql = "UPDATE mm_map SET  recommend_point = -1 WHERE id = ?";
		return getJdbcTemplate().update(sql,new Object[] { mapId});
	}
	
	public int insertRecommendMap(int mapId, long added, String imgURL) {
		String query = "INSERT INTO mm_map_recommend (map_id, added, imagepath) "
			+ " VALUES (?, ?, ?)";
		
		return getJdbcTemplate().update(query, new Object[] { mapId, added, imgURL });
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<RecommendList> getRecommendManagementList(int page, int pagelimit, String searchfield, String search) throws DataAccessException {
		String sql = "SELECT *, revisioncnt " +
				"FROM (SELECT m.*,mr.id as recommend_id, mr.map_id, mr.added, mr.imagepath, u.lastname, u.firstname, u.username " +
				"FROM mm_map_recommend mr " + 
				"JOIN mm_map m ON mr.map_id = m.id " +
				"LEFT JOIN mm_map_owner o ON m.id = o.mapid " +
				"LEFT JOIN mm_user u ON o.userid = u.id ";
				
		ArrayList params = new ArrayList();
		
		if (search != null && search.trim().length() > 0) {
			sql += " where " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
		}
			
		sql += " ORDER BY mr.added desc ";
		
		if(pagelimit>0){
			sql += " LIMIT ? OFFSET ? ";
			params.add(pagelimit);
			params.add((page-1)*pagelimit);
		}
		sql += ") mm " +
		"LEFT JOIN (SELECT map_id, COUNT(id) AS revisioncnt FROM mm_map_timeline GROUP BY map_id) rev ON mm.id = rev.map_id ";
		
		return getJdbcTemplate().query(sql, params.toArray(),new RecommendMapRowMapper());
		
	}
	
	public int countAllRecommendManagementList(String searchfield, String search) throws DataAccessException {
		String sql ="SELECT COUNT(mr.id) FROM mm_map_recommend mr LEFT JOIN mm_map_owner o ON mr.map_id = o.mapid "+ 
		" LEFT JOIN mm_user u ON o.userid = u.id ";
			
		if (search != null && search.trim().length() > 0) {
			ArrayList<String> params = new ArrayList<String>();
			sql += " where " + SORT_ORDER.get(searchfield) +  " LIKE CONCAT('%', ?, '%')";
			params.add(search.trim());
			return getJdbcTemplate().queryForInt(sql, new Object[] { search.trim() });
		} else {
			return getJdbcTemplate().queryForInt(sql);
		}
	}
	
	public int deleteRecommendManagementList(int recommendId ) throws DataAccessException {
		String sql = "DELETE FROM mm_map_recommend WHERE id = ?";
		return getJdbcTemplate().update(sql,new Object[] { recommendId});
	}
	
	public List getRecommendFilePath(int recommendId ) throws DataAccessException {
		String sql = "SELECT imagepath FROM mm_map_recommend WHERE id = ?";
		return getJdbcTemplate().queryForList(sql,new Object[] { recommendId});
	}

	@Override
	public int updateNodeLineColor(String dbid, String color) {
		String sql = "update mm_node set line_color= '"+color+"' WHERE id = '"+dbid+"' ";
		return getJdbcTemplate().update(sql);
	}

}
