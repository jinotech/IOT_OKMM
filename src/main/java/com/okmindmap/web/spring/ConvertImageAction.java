package com.okmindmap.web.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.ActionDigester;
import com.okmindmap.action.Action;
import com.okmindmap.action.MoveAction;
import com.okmindmap.action.NewAction;
import com.okmindmap.model.Node;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;
import com.okmindmap.model.Attribute;
import java.io.*;
import java.util.*;
import org.imsglobal.lti.launch.*;

import java.net.URL;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.awt.Toolkit;
import java.awt.Image;
import java.net.URLEncoder;
import java.net.URI;

import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;

import java.io.IOException;

import org.apache.batik.dom.svg.SAXSVGDocumentFactory;
import org.apache.batik.util.XMLResourceDescriptor;

import org.w3c.dom.Document;

public class ConvertImageAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		String mapid = request.getParameter("map");
		String identity = request.getParameter("node");
		String image_url = request.getParameter("url");
		String svg = request.getParameter("svg");
		byte[] result = null;

		if (image_url != null) {
	        try {
				//int map_id = Integer.parseInt(mapid);
				//Node node = this.mindmapService.getNode(identity, map_id, false);
	        	String encoded_url = image_url;
	        	encoded_url = image_url.replace(" ", "%20");

				URL url = new URL(encoded_url);
				BufferedImage bImg = ImageIO.read(url);
				
		        ByteArrayOutputStream bos = new ByteArrayOutputStream();

		        ImageIO.write(bImg, "png", bos);
	            byte[] imageBytes = bos.toByteArray();
	 
	            Base64.Encoder encoder = Base64.getEncoder();
	            result = encoder.encode(imageBytes);
	            
	            bos.close();
	        } catch (Exception e) {
	        	result = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAstJREFUeJztmjFrFEEYhp/oEXJR0E4RTSySQgiKNmKjjXZaaaMWVoLaGA2pDKh/wNJSsLWLNgoK2thojBjEUkGMBJsQNSEonsW4kN2b3flmdvZm15sH3ibMN/O9b3Z3dvcWIpFIJBKJ9CsDQCd0EyHZFLqB0MQAQjcQmpbmbwM976K3pK55fX8ExABCNxCaJgcwDEwD88D6P70BpoC2zUSdjJrAKPCB7t4TvQdGcmq7/DYtgGGKzW8MYUhT3/gApjGbT3RdU+89gH3AC2AFeAJMOMxhwzzyAOY09V4DGAeWM/XfgSOW89iwjjyANU29twBaqKuubuGvwA4rW3JqE8BFw+IPrGzJyQtdp9eaei8BDAJfBA0ctTQnYUqwbqJJTb2XAM4JG3hu501EG7XFmdZeoMJt8KWggSqPghGKQ1gA9uTUlg5gvGBhnWYtzUlpo/b5OdTFbg11zk+i/88nlA7glqamSH+AMQtjVVM6AMn5l9Udnw5KUiqAMc14iZaBLX59OJPqzfZx+JTjotuAs461lWNzBDzWjJfqLXbvG3ehLqCfgLv4u7N0PgWGgFXNeBtJt8RBuu/4loATwvoinAM4phlrq4fCJq/l1P8GLgvnyMM5gJs5Tdlqv6HBrcA3wxwzuL++dw7gmaEpX0fBDeE8t3ELwSmAFvBT2JhEJ3PWGUW9T5DOM2PrXudXEsBBD6Y3agnYm1ljO/DKYa6rvQjgiucAOsAicAE4DFwCPpaY63zVAdyrIACf+gUcrzKAdzUwadIK5h3GKYA2av8NbVCiz6g7SHEAkmeBCWCzYFwd2A08wuLBSxLAAed2wnAIuI/wd0/JIMl5VTdOo17ciDBdA55qxjRFZyR+TQEs1sCIq37Q/VNdaozuO8Hs/fVOTShNYhW1RSak/EoC+N9I+W3yFyJe6PsA4rfCoRsITQwgdAORSCQSiUQiofgLHp90dsm9tlwAAAAASUVORK5CYII=".getBytes();
	        }
			response.getOutputStream().write(result);
	    } else if (svg != null) {
	    	try {
		    	ByteArrayInputStream is = new ByteArrayInputStream(svg.getBytes());
		    	
	    	    String parser = XMLResourceDescriptor.getXMLParserClassName();
	    	    SAXSVGDocumentFactory f = new SAXSVGDocumentFactory(parser);
	    	    String uri = "http://www.example.org/diagram.svg";
	    	    Document doc = f.createDocument("", is);
	    	    
		    			    	
		    	TranscoderInput input = new TranscoderInput(doc);
		        ByteArrayOutputStream os = new ByteArrayOutputStream();
		        TranscoderOutput output = new TranscoderOutput(os);
		        
		        PNGTranscoder trans = new PNGTranscoder();
	
		        trans.transcode(input, output);
		        result = os.toByteArray();

		        //convert to base64
	            Base64.Encoder encoder = Base64.getEncoder();
	            result = encoder.encode(result);
		        
	        } catch (Exception e) {
	        	result = e.getMessage().getBytes();
	        }
			response.getOutputStream().write(result);	        
	    } else
	    	response.getOutputStream().write(("Invalid Url: " + image_url).getBytes());
		
		return null;
		
	}
	
	private long getCurrentTime() {
		long time = System.currentTimeMillis();
		
		return time;
	}
}
