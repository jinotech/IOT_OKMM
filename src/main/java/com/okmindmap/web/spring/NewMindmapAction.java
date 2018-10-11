package com.okmindmap.web.spring;

import java.io.BufferedOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.moodle.MoodleService;
import com.okmindmap.service.DiscussService;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;

public class NewMindmapAction extends BaseAction {
	@Autowired
	private UserService userService;
	private OKMindmapService okmindmapService;
	private MindmapService mindmapService;
	private ShareService shareService;
	private GroupService groupService;
	private DiscussService discussService;
	
	
	public void setDiscussService(DiscussService discussService) {
		this.discussService = discussService;
	}

	public void setOkmindmapService(OKMindmapService okmindmapService) {
		this.okmindmapService = okmindmapService;
	}
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User user = getUser(request);
		
		String title = request.getParameter("title");
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		String map_style = request.getParameter("mapstyle");
		String openmap = request.getParameter("openmap");
		
		// Moodle
		String mapType = (String) request.getParameter("type");
		String tabIdx = getOptionalParam(request, "tab",  "frm");
		String create_moodle = request.getParameter("create_moodle");
		
		String page = getOptionalParam(request, "page",  "1");
		int pagelimit = 10;
		String search = getOptionalParam(request, "search",  "");
		String searchfield = getOptionalParam(request, "searchfield",  "fullname");
		HashMap<String, Object> data = new HashMap<String, Object>();
		String message = "";
		
		MoodleService moodleService = new MoodleService(user, this.okmindmapService, this.mindmapService, this.userService, this.shareService, this.groupService);
		JSONObject moodleConfig =  moodleService.getMoodleConfig();
		if(mapType != null && "moodle".equals(mapType)) {
			if(moodleConfig == null) {
				message = "Oops! You can not use this function. OKMM is not connected to Moodle.";
			} else if(!moodleService.hasRole("coursecreator", user)) {
				message = "Oops! Your account does not have permission to perform this function. Please contact the administrator to be used.";
			} else if(create_moodle == null){
				if("frm".equals(tabIdx)) data = moodleService.getCourseCategories();
				else data = moodleService.getCourses(Integer.parseInt(page), pagelimit, searchfield, search);
				message = "";
			}
		}
		
		if(create_moodle != null && moodleConfig != null) {
			BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
			if("".equals(message)) {
				String shortname = request.getParameter("shortname");
				String category = getOptionalParam(request, "category",  "1");
				String summary = request.getParameter("summary");
				
				out.write(toBytes(moodleService.create_course(title, shortname, Integer.parseInt(category), summary)));
			}else {
				out.write(toBytes("{\"status\":\"error\", \"message\":\" "+message+" \"}"));
			}
			out.flush();
			out.close();

			return null;
		}
		
		if(title != null) {
		//	title = new String(title.getBytes("ISO-8859-1"), "UTF-8");
			
			int mapId = 0;
			
			// 게스트인 경우, 이메일, 비밀번호 입력
			if(user.getUsername().endsWith("guest")) {
				if(email != null && email.trim().length() != 0 //TODO 이메일 형식 체크
						&& password != null && password.trim().length() != 0) {
					mapId = this.mindmapService.newMap(title, email, password);
				} else {
					mapId = this.mindmapService.newMap(title);
				}
			} else {
//				Restrict restrict = new CreateMapRestrict(user.getId(), request.getSession().getServletContext());
//				if(restrict.isAvailable()) {
					mapId = this.mindmapService.newMap(title, user.getId());
					
					
					if(openmap!=null && openmap.equals("1")){
						//맵생성시 전체 공유 추가하기
						Share share = new Share();
						
						
						ShareMap shareMap = new ShareMap();
						shareMap.setId(mapId);
						share.setMap(shareMap);
						
						String shareType = "open";
						share.setShareType(this.shareService.getShareType(shareType));
						List<Permission> permissions = new ArrayList<Permission>();
						List<PermissionType> permissionTypes = this.shareService.getPermissionTypes();
						for(PermissionType permissionType : permissionTypes) {
							//int permited = getOptionalParam(request, "permission_" + permissionType.getShortName(), 0);
							Permission permission = new Permission();
							permission.setPermissionType(permissionType);
							if(permissionType.getShortName().equalsIgnoreCase("view")
									|| permissionType.getShortName().equalsIgnoreCase("copynode")){
								permission.setPermited(true);
							} else {
								permission.setPermited(false);
							}
							
							permissions.add(permission);
						}
						share.setPermissions(permissions);
						
						this.shareService.addShare(share);
						
						//공유추가 끝
					}
					
//				} else {
//					return new ModelAndView("error/createMapRestrict", "user", user);
//				}
			}
			this.mindmapService.updateMapStyle(mapId, map_style);
			
			Map map = this.mindmapService.getMap(mapId);
			
			String moodleCourseId = request.getParameter("moodleCourseId");
			if(moodleCourseId != null && moodleConfig != null) {
				moodleService.set_course_connection(map, Integer.parseInt(moodleCourseId));
			}
			
			
			//토론 리더 추가.
			discussService.insertMapUser(String.valueOf(mapId), String.valueOf(user.getId()) , "Y", user.getId());
			
			
			response.sendRedirect(request.getContextPath() + "/map/" + map.getKey());
			
			return null;//new ModelAndView("index", "params", params);
		} else {
			data.put("message", message);
			data.put("maptype", mapType);
			data.put("tabidx", tabIdx);
			
			data.put("page", page);		
			data.put("pagelimit", pagelimit);		
			data.put("searchfield", searchfield);
			data.put("search", search);
			
			return new ModelAndView("new", "data", data);
		}
	}
	
	private byte[] toBytes(String txt) {
		try {
			return txt.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return txt.getBytes();
	}

}
