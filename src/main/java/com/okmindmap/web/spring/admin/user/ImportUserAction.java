package com.okmindmap.web.spring.admin.user;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.commons.io.CopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.ibm.icu.text.CharsetDetector;
import com.ibm.icu.text.CharsetMatch;
import com.okmindmap.bookmark.BookmarkParser;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.RepositoryService;
import com.okmindmap.web.spring.BaseAction;

public class ImportUserAction extends BaseAction {

	private RepositoryService repositoryService;
	
	public RepositoryService getRepositoryService() {
		return repositoryService;
	}

	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		
		User adminuser = getUser(request);
		if(adminuser.getRoleId()!=1){
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
		}
		
//		User user = getUser(request);
		
//		String confirmed = request.getParameter("confirm");
//		if(confirmed != null && Integer.parseInt(confirmed) == 1) {
			
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			
			MultipartFile multipartFile = multipartRequest.getFile("file");
			String textFilePath = this.repositoryService.saveTextFile(multipartFile);
			
			File textFile = null;
			if(textFilePath != null) textFile = new File(textFilePath);
			
			if(textFile != null && textFile.exists()) {
				// 문자셋 알아내어 파일을 읽을 때 적절한 문자셋 지정하기
				CharsetDetector detector = new CharsetDetector();
				detector.setText( new BufferedInputStream(new FileInputStream( textFile )) );
				CharsetMatch match = detector.detect();
				String encoding = match.getName();
				
				InputStreamReader in = null;
				if( encoding != null ) {
					try {
						in = new InputStreamReader(new FileInputStream(textFile), Charset.forName(encoding));
					} catch (Exception e) {
						in = new InputStreamReader(new FileInputStream(textFile), Charset.forName("UTF-8"));
					}
					
				} else {
					in = new InputStreamReader(new FileInputStream(textFile));
				}
				
				BufferedReader br = new BufferedReader(in);
				OutputStreamWriter ow = new OutputStreamWriter(response.getOutputStream(), Charset.forName("UTF-8"));
				
				char[] ch = new char[4096];
				int len = -1;
				while((len = br.read(ch)) > 0) {
					ow.write(ch, 0, len);
				}
				
				ow.close();
				return null;
				
				
			}
			
			return null;
//		} else {
//			return null;
//		}
		
	}
	
}
