package com.okmindmap.web.spring.admin.map;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.admin.RecommendList;
import com.okmindmap.service.MindmapService;
import com.okmindmap.web.spring.BaseAction;

import com.okmindmap.stats.RecommendMapFile;

public class ListRecommendMindmapAction extends BaseAction {

	private MindmapService mindmapService;
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String type = getOptionalParam(request, "type", "");
		
	    if(type.equals("del")){
			
			int recommendId = getOptionalParam(request, "del_map", 0);
			ServletContext context =  request.getSession().getServletContext();
			String realPath = context.getRealPath("");
			
			List pathTemp = mindmapService.getRecommendFilePath(recommendId);
			String filePath = pathTemp.toString().substring(12,  pathTemp.toString().lastIndexOf("}"));
			
			String deleteFileName = realPath + File.separator + filePath;
			File file = new File(deleteFileName);
	        
	        if(file.exists() == true){
	            file.delete();
	        }
			
			mindmapService.deleteRecommendManagementList(recommendId);
			
			List<RecommendList> mainList = mindmapService.getRecommendManagementList(1, 12, "", "");
			
			RecommendMapFile recommendMapFile = new RecommendMapFile();
			
			recommendMapFile.MakeRecommendFile(mainList, context);
		
		}
			
		int page = ServletRequestUtils.getIntParameter(request, "page", 1);
		int pagelimit = 10;
		
		String searchfield = getOptionalParam(request, "searchfield", "");
		String search = getOptionalParam(request, "search",  "");
		
		String mapType = ServletRequestUtils.getStringParameter(request, "maptype");
		data.put("mapType", mapType);
		
		data.put("searchfield", searchfield);
		data.put("search", search); 
		
		int totalMaps =0;
		List<RecommendList> maps = mindmapService.getRecommendManagementList(page, pagelimit, searchfield, search);
		totalMaps = mindmapService.countAllRecommendManagementList(searchfield, search); 
		data.put("maps", maps);
		data.put("pages", pages(totalMaps, pagelimit));
		
		data.put("totalMaps", totalMaps);
		data.put("page", page);		
		data.put("pagelimit", pagelimit);
		
		int tempA = ((page-1)*pagelimit);
		
		data.put("startnum", (totalMaps-tempA));
		data.put("plPageRange", 10 );	 // 페이지출력 범위 
		
		return new ModelAndView("admin/maps/managementRecommend", "data", data);
		
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
