package com.okmindmap.web.spring;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Node;
import com.okmindmap.service.MindmapService;
import com.okmindmap.util.ArrayUtil;

public class NodePathAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String id = request.getParameter("id");
		String mapId = request.getParameter("mapid");
		
		Node node = null;
		try {
			int nodeId = Integer.parseInt(id);
			node  = mindmapService.getNode(nodeId, false);
		} catch (Exception e) {
			node  = mindmapService.getNode(id, Integer.parseInt(mapId), false);
		}
		
		List<Node> paths = mindmapService.getPathToRoot(node);
		
		ArrayList<String> ids = new ArrayList<String>();
		for(Node path : paths) {
			ids.add(path.getIdentity());
		}
		
		String pathString = ArrayUtil.join(ids, ",");
		
		response.getOutputStream().write(pathString.getBytes());
		
		return null;
	}
}
