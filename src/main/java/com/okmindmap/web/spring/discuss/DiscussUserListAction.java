package com.okmindmap.web.spring.discuss;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Discuss;
import com.okmindmap.service.DiscussService;
import com.okmindmap.web.spring.BaseAction;

import net.sf.json.JSONArray;

public class DiscussUserListAction extends BaseAction {

	private DiscussService discussService;
	
	public void setDiscussService(DiscussService discussService) {
		this.discussService = discussService;
	}
	
	@SuppressWarnings("static-access")
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String mapid = request.getParameter("mapid");
		int page =getOptionalParam(request, "page", 1);
		int sizePerPage = 10;
		
		data.put("leaderid", discussService.leaderUserId(mapid));
		
		List<Discuss> userList =  discussService.userList(mapid, page, sizePerPage);
		JSONArray jsonArray = new JSONArray();
		data.put("userListJson", jsonArray.fromObject(userList));
		data.put("userList", userList);
		
		int listCount = discussService.userListCount(mapid);
		int pageCount = listCount/sizePerPage +1;
		data.put("listCount", listCount);
		data.put("pageCount", pageCount);
		
		int pagedGroup = 10;
		int nPage = new Integer(page).intValue();
		int pagedLoop = pagedGroup;
		if (pagedLoop > pageCount) {
			pagedLoop = pageCount;	
		}
		String deli = new String(" ");	
		StringBuffer sb = new StringBuffer();
		
		if ((pageCount > pagedGroup) && (nPage > pagedGroup)) {
			sb.append("<a href=\"/mindmap/discussUserList.do?page=" + (nPage - pagedGroup));
			if ((mapid != null) && (mapid != null)) {
				sb.append("&mapid=" + mapid);
			}
			sb.append("\">");
			sb.append("[" + pagedGroup + "]");
			sb.append("</a>");
			sb.append(deli);
		}
		
		for (int i = 0; i < pagedLoop; i++) {
			sb.append("<a href=\"/mindmap/discussUserList.do?page=" + (i + 1));
			if ((mapid != null) && (mapid != null)) {
				sb.append("&mapid=" + mapid);
			}		
			sb.append("\">");
			sb.append(i + 1);
			sb.append("</a>");
			sb.append(deli);
		}
		
		if ((pageCount > pagedGroup) && (nPage < pagedGroup)) {
			sb.append("<a href=\"/mindmap/discussUserList.do?page=" + (nPage + pagedGroup));
			if ((mapid != null) && (mapid != null)) {
				sb.append("&mapid=" + mapid);
			}		
			sb.append("\">");
			sb.append("[" + pagedGroup + "]");
			sb.append("</a>");
		}
		data.put("pagedLink", sb.toString());
		
		/*OutputStream out = response.getOutputStream();
		out.write(new JSONObject(data).toString().getBytes("UTF-8"));
		out.close();
		return null;*/
		return new ModelAndView("discuss/discussUserList", "data", data);
	}

}
