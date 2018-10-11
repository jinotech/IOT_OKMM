
/**
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/copyleft/lesser.html).
 */

package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.service.MindmapService;

import del.icio.us.Delicious;
import del.icio.us.DeliciousNotAuthorizedException;
import del.icio.us.beans.Post;

@Controller
public class DeliciousServiceAction extends BaseAction {


	@Autowired MindmapService mindmapService;

	@RequestMapping(value = "/mashup/delicious.do")
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String action = request.getParameter("action");		
		
		if("login".equals(action)){
			HttpSession session = request.getSession();			
			if(session.getAttribute("delicious") == null) {
				String id = request.getParameter("id");
				String pw = request.getParameter("pw");
				Delicious d = new Delicious(id, pw, "https://api.del.icio.us/v1/");
				
				try{
					// 로긴 되었는지 체크
					// 제대로 로긴 되었는지 체크 방법이 없다
					d.getLastUpdate();
				} catch (DeliciousNotAuthorizedException e) {
					System.out.println("exception");
					OutputStream out = response.getOutputStream();
					out.write("0".getBytes());
					out.close();
					return null;
				}
				
				session.setAttribute("delicious", d);
			}
			
			OutputStream out = response.getOutputStream();
			out.write("1".getBytes());
			out.close();
		} else if("logout".equals(action)) {
			HttpSession session = request.getSession();
			session.removeAttribute("delicious");
		} else if("session".equals(action)) {
			HttpSession session = request.getSession();
			
			OutputStream out = response.getOutputStream();
			if(session.getAttribute("delicious") == null) out.write("0".getBytes());
			else out.write("1".getBytes());
			out.close();			
		} else if("getAllPosts".equals(action)) {
			HttpSession session = request.getSession();
			Delicious d = (Delicious) session.getAttribute("delicious");
			
			List<Post> postList = d.getAllPosts();
			
			JSONArray json = JSONArray.fromObject(postList);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
		} else if("addPost".equals(action)) {
			HttpSession session = request.getSession();
			Delicious d = (Delicious) session.getAttribute("delicious");
			
			String url = request.getParameter("url");
			String description = request.getParameter("description");
			String extended = request.getParameter("extended");
			String tags = request.getParameter("tags");
			
			d.addPost(url, description, extended, tags, new Date());
		}
		
		return null;
		
	}
	
}
