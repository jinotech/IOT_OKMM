package com.okmindmap.web.spring;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
import com.okmindmap.util.PasswordEncryptor;

public class MineMindmapAction extends BaseAction {
	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String id = request.getParameter("id");
		
		User user = getUser(request);
		
		if(!user.getUsername().equals("guest")) {
			if(id != null) {
				Map map =  this.mindmapService.getMap(Integer.parseInt(id));
				if(map != null) { // 맵이 존재하는 경우
					User owner = this.mindmapService.getMapOwner(map.getId());
					if(owner.getEmail() != null && owner.getPassword() != null) {
						String email = request.getParameter("email");
						String password = request.getParameter("password");
						if(email != null && password != null) {
							String encrypted = PasswordEncryptor.encrypt(password);
							if( !email.equals(owner.getEmail()) || !encrypted.equals(owner.getPassword())) {
								HashMap<String, String> data = new HashMap<String, String>();
								data.put("url", "/mindmap/mine.do?id=" + id);
								data.put("message", "Invalid password or email!");
								
								return new ModelAndView("error/index", "data", data);
							}
						} else {
							HashMap<String, String> data = new HashMap<String, String>();
							data.put("action", "/mindmap/mine.do");
							data.put("mapId", id);
							
							return new ModelAndView("confirm_owner", "data", data);
						}
					}
					
					this.mindmapService.setOwner(map.getId(), user.getId());
				}
			}
		}
		
		response.sendRedirect(request.getContextPath() + "/mindmap/list.do");
		
		return null;
	}

}
