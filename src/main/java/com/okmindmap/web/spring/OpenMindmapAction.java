package com.okmindmap.web.spring;

import static com.rosaloves.bitlyj.Bitly.as;
import static com.rosaloves.bitlyj.Bitly.shorten;

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
import com.okmindmap.model.share.Share;
import com.okmindmap.moodle.MoodleService;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.service.UserService;
import com.okmindmap.util.PasswordEncryptor;
import com.rosaloves.bitlyj.Url;

public class OpenMindmapAction extends BaseAction {
	@Autowired
	private UserService userService;
	private OKMindmapService okmindmapService;
	private MindmapService mindmapService;
	private ShareService shareService;
	private GroupService groupService;
	
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
		String mapKey = request.getParameter("key");
		int directView = getOptionalParam(request, "directView", 0); //수정을 거부하고 온 경우 따라서 password의 수정체크를 실행할 이유가 없다.(1인경우)

		String showParam = getOptionalParam(request, "show", "false"); //presentation mode
		boolean show = showParam.equalsIgnoreCase("true");
		String presentationType = getOptionalParam(request, "type", "Box"); //presentation type: Box, Aero, ...
		String presentationStyle = getOptionalParam(request, "style", "BlackLabel"); //presentation style: BlackLabel, Basic, ...
		
		User user = getUser(request);
		if(user == null || user.getUsername().equals("guest")) {
			String persistent = getPersistentCookie(request);
			if(persistent != null) {
				User user2 = this.userService.loginFromPersistent(request, response, persistent);
				if(user2 != null) {
					user = user2;
				}
			}
		}
		
		
		Map map = null;
		try {
			map =  this.mindmapService.getMapInfo(mapKey);
		} catch (Exception e) {
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("message", getMessage("map.open.notexists", null));
			data.put("url",  "/");
			return new ModelAndView("error/index", "data", data);
		}
		
		boolean canView = false;
		boolean canEdit = false;
		boolean canDelete = false;
		boolean canCopyNode = false;
		boolean isOwner= false;
		boolean hasPasswordEditGrant = false; // 비밀번호 공유일때 비밀번호로 수정 권한을 부여한 공유여부 저장
		boolean hasIncludePasswordShare = false; // 전체 공유중에서 비밀번호 공유를 입력하였는지 저장, 그래야 추후 비번 입력 페이지로 이동
		User owner = null;
		if(map.getShort_url() == null){
			try {
			    String short_url = new java.net.URL(request.getScheme(), request.getServerName(), request.getServerPort(), request.getContextPath()+"/map/").toString() + mapKey;
				Url url = as("okmindmap", "R_da786c2b143c929588b05f253198be62").call(shorten(short_url));
				map.setShort_url(url.getShortUrl());
				this.mindmapService.updateshortUrl(map.getId(), url.getShortUrl());
			} catch (Exception e) {}
		}
		String password = getOptionalParam(request, "password", null);
		String email = getOptionalParam(request, "email", null);
		
