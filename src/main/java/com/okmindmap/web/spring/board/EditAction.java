package com.okmindmap.web.spring.board;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Board;
import com.okmindmap.model.User;
import com.okmindmap.service.BoardService;
import com.okmindmap.web.spring.BaseAction;

public class EditAction extends BaseAction{
	
	private BoardService boardService;

	public void setBoardService(BoardService boardService) {
		this.boardService = boardService;
	}
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		//int confirm = getOptionalParam(request, "confirmed", 0);
		int boardId = (Integer)getRequiredParam(request, "boardId", Integer.class);
		int boardType = getOptionalParam(request, "boardType", 1);//寃뚯떆�먯쓽 醫낅쪟
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			user = new User();
			user.setId(0);
//			HashMap<String, Object> data = new HashMap<String, Object>();
//			data.put("url", "/board/edit.do?boardId=" + boardId+"&boardType="+boardType);
//			return new ModelAndView("user/login", "data", data);
		}
		
		Board board = this.boardService.select(boardId);
		String title =(String)getRequiredParam(request, "title", String.class);
		String content = (String)getRequiredParam(request, "content", String.class);
		String password = getOptionalParam(request, "password", "");		
		board.setTitle(title);
		board.setContent(content);
		
//		System.out.println("board userid"+board.getUserId());
//		System.out.println("user userid"+user.getId());
//		System.out.println("board password"+board.getUserpassword());
//		System.out.println("user password"+password);
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("boardType", boardType);
		data.put("boardId", boardId);
		data.put("password", password);
		 
		if(board.getUserId()>0 && board.getUserId()==user.getId()){//자신의 글
				this.boardService.update(board);		
				response.sendRedirect(request.getContextPath() + "/board/list.do?boardType="+boardType);				
		}else if(board.getUserpassword().equalsIgnoreCase(password)){ //비번이 맞는 경우
				this.boardService.update(board);		
				response.sendRedirect(request.getContextPath() + "/board/list.do?boardType="+boardType);
		}else if(password!=null && password.length()>0 && !board.getUserpassword().equalsIgnoreCase(password)){ //비번이 다른경우
			data.put("password", password);
			data.put("url", "/board/edit.do?boardId="+boardId+"&boardType="+boardType);
			data.put("message", "Check your password!");
			
			return new ModelAndView("error/index", "data", data);
		}else{ //자신의 글이 아니면 비번 사이트로 이동
				data.put("action", "/board/edit.do");
				return new ModelAndView("board/password", "data", data);
		}
		
		return null;
	}
}
