package com.okmindmap.web.spring;

import java.io.File;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.NoticeService;

public class ManualUpdateAction extends BaseAction {
	
	private final String SAVE_PATH = "C:/dev/eGovFrameDev-3.6.0-64bit/workspace/okmindmap_egov/src/main/webapp";
	private final String SAVE_PATH2 = "/upload/manual";
	
	private NoticeService noticeService;
	
	public void setNoticeService(NoticeService noticeService) {
		this.noticeService = noticeService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		String id = request.getParameter("id");
		String title = request.getParameter("noticeTitle");
		String content = request.getParameter("ir1");
		String hide = request.getParameter("hide");
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		
		int result = 0;
		
		if(!StringUtils.isEmpty(id)){
			
			try{

				MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;			
				MultipartFile multipartFile = multipartRequest.getFile("file1");
				
				if(multipartFile != null){
					
					String fileName = multipartFile.getOriginalFilename();
					
					Calendar cal = Calendar.getInstance();
					//현재 년도, 월, 일
					int year = cal.get ( cal.YEAR );
					int month = cal.get ( cal.MONTH ) + 1 ;
					int date = cal.get ( cal.DATE ) ;

			        String targetFilePath = SAVE_PATH + File.separator + SAVE_PATH2 + File.separator + year + File.separator + month + File.separator + date + File.separator + fileName;
			        String targetDbFilePath = SAVE_PATH2 + "/" + year + "/" + month + "/" + date + "/" + fileName;
			        File file = new File(targetFilePath);
			        file.mkdirs();
			        multipartFile.transferTo(file);
			        
			        result = noticeService.updateManual(id, title, content, hide, user.getId(), targetDbFilePath);
			        
				}else{
					
					result = noticeService.updateManual(id, title, content, hide, user.getId());
					
				}
		        
			}catch(Exception e){
			  e.printStackTrace();
			}
			
		}
		
		resultMap.put("result", result);
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(resultMap).toString().getBytes("UTF-8"));
		out.close();	
				
		return null;
	}

}