package com.okmindmap.servlet;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.okmindmap.MindmapDigester;
import com.okmindmap.export.ExportHTML;
import com.okmindmap.export.ExportPPT;
import com.okmindmap.export.ExportTWIKI;
import com.okmindmap.model.Map;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.helper.MindmapServiceHelper;

public class ExportServlet extends HttpServlet {

	private static final long serialVersionUID = 4174746009699292841L;

	private MindmapService mindmapService;
	Logger logger;
	
	public void init(ServletConfig servletConfig) throws ServletException {
		super.init(servletConfig);
		
		mindmapService = MindmapServiceHelper.getMindMapService(servletConfig.getServletContext());
		
		logger = Logger.getLogger(ExportServlet.class);
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws IOException, ServletException {
		
		String format = request.getParameter("format");
		String mapId = request.getParameter("id");
		
		Map map = this.mindmapService.getMap( Integer.parseInt(mapId) );
		
		OutputStream out = response.getOutputStream();
		
		if("html".equals(format)) {
			response.setContentType("application/zip"); 
			
			try {
				String realPath = getServletContext().getRealPath("/");
				Properties prop = new Properties();
				prop.put("iconDir", realPath + "images/icons");
				prop.put("xsltFileName", "toxhtml.xsl");
				prop.put("files", "marktree.js,minus.png,plus.png,ilink.png,treestyles.css");
				prop.put("filePrefix", realPath + "WEB-INF/classes/com/okmindmap/export/");
				ExportHTML html = new ExportHTML();
				html.transform(map, prop, out);
			} catch(Exception e) {
				logger.error(e);
			}
			
		} else if("twiki".equals(format)) {
			response.setContentType("text/twi"); 
			
			try {
				String realPath = getServletContext().getRealPath("/");
				Properties prop = new Properties();
				prop.put("xsltFileName", "mm2twiki.xsl");
				prop.put("filePrefix", realPath + "WEB-INF/classes/com/okmindmap/export/");
				ExportTWIKI twiki = new ExportTWIKI();
				twiki.transform(map, prop, out);
			} catch(Exception e) {
				logger.error(e);
			}
		} else if("ppt".equals(format)) {
			response.setContentType("application/vnd.ms-powerpoint");
			
			String realPath = getServletContext().getRealPath("/");
			Properties prop = new Properties();
			prop.put("realPath", realPath);
			
			// nvhoang
			// because it is not used for edit export ppt
//			try {
//				// 한글 깨지는 문제 때문에....
//				map = MindmapDigester.parseMap(map.toXml());
//			} catch (Exception e) {
//				e.printStackTrace();
//			}
			ExportPPT ppt = new ExportPPT(this.mindmapService);
			ppt.transform(map, prop, out);
		} else {
			out.write("Not Supported!".getBytes());
		}
		
		out.close();
	}
}
