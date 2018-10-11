package com.okmindmap.moodle;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.net.HttpURLConnection;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringEscapeUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.okmindmap.dao.MindmapDAO;
import com.okmindmap.model.Attribute;
import com.okmindmap.model.Category;
import com.okmindmap.model.Map;
import com.okmindmap.model.Node;
import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.group.Member;
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;

public class MoodleService {
	private ShareService shareService;
	private GroupService groupService;
	protected UserService userService;
	private OKMindmapService okmindmapService;
	private MindmapService mindmapService;
	private User user;
	
	public MoodleService(User user, OKMindmapService okmindmapService, MindmapService mindmapService){
		this.user = user;
		this.okmindmapService = okmindmapService;
		this.mindmapService = mindmapService;
	}
	public MoodleService(User user, OKMindmapService okmindmapService, MindmapService mindmapService, UserService userService){
		this.user = user;
		this.okmindmapService = okmindmapService;
		this.mindmapService = mindmapService;
		this.userService = userService;
	}
	public MoodleService(User user, OKMindmapService okmindmapService, MindmapService mindmapService, UserService userService, ShareService shareService, GroupService groupService){
		this.user = user;
		this.okmindmapService = okmindmapService;
		this.mindmapService = mindmapService;
		this.userService = userService;
		this.shareService = shareService;
		this.groupService = groupService;
	}
	
