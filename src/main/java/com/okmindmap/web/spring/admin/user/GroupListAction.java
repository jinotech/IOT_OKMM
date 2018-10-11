package com.okmindmap.web.spring.admin.user;

import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.model.group.Group;
import com.okmindmap.model.group.Member;
import com.okmindmap.service.GroupService;
import com.okmindmap.web.spring.BaseAction;

public class GroupListAction extends BaseAction {
	private GroupService groupService;
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String type = request.getParameter("type");
		String searchfield = getOptionalParam(request, "searchfield", "groupname");
		String search = getOptionalParam(request, "search",  "");
		
		User adminuser = getUser(request);
		if(adminuser.getRoleId()!=1){
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
		}
		
		if(type != null && "members".equals(type.toLowerCase())) {
			String groupId = request.getParameter("groupid");
			if(groupId == null) {
				OutputStream out = response.getOutputStream();
				out.write("Require group id.".getBytes());
				out.close();
				return null;
			}
			
			List<Member> members = this.groupService.getGroupMembers(Integer.parseInt(groupId));
			
			ArrayList<HashMap<String, String>> ms = new ArrayList<HashMap<String,String>>();
			for( Member member : members) {
				HashMap<String, String> m = new HashMap<String, String>();
				m.put("username", member.getUser().getUsername());
				//m.put("id", member.getId());
				//m.put("status", member.getMemberStatus());
				
				ms.add(m);
			}
			
			JSONArray json = JSONArray.fromObject(ms);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		}
		else if(type != null && "groups".equals(type.toLowerCase())) {
			List<Group>	groups = this.groupService.getGroups(-1, -1);
			
			ArrayList<HashMap<String, String>> gs = new ArrayList<HashMap<String,String>>();
			for( Group group : groups) {
				HashMap<String, String> g = new HashMap<String, String>();
				g.put("name", group.getName());
				g.put("summary", group.getSummary());
				g.put("id", String.valueOf(group.getId()));
				
				gs.add(g);
			}
			
			JSONArray json = JSONArray.fromObject(gs);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		}
		
		int page = ServletRequestUtils.getIntParameter(request, "page", 1);
		int pagelimit = 10;
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		List<Group>	groups = "".equals(search) ? this.groupService.getGroups(page, pagelimit) : this.groupService.getGroups(page, pagelimit, searchfield, search, "", true);
		
		ArrayList<HashMap<String, String>> gs = new ArrayList<HashMap<String,String>>();
		for( Group group : groups) {
			HashMap<String, String> g = new HashMap<String, String>();
			g.put("name", group.getName());
			g.put("creator", group.getUser().getUsername());
			g.put("summary", group.getSummary());
			SimpleDateFormat sdfCurrent = new SimpleDateFormat ("yyyy-MM-dd hh:mm"); 
			g.put("created", sdfCurrent.format(group.getCreated()));
			g.put("usercount", String.valueOf(this.groupService.getGroupMembers(group.getId()).size()));
			g.put("policy", group.getPolicy().getName());
			g.put("id", String.valueOf(group.getId()));			
			gs.add(g);
		}
		
		data.put("groupcount", this.groupService.countAllGroups());		
		data.put("groups", gs);
		data.put("page", page);		
		data.put("pagelimit", pagelimit);		
		data.put("plPageRange", 10 );	 // 페이지출력 범위
		data.put("searchfield", searchfield);
		data.put("search", search);
		
		return new ModelAndView("admin/users/group", "data", data);
		
	}

}
