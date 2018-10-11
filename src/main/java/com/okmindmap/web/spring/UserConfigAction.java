package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.UserConfigData;
import com.okmindmap.service.UserService;

public class UserConfigAction extends BaseAction {

	@Autowired
	private UserService userService;
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String confirmed = request.getParameter("confirmed");
		String returnType = request.getParameter("returntype");
		int userid = Integer.parseInt(request.getParameter("userid"));
		
		// 환경 설정이 끝나 확인을 눌렀을때. 환경 저장
		if(confirmed != null && Integer.parseInt(confirmed) == 1) {
			String [] fields = request.getParameterValues("fields");
			String [] data = request.getParameterValues("data");
			
			for(int i = 0; i < fields.length; i++) {
				this.userService.setUserConfigData(userid, fields[i], data[i]);
			}
			
			return null;
		} else {	// 환경로드
			List<UserConfigData> configData = this.userService.getUserConfigData(userid);
			HashMap<String, Object> data = new HashMap<String, Object>();
			
			Iterator<UserConfigData> it = configData.iterator();
			while(it.hasNext()) {
				UserConfigData u = it.next();
				data.put(u.getFieldname(), u);
			}
			
			// 초기 OKM에 불렀을때 환경을 적용하기 위해 로딩하는 부분에서 사용
			if(returnType != null && "json".equals(returnType.toLowerCase())) {
				JSONArray json = JSONArray.fromObject(data);
				OutputStream out = response.getOutputStream();
				out.write(json.toString().getBytes("UTF-8"));
				out.close();				
				return null;
			} else {	// 환경설정 페이지로 이동
				data.put("preference_type", "user_preference");
				return new ModelAndView("preference", "data", data);
			}
			
		}
		
		
		
//		User user = getUser(request);
//		user.setuse
//		userService.get
//		
//		StringBuffer buffer = new StringBuffer();
//		buffer.append("{");
//		buffer.append("\"userId\":\"" + usedId + "\"" );
//		if(imgsize != null) {
//			buffer.append(",");
//			buffer.append("\"name\":\"" + imgsize + "\"" );
//		}		
//		buffer.append("}");
//		
//		response.getOutputStream().write(buffer.toString().getBytes());
		
		
	}
}
