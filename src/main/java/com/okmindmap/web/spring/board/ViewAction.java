package com.okmindmap.web.spring.board;

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

public class ViewAction extends BaseAction {

	private BoardService boardService;

	private BoardMemoService boardMemoService;

	public void setBoardService(BoardService boardService) {
		this.boardService = boardService;
	}

	public void setBoardMemoService(BoardMemoService boardMemoService) {
		this.boardMemoService = boardMemoService;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		int boardType = getOptionalParam(request, "boardType", 1);// 게시판의 종류
		int boardId = (Integer) getRequiredParam(request, "boardId",
				Integer.class);
		int page =getOptionalParam(request, "page", 1);
		String searchKey = getOptionalParam(request, "searchKey", "");
		String searchVal =getOptionalParam(request, "searchVal","");
		
		User user = null;
		try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			user = new User();
			user.setId(0);
			user.setUsername("guest");
			// HashMap<String, Object> data = new HashMap<String, Object>();
			// data.put("url", "/board/view.do?boardId=" +
			// boardId+"&boardType="+boardType);
			// return new ModelAndView("user/login", "data", data);
		}

		Board board = this.boardService.select(boardId);
		if(board!=null && board.getContent()!=null)
			board.setContent(board.getContent().replaceAll("\n", "<br>"));
		Map data = new HashMap();
		data.put("board", board);
		data.put("boardType", boardType);
		data.put("searchKey", searchKey);
		data.put("searchVal", searchVal);
		data.put("page", page);
		data.put("user", user);

		List<BoardMemo> boardMemoList = this.boardMemoService.getList(boardId);
		
		data.put("boardMemoList", boardMemoList);

		return new ModelAndView("board/view", "data", data);
	}

}
