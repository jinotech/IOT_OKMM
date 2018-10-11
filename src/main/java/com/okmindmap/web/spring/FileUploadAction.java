package com.okmindmap.web.spring;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.Hashtable;

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
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.RepositoryService;

public class FileUploadAction extends BaseAction {
	
	private RepositoryService repositoryService;
	private MindmapService mindmapService;
	
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


	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String confirmed = request.getParameter("confirm");		
		String url_only = request.getParameter("url_only");
		//KHANG: use this parameter to return url only.
		//it is usefull with AjaxForm
		
		Hashtable<String,String> data = new Hashtable<String, String>();
		if(confirmed != null && Integer.parseInt(confirmed) == 1) {
			int map_id = Integer.parseInt(request.getParameter("mapid"));
			
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;			
			MultipartFile multipartFile = multipartRequest.getFile("file");
			
			// 저장 경로 : /map-files/{owner_user id}/{map id}
			String subPath = "/map-files/";
			int ownerUserId = this.mindmapService.getMapOwner(map_id).getId();
			subPath = subPath + ownerUserId + "/";
			subPath = subPath + map_id + "/";
			
			int repoID = this.repositoryService.saveFile(multipartFile, subPath, map_id, ownerUserId);
			String url = "";
			if(repoID != -1) {
				String fileName = multipartFile.getOriginalFilename();
				// url 정보 : ./file/{repository id}/{user id}/{fileName}
				url = "/file/" + repoID + "/"+ ownerUserId + "/" + fileName;
				
				String ext = getFileExtension(fileName);

				data.put("repoid", String.valueOf(repoID));
				data.put("owner_userid", String.valueOf(ownerUserId));
				data.put("filename", fileName);
				data.put("ext", ext);
				data.put("url", url);
				data.put("type", "fileupload");
			} else {
				data.put("message", "Error");
			}
			if (url_only != null) {				
				response.getOutputStream().write(url.getBytes());
				return null;
			}
			return new ModelAndView("media/fileupload-result", "data", data);
		} else {			
			//return new ModelAndView("fileupload-form");
			data.put("type", "fileupload");
			return new ModelAndView("media/image", "data", data);
		}
		
	}
	
	protected String getFileExtension(String fileName) {
		int i = fileName.lastIndexOf('.');
		if(i > 0 && i < fileName.length() - 1) {
			return fileName.substring(i + 1).toLowerCase();
		}
		return "";
	}

}
