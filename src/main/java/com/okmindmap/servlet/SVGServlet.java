package com.okmindmap.servlet;

import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.imageio.ImageIO;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.batik.dom.svg.SAXSVGDocumentFactory;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.w3c.dom.svg.SVGDocument;




import com.okmindmap.model.Map;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.helper.MindmapServiceHelper;
import com.okmindmap.util.ImageCropper;

public class SVGServlet extends HttpServlet {

	private static final long serialVersionUID = 378444570547257806L;
	private MindmapService mindmapService;
	
	public void init(ServletConfig servletConfig) throws ServletException {
		super.init(servletConfig);
		
		mindmapService = MindmapServiceHelper.getMindMapService(servletConfig.getServletContext());
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws IOException, ServletException {
		
		String svg = request.getParameter("svg");
		String mapId = request.getParameter("id");
		String type = request.getParameter("type");
		
		Map map = this.mindmapService.getMap( Integer.parseInt(mapId) );
		String fileName = map.getName();
		
		if("png".equals(type)){
			toPNG(response, svg, fileName);
		} else {
			byte[] decoded = org.apache.commons.codec.binary.Base64.decodeBase64(svg);	
			toSVG(response, decoded, fileName);
		}
		
	}
	
	private void toSVG(HttpServletResponse response, byte[] decoded, String fileName) throws IOException {
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		response.setDateHeader("Expires", 0);
		response.setHeader("Content-Type", "image/svg+xml");
		response.setHeader( "Content-Disposition", "attachment; filename=\"" + URLEncoder.encode(fileName, "UTF-8") + ".svg\"" );
		
		ByteArrayInputStream in = new ByteArrayInputStream(unescape(new String(decoded)));
		BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());

		byte[] data = new byte[4096];
		for( int length = in.read(data, 0, data.length); length > 0; length = in.read(data, 0, data.length)) {
			out.write(data, 0, length);
		}
		
		out.flush();
		out.close();
	}
	
	private void toPNG(HttpServletResponse response, String svg, String fileName) throws IOException {

		response.setHeader("Content-type","image/png"); 
		response.setHeader( "Content-Disposition", "attachment; filename=\"" + URLEncoder.encode(fileName, "UTF-8") + ".png\"" );
	   
	    svg = svg.replace(' ', '+');
	   	    
	    byte[] decoded = org.apache.commons.codec.binary.Base64.decodeBase64(svg);
	    
	    ByteArrayInputStream in = new ByteArrayInputStream(decoded);
	    BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
	    
	    byte[] data = new byte[4096];
		for( int length = in.read(data, 0, data.length); length > 0; length = in.read(data, 0, data.length)) {
			out.write(data, 0, length);
		
		} 
		
	}
	
	private byte[] unescape(String src) { 
		StringBuffer tmp = new StringBuffer(); 
		tmp.ensureCapacity(src.length()); 

		int lastPos = 0, pos = 0; 
		char ch;

		while (lastPos < src.length()) {
			pos = src.indexOf("%", lastPos);
			if (pos == lastPos) {
				if (src.charAt(pos+1) == 'u') {
					ch = (char) Integer.parseInt(src.substring(pos+2, pos+6), 16); 
					tmp.append(ch);
					lastPos = pos+6; 
				} else { 
					ch = (char) Integer.parseInt(src.substring(pos+1, pos+3), 16); 
					tmp.append(ch); 
					lastPos = pos+3; 
				} 
			} else { 
				if (pos == -1) { 
					tmp.append(src.substring(lastPos)); 
					lastPos = src.length(); 
				} else { 
					tmp.append(src.substring(lastPos, pos)); 
					lastPos = pos; 
				} 
			} 
		}
		
		try {
			return tmp.toString().getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return tmp.toString().getBytes();
	}
	
	
}
