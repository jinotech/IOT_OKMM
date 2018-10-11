package com.okmindmap.web.spring;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.MailService;

public class SendMailAction extends BaseAction {
	
	private MailService mailService;
	
	public void setMailService(MailService mailService) {
		this.mailService = mailService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String result = "{result : '0'}";
		String email = request.getParameter("email");
		String url = request.getParameter("url");
		String[] emails = null; 
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		
		String temp = getMailTemp();
		
		if(user != null && !StringUtils.isEmpty(email)) {
			emails = email.split(",");
			
			if(emails != null && emails.length > 0) {
				String title = user.getFirstname() + "님이, 마인드맵을 공유 하셨습니다.";
				
				temp = temp.replaceAll("%name%", user.getFirstname());
				temp = temp.replaceAll("%공유 URL%", url);
				
				mailService.sendMail(emails, title, temp, "text/html; charset=UTF-8");
				
				result = "{result : '1'}";	
			}
		}
		
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(result).toString().getBytes("UTF-8"));
		out.close();
		return null;
	}
	
	public String getMailTemp() throws Exception {
		
		//ResourceBundle properties = new PropertyResourceBundle(new FileInputStream("path.properties"));
		ResourceBundle properties = ResourceBundle.getBundle("path");
		
		// 버퍼 생성
        BufferedReader br = null;       
         
        // Input 스트림 생성
        InputStreamReader isr = null;   
         
        // File Input 스트림 생성
        FileInputStream fis = null;       
 
        // File 경로
        File file = new File(properties.getString("email.path"));
 
        // 버퍼로 읽어들일 임시 변수
        String temp = "";
         
        // 최종 내용 출력을 위한 변수
        String content = "";
        
        try {
            
            // 파일을 읽어들여 File Input 스트림 객체 생성
            fis = new FileInputStream(file);
             
            // File Input 스트림 객체를 이용해 Input 스트림 객체를 생서하는데 인코딩을 UTF-8로 지정
            isr = new InputStreamReader(fis, "UTF-8");
             
            // Input 스트림 객체를 이용하여 버퍼를 생성
            br = new BufferedReader(isr);
         
            // 버퍼를 한줄한줄 읽어들여 내용 추출
            while( (temp = br.readLine()) != null) {
                content += temp + "\n";
            }
             
        } catch (FileNotFoundException e) {
            e.printStackTrace();
             
        } catch (Exception e) {
            e.printStackTrace();
             
        } finally {
 
            try {
                fis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
             
            try {
                isr.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
             
            try {
                br.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
             
        }

         
        return content;
	}
}
