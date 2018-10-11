package com.okmindmap.web.spring.board.memo;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.BoardMemo;
import com.okmindmap.model.User;
import com.okmindmap.service.BoardMemoService;
import com.okmindmap.web.spring.BaseAction;

public class DeleteAction extends BaseAction{
private BoardMemoService boardMemoService;
	
	public void setBoardMemoService(BoardMemoService boardMemoService) {
		this.boardMemoService = boardMemoService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		int boardId = (Integer)getRequiredParam(request, "boardId", Integer.class);
		int memoId = (Integer)getRequiredParam(request, "memoId", Integer.class);
		String password = getOptionalParam(request, "password", "");
		int boardType = getOptionalParam(request, "boardType", 1);//寃뚯떆�먯쓽 醫낅쪟
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			user = new User();
			user.setId(0);
//			HashMap<String, Object> data = new HashMap<String, Object>();
//			data.put("url", "/board/memo_delete.do?memoId="+memoId+"&boardId=" + boardId+"&boardType="+boardType);
//			return new ModelAndView("user/login", "data", data);
		}
		
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		BoardMemo memo = this.boardMemoService.select(memoId);
		data.put("memo", memo);
		data.put("boardType", boardType);
		data.put("boardId", boardId);
		data.put("memoId", memoId);
		
						
		if(user.getId()>0 && memo.getUserId()==user.getId()){ //자신의 글
			this.boardMemoService.delete(memoId);
			response.sendRedirect(request.getContextPath() + "/board/view.do?boardType="+boardType+"&boardId="+boardId);
			
		}else if(password.equalsIgnoreCase(memo.getUserpassword())){
			this.boardMemoService.delete(memoId);
			response.sendRedirect(request.getContextPath() + "/board/view.do?boardType="+boardType+"&boardId="+boardId);
		}else if(password!=null && password.length()>0 && !password.equalsIgnoreCase(memo.getUserpassword())){ //비번이 다른경우
				data.put("password", password);
				data.put("url", "/board/memo_delete.do?boardId="+boardId+"&memoId="+memoId+"&boardType="+boardType);
				data.put("message", "Check your password!");
				
				return new ModelAndView("error/index", "data", data);
		}else{
				data.put("action", "/board/memo_delete.do");
				data.put("password", password);
				return new ModelAndView("board/password", "data", data);
			
		}
				
		
		return null;
	}
}
