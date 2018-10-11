package com.okmindmap.servlet;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;

import sun.misc.BASE64Encoder;

public class convertBaseForPngServlet extends HttpServlet {
	
	private static final long serialVersionUID = 4441352443421147881L;

	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws IOException, ServletException {
		String svg = request.getParameter("svg");
		
		svg = svg.replaceFirst("xmlns=\"http://www.w3.org/2000/svg\"", "xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"");
		
		while( true ) {
			try {
				Matcher m = Pattern.compile("(<image[^>]*)href=\"(https?[^\"]*)\"([^>]*)>").matcher(svg);
				
				if(!m.find()) break;
				
				if(m.groupCount() > 0) {
					String imgLink = m.group(2);
					svg = m.replaceFirst( m.group(1)+"href=\""+getBase64FromLink(imgLink)+"\""+m.group(3)+">" );
				}
			} catch (Exception e) {
				break;
			}
		}
		
		BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
		out.write(svg.getBytes());
		out.flush();
		out.close();
	}
	
	private String getBase64FromLink(String inputURL) throws Exception {
		try {
			HttpClient client = HttpClientBuilder.create().build();
			HttpGet request = new HttpGet(inputURL);
			HttpResponse response = client.execute(request);

			// Get the response
			BufferedInputStream bis = new BufferedInputStream(response.getEntity().getContent());
			ByteArrayOutputStream bos = new ByteArrayOutputStream();

			byte[] chunk = new byte[1024];
			int read;
			do {
				read = bis.read(chunk);
				if (read >= 0) {
					bos.write(chunk, 0, read);
				}
			} while (read >= 0);

			BASE64Encoder encoder = new BASE64Encoder();
			String output = encoder.encode(bos.toByteArray());

			bos.close();
			bis.close();
			
			StringBuilder sb = new StringBuilder();
			sb.append("data:image/png;base64,");
			sb.append(output);

			return sb.toString();
		} catch (Exception e) {
			throw e;
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
	
//	public static void main(String[] args) {
//		String svg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg height=\"3000\" version=\"1.1\" width=\"5000\" xmlns=\"http://www.w3.org/2000/svg\" style=\"overflow: hidden; position: relative; display: block;\" id=\"paper_mapview\"><path fill=\"#8cbeb3\" stroke=\"#8cbeb3\" d=\"M2218.5,1633.5C2204.844,1633.5,2204.844,1656.5,2191.188,1656.5C2204.844,1656.5,2206.844,1633.5,2218.5,1635.5\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#8d96ae\" stroke=\"#8d96ae\" d=\"M2218.5,1633.5C2204.703,1633.5,2204.703,1622.5,2190.906,1622.5C2204.703,1622.5,2202.703,1633.5,2218.5,1635.5\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#78bdb3\" stroke=\"#78bdb3\" d=\"M2330.5,1492C2316.703,1492,2316.703,1634.5,2302.906,1634.5C2316.703,1634.5,2318.703,1492,2330.5,1494\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#8b9fb3\" stroke=\"#8b9fb3\" d=\"M2218.5,1468.5C2204.5,1468.5,2204.5,1513.5,2190.5,1513.5C2204.5,1513.5,2206.5,1468.5,2218.5,1470.5\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#7bb2b1\" stroke=\"#7bb2b1\" d=\"M2218.5,1468.5C2204.984,1468.5,2204.984,1404.5,2191.469,1404.5C2204.984,1404.5,2202.984,1468.5,2218.5,1470.5\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#889bb1\" stroke=\"#889bb1\" d=\"M2218.5,1468.5C2204.922,1468.5,2204.922,1370.5,2191.344,1370.5C2204.922,1370.5,2202.922,1468.5,2218.5,1470.5\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#6eabad\" stroke=\"#6eabad\" d=\"M2330.5,1492C2316.703,1492,2316.703,1469.5,2302.906,1469.5C2316.703,1469.5,2314.703,1492,2330.5,1494\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#6175a4\" stroke=\"#6175a4\" d=\"M2500.281,1496C2446.773,1496,2446.773,1493,2393.266,1493C2446.773,1493,2438.773,1496,2500.281,1504\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#a2969e\" stroke=\"#a2969e\" d=\"M2704.672,1492C2718.672,1492,2718.672,1582,2732.672,1582C2718.672,1582,2716.672,1492,2704.672,1494\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#9f9090\" stroke=\"#9f9090\" d=\"M2704.672,1492C2718.672,1492,2718.672,1444,2732.672,1444C2718.672,1444,2720.672,1492,2704.672,1494\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><path fill=\"#937886\" stroke=\"#937886\" d=\"M2500.281,1496C2554.172,1496,2554.172,1493,2608.063,1493C2554.172,1493,2562.172,1496,2500.281,1504\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></path><desc style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">Created with Raphaël 2.1.2</desc><defs style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></defs><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2421.5\" y=\"1477.5\" width=\"157.5625\" height=\"45\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#660000\" stroke=\"#cccccc\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2500.28125\" y=\"1500\" text-anchor=\"middle\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#ffffff\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-style: normal; font-variant: normal; font-weight: 700; font-stretch: normal; font-size: 30px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"30px\" font-weight=\"700\"><tspan dy=\"10.5\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">png 테스트</tspan></text><circle cx=\"2579.0625\" cy=\"1500\" r=\"4\" fill=\"#660000\" stroke=\"#cccccc\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2609.0625\" y=\"1477.5\" width=\"94.609375\" height=\"31\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#c4a0b3\" stroke=\"#937886\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2614.0625\" y=\"1493\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 700; font-stretch: normal; font-size: 18px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"18px\" font-weight=\"700\"><tspan dy=\"6.5\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㅁㅇㄹㄴ</tspan></text><circle cx=\"2703.671875\" cy=\"1493\" r=\"4\" fill=\"#c4a0b3\" stroke=\"#937886\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2733.671875\" y=\"1365.5\" width=\"226\" height=\"157\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#d3bdd6\" stroke=\"#9f9090\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2738.671875\" y=\"1510.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㅇㄹㄴㅇ</tspan></text><circle cx=\"2959.671875\" cy=\"1444\" r=\"4\" fill=\"#d3bdd6\" stroke=\"#9f9090\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle><a xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"http://www.goog.com\" xlink:show=\"new\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><image x=\"2945.671875\" y=\"1438.5\" width=\"11\" height=\"11\" preserveAspectRatio=\"none\" xlink:href=\"/okmindmap/images/hyperlink.png\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: auto;\"></image></a><image x=\"2738.671875\" y=\"1370.5\" width=\"200\" height=\"133\" preserveAspectRatio=\"none\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"http://pds25.egloos.com/pds/201303/27/58/e0284258_51529c8b6e9ea.jpg\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></image></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2733.671875\" y=\"1532.5\" width=\"85\" height=\"99\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#cbcfc1\" stroke=\"#a2969e\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2738.671875\" y=\"1619.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㅇㄹㄴㄹ</tspan></text><circle cx=\"2818.671875\" cy=\"1582\" r=\"4\" fill=\"#cbcfc1\" stroke=\"#a2969e\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle><image x=\"2738.671875\" y=\"1537.5\" width=\"75\" height=\"75\" preserveAspectRatio=\"none\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://farm9.staticflickr.com/8190/8125576869_e5eb13db3f_s.jpg\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></image></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2331.5\" y=\"1477.5\" width=\"60.765625\" height=\"31\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#829ddb\" stroke=\"#6175a4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2336.5\" y=\"1493\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 700; font-stretch: normal; font-size: 18px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"18px\" font-weight=\"700\"><tspan dy=\"6.5\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㅇㄹ</tspan></text><circle cx=\"2331.5\" cy=\"1493\" r=\"4\" fill=\"#829ddb\" stroke=\"#6175a4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2219.5\" y=\"1457.5\" width=\"82.40625\" height=\"24\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#96e5e8\" stroke=\"#6eabad\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2224.5\" y=\"1469.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㅇㄹㄴㅇ</tspan></text><circle cx=\"2219.5\" cy=\"1469.5\" r=\"4\" fill=\"#96e5e8\" stroke=\"#6eabad\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle><a xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"http://ㅈㅈㅈ.채ㅡ\" xlink:show=\"new\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><image x=\"2287.90625\" y=\"1464\" width=\"11\" height=\"11\" preserveAspectRatio=\"none\" xlink:href=\"/okmindmap/images/hyperlink.png\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: auto;\"></image></a></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2130.5\" y=\"1358.5\" width=\"59.84375\" height=\"24\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#afefd3\" stroke=\"#889bb1\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2135.5\" y=\"1370.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㅇㄴㄹ</tspan></text><circle cx=\"2130.5\" cy=\"1370.5\" r=\"4\" fill=\"#afefd3\" stroke=\"#889bb1\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle><a xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"http://www.gogo.com\" xlink:show=\"new\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><image x=\"2176.34375\" y=\"1365\" width=\"11\" height=\"11\" preserveAspectRatio=\"none\" xlink:href=\"/okmindmap/images/hyperlink.png\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: auto;\"></image></a></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2101.5\" y=\"1392.5\" width=\"88.96875\" height=\"24\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#a5f2cf\" stroke=\"#7bb2b1\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2106.5\" y=\"1404.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㅇㄹㄴㅇㄹㄴ</tspan></text><circle cx=\"2101.5\" cy=\"1404.5\" r=\"4\" fill=\"#a5f2cf\" stroke=\"#7bb2b1\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"1979.5\" y=\"1426.5\" width=\"210\" height=\"174\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#a7faea\" stroke=\"#8b9fb3\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"1984.5\" y=\"1588.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">사진</tspan></text><circle cx=\"1979.5\" cy=\"1513.5\" r=\"4\" fill=\"#a7faea\" stroke=\"#8b9fb3\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle><image x=\"1984.5\" y=\"1431.5\" width=\"200\" height=\"150\" preserveAspectRatio=\"none\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"http://cfs15.tistory.com/upload_control/download.blog?fhandle=YmxvZzIwMzI0NkBmczE1LnRpc3RvcnkuY29tOi9hdHRhY2gvMC8zNTAwMDAwMDAwMDguanBn\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"></image></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2219.5\" y=\"1622.5\" width=\"82.40625\" height=\"24\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#9aeee4\" stroke=\"#78bdb3\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2224.5\" y=\"1634.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㅇㄹㄴㅇ</tspan></text><circle cx=\"2219.5\" cy=\"1634.5\" r=\"4\" fill=\"#9aeee4\" stroke=\"#78bdb3\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle><a xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"http://www.google.com\" xlink:show=\"new\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><image x=\"2287.90625\" y=\"1629\" width=\"11\" height=\"11\" preserveAspectRatio=\"none\" xlink:href=\"/okmindmap/images/hyperlink.png\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: auto;\"></image></a></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2123.5\" y=\"1610.5\" width=\"66.40625\" height=\"24\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#aee9e8\" stroke=\"#8d96ae\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2128.5\" y=\"1622.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㅇㄹㄴㅇ</tspan></text><circle cx=\"2123.5\" cy=\"1622.5\" r=\"4\" fill=\"#aee9e8\" stroke=\"#8d96ae\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle></g><g style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><rect x=\"2112.5\" y=\"1644.5\" width=\"77.6875\" height=\"24\" r=\"0\" rx=\"5\" ry=\"5\" fill=\"#b8eafc\" stroke=\"#8cbeb3\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\" stroke-width=\"1\"></rect><text x=\"2117.5\" y=\"1656.5\" text-anchor=\"start\" font=\"10px &quot;Arial&quot;\" stroke=\"none\" fill=\"#000000\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 12px; line-height: normal; font-family: 'Malgun Gothic', 맑은고딕, Gulim, 굴림, Arial, sans-serif;\" font-family=\"Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif\" font-size=\"12px\" font-weight=\"400\"><tspan dy=\"4\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">ㄴㄴㅇㄹㅇㄴ</tspan></text><circle cx=\"2112.5\" cy=\"1656.5\" r=\"4\" fill=\"#b8eafc\" stroke=\"#8cbeb3\" style=\"-webkit-tap-highlight-color: rgba(0, 0, 0, 0); display: none;\"></circle></g></svg>";
//		
//		while( true ) {
//			try {
//				Matcher m = Pattern.compile("(<image.*)href=\"(https?[^\"]*)\"([^>]*)>").matcher(svg);
//				
//				if(!m.find()) break;
//				
//				if(m.groupCount() > 0) {
//					String imgLink = m.group(2);
//					System.out.println("---------------------------------------------");
//					System.out.println(m.group(1));
//					System.out.println(m.group(2));
//					System.out.println(m.group(3));
//					svg = m.replaceFirst( m.group(1)+"href=\""+getBase64FromLink(imgLink)+"\""+m.group(3)+">" );
//				}
//			} catch (Exception e) { 
//				break;
//			}
//		}
//		
//		System.out.println(svg);
//	}
}
