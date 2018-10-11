package com.okmindmap.web.spring;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Node;
import com.okmindmap.service.MindmapService;

public class ChildNodesAction extends BaseAction {
	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String mapid = request.getParameter("map");
		String identity = request.getParameter("node");
		String alldescendant = request.getParameter("alldescendant");
		boolean all = (alldescendant != null && "true".equals(alldescendant))? true:false;
		
//		User user = getUser(request);
		
		if(mapid != null && identity != null) {
			int map_id = Integer.parseInt(mapid);
			Node node = this.mindmapService.getNode(identity, map_id, false);
			
			if(node != null) {
				List<Node> children = this.mindmapService.getChildNodes(node.getId(), all);
				node.setChildren(children);
				
				response.setHeader("Cache-Control", "no-cache");
				response.setHeader("Pragma", "no-cache");
				response.setHeader("Content-Type", "text/text");
				response.setDateHeader("Expires", 0);
				
				ByteArrayInputStream in = new ByteArrayInputStream(node.toXml().getBytes());
				BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
				byte[] data = new byte[4096];
				for( int length = in.read(data, 0, data.length); length > 0; length = in.read(data, 0, data.length)) {
					out.write(data, 0, length);
				}
				
				out.flush();
				out.close();
			}
		} else {
			;
		}
		
		return null;
	}

}
