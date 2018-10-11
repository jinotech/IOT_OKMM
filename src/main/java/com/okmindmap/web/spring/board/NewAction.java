package com.okmindmap.web.spring.board;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Board;
import com.okmindmap.model.User;
import com.okmindmap.service.BoardService;
import com.okmindmap.web.spring.BaseAction;



public class NewAction extends BaseAction{
	private BoardService boardService;
	
	
	public void setBoardService(BoardService boardService) {
		this.boardService = boardService;
	}


	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		int boardType = (Integer)getRequiredParam(request, "boardType", Integer.class);//게시판의 종류
		String lang = getOptionalParam(request, "lang", "ko");
		int confirm = getOptionalParam(request, "confirmed", 0);
		
		if(confirm == 0) {
			// form 전송
			HashMap<String, Object> data = new HashMap<String, Object>();
			try{	
				User user = getRequireLogin(request);
				data.put("user", user);
				data.put("userId", user.getId());
			}catch(Exception e){
				//e.printStackTrace();
			}
			
			data.put("boardType", boardType);
			data.put("lang", lang);
//			System.out.println("boardtype:confirm o::"+boardType);
			return new ModelAndView("board/new", "data", data);
			
		} else {
			
			
			
			String title =(String)getRequiredParam(request, "title", String.class);
			String content = (String)getRequiredParam(request, "content", String.class);
			Board board = new Board();
			
			try {
				User user = getRequireLogin(request);
				
				board.setUserId(user.getId());
				board.setUsername2(user.getUsername());
			} catch (Exception e) {
				String username2 =(String)getRequiredParam(request, "username2", String.class);
				String userpassword = (String)getRequiredParam(request, "userpassword", String.class);
				board.setUsername2(username2);
				board.setUserpassword(userpassword);
			}
			
			
			board.setTitle(title);
			board.setContent(content);
			
			board.setUserIp(request.getRemoteAddr());
			
			board.setBoardType(boardType);
			board.setLang(lang);
			this.boardService.insert(board);
			
			response.sendRedirect(request.getContextPath() + "/board/list.do?boardType="+boardType+"&lang="+lang);
		}
		return null;
	}
		
		
	
	

}
