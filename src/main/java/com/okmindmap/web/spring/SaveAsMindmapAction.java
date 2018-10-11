package com.okmindmap.web.spring;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.MindmapDigester;
import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.util.EscapeUnicode;

public class SaveAsMindmapAction extends BaseAction {

	private MindmapService mindmapService;
	private ShareService shareService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String title = request.getParameter("title");
		
		User user = getUser(request);
		
		int countDuplicatedMapName = mindmapService.countDuplicateMapName(user.getId(), title);
	
		
		String xml = request.getParameter("xml");
		
		byte[] decoded = org.apache.commons.codec.binary.Base64.decodeBase64(xml);
		xml = unescape(new String(decoded));
		
		
		Map map = MindmapDigester.parseMap(xml);
		map.setName(title);
		int mapId = mindmapService.saveMap(map, user.getId());

		
		// 기본적으로 맵을 전체 공개 시키기
		String openmap = "1";
		if(openmap!=null && openmap.equals("1")){
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
				if(permissionType.getShortName().equalsIgnoreCase("view")){
					permission.setPermited(true);
				}else
					permission.setPermited(false);
				
				permissions.add(permission);
			}
			share.setPermissions(permissions);
			
			this.shareService.addShare(share);
			
			//공유추가 끝
		}
		
		
		map = mindmapService.getMap(mapId);

		StringBuffer buffer = new StringBuffer();
		buffer.append("{");
		buffer.append("\"id\":\"" + mapId + "\"" );
		buffer.append(",");
		buffer.append("\"name\":\"" + EscapeUnicode.text(title) + "\"" );
		buffer.append(",");
				
		buffer.append("\"status\":\"" + (countDuplicatedMapName == 0?"ok": "duplicated") + "\"" );
		buffer.append(",");
		
		buffer.append("\"redirect\":\"" + request.getContextPath() + "/map/" + map.getKey() + "\"" );
		buffer.append("}");
		
		response.getOutputStream().write(buffer.toString().getBytes());
		
		//response.sendRedirect(request.getContextPath() + "/map/" + map.getKey());
		
		return null;
	}

	public String unescape(String src) { 
		StringBuffer tmp = new StringBuffer(); 
		tmp.ensureCapacity(src.length()); 

		int lastPos = 0, pos = 0; 
		char ch;

		while (lastPos < src.length()) {
			pos = src.indexOf("%", lastPos);
			if (pos == lastPos) {
				if (src.charAt(pos+1) == 'u') {
					ch = (char) Integer.parseInt(src.substring(pos+2, pos+6), 16); 
					tmp.append(ch);
					lastPos = pos+6; 
				} else { 
					ch = (char) Integer.parseInt(src.substring(pos+1, pos+3), 16); 
					tmp.append(ch); 
					lastPos = pos+3; 
				} 
			} else { 
				if (pos == -1) { 
					tmp.append(src.substring(lastPos)); 
					lastPos = src.length(); 
				} else { 
					tmp.append(src.substring(lastPos, pos)); 
					lastPos = pos; 
				} 
			} 
		} 
		return tmp.toString(); 
	}
}
