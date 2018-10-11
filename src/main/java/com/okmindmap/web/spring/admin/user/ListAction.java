package com.okmindmap.web.spring.admin.user;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.service.UserService;
import com.okmindmap.web.spring.BaseAction;

public class ListAction extends BaseAction {
	UserService userService = null;
	
	
		
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		User user = getUser(request);
		if(user.getRoleId()!=1){
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
			
		}
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("user", user);
		
		int page = ServletRequestUtils.getIntParameter(request, "page", 1);
		int pagelimit = 10;
		
//		String searchfield = ServletRequestUtils.getStringParameter(request, "searchfield");
//		String search = ServletRequestUtils.getStringParameter(request, "search");
		String searchfield = getOptionalParam(request, "searchfield", "");
		String search = getOptionalParam(request, "search",  "");
		
		String sort = ServletRequestUtils.getStringParameter(request, "sort", "id");
		if(sort.length()<1) sort="id";
		boolean isAsc = ServletRequestUtils.getBooleanParameter(request, "isAsc", false);
		data.put("sort", sort);
		data.put("isAsc", isAsc);
		data.put("searchfield", searchfield);
		data.put("search", search);
		
		
		// param으로 넘어온 값으로 맵 선택
		// param : guest, user, shares
		List<User> users = userService.getAllUsers(page, pagelimit, searchfield,  search, sort, isAsc);
		int totalUsers = userService.countAllUsers(search);
		data.put("users", users);
		data.put("usertotalcnt", totalUsers);
		data.put("pagelimit", pagelimit);
		data.put("page", page);		
		data.put("startnum", (totalUsers-((page-1)*pagelimit)));
		data.put("pagelimit", pagelimit);		
		data.put("plPageRange", 10 );	 // 페이지출력 범위 
		
	
		return new ModelAndView("admin/users/list", "data", data);
	}

	// page 갯수 계산 
	private int pages(int total, int pagelimit) {
		int extra = total % pagelimit;
        
        if ( extra > 0 ){           
            return (total - extra )/pagelimit + 1;
        } else {
            return total/pagelimit;
        }
	}
}
