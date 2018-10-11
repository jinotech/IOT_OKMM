package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
import com.okmindmap.util.EscapeUnicode;

public class ChangeMindmapAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String mapId = request.getParameter("mapId");
		String title = request.getParameter("title");
		String map_style = request.getParameter("style");
		String lazyloading = request.getParameter("lazyloading");
		String pt_sequence = request.getParameter("pt_sequence");
		String queueing = request.getParameter("queueing");
		
		User user = getUser(request);
		
		if(title != null) title = mindmapService.updateMapTitle(Integer.parseInt(mapId), title);
		if(map_style != null) map_style = mindmapService.updateMapStyle(Integer.parseInt(mapId), map_style);
		if(lazyloading != null) lazyloading = mindmapService.updateMapLazyloading(Integer.parseInt(mapId), Integer.parseInt(lazyloading));
		if(pt_sequence != null) pt_sequence = mindmapService.updatePresentationSequence(Integer.parseInt(mapId), pt_sequence);
		if(queueing != null) queueing = mindmapService.updateQueueing(Integer.parseInt(mapId), Integer.parseInt(queueing));
		// 위에 것들을 하나로 바꾸는것이 좋을듯 하다. 쿼리를 네번 날리는것보다 좋을것 같다. 2012.01.10 박기원
		StringBuffer buffer = new StringBuffer();
		buffer.append("{");
		buffer.append("\"id\":\"" + mapId + "\"" );
		if(title != null) {
			buffer.append(",");
			buffer.append("\"name\":\"" + EscapeUnicode.text(title) + "\"" );
		}
		if(map_style != null) {
			buffer.append(",");
			buffer.append("\"style\":\"" + map_style + "\"" );
		}
		if(lazyloading != null) {
			buffer.append(",");
			buffer.append("\"lazyloading\":\"" + lazyloading + "\"" );
		}
		if(pt_sequence != null) {
			buffer.append(",");
			buffer.append("\"pt_sequence\":\"" + pt_sequence + "\"" );
		}
		if(queueing != null) {
			buffer.append(",");
			buffer.append("\"queueing\":\"" + queueing + "\"" );
		}
		buffer.append("}");
		
		response.getOutputStream().write(buffer.toString().getBytes());
		
		return null;
	}

	public String unescape(String src) { 
		StringBuffer tmp = new StringBuffer(); 
		tmp.ensureCapacity(src.length()); 

		int lastPos = 0, pos = 0; 
		char ch;

		while (lastPos < src.length()) {
			pos = src.indexOf("%", lastPos);
			if (pos == lastPos) {
				if (src.charAt(pos+1) == 'u') {
					ch = (char) Integer.parseInt(src.substring(pos+2, pos+6), 16); 
					tmp.append(ch);
					lastPos = pos+6; 
				} else { 
					ch = (char) Integer.parseInt(src.substring(pos+1, pos+3), 16); 
					tmp.append(ch); 
					lastPos = pos+3; 
				} 
			} else { 
				if (pos == -1) { 
					tmp.append(src.substring(lastPos)); 
					lastPos = src.length(); 
				} else { 
					tmp.append(src.substring(lastPos, pos)); 
					lastPos = pos; 
				} 
			} 
		} 
		return tmp.toString(); 
	}
}
