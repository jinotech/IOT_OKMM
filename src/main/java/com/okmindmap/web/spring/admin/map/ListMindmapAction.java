package com.okmindmap.web.spring.admin.map;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.User;
import com.okmindmap.model.share.Share;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.web.spring.BaseAction;

public class ListMindmapAction extends BaseAction {

	private MindmapService mindmapService;
	private ShareService shareService;
	private GroupService groupService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
	}
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
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
		
		String searchfield = getOptionalParam(request, "searchfield", "");
		String search = getOptionalParam(request, "search",  "");
		
		String sort = ServletRequestUtils.getStringParameter(request, "sort", "id");
		if(sort.length()<1) sort="id";
		boolean isAsc = ServletRequestUtils.getBooleanParameter(request, "isAsc", false);
		
		// param으로 넘어온 값으로 맵 선택
		// param : guest, user, shares
		String mapType = ServletRequestUtils.getStringParameter(request, "maptype");
		if(mapType == null){
			mapType = user.getUsername().equals("guest")?"guest":"all";
		}
		data.put("sort", sort);
		data.put("mapType", mapType);
		data.put("isAsc", isAsc);
		
		data.put("searchfield", searchfield);
		data.put("search", search);

		int totalMaps =0;
		if(mapType.equals("user")){		// 사용자 맵			
			if(!user.getUsername().equals("guest")) {
				List<Map> maps = mindmapService.getUserMaps(user.getId(), page, pagelimit, searchfield, search, sort, isAsc);
				totalMaps = mindmapService.countUserMaps(user.getId(), searchfield, search);
				data.put("maps", maps);
				data.put("pages", pages(totalMaps, pagelimit));
			}			
		}
		else if(mapType.equals("shares")){	// 공유된 맵
			List<Share> shares = shareService.getAllShares(page, pagelimit, searchfield, search, sort, isAsc);
			totalMaps = shareService.countAllShares(searchfield, search);
			data.put("maps", shares);
			data.put("pages", pages(totalMaps, pagelimit));
		}
		else if(mapType.equals("guest")){	// 공개된 맵
			List<Map> maps = mindmapService.getGuestMaps(page, pagelimit, searchfield, search, sort, isAsc);
			totalMaps = mindmapService.countGuestMaps(searchfield, search);
			data.put("maps", maps);
			data.put("pages", pages(totalMaps, pagelimit));
		}else if(mapType.equals("all")){	// 전체맵
			List<Map> maps = mindmapService.getAllMaps(page, pagelimit, searchfield, search, sort, isAsc);
			totalMaps = mindmapService.countAllMaps(searchfield, search); 
			data.put("maps", maps);
			data.put("pages", pages(totalMaps, pagelimit));
		}
		
		data.put("totalMaps", totalMaps);
		data.put("page", page);		
		data.put("pagelimit", pagelimit);
		
		//int totalPage = (totalMaps%pagelimit>0?totalMaps/pagelimit+1:totalMaps/pagelimit);
		int tempA = ((page-1)*pagelimit);
		
		data.put("startnum", (totalMaps-tempA));
		data.put("plPageRange", 10 );	 // 페이지출력 범위 
	
		return new ModelAndView("admin/maps/list", "data", data);
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
