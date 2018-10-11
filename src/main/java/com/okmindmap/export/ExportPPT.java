package com.okmindmap.export;

import java.awt.Dimension;
import java.awt.geom.Rectangle2D;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.hslf.model.Hyperlink;
import org.apache.poi.hslf.model.Picture;
import org.apache.poi.hslf.model.Slide;
import org.apache.poi.hslf.model.TextBox;
import org.apache.poi.hslf.model.TextRun;
import org.apache.poi.hslf.model.textproperties.TextPropCollection;
import org.apache.poi.hslf.record.Record;
import org.apache.poi.hslf.record.StyleTextPropAtom;
import org.apache.poi.hslf.record.TextCharsAtom;
import org.apache.poi.hslf.record.TextHeaderAtom;
import org.apache.poi.hslf.usermodel.RichTextRun;
import org.apache.poi.hslf.usermodel.SlideShow;
import org.htmlparser.Parser;
import org.htmlparser.util.ParserException;
import org.htmlparser.visitors.TextExtractingVisitor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.okmindmap.model.ForeignObject;
import com.okmindmap.model.Map;
import com.okmindmap.model.Node;
import com.okmindmap.model.RichContent;
import com.okmindmap.service.MindmapService;
import sun.misc.BASE64Decoder;

public class ExportPPT implements Export {
	// 타이틀 위치
	private static final java.awt.Rectangle TITLE_ANCHOR = new java.awt.Rectangle(54, 30, 612, 60);
	// 본문 위치
	private static final java.awt.Rectangle BODY_ANCHOR = new java.awt.Rectangle(54, 138, 612, 352);
	// bullet과 text와의 간격
	private static final int TEXT_OFFSET = 15;
	// bullet의 최대 indent level 은 5(0~4).
	private static final int MAX_INDENT_LEVEL = 4;
	// Slide에 들어가는 Bullet 수
	private static final int MAX_BULLET = 10;
	
	private static final Hashtable<String, Integer> SUPPORTED_IMAGE_FORMAT = new Hashtable<String, Integer>();
	// JPEG, PNG 만 지원
	static {
//		SUPPORTED_IMAGE_FORMAT.put("EMF", Picture.EMF);
		SUPPORTED_IMAGE_FORMAT.put("JPEG", Picture.JPEG);
//		SUPPORTED_IMAGE_FORMAT.put("PICT", Picture.PICT);
		SUPPORTED_IMAGE_FORMAT.put("PNG", Picture.PNG);
//		SUPPORTED_IMAGE_FORMAT.put("WMF", Picture.WMF);
	}
	
//	private Map map;
	
	
	private SlideShow ppt = null;
	private Slide slide = null;
	private TextBox shape = null;
	private TextCharsAtom textAtom = null; 
	private StyleTextPropAtom styleAtom = null;
	private TextPropCollection /*prProps,*/ chProps;
	private StringBuffer buffer = null;
	private ArrayList<Integer> indentLevel;
	private int countBullet = 0;
	private String realPath = "";
	
	private MindmapService mindmapService;
	Logger logger;
	
	public ExportPPT() {
		logger = Logger.getLogger(ExportPPT.class);
	}
	
	public ExportPPT(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
		logger = Logger.getLogger(ExportPPT.class);
	}
	
	
	public void transform(Map map, Properties prop, OutputStream out) throws IOException {
//		this.map = map;
		
		this.realPath = prop.getProperty("realPath");
		ppt = new SlideShow(new FileInputStream(this.realPath + "plugin/presentation/ppt/default.pot"));
		
	    Node root = map.getNodes().get(0);
	    // 첫 페이지 만들기
	    addFirstSlide(root);
	    
	    String[] pt_sequence = map.getPt_sequence().split(" ");
	    int mapId = map.getId();
	    
	    for(String identity: pt_sequence) {
	    	Node child = this.mindmapService.getNode(identity, mapId, true);
	    	
	    	if(child != null) {
		    	String title = getNodeText(child);
		    	if(title == null) {
		    		title = "";
		    	}
		    	
		    	com.okmindmap.model.Slide p_slide = this.mindmapService.getSlide(child.getId());
		    	int showdepths = 2;
		    	if(p_slide != null) {
		    		showdepths = p_slide.getShowDepths() - 1;
		    	}
		    	
		    	shape = startSlide(title, extractLink(child));
		    	for(Node node: child.getChildren()) {
		    		processTransform(node, 0, title, showdepths);
		    	}
		    	endSlide(); 
	    	}
		}
	    
	    //save
	    ppt.write(out);
	}
	
