package com.okmindmap.web.spring.board;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Board;
import com.okmindmap.model.User;
import com.okmindmap.service.BoardService;
import com.okmindmap.web.spring.BaseAction;

public class EditViewAction extends BaseAction {
	
	private BoardService boardService;
	
	public void setBoardService(BoardService boardService) {
		this.boardService = boardService;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		int boardType = getOptionalParam(request, "boardType", 1);//寃뚯떆�먯쓽 醫낅쪟
		int boardId = (Integer)getRequiredParam(request, "boardId", Integer.class);
		String password = getOptionalParam(request, "password", "");//寃뚯떆�먯쓽 醫낅쪟
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			user = new User();
			user.setId(0);
//			HashMap<String, Object> data = new HashMap<String, Object>();
//			data.put("url", "/board/edit_view.do?boardId=" + boardId+"&boardType="+boardType);
//			return new ModelAndView("user/login", "data", data);
		}
		
		Board board =  this.boardService.select(boardId);
		Map data = new HashMap();
		
		data.put("boardId", boardId);
		data.put("boardType", boardType);
		
		
		if(user.getId()>0 && board.getUserId()==user.getId()){ //자신의 글
			data.put("board", board);
			return new ModelAndView("board/edit_view", "data", data);

		}else if(password.equalsIgnoreCase(board.getUserpassword())){
			data.put("board", board);
			data.put("password", password);
			return new ModelAndView("board/edit_view", "data", data);
			
		}else{
			data.put("action", "/board/edit_view.do");
			return new ModelAndView("board/password", "data", data);
		}
		
		
		
		//return null;
		
	}

}
