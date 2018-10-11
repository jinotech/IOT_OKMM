package com.okmindmap.web.spring.admin.map;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.admin.RecommendList;
import com.okmindmap.service.MindmapService;
import com.okmindmap.stats.RecommendMapFile;
import com.okmindmap.web.spring.BaseAction;

public class RecommendMindmapAction extends BaseAction {

	private final String SAVE_PATH = "thumbnails/recommend";
	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		String type = getOptionalParam(request, "type", "");
		
		if(type.equals("add")){
			int mapId = getOptionalParam(request, "add_map", 0);
			ServletContext context =  request.getSession().getServletContext();
			long added = System.currentTimeMillis();
			try{

				MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;			
				MultipartFile multipartFile = multipartRequest.getFile("imagefile");
				
				String fileName = multipartFile.getOriginalFilename();
				String extension = fileName.substring(fileName.indexOf(".")+1, fileName.lastIndexOf(""));
				
				String realPath = context.getRealPath(SAVE_PATH);
				
				String key = UUID.randomUUID().toString();
		        String targetFilePath = realPath + File.separator + key + "." + extension;
		        File file = new File(targetFilePath);
		        file.mkdirs();
		        multipartFile.transferTo(file);
		        
		        if(file != null && file.exists()) {
		        	String imgURL = SAVE_PATH + "/" + key + "." + extension;
		        	mindmapService.insertRecommendMap(mapId, added, imgURL);
		        }
				
				List<RecommendList> mainList = mindmapService.getRecommendManagementList(1, 12, "", "");
				
				RecommendMapFile recommendMapFile = new RecommendMapFile();
				
				recommendMapFile.MakeRecommendFile(mainList, context);
				
			}catch(Exception e){
			  e.printStackTrace();
			}
			
		}else if(type.equals("del")){
			
			int mapId = getOptionalParam(request, "del_map", 0);
			
			mindmapService.deleteRecommendList(mapId);
		
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
			List<Map> maps = mindmapService.getMapRecommend(page, pagelimit, searchfield, search);
			totalMaps = mindmapService.countAllRecommendMaps(searchfield, search); 
			data.put("maps", maps);
			data.put("pages", pages(totalMaps, pagelimit));
			
			data.put("totalMaps", totalMaps);
			data.put("page", page);		
			data.put("pagelimit", pagelimit);
			
			int tempA = ((page-1)*pagelimit);
			
			data.put("startnum", (totalMaps-tempA));
			data.put("plPageRange", 10 );	 // 페이지출력 범위 
			
			return new ModelAndView("admin/maps/recommend", "data", data);
		
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
