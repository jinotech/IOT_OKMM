package com.okmindmap.web.spring.board;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Board;
import com.okmindmap.model.User;
import com.okmindmap.service.BoardService;
import com.okmindmap.web.spring.BaseAction;

public class ListAction extends BaseAction {
	
	private BoardService boardService;
	
	public void setBoardService(BoardService boardService){
		this.boardService = boardService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		//User user = null;
		int boardType = getOptionalParam(request, "boardType", 1);
		int page =getOptionalParam(request, "page", 1);
		String lang = getOptionalParam(request, "lang", "ko");
		/*try {
			user = getRequireLogin(request);
		} catch (Exception e) {
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("url", "/board/list.do?boardType"+boardType+"&page="+page);
			return new ModelAndView("user/login", "data", data);
		}*/
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		User adminuser = getUser(request);
		int roleid = adminuser.getRoleId();
		
		String searchKey = getOptionalParam(request, "searchKey", "");
		String searchVal =getOptionalParam(request, "searchVal","");
		
		
		data.put("boardType", boardType);
		data.put("searchKey", searchKey);
		data.put("searchVal", searchVal);
		data.put("page", page);
		data.put("lang", lang);
		int sizePerPage = 10;
		
		
		List<Board>	boardList = null;
		if (searchVal.length()>0) {
			boardList = this.boardService.getList(boardType, searchKey, searchVal, page, sizePerPage, lang, roleid); 
		} else {
			boardList = this.boardService.getList(boardType, page, sizePerPage, lang, roleid);
		}
		
		data.put("myBoards", boardList);  
		
		
		int listCount = this.boardService.getListCount(boardType, searchKey, searchVal);
		int pageCount = listCount/sizePerPage +1;
		data.put("listCount", listCount);
		data.put("pageCount", pageCount);
		data.put("roleid", roleid);
		
		int pagedGroup = 10;
		int nPage = new Integer(page).intValue();
		int pagedLoop = pagedGroup;
		if (pagedLoop > pageCount) {
			pagedLoop = pageCount;	
		}
		String deli = new String(" ");	
		StringBuffer sb = new StringBuffer();
		
		if ((pageCount > pagedGroup) && (nPage > pagedGroup)) {
			sb.append("<a href=\"list.do?boardType="+boardType+"&page=" + (nPage - pagedGroup));
			if ((searchKey != null) && (searchVal != null)) {
				sb.append("&searchKey=" + searchKey + "&searchVal=" + searchVal);
			}
			sb.append("\">");
			sb.append("[" + pagedGroup + "]");
			sb.append("</a>");
			sb.append(deli);
		}
		
		for (int i = 0; i < pagedLoop; i++) {
			sb.append("<a href=\"list.do?boardType="+boardType+"&page=" + (i + 1));
			if ((searchKey != null) && (searchVal != null)) {
				sb.append("&searchKey=" + searchKey + "&searchVal=" + searchVal);
			}			
			sb.append("\">");
			sb.append(i + 1);
			sb.append("</a>");
			sb.append(deli);
		}
		
		if ((pageCount > pagedGroup) && (nPage < pagedGroup)) {
			sb.append("<a href=\"list.do?boardType="+boardType+"&page=" + (nPage + pagedGroup));
			if ((searchKey != null) && (searchVal != null)) {
				sb.append("&searchKey=" + searchKey + "&searchVal=" + searchVal);
			}			
			sb.append("\">");
			sb.append("[" + pagedGroup + "]");
			sb.append("</a>");
		}
		data.put("pagedLink", sb.toString());	// �� ��ü�� ����
		
		
		
		return new ModelAndView("board/list", "data", data);
		
			
		
	}	
}
