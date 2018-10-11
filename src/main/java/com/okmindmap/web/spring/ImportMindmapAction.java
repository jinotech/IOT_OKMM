package com.okmindmap.web.spring;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.ibm.icu.text.CharsetDetector;
import com.ibm.icu.text.CharsetMatch;
import com.okmindmap.MindmapDigester;
import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.model.share.Permission;
import com.okmindmap.model.share.PermissionType;
import com.okmindmap.model.share.Share;
import com.okmindmap.model.share.ShareMap;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.RepositoryService;
import com.okmindmap.service.ShareService;

public class ImportMindmapAction extends BaseAction {

	private MindmapService mindmapService;
	private RepositoryService repositoryService;
	private ShareService shareService;
	
	public MindmapService getMindmapService() {
		return mindmapService;
	}

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}

	public RepositoryService getRepositoryService() {
		return repositoryService;
	}

	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}
	
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User user = getUser(request);
		
		String confirmed = request.getParameter("confirm");
		if(confirmed != null && Integer.parseInt(confirmed) == 1) {
			String email = request.getParameter("email");
			String password = request.getParameter("password");
			
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			
			Hashtable<String,String> result = new Hashtable<String, String>();
	
			MultipartFile multipartFile = multipartRequest.getFile("file");
			String mmFilePath = this.repositoryService.saveMMFile(multipartFile);
			
			File mmFile = null;
			if(mmFilePath != null) mmFile = new File(mmFilePath);
			
			if(mmFile != null && mmFile.exists()) {
				// 문자셋 알아내어 파일을 읽을 때 적절한 문자셋 지정하기
				CharsetDetector detector = new CharsetDetector();
				detector.setText( new BufferedInputStream(new FileInputStream( mmFile )) );
				CharsetMatch match = detector.detect();
				String encoding = match.getName();
				
				InputStreamReader in = null;
				if( encoding != null ) {
					in = new InputStreamReader(new FileInputStream(mmFile), Charset.forName(encoding));
				} else {
					in = new InputStreamReader(new FileInputStream(mmFile));
				}
				
				Map map = MindmapDigester.parseMap(in);
				
				String name = multipartFile.getOriginalFilename();
				// 끝에 .mm 을 제거한다.
				name = removeExtension(name);
				map.setName(name);
				
				int map_id = 0;
				if(user.getUsername().endsWith("guest")) {
					if(email != null && password != null) {
						map_id = this.mindmapService.saveMap(map, email, password);
					} else {
						map_id = this.mindmapService.saveMap(map);
					}
				} else {
					map_id = this.mindmapService.saveMap(map, user.getId());
				}
				
				String openmap = "1";
				if(openmap!=null && openmap.equals("1")){
					//맵생성시 전체 공유 추가하기
					Share share = new Share();
					
					
					ShareMap shareMap = new ShareMap();
					shareMap.setId(map_id);
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
				
				
				
				map = this.mindmapService.getMap(map_id);
				
				result.put("id", Integer.toString(map_id));
				result.put("key", map.getKey());
				result.put("name", map.getName());
				result.put("message", "Success!");
			} else {
				result.put("message", "Error: File does not exits!");
			}
			
			return new ModelAndView("import/import_map-result", "result", result);
		} else {
			return new ModelAndView("import/import_map-form", "user", user);
		}
		
	}
	
	private String removeExtension(String s) {

	    String separator = System.getProperty("file.separator");
	    String filename;

	    // Remove the path upto the filename.
	    int lastSeparatorIndex = s.lastIndexOf(separator);
	    if (lastSeparatorIndex == -1) {
	        filename = s;
	    } else {
	        filename = s.substring(lastSeparatorIndex + 1);
	    }

	    // Remove the extension.
	    int extensionIndex = filename.lastIndexOf(".");
	    if (extensionIndex == -1)
	        return filename;

	    return filename.substring(0, extensionIndex);
	}

}