	private void processTransform(Node node, int depth, String title, int showdepths) {
		if(countBullet >= MAX_BULLET) {
			endSlide();
			shape = startSlide(title, extractLink(node));
			processTransform(node, depth, title, showdepths);
			return;
		}
		
		String text = getNodeText(node);
		Boolean writetxt = true;
		
		// 이미지 처리
		String[] images = extractImage(node);
		if(images != null && images.length > 0) {
			writetxt = false;
			if(textAtom != null && countBullet > 0) endSlide();
			for (String url : images) {
				addImageSlide(url, depth, title, node);
			}
		}
		
		// video processing
		String video = extractVideo(node);
		if(video != null){
			writetxt = false;
			if(textAtom != null && countBullet > 0) endSlide();
			addVideoSlide(video, depth, title, node);
		}
		
		// webpage processing
		String webpage = extractWebpage(node);
		if(webpage != null){
			writetxt = false;
			if(textAtom != null && countBullet > 0) endSlide();
			addWebpageSlide(webpage, depth, title, node);
		}
		
		// iframe processing
		String iframe = extractiFrame(node);
		if(iframe != null){
			writetxt = false;
			if(textAtom != null && countBullet > 0) endSlide();
			addiFrameSlide(iframe, depth, title, node);
		}
		
		// default text processing
		if(writetxt) {
			if(textAtom == null) shape = startSlide(title, extractLink(node));
			writeText(text, depth, extractLink(node));
		}
		
		if(depth < showdepths) {
			for(Node child: node.getChildren()) {
				processTransform(child, depth + 1, title, showdepths);
			}
		}
	}
	
	private void addFirstSlide(Node node) {
		String text = getNodeText(node);
    	if(text == null) {
    		text = "";
    	}
    	
    	Slide s = ppt.getSlides()[0];
        
        // 제목
        TextBox shapeTitle = new TextBox();
        TextRun textRun = shapeTitle.getTextRun();
        textRun.setText(text);
        textRun.setRunType(TextHeaderAtom.CENTER_TITLE_TYPE);
        Rectangle2D anchor = shapeTitle.getAnchor2D();
        anchor.setRect(54,200,612,117);
        shapeTitle.setAnchor(anchor);
        
        RichTextRun rt = textRun.getRichTextRuns()[0];
        rt.setFontSize(44);
        rt.setAlignment(TextBox.AlignCenter);
        s.addShape(shapeTitle);
    	
    	// 부제목
//    	TextBox shape1 = new TextBox();
//    	TextRun textRun1 = shape1.getTextRun();
//    	textRun1.setText("");
//    	textRun1.setRunType(TextHeaderAtom.CENTER_TITLE_TYPE);
//    	Rectangle2D anchor1 = shape1.getAnchor2D();
//    	anchor1.setRect(108,306,504,138);
//    	shape1.setAnchor(anchor1);
//    	
//    	RichTextRun rt1 = textRun1.getRichTextRuns()[0];
//    	rt1.setFontSize(32);
//		
//    	s.addShape(shape1);
    	
    	String[] images = extractImage(node);
    	if(images != null && images.length > 0) {
    		for (String url : images) {
    			addImageSlide(url, 0, null, null);
			}
    	}
	}
	