		if( map != null) {
			
			MoodleService moodleService = new MoodleService(user, this.okmindmapService, this.mindmapService, this.userService, this.shareService, this.groupService);
			JSONObject moodleConfig =  moodleService.getMoodleConfig();
			if(moodleConfig != null) {
				moodleService.syncShareMap(map.getId());
				moodleService.syncAction(map.getId());
			}
			
			owner = this.mindmapService.getMapOwner(map.getId());
			
			if( user != null){
				if(user.getRoleId()==1 ){ // 관리자 
					isOwner = false;
					canView = true;
					canEdit = false;
				} // 관리자 체크 end
				
				// 자신의 맵이지만 gust 가 아닌경우와, guest인 경우로 나뉘어야 한다.				
				// 자신의 맵인 경우 
				if( owner.getUsername().equals(user.getUsername())) {
					if(!owner.getUsername().equalsIgnoreCase("guest")){
						isOwner = true;
						canEdit = true;
						canView = true;
						canCopyNode = true;
						canDelete = true;
					}
				}else{
					// 맵에 대한 모든 공유를 체크
					List<Share> shares = shareService.getSharesByMap(map.getId());
					if(shares != null && shares.size() > 0) {
						for(Share share : shares) {
							String shareType = share.getShareType().getShortName();
							//if(password!=null){ //패스워드가 입력된 경우에는 group, open에 대해서 신경쓸 이유가 없다.
							if("group".equals(shareType)) {
								// 사용자가 그룹에 속해있는지 체크
								if(this.groupService.isMember(share.getGroup().getId(), user.getId())) {
									Permission viewPermission = this.shareService.getShare(share.getId()).getPermission("view");
									if(viewPermission != null) {
										canView = viewPermission.isPermited()?true:canView;
									} 
									// 편집 권한이 있는지 체크
									Permission editPermission = this.shareService.getShare(share.getId()).getPermission("edit");
									if(editPermission != null) {
										canEdit = editPermission.isPermited()?true:canEdit;
									}
									Permission copyPermission = this.shareService.getShare(share.getId()).getPermission("copynode");
									if(copyPermission != null) {
										canCopyNode = copyPermission.isPermited()?true:canCopyNode;
									}
								}
							} else if("open".equals(shareType)) { // open
								
								Permission viewPermission = this.shareService.getShare(share.getId()).getPermission("view");
								if(viewPermission != null) {
									canView = viewPermission.isPermited()?true:canView;
								}
								// 편집 권한이 있는지 체크
								Permission editPermission = this.shareService.getShare(share.getId()).getPermission("edit");
								if(editPermission != null) {
									canEdit = editPermission.isPermited()?true:canEdit;
								}
								Permission copyPermission = this.shareService.getShare(share.getId()).getPermission("copynode");
								if(copyPermission != null) {
									canCopyNode = copyPermission.isPermited()?true:canCopyNode;
								}
							} else if("password".equals(shareType)) {
								
								hasIncludePasswordShare = true;
								Permission editPermission = null;
								if(directView==0){
									editPermission = this.shareService.getShare(share.getId()).getPermission("edit");
									if(editPermission.isPermited()) { //일단 해당 share id가 edit 권한을 가지고 있다. 맵의 공유에서 비밀번호 수정을 받아야 함을 알려줌(단 이미수정 권한이 있으면 상관없음)
										hasPasswordEditGrant = true;
									}
								}
								
								if(password != null) { // 비밀번호 확인
									String encrypted = PasswordEncryptor.encrypt(password);
									if( encrypted.equals(share.getPassword())) {
										Permission viewPermission = this.shareService.getShare(share.getId()).getPermission("view");
										if(viewPermission != null) {
											canView = viewPermission.isPermited()?true:canView;
										} 
										// 편집 권한이 있는지 체크
										if(editPermission != null) {
											canEdit = editPermission.isPermited()?true:canEdit;
										}
										Permission copyPermission = this.shareService.getShare(share.getId()).getPermission("copynode");
										if(copyPermission != null) {
											canCopyNode = copyPermission.isPermited()?true:canCopyNode;
										}
									} 
								}
							}
						}
						
						
					}
				} // 맵에 대한 모든 공유를 체크 end
				
				if(user.getRoleId()!=1){ //관리자가 아닐경우만 체크
					if(owner.getUsername().equals("guest")) { // 게스트맵
						// 이메일과 비밀번호가 설정되어 있는 경우
						if( owner.getEmail() != null && owner.getEmail().trim().length() != 0 && owner.getPassword() != null && owner.getPassword().trim().length() != 0 ) {// password 가 설정되어 있는 경우
							if(email != null && password != null) {
								String encrypted = PasswordEncryptor.encrypt(password);
								if( email.equals(owner.getEmail()) && encrypted.equals(owner.getPassword())) { //비번이 맞는경우
									canView = true;
									canEdit = true;
								}else { // 이외에는 비번이 맞지 않아서 입력페이지로 이동
									HashMap<String, String> data = new HashMap<String, String>();
									if (show)
										data.put("url", "/show/map/" + mapKey + "&type=" + presentationType + "&style=" + presentationStyle);
									else
										data.put("url", "/map/" + mapKey);
										
									data.put("message", "Invalid password or email!");
									if(canView){
										data.put("directView", "1");
									}
									//return new ModelAndView("error/index", "data", data);
									return new ModelAndView("confirm_owner", "data", data);
								}
							} else { //사용자 정보 입력 페이지로 이동
								HashMap<String, String> data = new HashMap<String, String>();
								if (show)
									data.put("action", "/show/map/" + mapKey + "&type=" + presentationType + "&style=" + presentationStyle);
								else
									data.put("action", "/map/" + mapKey);
									
								data.put("mapId", Integer.toString(map.getId()));
								if(canView){
									data.put("directView", "1");
								}
								return new ModelAndView("confirm_owner", "data", data);
							}
						}
					}
				}//관리자가 아닐경우만 체크 end
			}else if(user == null){ 
				// 조동휘 180820
				// user null일 경우 main으로 return				
				ModelAndView mView = new ModelAndView();
				request.getSession().setAttribute("returnMapKey", mapKey);				
				mView.setViewName("../main");
				return mView;
			}
			
			
			
			
			if(hasIncludePasswordShare){
				if(!canView){ // 패스워드 이동
					//System.out.println("1번 경우");
					HashMap<String, String> data = new HashMap<String, String>();
					if (show)
						data.put("action", "/show/map/" + mapKey + "&type=" + presentationType + "&style=" + presentationStyle);
					else
						data.put("action", "/map/" + mapKey);
					
					data.put("mapId", Integer.toString(map.getId()));
					data.put("hasPasswordEditGrant", ""+hasPasswordEditGrant);
					return new ModelAndView("share/password", "data", data);
				}
				if(password==null && directView==0 &&  hasPasswordEditGrant && !canEdit){ //패스워드 이동(바로보기 안내창으로)  원래는 hasPasswordEditGrant && !canEdit 였는데 directView가 추가되어야 함, view권한의 password 입력후, 수정권한을 만났을때 또 물어보는것 방지
					//System.out.println("2번 경우");
					/*HashMap<String, String> data = new HashMap<String, String>();
					data.put("action", "/map/" + mapKey);
					data.put("mapId", Integer.toString(map.getId()));
					data.put("message", "strongpassword");
					data.put("hasPasswordEditGrant", ""+hasPasswordEditGrant);*/
					//return new ModelAndView("share/password", "data", data);
					//원래는 페이지 이동이라 이페이지가 필요하였다. 그러나 팝업으로 구조하면서 이경우 수&페이지 이동은 필요 없게 되었다. 패스워드를 입력하는 경우는 password에 대한 view도 안되는 경우라 하단에서 시행한다.
				}
				if(!canView && password!=null){ //패스워드가 틀렸음 , ajax로 처리하기 때문에 실제로 이경우는 없다.
					//System.out.println("3번 경우");
					HashMap<String, String> data = new HashMap<String, String>();
					data.put("hasPasswordEditGrant", ""+hasPasswordEditGrant);
					if (show)
						data.put("action", "/show/map/" + mapKey + "&type=" + presentationType + "&style=" + presentationStyle);
					else
						data.put("action", "/map/" + mapKey);

					data.put("mapId", Integer.toString(map.getId()));
					data.put("message", "Invalid password!");
					return new ModelAndView("share/password", "data", data);
				}
			}
			
			if(!canView){
				
				//로그인 페이지 안내하기, 로그인하면 다시 원래 요청온 페이지로
				//비공개 맵, 그룹공유맵인데 그룹원이 아닌경우
				HashMap<String, String> data = new HashMap<String, String>();
				data.put("hasPasswordEditGrant", ""+hasPasswordEditGrant);
				if (show)
					data.put("action", "/show/map/" + mapKey + "&type=" + presentationType + "&style=" + presentationStyle);
				else
					data.put("action", "/map/" + mapKey);

				data.put("message", "cantview");
				
				return new ModelAndView("error/cantview", "data", data);
			}
			
			
			
			
		} else {
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("url", "/");
			data.put("message", "Map does not exits!");
			
			return new ModelAndView("error/index", "data", data);
		}
		
		
		String menu = request.getParameter("m");
		if(menu == null) menu = "on";
		String google = request.getParameter("g");
		if(google == null) google = "off";

	
		// lazyloading
		String lazyloading = map.getLazyloading();
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("map", map);
		data.put("mapId", Integer.toString(map.getId()));
		data.put("menu", menu);
		data.put("google", google);
		data.put("canEdit", canEdit);
		data.put("canDelete", canDelete);
		data.put("canCopyNode", canCopyNode);
		data.put("isOwner", isOwner);
		data.put("lazyloading", lazyloading);
		data.put("mapContentsText", map.getText().replaceAll("\"", ""));
		data.put("short_url", map.getShort_url());
		
