package com.okmindmap.web.spring.board;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Board;
import com.okmindmap.model.User;
import com.okmindmap.service.BoardService;
import com.okmindmap.web.spring.BaseAction;

public class DeleteAction extends BaseAction{
private BoardService boardService;
	
	public void setBoardService(BoardService boardService) {
		this.boardService = boardService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		int boardId = (Integer)getRequiredParam(request, "boardId", Integer.class);
		int boardType = getOptionalParam(request, "boardType", 1);//寃뚯떆�먯쓽 醫낅쪟
		String password = getOptionalParam(request, "password", "");
		int page =getOptionalParam(request, "page", 1);
		String searchKey = getOptionalParam(request, "searchKey", "");
		String searchVal =getOptionalParam(request, "searchVal","");
		
		User user = null;
		try {
			user = getRequireLogin(request);
			
		} catch (Exception e) {
			//HashMap<String, Object> data = new HashMap<String, Object>();
			//data.put("url", "/board/delete.do?boardId=" + boardId+"&boardType="+boardType);
			//return new ModelAndView("user/login", "data", data);
			user = new User();
			user.setId(0);
		}
//		System.out.println("delete 인데요....");
		int confirm = getOptionalParam(request, "confirmed", 0);
		
		
		
		
		
		Board board = this.boardService.select(boardId);
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("boardType", boardType);
		data.put("boardId", boardId);
		data.put("password", password);
		data.put("searchKey", searchKey);
		data.put("searchVal", searchVal);
		data.put("page", page);
		
		if(confirm == 0) {
			if((user.getId()>0 &&  board.getUserId()==user.getId()) || user.getRoleId() == 1){
				data.put("board", board);
				return new ModelAndView("board/delete", "data", data);
			}else if(password.equalsIgnoreCase(board.getUserpassword())){
				data.put("board", board);
				return new ModelAndView("board/delete", "data", data);
			}else{
				data.put("action", "/board/delete.do");
				
				return new ModelAndView("board/password", "data", data);
			}

		} else {
			if((board.getUserId()>0 && board.getUserId()==user.getId()) || user.getRoleId() == 1){//자신의 글 or Administrator
				this.boardService.delete(boardId);
				response.sendRedirect(request.getContextPath() + "/board/list.do?boardType="+boardType+"&page="+page+"&searchVal="+searchVal);
			}else if(board.getUserpassword().equalsIgnoreCase(password)){ //비번이 맞는 경우		
				this.boardService.delete(boardId);
				response.sendRedirect(request.getContextPath() + "/board/list.do?boardType="+boardType+"&page="+page+"&searchVal="+searchVal);
			}else if(password!=null && password.length()>0 && !board.getUserpassword().equalsIgnoreCase(password)){ //비번이 다른경우
				data.put("password", password);
				data.put("url", "/board/delete.do?boardId="+boardId+"&boardType="+boardType);
				data.put("message", "Check your password!");
				
				return new ModelAndView("error/index", "data", data);
			}else{
				data.put("action", "/board/delete.do");
				return new ModelAndView("board/password", "data", data);
				
			}
		}
		return null;
	}
}
