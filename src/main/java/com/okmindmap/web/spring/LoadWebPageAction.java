package com.okmindmap.web.spring;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.springframework.web.servlet.ModelAndView;

public class LoadWebPageAction extends BaseAction {

	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String url = request.getParameter("url");
		
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Content-Type", "text/text");
		response.setDateHeader("Expires", 0);
		
		BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
		
		GetMethod m = urlRead(url, null);
		out.write(m.getResponseBody());
		
		out.flush();
		out.close();
		
		return null;
	}
	
	private GetMethod urlRead(String src, String referer) {
		try{
			GetMethod method = new GetMethod(src);
			if(referer != null)
				method.setRequestHeader("Referer", referer);
	
			HttpClient client = new HttpClient();
			int statusCode = client.executeMethod(method);
			if (statusCode != HttpStatus.SC_OK) {
				System.err.println("Method failed: " + method.getStatusLine());
				return null;
			}
			return method;
		}
		catch (Exception e) {
			return null;
		}
	}

}
