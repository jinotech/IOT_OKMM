
/**
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/copyleft/lesser.html).
 */

package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.benfante.jslideshare.SlideShareAPI;
import com.benfante.jslideshare.SlideShareAPIFactory;
import com.benfante.jslideshare.messages.Slideshow;
import com.benfante.jslideshare.messages.Tag;
import com.okmindmap.service.MindmapService;

@Controller
public class SlideshareServiceAction extends BaseAction {


	@Autowired MindmapService mindmapService;

	@RequestMapping(value = "/mashup/slideshare.do")
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String query = request.getParameter("q");
		String offset = request.getParameter("offset");
		String limit = request.getParameter("limit");
		
		int o = -1;
		int l = -1;
		
		if(offset != null) o = Integer.parseInt(offset);
		if(limit != null) l = Integer.parseInt(limit);
		
		
//		HashMap<String, String> hMap = new HashMap<String, String>();
//		List<HashMap<String, String>> list = new ArrayList<HashMap<String,String>>();
		SlideShareAPI ssapi = SlideShareAPIFactory.getSlideShareAPI( "kIpo2ySY", "KZgaPStK" );
		
		Tag t = ssapi.getSlideshowByTag(query, o, l);
		List<Slideshow> slideshows  = t.getSlideshows();
		
//		for(Iterator i =  slideshows.listIterator(); i.hasNext();) {
//			Slideshow s  = (Slideshow) i.next();
//			 
//			hMap.put("description", s.getDescription());
//			hMap.put("embedCode", s.getEmbedCode());
//			
//			list.add(hMap);			
//		}
		
		JSONArray json = JSONArray.fromObject(slideshows);
//		JSONObject json = JSONObject.fromObject(slideshows);		
		OutputStream out = response.getOutputStream();		
		out.write(json.toString().getBytes());
		out.close();
				
		return null;
		
	}
	
}
