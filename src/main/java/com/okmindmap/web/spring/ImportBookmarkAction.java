package com.okmindmap.web.spring;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.nio.charset.Charset;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.ibm.icu.text.CharsetDetector;
import com.ibm.icu.text.CharsetMatch;
import com.okmindmap.bookmark.BookmarkParser;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.RepositoryService;

public class ImportBookmarkAction extends BaseAction {

	private MindmapService mindmapService;
	private RepositoryService repositoryService;
	
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
		
		User user = getUser(request);
		
		String confirmed = request.getParameter("confirm");
		if(confirmed != null && Integer.parseInt(confirmed) == 1) {
			String format = request.getParameter("format");
			
			if(format == null) {
				format = BookmarkParser.OUTPUT_FORMAT_JSON;
			}
			
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			
			MultipartFile multipartFile = multipartRequest.getFile("file");
			String bookmarkFilePath = this.repositoryService.saveBookmarkFile(multipartFile);
			
			File bookmarkFile = null;
			if(bookmarkFilePath != null) bookmarkFile = new File(bookmarkFilePath);
			
			if(bookmarkFile != null && bookmarkFile.exists()) {
				// 문자셋 알아내어 파일을 읽을 때 적절한 문자셋 지정하기
				CharsetDetector detector = new CharsetDetector();
				detector.setText( new BufferedInputStream(new FileInputStream( bookmarkFile )) );
				CharsetMatch match = detector.detect();
				String encoding = match.getName();
				
				InputStreamReader in = null;
				if( encoding != null ) {
					in = new InputStreamReader(new FileInputStream(bookmarkFile), Charset.forName(encoding));
				} else {
					in = new InputStreamReader(new FileInputStream(bookmarkFile));
				}
				
				BookmarkParser parser = new BookmarkParser();
				parser.parse( in );
				
				response.setContentType("text/html");
//				response.setHeader("Content-Disposition","attachment; filename=bookmarks.xml");
				
				BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());				
				
//				out.write("<html><head>".getBytes());
//				out.write("<script type=\"text/javascript\">".getBytes());
//				out.write("var xml=\"".getBytes());
				
				StringWriter writer = new StringWriter();
				parser.writeTo(writer, format);
				
				
				String xml = writer.getBuffer().toString();
//				xml = xml.replaceAll("\"", "\\\\\"");
				
				ByteArrayInputStream bain = new ByteArrayInputStream(xml.getBytes());
				byte[] data = new byte[4096];
				for(int length = bain.read(data);  length > 0; length = bain.read(data)) {
					out.write(data, 0, length);
				}
				
//				out.write("\";".getBytes());
//				out.write("parent.JinoUtil.BookmarkCallback(xml);".getBytes());
//				out.write("</script>".getBytes());
//				out.write("</head></html>".getBytes());
				
				out.flush();
				out.close();
				
			} else {
			}
			
			return null;
		} else {
			return new ModelAndView("import/import_bookmark-form", "user", user);
		}
		
	}
	
}
