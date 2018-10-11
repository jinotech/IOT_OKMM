package com.okmindmap.web.spring.board.memo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Board;
import com.okmindmap.model.BoardMemo;
import com.okmindmap.model.User;
import com.okmindmap.service.BoardMemoService;
import com.okmindmap.service.BoardService;
import com.okmindmap.web.spring.BaseAction;

public class EditAction extends BaseAction{
	
	private BoardMemoService boardMemoService;
	private BoardService boardService;

	public void setBoardMemoService(BoardMemoService boardMemoService) {
		this.boardMemoService = boardMemoService;
	}
	
	
	public void setBoardService(BoardService boardService) {
		this.boardService = boardService;
	}


	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		int confirm = getOptionalParam(request, "confirmed", 0);
		int isEditMode = getOptionalParam(request, "isEditMode", 0);
//		System.out.println("eidt confirm"+confirm);
		int boardId = (Integer)getRequiredParam(request, "boardId", Integer.class);
		int memoId = (Integer)getRequiredParam(request, "memoId", Integer.class);
		int boardType = getOptionalParam(request, "boardType", 1);//게시판의 종류
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/board/edit.do?boardId=" + boardId+"&boardType="+boardType+"&memoId="+memoId);
			return new ModelAndView("user/login", "data", data);
		}
		//추가 해야함
		if(confirm == 0) {
			//뷰에서 마찬가지로 보이면서 자신의 정보를 더해서 보여줘야 한다. 게시글 + 메모 리스트 + 자신의입력한 내용
			Board board =  this.boardService.select(boardId);
			Map data = new HashMap();
			data.put("board",board);
			data.put("boardType", boardType);
			
			List<BoardMemo> boardMemoList = this.boardMemoService.getList(boardId);
			
			data.put("boardMemoList", boardMemoList);
			data.put("isEditMode", "1");
						
			BoardMemo memo = this.boardMemoService.select(memoId);
			data.put("myMemo", memo);
			
			return new ModelAndView("board/view","data",data);
			
		}else {
			
			BoardMemo memo = this.boardMemoService.select(memoId);

			String content = (String)getRequiredParam(request, "content", String.class);
					
			memo.setContent(content);
		
			this.boardMemoService.update(memo);		
			
			response.sendRedirect(request.getContextPath() + "/board/view.do?boardType"+boardType+"&boardId="+boardId);
		}
			
		
		
		return null;
	}
}