	private void addImageSlide(String url, int depth, String title, Node node) {
//		String imgFormat = getImageFormatName(url);
		String imgFormat = "png";
		if(imgFormat != null && SUPPORTED_IMAGE_FORMAT.containsKey(imgFormat.toUpperCase())) {
			int marginTop = 0;
			
			if(title == null) title = " ";
			if(countBullet > 0) shape = startSlide(title, extractLink(node));
			
			if(title != null && title.trim().length() > 0){
				marginTop += 60;
			}
			
			String nodeText = node != null ? getNodeText(node) : "";
//			if(nodeText.length() > 0){
//				writeText(nodeText, depth, node != null ? extractLink(node):null);
//			}
			
			countBullet++;
			endSlide();
			
			if(nodeText.trim().length() > 0){
				marginTop -= 352/MAX_BULLET;
			}
			
			try {
//				byte[] data = getImageData(url);
				String src = this.realPath + "plugin/presentation/ppt/image.png";
				byte[] data = org.apache.poi.util.IOUtils.toByteArray(new FileInputStream(src));
		    	
		    	int idx = ppt.addPicture(data, SUPPORTED_IMAGE_FORMAT.get(imgFormat.toUpperCase()));
				Picture picture = new Picture(idx);
				
				slide.addShape(picture);
				
				Dimension pptSize = ppt.getPageSize();
				Rectangle2D rectImage = picture.getAnchor2D();
				
//				double height = Math.min(pptSize.height - 54*2 - marginTop, rectImage.getHeight());
//				double width = (height*rectImage.getWidth())/rectImage.getHeight(); 
				double width = 400;
				double height = 267;

				rectImage.setRect((pptSize.width - width)/2 , marginTop + (pptSize.height - height)/2, width, height);
				
				picture.setAnchor(rectImage);
				
				if(nodeText.trim().length() > 0){
					marginTop = (int) ((marginTop + (pptSize.height - height)/2) + height);
					writeCaption(nodeText, node != null ? extractLink(node):null, marginTop);
				}
				
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	private void addVideoSlide(String url, int depth, String title, Node node) {
		String regexUrl = "(?<=watch\\?v=|/videos/|embed\\/)[^#\\&\\?]*";

	    Pattern compiledPattern = Pattern.compile(regexUrl);
	    Matcher matcher = compiledPattern.matcher(url);

	    if(matcher.find()){
	    	int marginTop = 0;
	    	
	    	if(title == null) title = " ";
	    	if(countBullet > 0) shape = startSlide(title, extractLink(node));
			
			if(title != null && title.trim().length() > 0){
				marginTop += 60;
			}
			
			String nodeText = node != null ? getNodeText(node) : "";
//			if(nodeText.length() > 0){
//				writeText(nodeText, depth, node != null ? extractLink(node):null);
//			}
			
			countBullet++;
			endSlide();
			
			if(nodeText.trim().length() > 0){
				marginTop -= 352/MAX_BULLET;
			}
	    	
	    	String id = matcher.group();
	    	String video = "https://www.youtube.com/embed/"+id;
//			String thumb = "http://img.youtube.com/vi/"+id+"/0.jpg";
			
//			byte[] thumbData = getImageData(thumb);
			
			try {
//				int thumbIdx = ppt.addPicture(thumbData, Picture.JPEG);
				String thumb = this.realPath + "plugin/presentation/ppt/video.png";
				byte[] thumbData = org.apache.poi.util.IOUtils.toByteArray(new FileInputStream(thumb));
				int thumbIdx = ppt.addPicture(thumbData, Picture.PNG);
				
				// add thumbnail and video object
//				int movieIdx = ppt.addMovie(video, MovieShape.MOVIE_MPEG);
//				MovieShape movieShape = new MovieShape(movieIdx, thumbIdx);
				
				Dimension pptSize = ppt.getPageSize();
				
				double width = 400; //560;
				double height = 267; //315;
				
//				movieShape.setAnchor(new Rectangle2D.Double((pptSize.width - width)/2, marginTop + (pptSize.height - height)/2, width, height));
//				slide.addShape(movieShape);
				
				// add thumbnail only
				Picture picture = new Picture(thumbIdx);
				slide.addShape(picture);
				Rectangle2D rectImage = picture.getAnchor2D();
				rectImage.setRect((pptSize.width - width)/2, marginTop + (pptSize.height - height)/2, width, height);
				picture.setAnchor(rectImage);
				
				if(nodeText.trim().length() > 0){
					marginTop = (int) ((marginTop + (pptSize.height - height)/2) + height);
					writeCaption(nodeText, node != null ? extractLink(node):null, marginTop);
				}
				
			} catch (Exception e) {
				e.printStackTrace();
			}
	    }
	}
	
	private void addWebpageSlide(String content, int depth, String title, Node node) {
		int marginTop = 0;
		if(title == null) title = " ";
		if(countBullet > 0) shape = startSlide(title, extractLink(node));
		
		if(title != null && title.trim().length() > 0){
			marginTop += 60;
		}
		
		String nodeText = node != null ? getNodeText(node) : "";
//		if(nodeText.length() > 0){
//			writeText(nodeText, depth, node != null ? extractLink(node):null);
//		}
		
//		Document doc = Jsoup.parse(content);
//		Elements elements = doc.select("body > *");
//		webpageProcessTransform(elements, depth);
		
		countBullet++;
		endSlide();
		
		if(nodeText.trim().length() > 0){
			marginTop -= 352/MAX_BULLET;
		}
		
		try {
			String src = this.realPath + "plugin/presentation/ppt/webpage.png";
			byte[] data = org.apache.poi.util.IOUtils.toByteArray(new FileInputStream(src));
			String imgFormat = "png";
	    	
	    	int idx = ppt.addPicture(data, SUPPORTED_IMAGE_FORMAT.get(imgFormat.toUpperCase()));
			Picture picture = new Picture(idx);
			
			slide.addShape(picture);
			
			Dimension pptSize = ppt.getPageSize();
			Rectangle2D rectImage = picture.getAnchor2D();
			
			double width = 400;
			double height = 267;

			rectImage.setRect((pptSize.width - width)/2 , marginTop + (pptSize.height - height)/2, width, height);
			
			picture.setAnchor(rectImage);
			
			if(nodeText.trim().length() > 0){
				marginTop = (int) ((marginTop + (pptSize.height - height)/2) + height);
				writeCaption(nodeText, node != null ? extractLink(node):null, marginTop);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private void webpageProcessTransform(Elements elements, int depth){
		for (Element el : elements) {
			int d = depth;
			if(el.isBlock() && !hasInnerBlockElements(el)){
				if(el.text().trim().length() > 0){
					writeText(el.text(), d > 0 ? (-1)*depth:Integer.MIN_VALUE, null);
				}
			}else{
				if(el.ownText().trim().length() > 0){
					writeText(el.ownText(), d > 0 ? (-1)*depth:Integer.MIN_VALUE, null);
				}
				if(el.tagName().equals("ul") || el.tagName().equals("ol")) {
					d += 1;
				}
				webpageProcessTransform(el.children(), d);
			}
		}
	}
	
	private Boolean hasInnerBlockElements(Element el){
		Boolean found = false;
		for (Element children : el.children()) {
			if(children.isBlock()){
				found = true;
				break;
			}else{
				found = hasInnerBlockElements(children);
				if(found) break;
			}
		}
		return found;
	}
	
	private void addiFrameSlide(String url, int depth, String title, Node node) {
		int marginTop = 0;
		
		if(title == null) title = " ";
		if(countBullet > 0) shape = startSlide(title, extractLink(node));
		
		if(title != null && title.trim().length() > 0){
			marginTop += 60;
		}
		
		String nodeText = node != null ? getNodeText(node) : "";
//		if(nodeText.length() > 0){
//			writeText(nodeText, depth, node != null ? extractLink(node):null);
//		}
		
		countBullet++;
		endSlide();
		
		if(nodeText.trim().length() > 0){
			marginTop -= 352/MAX_BULLET;
		}
		
		try {
			// add iframe screenshot
			// https://developers.google.com/speed/docs/insights/v2/reference/pagespeedapi/runpagespeed
			
//			URL curl = new URL("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?screenshot=true&strategy=desktop&url="+url);
//			HttpURLConnection connection = (HttpURLConnection) curl.openConnection();
//			connection.setRequestMethod("GET");
//
//			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//			String inputLine;
//			StringBuffer response = new StringBuffer();
//
//			while ((inputLine = in.readLine()) != null) {
//				response.append(inputLine);
//			}
//			in.close();
//
//			JSONObject responseObj = new JSONObject(response.toString());
//			JSONObject screenshot = responseObj.getJSONObject("screenshot");
//			String src = screenshot.getString("data");
//			src = src.replaceAll("_", "/");
//			src = src.replaceAll("-", "+");
//			src = "data:"+screenshot.getString("mime_type")+";base64,"+src;
			
			// Make its own way to represent iframe
			String src = this.realPath + "plugin/presentation/ppt/iframe.png";
			byte[] data = org.apache.poi.util.IOUtils.toByteArray(new FileInputStream(src));
			String imgFormat = "png";
			
//			byte[] data = getImageData(src);
//			String imgFormat = getImageFormatName(src);
	    	
	    	int idx = ppt.addPicture(data, SUPPORTED_IMAGE_FORMAT.get(imgFormat.toUpperCase()));
			Picture picture = new Picture(idx);
			
			slide.addShape(picture);
			
			Dimension pptSize = ppt.getPageSize();
			Rectangle2D rectImage = picture.getAnchor2D();
			
//			double height = Math.min(pptSize.height - 54*2 - marginTop, rectImage.getHeight()*1.5);
//			double width = (height*rectImage.getWidth())/rectImage.getHeight(); 
			double width = 400;
			double height = 267;

			rectImage.setRect((pptSize.width - width)/2 , marginTop + (pptSize.height - height)/2, width, height);
			
			picture.setAnchor(rectImage);
			
			if(nodeText.trim().length() > 0){
				marginTop = (int) ((marginTop + (pptSize.height - height)/2) + height);
				writeCaption(nodeText, node != null ? extractLink(node):null, marginTop);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 새로운 슬라이드를 만들고, 본문이 들어갈 Text Box를 리턴
	 * @param title
	 * @return
	 */
	private TextBox startSlide(String title, String link) {
		buffer = new StringBuffer();
        indentLevel = new ArrayList<Integer>();
        countBullet = 0;
		
		slide = createSlide();
		
		title = StringEscapeUtils.unescapeHtml(title);
		title = title.replaceAll("\n", "");
		
		// 타이틀 추가
        TextBox textBox = new TextBox();
    	TextRun txtRun = textBox.getTextRun();
    	if("".equals(title)) title = " ";
    	txtRun.setText(title);
    	txtRun.setRunType(TextHeaderAtom.TITLE_TYPE);
    	textBox.setAnchor(TITLE_ANCHOR);
    	
    	if(link != null && link.trim().length() > 0) {
			Hyperlink hyperlink = new Hyperlink();
			
			hyperlink.setAddress(link);
			hyperlink.setTitle(title);
			int linkIdx = ppt.addHyperlink(hyperlink);
			textBox.setHyperlink(linkIdx, 0, title.length());
		}
    	
    	RichTextRun rt = txtRun.getRichTextRuns()[0];
    	rt.setAlignment(TextBox.AlignLeft);
    	slide.addShape(textBox);
        
	    TextBox shape = slide.addTitle();
	    TextRun textRun = shape.getTextRun();
        
        for(Record r : textRun.getRecords()){ 
            if(r instanceof StyleTextPropAtom) styleAtom = (StyleTextPropAtom)r; 
            else if(r instanceof TextCharsAtom) textAtom = (TextCharsAtom)r; 
        } 

        styleAtom.getParagraphStyles().clear(); 
        styleAtom.getCharacterStyles().clear();
        
        return shape;
	}
	
	private void endSlide() {
		if(textAtom == null) return;
		//RichTextRun을 만듦.
        String txt = buffer.toString(); 
        textAtom.setText(txt);
        TextRun txtRun = shape.getTextRun();
        txtRun.buildRichTextRuns(styleAtom.getParagraphStyles(), styleAtom.getCharacterStyles(), txt);
        txtRun.setRunType(TextHeaderAtom.BODY_TYPE);
	    shape.setAnchor(BODY_ANCHOR);
	    // 줄바꿈 방법 설정.
	    // shape.setWordWrap(TextShape.WrapNone);
	    
	    // Slide에 추가
//	    slide.addShape(shape);
	    // 크기를 제대로 설정하지 못함
	    // shape.resizeToFitText();
	    
	    // Bullet을 만듦.
	    // Slide에 추가 후에 해야함. 
	    RichTextRun[] rts = shape.getTextRun().getRichTextRuns();
	    int level = 0;
	    Boolean blankIndent = false;
	    for (int i = 0; i < rts.length-1; i++) {
	    	if(indentLevel.size() >= rts.length-1) {
        		level = indentLevel.get(i);
        		blankIndent = level < 0;
            	if(blankIndent) level = level == Integer.MIN_VALUE ? 0 : (-1)*level; 
        		level = Math.min(level, MAX_INDENT_LEVEL);
        	}
        	// 1 단계 노드의 하위노드가 없어서 본문에 텍스트를 입력하지 못하는 경우 NullPointerException이 발생함.
        	try {
        		rts[i].setBullet(true);
        		if(blankIndent){
        			rts[i].setBulletChar(level==0 ? ' ' : '-');
        		}
        		rts[i].setIndentLevel(level);
        		// use theme
//        		rts[i].setTextOffset(rts[i].getBulletOffset() + TEXT_OFFSET);
        	} catch (Exception e) {}
		}
        
    	textAtom = null; 
    	styleAtom = null;
    	chProps = null;
	}
	
	/**
	 * 노드에 있는 이미지를 추출한다.
	 * @param node
	 */
	private String[] extractImage(Node node) {
		ArrayList<String> images = new ArrayList<String>();

		String richTxt = null;
		RichContent richContent = node.getRichContent();
		if(richContent != null) {
			richTxt = richContent.getContent();
		}
		if( richTxt != null) {
			Document doc = Jsoup.parse(richTxt);
			Elements elements = doc.select("img");
			for (Element element : elements) {
				images.add(element.attr("src"));
			}
		};
		
		// Find images that exist in the ForeignObject (example in the webpage)
		ForeignObject foreignObject = node.getForeignObject();
		if(foreignObject != null) {
			Document doc = Jsoup.parse(foreignObject.getContent());
			Elements elements = doc.select("img");
			for (Element element : elements) {
				images.add(element.attr("src"));
			}
		}
		
		return images.toArray(new String[images.size()]);
	}
	
	private String getImageFormatName(String url) {
		try {
	    	String pattern = "data:image\\/([a-zA-Z]*);base64,";
	    	
	    	Pattern pSrc = Pattern.compile(pattern);
			Matcher type = pSrc.matcher(url);
			
	    	if(type.find()) {
	    		String typ = type.group();
	    		return typ.split("data:image\\/")[1].split(";base64,")[0];
	    	}else{
	    		URLConnection openConnection = (new URL(url)).openConnection();
	    		openConnection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
	            openConnection.connect();
	    		
	    		ImageInputStream iis = ImageIO.createImageInputStream(new BufferedInputStream(openConnection.getInputStream()));

		        Iterator<ImageReader> iter = ImageIO.getImageReaders(iis);
		        if (!iter.hasNext()) {
		            return null;
		        }

		        ImageReader reader = (ImageReader)iter.next();
		        
		        iis.close();

		        // Return the format name
		        return reader.getFormatName();
	    	}
	    } catch (IOException e) {
	    	e.printStackTrace();
	    }
	    
	    return null;
	}
	
	private byte[] getImageData(String url) {
		byte[] rData = new byte[0];
		
		try {
			String pattern = "data:image\\/([a-zA-Z]*);base64,";
	    	
	    	Pattern pSrc = Pattern.compile(pattern);
			Matcher type = pSrc.matcher(url);
			
	    	if(type.find()) {
	    		String[] imageData = url.split(",");
	    		
	    		BASE64Decoder decoder = new BASE64Decoder();
	    		rData = decoder.decodeBuffer(imageData[1]);
	    		
	    	}else {
	    		URLConnection openConnection = (new URL(url)).openConnection();
	    		openConnection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
	            openConnection.connect();
	    		
	    		InputStream in = new BufferedInputStream(openConnection.getInputStream());
				byte[] b = new byte[4096];
				int length = 0;
				for( length = in.read(b); length > 0; length = in.read(b)) {
					rData = concat(rData, b, 0, length);
				}
		        in.close();
	    	}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return rData;
	}
	
	private byte[] concat(byte[] A, byte[] B, int offset, int length) {
		byte[] C = new byte[A.length + length];
		System.arraycopy(A, 0, C, 0, A.length);
		System.arraycopy(B, 0, C, A.length, length);
		
		return C;
	}
	
	/**
	 * 노드에 걸려있는 hyperlink 반환
	 * @param node
	 * @return
	 */
	private String extractLink(Node node) {
		return node.getLink();
	}
	
	/**
	 * Extract the video from the node
	 * @param node
	 */
	private String extractVideo(Node node){
		String video = null;
		ForeignObject foreignObject = node.getForeignObject();
		if(foreignObject != null){
			String link = node.getLink();
			
			if(link != null && link.trim().length() > 0) {
				String regexUrl = "https?:\\/\\/(?:[0-9A-Z-]+\\.)?(?:youtu\\.be\\/|youtube\\.com\\S*[^\\w\\-\\s])([\\w\\-]{11})(?=[^\\w\\-]|$)(?![?=&+%\\w]*(?:['\"][^<>]*>|<\\/a>))[?=&+%\\w]*";
				Pattern compiledPattern = Pattern.compile(regexUrl, Pattern.CASE_INSENSITIVE);
				Matcher matcher = compiledPattern.matcher(link);
				if(matcher.find()) {
				    video = matcher.group();
				}
			}
		}
		return video;
	}
	
	/**
	 * Extract the webpage from the node
	 * @param node
	 */
	private String extractWebpage(Node node){
		String content = null;
		ForeignObject foreignObject = node.getForeignObject();
		if(foreignObject != null){
			Document doc = Jsoup.parse(foreignObject.getContent());
			Elements elements = doc.select("iframe");
			if(elements.size() == 0){
				content = foreignObject.getContent();
			}
		}
		return content;
	}
	
	/**
	 * Extract the iframe from the node
	 * @param node
	 */
	private String extractiFrame(Node node) {
		String iframe = null;
		ForeignObject foreignObject = node.getForeignObject();
		String link = node.getLink();
		if(foreignObject != null && link != null && extractVideo(node) == null){
			iframe = link;
		}
		return iframe;
	}
	
	/**
	 * plain text 를 반환
	 * @param node
	 * @return
	 */
	private String getNodeText(Node node) {
		String txt = node.getText();
		if(txt == null) txt = "";
		
		String richTxt = null;
		RichContent richContent = node.getRichContent();
		if(richContent != null) {
			richTxt = richContent.getContent();
		}
		if( richTxt != null) {
			Parser parser = new Parser();
			try {
				parser.setInputHTML(richTxt);
				TextExtractingVisitor visitor = new TextExtractingVisitor ();
		        parser.visitAllNodesWith (visitor);
		        txt += visitor.getExtractedText().trim();
			} catch (ParserException e) {
				e.printStackTrace();
			}
		}
		
		return StringEscapeUtils.unescapeHtml(txt);
	}
	
	private void writeText(String text, int depth, String link) {
		indentLevel.add(depth);
		text = StringEscapeUtils.unescapeHtml(text);
		if(link != null && link.trim().length() > 0) {
			Hyperlink hyperlink = new Hyperlink();
			
			hyperlink.setAddress(link);
			hyperlink.setTitle(text);
			int linkIdx = ppt.addHyperlink(hyperlink);
			shape.setHyperlink(linkIdx, buffer.length(), buffer.length() + text.length());
		}
		
		countBullet += StringUtils.countMatches(text, "\n");
		text = text.replaceAll("\n", "");
		text = text + "\r";
		
    	buffer.append(text);
    	styleAtom.addParagraphTextPropCollection(text.length());
    	chProps = styleAtom.addCharacterTextPropCollection(text.length());
    	RichTextRun rt = new RichTextRun(shape.getTextRun(), buffer.length(), text.length(), null, chProps, false, false);
    	rt.supplySlideShow(ppt);
    	
    	countBullet++;
	}
	
	public void writeCaption(String text, String link, int top) {
		TextBox shapeTitle = new TextBox();
    	TextRun textRun = shapeTitle.getTextRun();
    	textRun.setText(text);
    	textRun.setRunType(TextHeaderAtom.CENTER_TITLE_TYPE);
    	Rectangle2D anchor = shapeTitle.getAnchor2D();
    	anchor.setRect(54,top,612,20);
    	shapeTitle.setAnchor(anchor);
    	
    	if(link != null && link.trim().length() > 0) {
			Hyperlink hyperlink = new Hyperlink();
			
			hyperlink.setAddress(link);
			hyperlink.setTitle(text);
			int linkIdx = ppt.addHyperlink(hyperlink);
			shapeTitle.setHyperlink(linkIdx, 0, text.length());
		}
    	
    	RichTextRun rt = textRun.getRichTextRuns()[0];
    	rt.setFontSize(14);
    	rt.setBold(false);
    	rt.setAlignment(TextBox.AlignCenter);
    	slide.addShape(shapeTitle);
	}
	
	private Slide createSlide() {
//		Slide root = ppt.getSlides()[0];
		Slide s = ppt.createSlide(); 
//		s.setMasterSheet(root.getMasterSheet());
		return s;
	}
	
//	public static void main(String[] args) {
//		
//	}
	
}
