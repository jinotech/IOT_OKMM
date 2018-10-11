package com.okmindmap.web.spring.board.memo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.BoardMemo;
import com.okmindmap.model.User;
import com.okmindmap.service.BoardMemoService;
import com.okmindmap.web.spring.BaseAction;



public class NewAction extends BaseAction{
	private BoardMemoService boardMemoService;
	
	
	public void setBoardMemoService(BoardMemoService boardMemoService) {
		this.boardMemoService = boardMemoService;
	}


	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		int boardType = (Integer)getRequiredParam(request, "boardType", Integer.class);//寃뚯떆�먯쓽 醫낅쪟
		
		
		int confirm = getOptionalParam(request, "confirmed", 0);
		int boardId = (Integer)getRequiredParam(request, "boardId", Integer.class);
		
		if(confirm == 1) {
			String content = (String)getRequiredParam(request, "content", String.class);
			
			BoardMemo memo = new BoardMemo();
			
			try {
				User user = getRequireLogin(request);
				memo.setUserId(user.getId());
				memo.setUsername2(user.getUsername());
			} catch (Exception e) {
				String username2 =(String)getRequiredParam(request, "username2", String.class);
				String password = (String)getOptionalParam(request, "password", "");
				memo.setUsername2(username2);
				memo.setUserpassword(password);
			}
			memo.setUserIp(request.getRemoteAddr());
			memo.setContent(content);
			memo.setBoardId(boardId);
			this.boardMemoService.insert(memo);
			
			response.sendRedirect(request.getContextPath() + "/board/view.do?boardType="+boardType+"&boardId="+boardId);
		}
		return null;
	}

}
