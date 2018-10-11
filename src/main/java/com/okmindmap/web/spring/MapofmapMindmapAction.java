package com.okmindmap.web.spring;

import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.Node;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
/**
 * 맵오브 맵의 액션 클래스
 * @author kwpark
 *
 */
public class MapofmapMindmapAction extends BaseAction {
	
	private MindmapService mindmapService;
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	private Node createNode(String text) {
		  String identity = "ID_" + Integer.toString(new Random().nextInt(2000000000));
		  long created = new Date().getTime();
		  
		  Node node = new Node();
		  node.setText(text);
		  node.setIdentity(identity);
		  node.setCreated( created );
		  node.setModified( created );
		  
		  return node;
		 }
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User user = getUser(request);
		if(user == null || user.getUsername().equals("guest")) {
			response.sendRedirect(request.getContextPath());
			return null;
		}
		
		// 사용자의 ID 로 mapofmap에서 자신의 mapofmap 의 키를 가져온다.
		int mapId = 0;
		Map map = null;
		try{
		
			mapId = this.mindmapService.getMapofMapId(user.getId());

		}catch (Exception e) {
			e.printStackTrace();
		}
		// 이미 있는 경우에는 불러온다.
		if(mapId>0){
			response.sendRedirect(request.getContextPath() + "/map/"+mindmapService.getMap(mapId).getKey());
		}
		// 없는 경우
		else{
			// 자신의 맵 목록을 가져온다.(공유맵, 내가 만든맵)
			List<Map> myMapList = mindmapService.getUserMaps(user.getId());
			
			// 맵을 새로 하나 만든다.
			String mapofmapText = getMessage("common.mapofmap", null);
			int newMapId = this.mindmapService.newMap(mapofmapText, user.getId());
			
			//루트 노드를 가져온다.
			map = mindmapService.getMap(newMapId);
			Node rootNode = map.getNodes().get(0);
			
			//2011. 6. 22 **** getMap 으로 가져와서 입력하는 경우 한글이 깨졌다. 그래서 여기에서 다시 써준다.
			//rootNode.setText(mapofmapText);
			// 자신의 맵 목록을 노드로 추가한다
			for(Map listMap : myMapList){
				Node tempNode = createNode(listMap.getName());
				tempNode.setLink("http://"+request.getServerName()+"/"+request.getContextPath()+"/map/" + listMap.getKey());
				this.mindmapService.newNodeAfterSibling(newMapId, tempNode, rootNode.getIdentity(), null);
				//rootNode.addChild(tempNode);
			}
			
			//DB에 저장한다.
		//	mindmapService.updateMap(map, true);
			
			
			
			
			//map of map 테이블에 추가한다.
			mindmapService.insertMapofMap(user.getId(), map.getId());
			response.sendRedirect(request.getContextPath() + "/map/"+map.getKey());
			
		}
		//열기 페이지로 이동한다.
		
		
		return null;
		
	}
}