	public JSONObject getMoodleConfig() {
		try {
			String moodle_url = this.okmindmapService.getSetting("moodle_url");
			String moodle_secret = this.okmindmapService.getSetting("moodle_secret");
			String moodle_course_creator_group = this.okmindmapService.getSetting("moodle_course_creator_group");
			
			if(moodle_url.isEmpty() || moodle_secret.isEmpty()) return null;
			
			JSONObject config = new JSONObject();
			config.put("moodle_url", this.str_finish(moodle_url, "/"));
			config.put("moodle_secret", moodle_secret);
			config.put("moodle_course_creator_group", moodle_course_creator_group);
			
			return config;
		} catch (JSONException e) {} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	public String str_finish(String str, String delimiter) {
		return str.endsWith(delimiter) ? str : str + delimiter;
	}
	
	public HashMap<String, Object> getCourseCategories() {
		HashMap<String, Object> res = new HashMap<String, Object>();
		try {
			JSONObject config = this.getMoodleConfig();
			JSONObject obj = new JSONObject();
			obj.put("role", "coursecreator");
			obj.put("info", "course_categories.do");
			
			String query = this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), this.user);
			
			JSONObject data = new JSONObject(query);
			if(data != null) {
				res = this.toHashMap(data);
			}
		} catch (JSONException e) {}
		return res;
	}
	
	public String create_course(String title, String shortname, int category, String summary) {
		try {
			JSONObject config = this.getMoodleConfig();
			
			JSONObject obj = new JSONObject();
			obj.put("role", "coursecreator");
			obj.put("info", "create_course.do");
			obj.put("fullname",  StringEscapeUtils.escapeHtml(title));
			obj.put("shortname",  StringEscapeUtils.escapeHtml(shortname));
			obj.put("category", category);
			obj.put("summary",  StringEscapeUtils.escapeHtml(summary));
			
			return this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), this.user);
		} catch (JSONException e) {}
		return null;
	}
	
	public void set_course_connection(Map map, int course) {
		try {
			JSONObject config = this.getMoodleConfig();
			
			Node root = map.getNodes().get(0);
			ArrayList<Attribute> attrs = (ArrayList<Attribute>) root.getAttributes();
			
			Attribute moodleUrl = new Attribute();
			moodleUrl.setName("moodleUrl");
			moodleUrl.setNodeId(root.getId());
			moodleUrl.setValue(config.getString("moodle_url"));
			attrs.add(moodleUrl);
			
			Attribute moodleCourseId = new Attribute();
			moodleCourseId.setName("moodleCourseId");
			moodleCourseId.setNodeId(root.getId());
			moodleCourseId.setValue(Integer.toString(course));
			attrs.add(moodleCourseId);
			
			root.setAttributes(attrs);
			this.mindmapService.updateNode(map.getId(), root);
			
			JSONObject obj = new JSONObject();
			obj.put("role", "coursecreator");
			obj.put("info", "set_course_connection.do");
			obj.put("moodleCourseId",  course);
			obj.put("okmmMapId",  map.getId());
			
			this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), this.user);
		} catch (JSONException e) {}
	}
	
	public void delete_course_connection(int mapId) {
		try {
			Map map = this.mindmapService.getMap(mapId);
			JSONObject config = this.getMoodleConfig();
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			
			if(config == null || mapConfig == null) return;
			
			if(mapConfig.has("moodleCourseTeacherShareId")) this.shareService.deleteShare(Integer.parseInt(mapConfig.getString("moodleCourseTeacherShareId")));
			if(mapConfig.has("moodleCourseStudentShareId")) this.shareService.deleteShare(Integer.parseInt(mapConfig.getString("moodleCourseStudentShareId")));
			
			if(mapConfig.has("moodleCourseTeacherGroupId")) this.groupService.deleteGroup(Integer.parseInt(mapConfig.getString("moodleCourseTeacherGroupId")));
			if(mapConfig.has("moodleCourseStudentGroupId")) this.groupService.deleteGroup(Integer.parseInt(mapConfig.getString("moodleCourseStudentGroupId")));
			
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			
			JSONObject obj = new JSONObject();
			obj.put("role", "coursecreator");
			obj.put("info", "delete_course_connection.do");
			obj.put("okmmMapId", mapId);
			obj.put("moodleCourseId", mapConfig.getInt("moodleCourseId"));
			
			this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), mapOwner);
		} catch (JSONException e) {}
	}
	
	public JSONObject add_module(int mapId, int section, String module, String name) {
		try {
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			JSONObject config = this.getMoodleConfig();
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			
			if(mapConfig == null) return null;
			
			JSONObject obj = new JSONObject();
			obj.put("role", "coursecreator");
			obj.put("info", "add_module.do");
			obj.put("moduleName", module);
			obj.put("add", module);
			obj.put("section", section);
			obj.put("name", name);
			obj.put("moodleCourseId", mapConfig.getInt("moodleCourseId"));
			
			JSONObject res = new JSONObject(this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), mapOwner));

			return res;
		} catch (JSONException e) {
			return null;
		}
	}

	public JSONObject getMoodleConnection(Node node) {
		JSONObject con = null;
		try {
			ArrayList<Attribute> attrs = (ArrayList<Attribute>) node.getAttributes();
			
			for(Attribute attr: attrs) {
				if(attr.getName().startsWith("moodle")) {
					if(con == null) con = new JSONObject();
					con.put(attr.getName(), attr.getValue());
				}
			}
			return con;
		} catch (JSONException e) {}
		return con;
	}
	
	public void updateNode(int mapId, Node node) {
		try {
			node = this.mindmapService.getNode(node.getIdentity(), mapId, false);
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			
			JSONObject config = this.getMoodleConfig();
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			JSONObject nodeConfig = this.getMoodleConnection(node);
			JSONObject obj = new JSONObject();
			
			if(mapConfig == null && nodeConfig != null) return;
			
			obj.put("role", "coursecreator");
			obj.put("moodleCourseId", mapConfig.getString("moodleCourseId"));
			obj.put("name",  node.getText());
			obj.put("okmmMapId", mapId);
			
			if(nodeConfig.has("moodleCourseSection")) {
				obj.put("info", "edit_section.do");
				obj.put("section", nodeConfig.getString("moodleCourseSection"));
			}else if(nodeConfig.has("moodleCourseId")) {
				obj.put("info", "edit_course.do");
			}else {
				if(nodeConfig.has("moodleModule") && nodeConfig.getString("moodleModule").equals("label")) {
					obj.put("intro", node.getText());
				}else {
					obj.put("intro", "");
				}
				obj.put("info", "edit_module.do");
				obj.put("okmmNodeId", node.getId());
				obj.put("moodleModule", nodeConfig.getString("moodleModule"));
				obj.put("moodleModuleId", nodeConfig.getString("moodleModuleId"));
			}
			
			this.request(mapConfig.getString("moodleUrl"), obj, config.getString("moodle_secret"), mapOwner);
		} catch (JSONException e) {}
	}
	
	public void deleteNode(int mapId, Node node) {
		try {
			MindmapDAO mindmapDAO = this.mindmapService.getMindmapDAO();
			Node orgNode = mindmapDAO.getNode(node.getIdentity(), mapId, false);
			
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			JSONObject config = this.getMoodleConfig();
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			JSONObject nodeConfig = this.getMoodleConnection(node);
			JSONObject obj = new JSONObject();
			
			if(mapConfig == null || orgNode == null && nodeConfig != null) return;
			
			obj.put("role", "coursecreator");
			obj.put("moodleCourseId", mapConfig.getString("moodleCourseId"));
			obj.put("okmmMapId", map.getId());
			
			if(nodeConfig.has("moodleCourseId")) {
				
//				obj.put("info", "edit_course.do");
			}else {
				obj.put("info", "delete_module.do");
				obj.put("okmmNodeId", orgNode.getId());
				obj.put("moodleModule", nodeConfig.getString("moodleModule"));
				obj.put("moodleModuleId", nodeConfig.getString("moodleModuleId"));
			}
			this.request(mapConfig.getString("moodleUrl"), obj, config.getString("moodle_secret"), mapOwner);
			
			List<Node> childrens = node.getChildren();
			Iterator<Node> it = childrens.iterator();
			while(it.hasNext()) {
				Node children = it.next();
				this.deleteNode(mapId, children);
			}
			
		} catch (JSONException e) {}
	}
	
	public void moveNode(int mapId, Node node, String parent, String next) {
		try {
			node = this.mindmapService.getNode(node.getIdentity(), mapId, false);
			Node parentNode = this.mindmapService.getNode(parent, mapId, false);
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			
			JSONObject config = this.getMoodleConfig();
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			JSONObject nodeConfig = this.getMoodleConnection(node);
			JSONObject obj = new JSONObject();
			
			if(mapConfig == null && nodeConfig != null && !nodeConfig.has("moodleModuleId")) return;
			
			obj.put("role", "coursecreator");
			obj.put("moodleCourseId", mapConfig.getString("moodleCourseId"));
			obj.put("okmmMapId", mapId);
			obj.put("info", "move_to_section.do");
			obj.put("module", nodeConfig.getString("moodleModuleId"));
			obj.put("section", this.findSection(map.getNodes().get(0).getId(), parentNode));
			
			this.request(mapConfig.getString("moodleUrl"), obj, config.getString("moodle_secret"), mapOwner);
		} catch (JSONException e) {}
	}
	
	public Boolean syncAction(int mapId) {
		try {
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			
			if(mapConfig != null) {
			
				JSONObject config = this.getMoodleConfig();
				JSONObject obj = new JSONObject();
				obj.put("role", "coursecreator");
				obj.put("info", "get_modules.do");
				obj.put("moodleCourseId", mapConfig.getString("moodleCourseId"));
				obj.put("okmmMapId", mapId);
				JSONObject res = new JSONObject(this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), mapOwner));
				
				if("ok".equals(res.getString("status"))) {
					JSONObject data = res.getJSONObject("data");
					Node root = map.getNodes().get(0);
					
					JSONObject sections = data.getJSONObject("sections");
					sections = this.syncSections(map, sections);
					
					JSONObject cm = data.getJSONObject("modules");
					Iterator<Node> it = root.getChildren().iterator();
					while(it.hasNext()) {
						Node n = it.next();
						cm = this.modifyAction(map, n, cm, sections);
					}
					
					Iterator<?> i = cm.keys();
					while(i.hasNext()) {
						String new_cm = (String)i.next();
						JSONObject _cm = cm.getJSONObject(new_cm);
						
						String identity = "ID_" + Integer.toString(new Random().nextInt(2000000000));
						long created = new Date().getTime();
						Node new_node = new Node();
						new_node.setIdentity(identity);
						new_node.setCreated( created );
						new_node.setModified( created );
						new_node.setParent(root);
						new_node.setText(_cm.getString("name"));
						new_node.setLink(_cm.getString("link"));
						
						
						ArrayList<Attribute> attrs = new ArrayList<Attribute>();
						
						Attribute moodleModule = new Attribute();
						moodleModule.setName("moodleModule");
						moodleModule.setValue(_cm.getString("modname"));
						attrs.add(moodleModule);
						
						Attribute moodleModuleId = new Attribute();
						moodleModuleId.setName("moodleModuleId");
						moodleModuleId.setValue(_cm.getString("id"));
						attrs.add(moodleModuleId);
						
						new_node.setAttributes(attrs);
						
						this.mindmapService.newNodeBeforeSibling(mapId, new_node, root.getIdentity(), "");
						
						String parent = "";
						if(sections.has("section_" + _cm.getString("section"))) {
							parent = this.mindmapService.getNode(sections.getInt("section_"+_cm.getString("section")), false).getIdentity();
						}else {
							parent = root.getIdentity();
						}
						this.mindmapService.moveNode(mapId, new_node, parent, null);
						
						this.updateNode(mapId, new_node);
					}
					
					root = this.mindmapService.getNode(root.getId(), false);
					root.setText(data.getJSONObject("course").getString("fullname"));
					this.mindmapService.updateNode(mapId, root);
					
					return true;
				}
			}
		} catch (JSONException e) {
			return false;
		}
		return false;
	}
	
	public JSONObject syncSections(Map map, JSONObject sections) {
		JSONObject res = new JSONObject();
		try {
			Node root = map.getNodes().get(0);
			
			// update title
			Iterator<Node> it = root.getChildren().iterator();
			while(it.hasNext()) {
				Node n = it.next();
				JSONObject nodeConfig = this.getMoodleConnection(n);
				if(nodeConfig != null && nodeConfig.has("moodleCourseSection")) {
					String name = "section_" + nodeConfig.getString("moodleCourseSection");
					if(sections.has(name)) {
						n.setText(sections.getString(name));
						this.mindmapService.updateNode(map.getId(), n);
						res.put(name, n.getId());
						sections.remove(name);
					}else {
						// can delete it if necessary
					}
				}
			}
			
			// create
			Iterator<?> i = sections.keys();
			while(i.hasNext()) {
				String key = (String)i.next();
				String sec = key.split("section_", 2)[1];
				
				String identity = "ID_" + Integer.toString(new Random().nextInt(2000000000));
				long created = new Date().getTime();
				Node new_node = new Node();
				new_node.setIdentity(identity);
				new_node.setCreated( created );
				new_node.setModified( created );
				new_node.setParent(root);
				new_node.setText(sections.getString(key));
				
				ArrayList<Attribute> attrs = new ArrayList<Attribute>();
				
				Attribute moodleSection = new Attribute();
				moodleSection.setName("moodleCourseSection");
				moodleSection.setValue(sec);
				attrs.add(moodleSection);
				
				new_node.setAttributes(attrs);
				
				this.mindmapService.newNodeBeforeSibling(map.getId(), new_node, root.getIdentity(), "");
				res.put(key, new_node.getId());
			}
			
		} catch (JSONException e) {}
		return res;
	}
	
	public int findSection(int root, Node node) {
		JSONObject nodeConfig = this.getMoodleConnection(node);
		try {
			if(node.getId() != root) {
				
				if(nodeConfig != null && nodeConfig.has("moodleCourseSection")) {
					return Integer.parseInt(nodeConfig.getString("moodleCourseSection"));
				}
				
				return this.findSection(root, node.getParent());
			}
		} catch (NumberFormatException e) {
		} catch (JSONException e) {}
		
		return 0;
	}
	
	public JSONObject modifyAction(Map map, Node node, JSONObject mod, JSONObject sections) {
		try {
			JSONObject nodeConfig = this.getMoodleConnection(node);
			
			
			if(nodeConfig != null) {
				if(!nodeConfig.has("moodleCourseSection")) {
					String name = "mod_" + nodeConfig.getString("moodleModuleId");
					if(mod.has(name)) {
						JSONObject cm = mod.getJSONObject(name);
						node.setText(cm.getString("name"));
						this.mindmapService.updateNode(map.getId(), node);
						
						int sec = this.findSection(map.getNodes().get(0).getId(), node);
						
						if(sec != Integer.parseInt(cm.getString("section"))) {
							String parent = "";
							if(sections.has("section_" + cm.getString("section"))) {
								parent = this.mindmapService.getNode(sections.getInt("section_"+cm.getString("section")), false).getIdentity();
							}else {
								parent = map.getNodes().get(0).getIdentity();
							}
							this.mindmapService.moveNode(map.getId(), node, parent, null);
						}
						
						mod.remove(name);
					}else {
						this.mindmapService.deleteNode(map.getId(), node);
					}
				}
			}
			
			Iterator<Node> it = node.getChildren().iterator();
			while(it.hasNext()) {
				Node n = it.next();
				mod = this.modifyAction(map, n, mod, sections);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			return null;
		}
		return mod;
	}
	
	public JSONObject getMoodleActivities(int mapId) {
		JSONObject activities = null;
		try {
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			
			if(mapConfig == null) return null;
			
			JSONObject config = this.getMoodleConfig();
			JSONObject obj = new JSONObject();
			obj.put("role", "coursecreator");
			obj.put("info", "get_activities.do");
			obj.put("moodleCourseId", mapConfig.getString("moodleCourseId"));
			JSONObject res = new JSONObject(this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), mapOwner));
			
			if("ok".equals(res.getString("status"))) {
				activities = res.getJSONObject("activities");
			}
		} catch (JSONException e) {}
		return activities;
	}
	
	public JSONObject courseEnrolment(int mapId, String search, String page, String perpage, String action, JSONObject enroluser, Boolean returnViewList) {
		JSONObject courseEnrolment = null;
		try {
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			
			if(mapConfig == null) return null;
			
			JSONObject config = this.getMoodleConfig();
			JSONObject obj = new JSONObject();
			obj.put("role", "coursecreator");
			obj.put("info", "course_enrolment.do");
			obj.put("moodleCourseId", mapConfig.getString("moodleCourseId"));
			obj.put("viewlist", returnViewList);
			
			if(search !=null && search != "") obj.put("search", search);
			if(page !=null && page != "") obj.put("page", page);
			if(perpage !=null && perpage != "") obj.put("perpage", perpage);
			if(action !=null && action != "") obj.put("action", action);
			if(enroluser !=null) obj.put("enroluser", enroluser);
			
			courseEnrolment = new JSONObject(this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), mapOwner));
			
		} catch (JSONException e) {}
		return courseEnrolment;
	}
	
	public JSONObject getOKMMEnrolment(int mapId, List<User> users) {
		JSONObject res = null;
		try {
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			
			if(mapConfig == null) return null;
			
			JSONObject config = this.getMoodleConfig();
			JSONObject obj = new JSONObject();
			obj.put("role", "coursecreator");
			obj.put("info", "course_enrolment.do");
			obj.put("moodleCourseId", mapConfig.getString("moodleCourseId"));
			
			obj.put("action", "check_okmmusers");
			List<String> okmmusers = new ArrayList<String>();
			for(User u : users) {
				if(!"guest".equals(u.getUsername())) {
					okmmusers.add(this.getIdEncrypt(u));
				}
			}
			obj.put("okmmusers", okmmusers);
			
			res = new JSONObject(this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), mapOwner));
			
		} catch (JSONException e) {}
		return res;
	}
	
	public String getMoodleLoginPageIdp() {
		JSONObject config = this.getMoodleConfig();
		try {
			if(config != null) {
				return config.getString("moodle_url") + "auth/okmmauth/login.php";
			}
		} catch (JSONException e) {}
		return "";
	}
	
	public User syncUser(String auth, String username, String firstname, String lastname, String email) {
		User user = null;
		
		if("okmmauth".equals(auth)) {
			user = this.userService.get(this.getIdDecrypt(username));
		}else {
			user = this.userService.get(username);
		
			if(user == null) {
				user = new User();
				
				user.setAuth(auth);
				user.setConfirmed(1);
				user.setUsername(username);
				user.setFirstname(firstname);
				user.setLastname(lastname);
				user.setEmail(email);
				user.setPassword("not cached");
				
				this.userService.add(user);
			}else {
				user.setFirstname(firstname);
				user.setLastname(lastname);
				user.setEmail(email);
				
				this.userService.update(user);
			}
			
			user = this.userService.get(username);
		}
		
		return user;
	}
	
	public User syncMoodleId(String mdlauth) {
		try {
			JSONObject config = this.getMoodleConfig();
			
			if(config == null) return null;
			
			JSONObject mdlUser = new JSONObject(this.decrypt(mdlauth, config.getString("moodle_secret")));
			
			if(mdlUser != null) {
				return this.syncUser(mdlUser.getString("auth"), mdlUser.getString("username"), mdlUser.getString("firstname"), mdlUser.getString("lastname"), mdlUser.getString("email"));
			}
		} catch (JSONException e) {}
		return null;
	}
	
	public Group getStudentGroup(int groupId, Map map) {
		Group group = null;
		try {
			group = this.groupService.getGroup(groupId);
		} catch (Exception e) {}
		
		if(group == null) {
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			
			// add new group
			Group newGroup = new Group();
			newGroup.setName("[Student] " + map.getName());
			newGroup.setUser(mapOwner);
			newGroup.setPolicy(this.groupService.getPolicy("closed"));
			
			List<Category> categories = this.groupService.getUserCategoryTree(mapOwner.getId());
			if(categories.size() > 0) {
				groupId = this.groupService.addGroup(newGroup, categories.get(0).getId());
			}else {
				groupId = this.groupService.addGroup(newGroup);
			}
			
			// update mapConfig
			Node root = map.getNodes().get(0);
			ArrayList<Attribute> attrs = (ArrayList<Attribute>) root.getAttributes();
			
			Attribute _groupId = null;
			
			for (int i = 0; i < attrs.size(); i++) {
				if("moodleCourseStudentGroupId".equals(attrs.get(i).getName())) {
					_groupId = attrs.get(i);
					_groupId.setValue(Integer.toString(groupId));
					attrs.set(i, _groupId);
				}
			}
			
			if(_groupId == null) {
				_groupId = new Attribute();
				_groupId.setName("moodleCourseStudentGroupId");
				_groupId.setNodeId(root.getId());
				_groupId.setValue(Integer.toString(groupId));
				attrs.add(_groupId);
			}
			
			root.setAttributes(attrs);
			this.mindmapService.updateNode(map.getId(), root);
			
			group = this.groupService.getGroup(groupId);
		}
		return group;
	}
	
	public Group getTeacherGroup(int groupId, Map map) {
		Group group = null;
		try {
			group = this.groupService.getGroup(groupId);
		} catch (Exception e) {}
		
		if(group == null) {
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			
			// add new group
			Group newGroup = new Group();
			newGroup.setName("[Teacher] " + map.getName());
			newGroup.setUser(mapOwner);
			newGroup.setPolicy(this.groupService.getPolicy("closed"));
			
			List<Category> categories = this.groupService.getUserCategoryTree(mapOwner.getId());
			if(categories.size() > 0) {
				groupId = this.groupService.addGroup(newGroup, categories.get(0).getId());
			}else {
				groupId = this.groupService.addGroup(newGroup);
			}
			
			// update mapConfig
			Node root = map.getNodes().get(0);
			ArrayList<Attribute> attrs = (ArrayList<Attribute>) root.getAttributes();
			
			Attribute _groupId = null;
			
			for (int i = 0; i < attrs.size(); i++) {
				if("moodleCourseTeacherGroupId".equals(attrs.get(i).getName())) {
					_groupId = attrs.get(i);
					_groupId.setValue(Integer.toString(groupId));
					attrs.set(i, _groupId);
				}
			}
			
			if(_groupId == null) {
				_groupId = new Attribute();
				_groupId.setName("moodleCourseTeacherGroupId");
				_groupId.setNodeId(root.getId());
				_groupId.setValue(Integer.toString(groupId));
				attrs.add(_groupId);
			}
			
			root.setAttributes(attrs);
			this.mindmapService.updateNode(map.getId(), root);
			
			group = this.groupService.getGroup(groupId);
		}
		return group;
	}
	
	public Share getStudentShare(int shareId, Group group, Map map) {
		Share share = null;
		
		try {
			share = this.shareService.getShare(shareId);
		} catch (Exception e) {}
		
		if(share == null) {
			// add Share
			share = new Share();
			ShareMap shareMap = new ShareMap();
			shareMap.setId(map.getId());
			share.setMap(shareMap);
			
			share.setShareType(this.shareService.getShareType("group"));
			
			share.setGroup(group);
			
			List<Permission> permissions = new ArrayList<Permission>();
			List<PermissionType> permissionTypes = this.shareService.getPermissionTypes();
			for(PermissionType permissionType : permissionTypes) {
				Permission permission = new Permission();
				permission.setPermissionType(permissionType);
				permission.setPermited("view".equals(permissionType.getShortName()));
				permissions.add(permission);
			}
			share.setPermissions(permissions);
			
			shareId = this.shareService.addShare(share);
			
			// update mapConfig
			Node root = map.getNodes().get(0);
			ArrayList<Attribute> attrs = (ArrayList<Attribute>) root.getAttributes();
			
			Attribute _groupId = null;
			
			for (int i = 0; i < attrs.size(); i++) {
				if("moodleCourseStudentShareId".equals(attrs.get(i).getName())) {
					_groupId = attrs.get(i);
					_groupId.setValue(Integer.toString(shareId));
					attrs.set(i, _groupId);
				}
			}
			
			if(_groupId == null) {
				_groupId = new Attribute();
				_groupId.setName("moodleCourseStudentShareId");
				_groupId.setNodeId(root.getId());
				_groupId.setValue(Integer.toString(shareId));
				attrs.add(_groupId);
			}
			
			root.setAttributes(attrs);
			this.mindmapService.updateNode(map.getId(), root);
			
			share = this.shareService.getShare(shareId);
		}
		
		return share;
	}
	
	public Share getTeacherShare(int shareId, Group group, Map map) {
		Share share = null;
		
		try {
			share = this.shareService.getShare(shareId);
		} catch (Exception e) {}
		
		if(share == null) {
			// add Share
			share = new Share();
			ShareMap shareMap = new ShareMap();
			shareMap.setId(map.getId());
			share.setMap(shareMap);
			
			share.setShareType(this.shareService.getShareType("group"));
			
			share.setGroup(group);
			
			List<Permission> permissions = new ArrayList<Permission>();
			List<PermissionType> permissionTypes = this.shareService.getPermissionTypes();
			for(PermissionType permissionType : permissionTypes) {
				Permission permission = new Permission();
				permission.setPermissionType(permissionType);
				permission.setPermited(true);
				permissions.add(permission);
			}
			share.setPermissions(permissions);
			
			shareId = this.shareService.addShare(share);
			
			// update mapConfig
			Node root = map.getNodes().get(0);
			ArrayList<Attribute> attrs = (ArrayList<Attribute>) root.getAttributes();
			
			Attribute _groupId = null;
			
			for (int i = 0; i < attrs.size(); i++) {
				if("moodleCourseTeacherShareId".equals(attrs.get(i).getName())) {
					_groupId = attrs.get(i);
					_groupId.setValue(Integer.toString(shareId));
					attrs.set(i, _groupId);
				}
			}
			
			if(_groupId == null) {
				_groupId = new Attribute();
				_groupId.setName("moodleCourseTeacherShareId");
				_groupId.setNodeId(root.getId());
				_groupId.setValue(Integer.toString(shareId));
				attrs.add(_groupId);
			}
			
			root.setAttributes(attrs);
			this.mindmapService.updateNode(map.getId(), root);
			
			share = this.shareService.getShare(shareId);
		}
		
		return share;
	}
	
	public void syncShareMap(int mapId) {
		try {
			Map map = this.mindmapService.getMap(mapId);
			User mapOwner = this.mindmapService.getMapOwner(map.getId());
			
			JSONObject config = this.getMoodleConfig();
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			
			if(config == null || mapConfig == null) return;
			
			Group teacherGroup = null;
			if(!mapConfig.has("moodleCourseTeacherGroupId")) {
				teacherGroup = this.getTeacherGroup(0, map);
			}else {
				teacherGroup = this.getTeacherGroup(Integer.parseInt(mapConfig.getString("moodleCourseTeacherGroupId")), map);
			}
			
			if(!mapConfig.has("moodleCourseTeacherShareId")) {
				this.getTeacherShare(0, teacherGroup, map);
			}else {
				this.getTeacherShare(Integer.parseInt(mapConfig.getString("moodleCourseTeacherShareId")), teacherGroup, map);
			}
			
			Group studentGroup = null;
			if(!mapConfig.has("moodleCourseStudentGroupId")) {
				studentGroup = this.getStudentGroup(0, map);
			}else {
				studentGroup = this.getStudentGroup(Integer.parseInt(mapConfig.getString("moodleCourseStudentGroupId")), map);
			}
			
			if(!mapConfig.has("moodleCourseStudentShareId")) {
				this.getStudentShare(0, studentGroup, map);
			}else {
				this.getStudentShare(Integer.parseInt(mapConfig.getString("moodleCourseStudentShareId")), studentGroup, map);
			}

			JSONObject obj = new JSONObject();
			obj.put("role", "");
			obj.put("info", "enrolled_users.do");
			obj.put("moodleCourseId", mapConfig.getString("moodleCourseId"));
			JSONArray res = new JSONArray(this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), mapOwner));
			
			if(res != null) {
				List<Member> students = this.groupService.getGroupMembers(studentGroup.getId());
				List<Member> teachers = this.groupService.getGroupMembers(teacherGroup.getId());
				
				HashMap<String, Boolean> student_enrolled = new HashMap<String, Boolean>();
				HashMap<String, Boolean> teacher_enrolled = new HashMap<String, Boolean>();
				
				for (int i = 0; i < res.length(); i++) {
					JSONObject enrolled_user = res.getJSONObject(i);
					User u = this.syncUser(enrolled_user.getString("auth"), enrolled_user.getString("username"), enrolled_user.getString("firstname"), enrolled_user.getString("lastname"), enrolled_user.getString("email"));
					
					if("0".equals(enrolled_user.getString("is_teacher"))) {
						if(!this.groupService.isMember(studentGroup.getId(), u.getId())) { 
							this.groupService.addMember(studentGroup.getId(), u.getId(), true);
						}
						student_enrolled.put(u.getUsername(), true);
					}
					
					if("1".equals(enrolled_user.getString("is_teacher"))) {
						if(!this.groupService.isMember(teacherGroup.getId(), u.getId())) {
							this.groupService.addMember(teacherGroup.getId(), u.getId(), true);
						}
						teacher_enrolled.put(u.getUsername(), true);
					}
				}
				
				for (Member member : students) {
					User u = member.getUser();
					if(!student_enrolled.containsKey(u.getUsername())) {
						this.groupService.removeMember(studentGroup.getId(), u.getId());
					}
				}
				
				for (Member member : teachers) {
					User u = member.getUser();
					if(!teacher_enrolled.containsKey(u.getUsername())) {
						this.groupService.removeMember(teacherGroup.getId(), u.getId());
					}
				}
			}
			
		} catch (JSONException e) {}
	}
	
	public void groupAction(String action, int groupId, int userId) {
		try {
			List<ShareMap> shareMaps = this.shareService.getGroupSharedMaps(groupId);
			if(shareMaps.size() == 0) return;
				
			Map map = this.mindmapService.getMap(shareMaps.get(0).getId()); 
			
			JSONObject config = this.getMoodleConfig();
			JSONObject mapConfig = this.getMoodleConnection(map.getNodes().get(0));
			
			if(config == null || mapConfig == null) return;
			
			JSONObject user = new JSONObject();
			
			if(Integer.parseInt(mapConfig.getString("moodleCourseTeacherGroupId")) == groupId) {
				user.put("assign_role", "editingteacher");
			}else if(Integer.parseInt(mapConfig.getString("moodleCourseStudentGroupId")) == groupId) {
				user.put("assign_role", "student");
			}else {
				return;
			}
			
			User u = this.userService.get(userId);
			
			if("moodle".equals(u.getAuth())) {
				user.put("id", this.getIdDecrypt(u.getUsername()));
			}else {
				user.put("okmmauth", 1);
				user.put("username", this.getIdEncrypt(u));
				user.put("firstname", StringEscapeUtils.escapeHtml(u.getFirstname()));
				user.put("lastname", StringEscapeUtils.escapeHtml(u.getLastname()));
				user.put("email", u.getEmail());
			}
			
			this.courseEnrolment(map.getId(), "", "", "", action, user, false);
			
			this.syncShareMap(map.getId());
		} catch (JSONException e) {}
	}
	
	@SuppressWarnings("unchecked")
	public HashMap<String, Object> getCourses(int page, int pagelimit, String searchfield, String search) {
		HashMap<String, Object> res = new HashMap<String, Object>();
		try {
			JSONObject config = this.getMoodleConfig();
			JSONObject obj = new JSONObject();
			obj.put("role", "");
			obj.put("info", "get_courses.do");
			
			obj.put("page", page);
			obj.put("pagelimit", pagelimit);
			obj.put("searchfield", searchfield);
			obj.put("search", search);
			
			String query = this.request(config.getString("moodle_url"), obj, config.getString("moodle_secret"), this.user);
			
			JSONObject data = new JSONObject(query);
			if(data != null) {
				List<HashMap<String, Object>> _res = (List<HashMap<String, Object>>) this.toHashMap(data).get("courses");
				List<Object> courses = new ArrayList<Object>();
				
				for(HashMap<String, Object> course : _res) {
					HashMap<String, Object> c = course;
					int map_id = Integer.parseInt((String) course.get("okmmMapId"));
					if(map_id != 0) {
						Map map = this.mindmapService.getMap(map_id);
						c.put("map_key", map != null ? map.getKey():"");
					}else c.put("map_key", "");
					
					courses.add(c);
				}
				
				res.put("courses", courses);
			}
		} catch (JSONException e) {}
		return res;
	}
	
	private String request_url(String url, JSONObject data, String secret, User user) {
		try {
			String _auth = user.getAuth();
			String _username = "";
			
			if("moodle".equals(_auth)) {
				_username = user.getUsername();
			}else {
				_auth = "okmmauth";
				_username = this.getIdEncrypt(user);
			}
			
			data.put("auth", _auth);
			data.put("username", _username);
			data.put("firstname", StringEscapeUtils.escapeHtml(user.getFirstname()));
			data.put("lastname", StringEscapeUtils.escapeHtml(user.getLastname()));
			data.put("email", user.getEmail());
			
			String p = this.encrypt(data.toString(), secret);
			p = p.replace("+", "-");
			p = p.replace("/", "_");
			p = p.replace("=", ",");
		
			url += "auth/okmmauth/services.php?q=" + p;
			return url;
		} catch (JSONException e) {
			return "";
		}
	}
	
	private String request(String url, JSONObject data, String secret, User user) {
		if(this.user == null || "guest".equals(this.user.getUsername())) return "";
		
		if(user == null) user = this.user;
		
		try {
			url = this.request_url(url, data, secret, user);
			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod("GET");
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
			
			return response.toString();
		} catch (MalformedURLException e) {
			 e.printStackTrace();
		} catch (IOException e) {
			 e.printStackTrace();
		}
		return "";
	}
	
	public String getAuthRedirect(String auth) {
		JSONObject userConfig = this.getMoodleConfig();
		if(userConfig != null) {
			try {
				String okmmauth_secret = userConfig.getString("moodle_secret");
				String str = this.decrypt(auth, okmmauth_secret);
				
				if(str != null){
					JSONObject auth_state = new JSONObject();
					
					String _auth = this.user.getAuth();
					String _username = "";
					
					if("moodle".equals(_auth)) {
						_username = this.user.getUsername();
					}else {
						_auth = "okmmauth";
						_username = this.getIdEncrypt(this.user);
					}
					
					auth_state.put("auth", _auth);
					
					auth_state.put("role", "user");
					
					auth_state.put("username", _username);
					auth_state.put("firstname", StringEscapeUtils.escapeHtml(this.user.getFirstname()));
					auth_state.put("lastname", StringEscapeUtils.escapeHtml(this.user.getLastname()));
					auth_state.put("email", this.user.getEmail());
					
					String stateData = this.encrypt(auth_state.toString(), okmmauth_secret);
					return userConfig.getString("moodle_url") + "auth/okmmauth/login.php?auth=" + stateData;
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		return "";
	}
	
	public Boolean hasRole(String role, User user) {
		if("admin".equals(user.getRoleShortName())) return true;
		
		Boolean res = false;
		JSONObject config = this.getMoodleConfig();
		
		try {
			if("coursecreator".equals(role)) {
				if(config.has("moodle_course_creator_group")) {
					Group group;
					group = this.groupService.getGroup(Integer.parseInt(config.getString("moodle_course_creator_group")));
					
					if(group != null) {
						res = this.groupService.isMember(group.getId(), user.getId());
					}
				}
			}
		} catch (NumberFormatException e) {
		} catch (JSONException e) {}
		
		return res;
	}
	
	/**
     * AES Encrypt
     */
	public String encrypt(String input, String key){
		byte[] crypted = null;
		try{
			SecretKeySpec skey = new SecretKeySpec(key.getBytes(), "AES");
			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
			cipher.init(Cipher.ENCRYPT_MODE, skey);
			crypted = cipher.doFinal(input.getBytes());
			
			String str = new String(Base64.encodeBase64(crypted));
			str = str.replace("+", "-");
			str = str.replace("/", "_");
			str = str.replace("=", ",");
		    return str;
	    }catch(Exception e){}
		return null;
	}
	
	/**
     * AES Decrypt
     */
	public String decrypt(String input, String key){
	    byte[] output = null;
	    input = input.replace("-", "+");
	    input = input.replace("_", "/");
	    input = input.replace(",", "=");
	    try{
	      SecretKeySpec skey = new SecretKeySpec(key.getBytes(), "AES");
	      Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
	      cipher.init(Cipher.DECRYPT_MODE, skey);
	      output = cipher.doFinal(Base64.decodeBase64(input));
	      return new String(output);
	    }catch(Exception e){}
	    return null;
	}
	
	public HashMap<String, Object> toHashMap(JSONObject object) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		try {
		    Iterator<String> keysItr = object.keys();
		    while(keysItr.hasNext()) {
		        String key = keysItr.next();
		        Object value = object.get(key);
	
		        if(value instanceof JSONArray) {
		            value = this.toList((JSONArray) value);
		        }else if(value instanceof JSONObject) {
		            value = this.toHashMap((JSONObject) value);
		        }
		        map.put(key, value);
		    }
		} catch (JSONException e) {
			e.printStackTrace();
		}
	    return map;
	}
	
	public List<Object> toList(JSONArray array) {
		List<Object> list = new ArrayList<Object>();
		try {
		    for(int i = 0; i < array.length(); i++) {
		        Object value;
				value = array.get(i);
		        if(value instanceof JSONArray) {
		            value = toList((JSONArray) value);
		        }else if(value instanceof JSONObject) {
		            value = this.toHashMap((JSONObject) value);
		        }
		        list.add(value);
		    }
		} catch (JSONException e) {
			e.printStackTrace();
		}
	    return list;
	}
	
	public String getIdEncrypt(User user) {
		String str = "";
		MessageDigest digest;
		try {
			digest = MessageDigest.getInstance("MD5");
			digest.update(user.getUsername().getBytes());
			BigInteger bigInteger = new BigInteger(1,digest.digest());
			str = bigInteger.toString(16);
		} catch (NoSuchAlgorithmException e) {};
		return Integer.toString(user.getId()) + "_" + str;
	}
	
	public int getIdDecrypt(String id) {
		return Integer.parseInt(id.split("_", 2)[0]);
	}

//	public MoodleService() {}
//	public static void main(String[] args) {
//	}
}