		if(password!=null && password.length()>0)
			data.put("password", "true");
		if(hasPasswordEditGrant && !canEdit){
			if (show)
				data.put("action", "/show/map/" + mapKey + "&type=" + presentationType + "&style=" + presentationStyle);
			else
				data.put("action", "/map/" + mapKey);

			data.put("mapId", Integer.toString(map.getId()));
			data.put("message", "strongpassword");
			
			data.put("hasPasswordEditGrant", ""+hasPasswordEditGrant);
		}
		
		// Mobile 식별을 위한 값
		String userAgent = request.getHeader("user-agent");
		if(userAgent.indexOf("iPhone") != -1 || userAgent.indexOf("iPod") != -1){
			data.put("mobile", "iPhone");
		}else if(userAgent.indexOf("iPad") != -1){
			data.put("mobile", "iPad");
		}else if(userAgent.indexOf("Android") != -1){
			data.put("mobile", "Android");
		}
		
		if(data.get("mobile") != null) {
			request.setAttribute("menu", "off");
		}
		
		
		// 마지막 맵을 열기위해 mapid 저장
		if(!"guest".equals(user.getUsername())) {
			userService.updateLastMap(user.getId(), map.getId());
		}
		
		//조회수 증가; 소유자와 보는 사람이 같지 않으면
		if( !owner.getUsername().equals(user.getUsername()) ) {
			//this.mindmapService.increaseViewCount(mapKey);
			this.mindmapService.increaseViewCount(map.getId());
		}
		
		data.put("show", show);
		data.put("type", presentationType);
		data.put("style", presentationStyle);

		//return new ModelAndView("index", "data", data);
		return new ModelAndView("mapLayout", "data", data);
	}
}
