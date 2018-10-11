package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.ActionDigester;
import com.okmindmap.action.Action;
import com.okmindmap.action.MoveAction;
import com.okmindmap.action.NewAction;
import com.okmindmap.model.Map;
import com.okmindmap.model.Node;
import com.okmindmap.model.User;
import com.okmindmap.moodle.MoodleService;
import com.okmindmap.service.OKMindmapService;
import com.okmindmap.service.MindmapService;

public class SaveMindmapAction extends BaseAction {

	private OKMindmapService okmindmapService;
	private MindmapService mindmapService;

	public void setOkmindmapService(OKMindmapService okmindmapService) {
		this.okmindmapService = okmindmapService;
	}
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
//		String mapId = request.getParameter("mapId");
		String xml = request.getParameter("action");
		
		Action action = ActionDigester.parseAction(xml); 
		String addr = request.getRemoteAddr();
		User user = getUser(request);
		
		int result = processAction(action, addr, user);

		// 결과값을 리턴한다.
		// -1 이 리턴되는 경우는 에러가 발생한 경우이다.
		response.getOutputStream().write(Integer.toString(result).getBytes());
		
		return null;
	}
	
	private int processAction(Action action, String addr, User user) {
		String name = action.getName();
		Node node = action.getNode();
		int mapId = action.getMapId();
		
		long currentTime = getCurrentTime();
		
		// nvhoang
		MoodleService moodleService = new MoodleService(user, this.okmindmapService, this.mindmapService);
		JSONObject moodleConnection = moodleService.getMoodleConnection(node);
		// nvhoang
		
		node.setModified(currentTime);
		if(!user.isGuest()) {
			node.setModifier(user.getId());
		}
		node.setModifierIP(addr);
		if(Action.NEW.equals(name)) {
			node.setCreated(currentTime);
			if(!user.isGuest()) {
				node.setCreator(user.getId());
			}
			node.setCreatorIP(addr);
			
			NewAction nAction = (NewAction)action;
			String parent = nAction.getParent();
			String next = nAction.getNext();
			
			return this.mindmapService.newNodeBeforeSibling(mapId, node, parent, next);
		} else if(Action.EDIT.equals(name)) {
			int res = this.mindmapService.updateNode(mapId, node);
			if(moodleConnection != null) moodleService.updateNode(mapId, node);
			return res;
		} else if(Action.DELETE.equals(name)) {
			if(moodleConnection != null) moodleService.deleteNode(mapId, node);
			return this.mindmapService.deleteNode(mapId, node);
		} else if(Action.MOVE.equals(name)) {
			MoveAction nAction = (MoveAction)action;
			String parent = nAction.getParent();
			String next = nAction.getNext();
			
			int res = this.mindmapService.moveNode(mapId, node, parent, next);
			if(moodleConnection != null) moodleService.moveNode(mapId, node, parent, next);
			return res;
		}
		
		return -1;
	}
	
	private long getCurrentTime() {
		long time = System.currentTimeMillis();
		
		return time;
	}
}
