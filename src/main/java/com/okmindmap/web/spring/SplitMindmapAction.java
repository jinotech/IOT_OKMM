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

public class SplitMindmapAction extends BaseAction {

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
		String xml = request.getParameter("xml");
		String link = request.getParameter("link");
		
		byte[] decoded = org.apache.commons.codec.binary.Base64.decodeBase64(xml);
		xml = "<map version=\"0.9.0\">\n"
			+ "<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->\n"
			+ unescape(new String(decoded))
			+ "</map>";
		
		User user = getUser(request);
		
		Map map = MindmapDigester.parseMap(xml);
		map.setName(title);
		map.getNodes().get(0).setLink(link);
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
//		buffer.append("\"id\":\"" + mapId + "\"" );
//		buffer.append(",");
//		buffer.append("\"name\":\"" + EscapeUnicode.text(title) + "\"" );
//		buffer.append(",");
		buffer.append("\"url\":\"" + request.getContextPath() + "/map/" + map.getKey() + "\"" );
		buffer.append("}");
		
		response.getOutputStream().write(buffer.toString().getBytes());
		
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
