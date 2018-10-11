package com.okmindmap.stats;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.TimeZone;

import javax.servlet.ServletContext;

import com.okmindmap.model.admin.RecommendList;

public class RecommendMapFile {
	

	public void MakeRecommendFile(List<RecommendList> mapList, ServletContext context) {
		
		String filePath = context.getRealPath("thumbnails/recommend") + File.separator + "mainhtml.jsp";
		
		File file = new File(filePath);
        
        if(file.exists() == true){
            file.delete();
        }
		
		try {
		      BufferedWriter out = new BufferedWriter(new FileWriter(filePath));
		      
		      for (int i = 0; i<mapList.size(); i++) {
		    	  
		    	  DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		    	  TimeZone tz = TimeZone.getTimeZone("GMT");
		    	  formatter.setTimeZone(tz);
		    	  java.util.Date d = new java.util.Date(mapList.get(i).getCreated());
		    	  String formatted = formatter.format(d);
		    	  
		    	  String ownerName = "";
		    	  if(mapList.get(i).getOwner() != null){
		    		  ownerName = mapList.get(i).getOwner().getFirstname() + " " + mapList.get(i).getOwner().getLastname();
		    	  }
		    	  
		    	  String htmlRow = "";
		    	  
		    	  htmlRow += "<div class='r_mindmap'>";
		    	  htmlRow += "<div class='mindmap_img'><img src='" + context.getContextPath() + File.separator + mapList.get(i).getImagepath() + "'></div>";
		    	  htmlRow += "<div class='subject'>";
		    	  htmlRow += "<div style='width:160px; height:20px; padding-left:20px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden'>";
		    	  htmlRow += "<span class='blue'><a href='"+ context.getContextPath() + File.separator + "map" + File.separator + mapList.get(i).getKey() + "' target='_blank'>" + mapList.get(i).getName() + "</a></span>";
		    	  htmlRow += "</div>";
		    	  htmlRow += "<div style='width:160px; height:20px; padding-left:20px;'>";
		    	  htmlRow += "<span class='orange'>" + ownerName +"</span>  |  "+ formatted ;
		    	  htmlRow += "</div></div></div>";
		    	  
		    	  out.write(htmlRow);
		    	  out.newLine();
		            
		        }

		      out.close();
		      ////////////////////////////////////////////////////////////////
		    } catch (IOException e) {
		        System.err.println(e); // 에러가 있다면 메시지 출력
		        System.exit(1);
		    }
		
	}

}
