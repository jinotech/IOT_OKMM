package com.okmindmap.web.spring.share;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.ShareService;
import com.okmindmap.web.spring.BaseAction;

public class PasswordAction extends BaseAction {

		
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
	/*	User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/share/list.do");
			return new ModelAndView("user/login", "data", data);
		}*/
		
		String type = (String)getOptionalParam(request, "type", ""); // password 창이  팝업이 아니면 로그인 버튼클릿기 팝업을 띄우고, 이미 팝업으로 뜬경우라면 페이지 이동을 한다. 
		String mapId = (String)getOptionalParam(request, "mapId", "");
		String hasPasswordEditGrant = (String)getOptionalParam(request, "hasPasswordEditGrant", "");
		String message = (String)getOptionalParam(request, "message", "");
		String action = (String)getOptionalParam(request, "action", "");

		HashMap<String, Object> data = new HashMap<String, Object>();
		/*if(map_id.equals("0"))
			data.put("sharedMaps", this.shareService.getSharedMaps(user.getId()));
		else{
			data.put("sharedMaps", this.shareService.getSharedMaps(user.getId(),map_id));
		}*/
		data.put("mapId", mapId);
		data.put("hasPasswordEditGrant", hasPasswordEditGrant);
		data.put("message", message);
		data.put("action", action);
		data.put("type", type);
		// TODO Auto-generated method stub
		return new ModelAndView("share/password", "data", data);
	}

}
