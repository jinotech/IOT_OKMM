package com.okmindmap.web.spring;

import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.Share;
import com.okmindmap.moodle.MoodleService;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;
import com.okmindmap.util.PasswordEncryptor;

public class DeleteMindmapAction extends BaseAction {
	@Autowired
	private UserService userService;
	private MindmapService mindmapService;
	private ShareService shareService;
	private GroupService groupService;
	private OKMindmapService okmindmapService;
	
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
		
		//int mapId = getOptionalParam(request, "id", 0);
		String returnUrl = getOptionalParam(request, "return_url", request.getContextPath() + "/");
		
		String[] multiMapId = request.getParameterValues("del_map");
		for(int multiMapIdx=0; multiMapIdx<multiMapId.length; multiMapIdx++){
			int mapId = 0; 
			try{
				mapId = Integer.parseInt(multiMapId[multiMapIdx]);
			}catch (Exception e) {
			}
			if(mapId != 0) {
				User owner = this.mindmapService.getMapOwner(mapId);
				Map map =  this.mindmapService.getMap(mapId, false);
				if( !owner.getUsername().equals(user.getUsername()) && user.getRoleId()!=1) { // 자신의 맵이 아닌 경우 // admin은 바로 삭제가능
					int shareId = getOptionalParam(request, "sid", 0);
					if(shareId > 0) { // 공유된 맵인 경우
						Share share = this.shareService.getShare(shareId);
						Permission deletePermission = share.getPermission("delete");
						if(deletePermission == null || !deletePermission.isPermited()) {
							HashMap<String, String> data = new HashMap<String, String>();
							data.put("url", "/map/" + map.getKey() + "?sid=" + shareId);
							data.put("message", "You can not delete " + map.getName() + "!");
							
							return new ModelAndView("error/index", "data", data);
						} else { // delete 권한이 있는 경우
							String shareType = share.getShareType().getShortName();
							if(shareType.equals("password")) {
								//비밀번호 확인;
								String password = getOptionalParam(request, "password", null);
								if(password != null) {
									String encrypted = PasswordEncryptor.encrypt(password);
									if( !encrypted.equals(share.getPassword())) {
										HashMap<String, String> data = new HashMap<String, String>();
										data.put("url", "/mindmap/delete.do?mapId=" + mapId + "&sid=" + shareId);
										data.put("message", "Invalid password!");
										
										return new ModelAndView("error/index", "data", data);
									}
								} else {
									HashMap<String, Object> data = new HashMap<String, Object>();
									data.put("action", "/mindmap/delete.do");
									data.put("mapId", mapId);
									data.put("sid", shareId);
									
									return new ModelAndView("share/password", "data", data);
								}
							} else if(shareType.equals("group")) {
								// 그룹 멤버인지 확인
								if(!this.groupService.isMember(share.getGroup().getId(), user.getId())) {
									HashMap<String, String> data = new HashMap<String, String>();
									data.put("url", "/map/" + map.getKey() + "?sid=" + shareId);
									data.put("message", "You can not delete " + map.getName() + "!");
									
									return new ModelAndView("error/index", "data", data);
								}
							}
						}
					}
					else { // public 맵 인 경우
						// 비밀번호가 설정되어 있다면
						if(owner.getUsername().equals("guest") && 
								(owner.getEmail() != null && owner.getPassword() != null) ) {
							String email = getOptionalParam(request, "email", null);
							String password = getOptionalParam(request, "password", null);
							if(email != null && password != null) {
								String encrypted = PasswordEncryptor.encrypt(password);
								if( !email.equals(owner.getEmail()) || !encrypted.equals(owner.getPassword())) {
									HashMap<String, String> data = new HashMap<String, String>();
									data.put("url", "/mindmap/delete.do?mapId=" + mapId);
									data.put("message", "Invalid password or email!");
									
									return new ModelAndView("error/index", "data", data);
								}
							} else {
								HashMap<String, Object> data = new HashMap<String, Object>();
								data.put("action", "/mindmap/delete.do");
								data.put("mapId", mapId);
								
								return new ModelAndView("confirm_owner", "data", data);
							}
						}
					}
				}
			} else {
				HashMap<String, String> data = new HashMap<String, String>();
				data.put("url", "/");
				data.put("message", "Invalid request!");
				
				return new ModelAndView("error/index", "data", data);
			}
			// OK, delete it!
			
			// Check moodle course connection
			MoodleService moodleService = new MoodleService(user, this.okmindmapService, this.mindmapService, this.userService, this.shareService, this.groupService);
			moodleService.delete_course_connection(mapId);
			
			this.mindmapService.deleteMap(mapId);
			this.mindmapService.deleteMapofMap(mapId);
			// delete shares
			List<Share> shares = this.shareService.getSharesByMap(mapId);
			for(Share share : shares) {
				this.shareService.deleteShare(share.getId());
			}
		}
		
		
		Hashtable<String, String> params = new Hashtable<String, String>();
		params.put("message", "Deleted");
		/**
		 * @author "Donghwi (pari0130@gmail.com)" 2018. 9. 3.
		 * @comment
		 * delete 후 front.do page로 이동되게 수정
		 * params.put("url", returnUrl);
		 */
		params.put("url", "/front.do");

		return new ModelAndView("notice", "params", params);
	}

}
