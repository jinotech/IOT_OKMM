package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Node;
import com.okmindmap.model.Slide;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
import com.okmindmap.util.EscapeUnicode;

public class SlideSettingAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String method = request.getParameter("method");
		String mapId = request.getParameter("mapid");
		int map_id = Integer.parseInt(mapId);
		
		if("get".equals(method)) {
			String id = request.getParameter("nodeid");
			String ids = request.getParameter("nodeids");
			String slideJson = "";
			
			if(id != null) {
				Node node = this.mindmapService.getNode(id, map_id, false);
//				System.out.println(node.getId());
				if(node != null) {
					slideJson = getSlideJson(node.getId());
				}
			} else if(ids != null) {
				
			}
			
			OutputStream out = response.getOutputStream();
			out.write(slideJson.getBytes());
			out.close();
			
			return null;
		} else if("set".equals(method)) {
			String data = request.getParameter("data");
			
			JSONArray ja = (JSONArray) JSONSerializer.toJSON( data );
			for(int i = 0; i < ja.size(); i++){
				JSONObject json = ja.getJSONObject(i);
				
				String identity = json.getString("nodeid");
				double x = json.getDouble("x");
				double y = json.getDouble("y");
				double scalex = json.getDouble("scalex");
				double scaley = json.getDouble("scaley");
				double rotate = json.getDouble("rotate");
				int showdepths = json.getInt("showdepths");
				
				Node node = this.mindmapService.getNode(identity, map_id, false);
				mindmapService.updateSlide(node.getId(), x, y, scalex, scaley, rotate, showdepths);
			}
			return null;
		}
		return null;		
	}
	
	private String getSlideJson(int id) {
		Slide slide = mindmapService.getSlide(id);
		if(slide == null) return "";
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("nodeid", slide.getNodeid());
		jsonObject.put("x", slide.getX());
		jsonObject.put("y", slide.getY());
		jsonObject.put("scalex", slide.getScaleX());
		jsonObject.put("scaley", slide.getScaleY());
		jsonObject.put("rotate", slide.getRotate());
		jsonObject.put("showdepths", slide.getShowDepths());
		
		return jsonObject.toString();
	}
}
