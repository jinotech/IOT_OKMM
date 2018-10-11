package com.okmindmap.export;

import java.awt.Font;
import java.awt.font.FontRenderContext;
import java.awt.geom.AffineTransform;
import java.awt.geom.Rectangle2D;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.rmi.dgc.VMID;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.FactoryConfigurationError;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.okmindmap.model.Map;

public class ExportODP implements Export {

	private static final String ODP_TITLE = "Title";
//	private static final String ODP_AUTHOR = "Author";
	private static final String ODP_SUBJECT = "Subject";	
	private static final String ODP_CONTENT_BOX = "Content";
	
	private Element presentation = null;
	private Element automatic_styles = null;
	private Document doc = null;
	private ArrayList<Element> pageList = null;
	private Hashtable<String, File> imgFiles = null;
//	private ArrayList<File> imgFiles = null;
	
	private Map map;
	
	public ExportODP() {
	}
	
	public void transform(Map map, Properties prop, OutputStream out) throws IOException {
		this.map = map;
		
		File template = new File(prop.getProperty("template"));
		
		imgFiles = new Hashtable<String, File>();
//		
//		// 마지막 템플릿 열었던 폴더로 설정
//		String lastOpen = getController().getController().getProperty("plugins.ExportOdp.lastOpened");		
//		if(lastOpen == null) lastOpen = ".";
//		
//		File selectedFile = null;
//		JFileChooser fileChooser = new JFileChooser(lastOpen);
//		fileChooser.setFileFilter(new FileFilter(){
//			public boolean accept(File f) {
//				if( f.isDirectory() ) return true;
//				if( f.getName().endsWith(".odp") ) return true;
//				return false;
//			}
//			public String getDescription() { return "ODP File(.odp)"; }
//		});
//		int status = fileChooser.showOpenDialog(null);
//		if (status == JFileChooser.APPROVE_OPTION) {
//			selectedFile = fileChooser.getSelectedFile();			
//		}
//		
////        File saveFile = chooseFile("ppt",
////                "ExportPPT", null);
//        
//        if (selectedFile == null /*|| saveFile == null*/) return;
//        
//		
		init(template);
		
        mm2Odp();
//        
//        try {
//        	String mapName = getController().getMap().getFile().getName();
//            File saveFile = new File(selectedFile.getParentFile(), getFileNameWithoutExtension(mapName)+".odp");
//			copyFile(selectedFile, saveFile);
			write(out);
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//        
//		// 템플릿 열었던 폴더 저장
//        getController().getController().setProperty("plugins.ExportOdp.lastOpened", selectedFile.getParent());
	}
	
	public void mm2Odp() throws IOException {
		com.okmindmap.model.Node root = this.map.getNodes().get(0);
		
		Element title_page = getPage("page1");
		if(title_page != null)
			replaceTextBox(title_page, ODP_TITLE, root.getPlainTextContent());				
		
	    Element content_page = getPage("page2");
	    if(content_page != null)
	    	convert(content_page, root);
	}
	
	/**
	 * 초기화
	 * @param file : odp 파일
	 */
	private void init(File file){
		ZipFile zip = null;
		InputStream is = null;
		try {
			// Zip파일 안에 존재하는 "content.xml"을 InputStream으로 가져온다.
			zip = new ZipFile(file);			
			ZipEntry contentEntry = zip.getEntry("content.xml");
			is = zip.getInputStream(contentEntry);			
			
			// Document 생성
		    DocumentBuilderFactory factory = 
		    DocumentBuilderFactory.newInstance();
		    DocumentBuilder builder = factory.newDocumentBuilder();
		    doc = builder.parse(is);	// InputStream 뿐만 아니라, File, String 등 을 받을수 있다.
		    
		    presentation = (Element)doc.getElementsByTagName("office:presentation").item(0);
		    automatic_styles = (Element)doc.getElementsByTagName("office:automatic-styles").item(0);
		    
		    zip.close();
		}
		catch (FactoryConfigurationError e) {
			e.printStackTrace();
		} 
		catch (ParserConfigurationException e) {
			e.printStackTrace();
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		catch ( Exception ex ) {
            ex.printStackTrace();
        }		
	}
	
	public ArrayList<Element> getPages(){
		if(pageList == null){
			pageList = new ArrayList<Element>();
			NodeList lists = presentation.getElementsByTagName("draw:page");		    
			for( int i = 0; i < lists.getLength(); i++ ) {
				Element e = (Element)lists.item(i);
				pageList.add(e);
			}
		}
		
		return pageList;
	}
	
	public Element getPage(String page){
		ArrayList<Element> pages = getPages();
		for(Element e : pages){
			if(page.equals(e.getAttribute("draw:name")))
			    return e;
		}
		return null;
	}
	
	/**
	 * Page 복사.
	 * 
	 * @param page : 복사할 페이지 ex) "page1" or "page2" or ... "page11" or ...
	 * @return : 복사한 Element
	 *  
	 */
	public Element copyPage(String page){
		ArrayList<Element> pages = getPages();
		for(Element e : pages){
			if(page.equals(e.getAttribute("draw:name"))){
				Element el = (Element) e.cloneNode(true);
			    el.setAttribute("draw:name", "page"+(pages.size()+1));
			    ((Element)el.getElementsByTagName("draw:page-thumbnail").item(0)).
			    		setAttribute("draw:page-number", String.valueOf((pages.size()+1)));
			    pages.add(el);
			    presentation.appendChild(el);
			    
			    return el;
			}					
		}
		return null;
	}
	
	public Element copyPage(Element page){
		ArrayList<Element> pages = getPages();
		Element el = (Element) page.cloneNode(true);
		el.setAttribute("draw:name", "page"+(pages.size()+1));
		((Element)el.getElementsByTagName("draw:page-thumbnail").item(0)).
				setAttribute("draw:page-number", String.valueOf((pages.size()+1)));
		pages.add(el);
		presentation.appendChild(el);
		
		return el;
	}
	
	public void deletePage(Element page){
		ArrayList<Element> pages = getPages();
		String pageName = page.getAttribute("draw:name");
		for(Element e : pages){
			if(pageName.equals(e.getAttribute("draw:name"))){				
			    pages.remove(e);			    
			    presentation.removeChild(page);
			    break;
			}
		}
		
		// draw:name, draw:page-thumbnail 속성 재정렬 (page를 나타내는 속성)
		NodeList lists = presentation.getElementsByTagName("draw:page");		    
		for( int i = 0; i < lists.getLength(); i++ ) {
			Element e = (Element)lists.item(i);
			e.setAttribute("draw:name", "page"+(i+1));
			((Element)e.getElementsByTagName("draw:page-thumbnail").item(0)).
					setAttribute("draw:page-number", String.valueOf(i+1));
		}		
	}
	
	private boolean replaceTextBox(Element page, String src, String des){
//		Element textBox = null;
		// 페이지에서 원하는 텍스트 박스 찾기. (CONTENT_BOX를 포함하는 텍스트 박스를 찾는다.)		
		// fix. (080808. 'draw:text-box'만을 찾지 않고 모두를 대상으로 한다.
//		NodeList textBoxs = page.getElementsByTagName("draw:text-box");
		NodeList childs = page.getChildNodes();
    	for( int i = 0; i < childs.getLength(); i++ ) {
    		Element leafElement = getLeafElement((Element)childs.item(i));
    		if(leafElement.getTextContent().equalsIgnoreCase(src)){
    			leafElement.setTextContent(des);
    			return true;
    		}
    	}
    	return false;
    }
	
	/**
	 * 
	 * @param page : page Element..
	 * @param node
	 * @return
	 */
	public boolean convert(Element page, com.okmindmap.model.Node node){
		int deep = 0;
		Element subjectTextBox = null;		
		ArrayList<ContentBox> contentBoxs = new ArrayList<ContentBox>();
		
////////////////////////////////////////////////////////////////////////////////////////////////
// 		페이지에서 원하는 텍스트 박스 찾기. (ODP_CONTENT_BOX, ODP_SUBJECT를 포함하는 텍스트 박스를 찾는다.)
// 		fix. (080808. 'draw:text-box'만을 찾지 않고 모두를 대상으로 한다.
//
//		NodeList textBoxs = page.getElementsByTagName("draw:text-box");
		NodeList childs = page.getChildNodes();
    	for( int i = 0; i < childs.getLength(); i++ ) {
    		Element leafElement = getLeafElement((Element)childs.item(i));
    		
    		if(leafElement.getTextContent().equalsIgnoreCase(ODP_CONTENT_BOX)){
    			// 'contentRoot' 변수는 draw:page Element의 자식중 하나. (draw:frame 혹은  draw:custom-shape 같은 것들)
    			// 'contentBox' 변수는 "text:"로 시작하는 노드들을 모두 포함하는 Element
    			// 즉, 실제 텍스트를 갖는 Element (draw:text-box 혹은 draw:custom-shape 같은 것들)
    			Element contentRoot = null;
    			Element contentBox = null;
        		
    			contentRoot = (Element)childs.item(i);
    			contentBox = contentRoot;
    			while(contentBox.getFirstChild() != null) {
    				if(contentBox.getFirstChild().getNodeName().startsWith("text:"))
    					 break;
    				else
    					contentBox = (Element) contentBox.getFirstChild();
    			}
    	    	
    	    	contentBoxs.add(new ContentBox(contentRoot, contentBox));
    		}

    		// Subject 텍스트 박스
    		if(leafElement.getTextContent().equalsIgnoreCase(ODP_SUBJECT))
    			subjectTextBox = (Element)childs.item(i);
    	}
//
/////////////////////////////////////////////////////////////////////////////////////////////
    	
    	if(subjectTextBox == null || contentBoxs.isEmpty()) return false;
    	
		// 우선 오른쪽의 노드만으로..
    	for( Object nodes : node.getChildren() ){
    		com.okmindmap.model.Node mmNode = (com.okmindmap.model.Node)nodes;
	    	if(mmNode.isLeft())
	    		continue;
	    	
	    	// 제목 텍스트 박스 변경
	    	if(subjectTextBox != null) // 제목 텍스트박스 치환자 찾지 못했을 경우, 무시된다.
	    		getLeafElement(subjectTextBox).setTextContent(mmNode.getPlainTextContent());
	    	
	    	// 컨텐츠 텍스트 박스 변경
	    	if(contentBoxs.size() != 0)
	    		addNodeTextBox(page, contentBoxs.get(0), mmNode, deep);
    	}
    	
    	// 다음 왼쪽의 노드만으로..
    	for( Object nodes : node.getChildren() ){
    		com.okmindmap.model.Node mmNode = (com.okmindmap.model.Node)nodes;
	    	if(!mmNode.isLeft())
	    		continue;

	    	if(subjectTextBox != null)
	    		getLeafElement(subjectTextBox).setTextContent(mmNode.getPlainTextContent());
	    	
	    	if(contentBoxs.size() != 0)
	    		addNodeTextBox(page, contentBoxs.get(0), mmNode, deep);
    	}
    	
    	// 템플렛 페이지 삭제..
    	deletePage(page);
    	
    	return true;
    }
	
	/**
	 * 텍스트 박스안에 node의 내용을 쓴다.
	 * 재귀를 이용하여 자식도 함께 쓴다.
	 * 
	 */
	private void addNodeTextBox(Element page, ContentBox content, com.okmindmap.model.Node node, int deep){
		//////////////////////////////////////////////////////////////////////////
		// 몇몇 조건일 경우. 새로운 페이지 생성.
		// 새로운 페이지 생성에 대해.. 잘 생각해야...
		// 텍스트 박스는 초기의 텍스트 박스(템플렛의 page2에 있는 텍스트 박스)의 레퍼런스로
		// 수정하므로 언제나 같은 텍스트 박스를 수정하게 된다.
		//////////////////////////////////////////////////////////////////////////		
		
		for( Object nodes : node.getChildren() ){
			com.okmindmap.model.Node mmNode = (com.okmindmap.model.Node)nodes;

	    	Element style = null;
	    	// deep이 갖고 있는 스타일 갯수보다 크다면,
	    	// 스타일의 가장 마지막 것으로.
	    	if(content.getStyles().size() > deep) {
	    		style = (Element) content.getStyles().get(deep).cloneNode(true);
	    	} else style = (Element) content.getStyles().get(content.getStyles().size()-1).cloneNode(true);
	    	
	    	// 노드에 하이퍼링크가 걸려 있는 경우.
	    	Element leafNode = getLeafElement(style);
	    	if(mmNode.getLink() != null/* && mmNode.getLink().startsWith("http://")*/){
	    		leafNode.setTextContent("");
	    		Element newEl = doc.createElement("text:a");
	    		newEl.setAttribute("xlink:href", mmNode.getLink());
	    		newEl.setTextContent(mmNode.getPlainTextContent());
	    		leafNode.appendChild(newEl);
	    	}
	    	// 이미지가 걸려 있는 경우.
	    	else if ( (mmNode.getText().indexOf("<img") != -1) && getPage("page3") != null ) {	    		
	    		if( getPage("page3").getElementsByTagName("draw:image").item(0) != null) {
		    		String nodeText = mmNode.getText();		    		
		    		String imgFilePath = "";
		    		String imgName = "";
		    		String imgSrcPath = "";
		    		
		    		int s = nodeText.indexOf("<img");
		    		s = nodeText.indexOf("\"", s)+1;
		    		int e = nodeText.indexOf("\"", s);
		    		imgSrcPath = nodeText.substring(s, e);
		    		
		    		if(imgSrcPath.indexOf("http://") != -1) {
		    			try {
		    				String ext = imgSrcPath.substring(imgSrcPath.lastIndexOf("."));
			    			// get a temp file
			    			File imgSrcFile = File.createTempFile("odpImgTemp", ext);
			    	        // delete it, otherwise you cannot rename your existing file to it.
			    			imgSrcFile.delete();
		    				
		    				InputStream is = new URL(imgSrcPath).openStream();
		    				FileOutputStream fos = new FileOutputStream(imgSrcFile);
		    				int len = 0;
		    				byte[] data = new byte[4096];
		    				while((len = is.read(data)) != -1){
		    					fos.write(data, 0, len);
		    				}		    				
		    				is.close();
		    				fos.close();
		    				
		    				imgFilePath = imgSrcFile.getAbsolutePath();
		    			} catch (IOException ex) {
		    				ex.printStackTrace();
		    			}
		    		}
		    		else imgFilePath = imgSrcPath.replaceAll("file:[\\/]*", "");
		    		
//		    		if(imgFilePath.indexOf(":") == -1 )
//		    			imgFilePath = getCanonicalPath(imgFilePath, getController().getMap().getFile().getParent()).replaceAll("%20", " ");
		    		
		    		// 이미지 파일정보를 갖고 있다가 나중에 odp파일을 만들 때, 같이 넣는다.		    		
		    		File imgFile = new File(imgFilePath);
		    		if(imgFile.exists()){
		    			Element img_page = copyPage(getPage("page3"));
		    			
			    		s = nodeText.lastIndexOf(".", e);
			    		String ext = nodeText.substring(s, e);
			    		imgName = new VMID().toString().replaceAll("[:-]", "") + ext;
			    		
			    		Element img_element = (Element) img_page.getElementsByTagName("draw:image").item(0);
			    		img_element.setAttribute("xlink:href", "Pictures/"+imgName);
			    		
			    		imgFiles.put(imgName, imgFile);
		    		}
	    		}
	    	}
	    	else leafNode.setTextContent(mmNode.getPlainTextContent());

	    	boolean lineFull = content.addContent(style, deep, true);//.getContentTextBox().appendChild(style);
	    	if(!lineFull){
	    		copyPage(page);
	    		// 텍스트 박스 내용 삭제
	    		content.cleanTextBox();
	    		content.addContent(style, deep, false);
	    	}
	    	
    		if(mmNode.hasChildren())
    			addNodeTextBox(page, content, mmNode, deep+1);
    		
		}
		
		///////////////////////////////////////////
		// 새로운 Subject로 변경될 때는 새로운 페이지로. 
		if(deep == 0){
			copyPage(page);
			// 텍스트 박스 내용 삭제
			content.cleanTextBox();
		}
		///////////////////////////////////////////
		
	}
	

	public String getCanonicalPath(String relative, String base) {
        String canonicalPath = null;

        File relativeFile = new File(relative);
        if(relativeFile.isAbsolute()) {
            canonicalPath = relativeFile.getAbsolutePath();
        } else {
            File canonicalFile = new File(base, relative);

            try {
                canonicalPath = canonicalFile.getCanonicalPath();
            } catch(IOException e) {
                e.printStackTrace();
            }
        }

        return canonicalPath;
    }

	
	/**
	 * 마지막 Element를 찾는다
	 * @param e
	 * @return
	 */
	public Element getLeafElement(Element e){
		// Node를 무조건 Element로 캐스팅하면 안된다.
		// Node에는 Element도 있지만, Text, Document, Entity ... 등등 많다.
		// fix. 위의 내용 해결..
		if(e.hasChildNodes()
				&& e.getFirstChild() instanceof Element)
			return getLeafElement((Element)e.getFirstChild());
		return e;

	}

	public void write(OutputStream out){
//	    try {
//	    	ByteArrayOutputStream baos = transform(doc);
//			addStreamToExistingZip(file, baos, "content.xml");
			// 이미지 파일 등록
//			if(imgFiles.size() != 0)
//				addFilesToExistingZip(file, imgFiles, "Pictures");
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
	}
	
	public ByteArrayOutputStream transform(Document doc) {
		ByteArrayOutputStream baos = null;
        try {
        	Transformer transformer = TransformerFactory.newInstance()
                .newTransformer();
//            transformer.setOutputProperty(OutputKeys.METHOD, "xml");
//            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
//            transformer.setOutputProperty(OutputKeys.DOCTYPE_SYSTEM,
//                "nk_input_data.dtd");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            DOMSource domsrc = new DOMSource(doc);
//            FileOutputStream fos = new FileOutputStream(file);
            baos = new ByteArrayOutputStream();
            transformer.transform(domsrc, new StreamResult(baos));

            baos.flush();
            baos.close();

        } catch (TransformerException e) {
        	e.printStackTrace();
        } catch (IOException e) {
        	e.printStackTrace();
        }
		
        return baos;
    }
	
	/**
	 * 이미 존재하는 압축파일에 OutputStream을
	 * fileName 이름으로 추가한다.
	 *  
	 * @param zipFile : 압축파일
	 * @param os : ByteArrayOutputStream
	 * @param fileName : 압축 파일에 추가될때 이름
	 * @throws IOException
	 */
	public void addStreamToExistingZip(File zipFile, ByteArrayOutputStream os, String fileName) throws IOException {
		// get a temp file
		File tempFile = File.createTempFile(zipFile.getName(), null);
        // delete it, otherwise you cannot rename your existing zip to it.
		tempFile.delete();

		boolean renameOk=zipFile.renameTo(tempFile);
		if (!renameOk)
		{
			throw new RuntimeException("could not rename the file "+zipFile.getAbsolutePath()+" to "+tempFile.getAbsolutePath());
		}
		byte[] buf = new byte[1024];
		
		ZipInputStream zin = new ZipInputStream(new FileInputStream(tempFile));
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
		
		// 기존의 압축 파일들을 넣는다.
		// 단, 새로 추가되는 압축파일과 같은 이름일 경우 제외 한다.
		ZipEntry entry = zin.getNextEntry();
		while (entry != null) {
			String name = entry.getName();
			boolean notInFiles = true;
			if (fileName.equals(name)) {
				notInFiles = false;				
			}
			if (notInFiles) {
				// Add ZIP entry to output stream.
				out.putNextEntry(new ZipEntry(name));
				// Transfer bytes from the ZIP file to the output file
				int len;
				while ((len = zin.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}
			entry = zin.getNextEntry();
		}
		// Close the streams // 기존 파일 추가 끝.
		zin.close();
		
		// 새로 추가되는 압축파일을 넣는다.
		// Add ZIP entry to output stream.
		out.putNextEntry(new ZipEntry(fileName));
		// Transfer bytes from the file to the ZIP file		
		out.write(os.toByteArray(), 0, os.size());
		
		// Complete the entry
		out.closeEntry();	
	
		// Complete the ZIP file
		out.close();
		tempFile.delete();
	}

	/**
	 * 이미 존재하는 압축파일에 또다른 파일들을 추가한다.
	 * @param zipFile : 압축파일
	 * @param files : 압축파일에 추가할 파일들
	 * @throws IOException
	 */
	public void addFilesToExistingZip(File zipFile, Hashtable<String, File> imgFiles, String relative) throws IOException {
		// get a temp file
		File tempFile = File.createTempFile(zipFile.getName(), null);
        // delete it, otherwise you cannot rename your existing zip to it.
		tempFile.delete();

		boolean renameOk=zipFile.renameTo(tempFile);
		if (!renameOk)
		{
			throw new RuntimeException("could not rename the file "+zipFile.getAbsolutePath()+" to "+tempFile.getAbsolutePath());
		}
		byte[] buf = new byte[1024];
		
		ZipInputStream zin = new ZipInputStream(new FileInputStream(tempFile));
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
		
		// 기존의 압축 파일들을 넣는다.
		// 단, 새로 추가되는 압축파일과 같은 이름일 경우 제외 한다.
		ZipEntry entry = zin.getNextEntry();
		while (entry != null) {
			String name = entry.getName();
			boolean notInFiles = true;
			for (File f : imgFiles.values()) {
				if (f.getName().equals(name)) {
					notInFiles = false;
					break;
				}
			}
			if (notInFiles) {
				// Add ZIP entry to output stream.
				out.putNextEntry(new ZipEntry(name));
				// Transfer bytes from the ZIP file to the output file
				int len;
				while ((len = zin.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}
			entry = zin.getNextEntry();
		}
		// Close the streams // 기존 파일 추가 끝.
		zin.close();
		
		// 새로 추가되는 압축파일을 넣는다.
		// Compress the files
		
		Enumeration<String> keys = null;
		for( keys = imgFiles.keys(); keys.hasMoreElements(); ) {
			String key = keys.nextElement();
			InputStream in = new FileInputStream(imgFiles.get(key));
			// Add ZIP entry to output stream.
			out.putNextEntry(new ZipEntry(relative + "/" + key));
			// Transfer bytes from the file to the ZIP file
			int len;
			while ((len = in.read(buf)) > 0) {
				out.write(buf, 0, len);
			}
			// Complete the entry
			out.closeEntry();
			in.close();
		}	
//		for (int i = 0; i < files.length; i++) {
//			InputStream in = new FileInputStream(files[i]);
//			// Add ZIP entry to output stream.
//			out.putNextEntry(new ZipEntry(relative+"/"+files[i].getName()));
//			// Transfer bytes from the file to the ZIP file
//			int len;
//			while ((len = in.read(buf)) > 0) {
//				out.write(buf, 0, len);
//			}
//			// Complete the entry
//			out.closeEntry();
//			in.close();
//		}
		// Complete the ZIP file
		out.close();
		tempFile.delete();
	}

	public String getFileNameWithoutExtension(String fileName) {		
		int i = fileName.lastIndexOf('.');
		if(i > 0 && i < fileName.length() - 1) {
		    return fileName.substring(0, i);
		}
		else {
		    return fileName;
		}
	}
	
	public void copyFile(File srcFile, File destFile) throws IOException {
	    if(srcFile.equals(destFile)) {
	        throw new IOException("Source and Target Files cannot be the same");
	    }
	    
	    int bufSize = 1024;
	    byte[] buf = new byte[bufSize];
	    BufferedInputStream bis = new BufferedInputStream(new FileInputStream(srcFile), bufSize);
	    BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(destFile), bufSize);
	    int size;
	    while((size = bis.read(buf)) != -1) bos.write(buf, 0, size);
	    bos.flush();
	    bos.close();
	    bis.close();
	}
	
//	private void ErrorMsg(){
//		JOptionPane.showMessageDialog(getController().getFrame().getContentPane(),
//				"Fail to Convert", "Export to ODP", JOptionPane.ERROR_MESSAGE);
//	}
	
	
	class ContentBox {
		private Element contentRoot = null;
		private Element contentBox = null;		
		private ArrayList<Element> styles = new ArrayList<Element>();
		private double curHeight = 0;
		
		ContentBox(Element contentRoot, Element contentBox){
			this.contentRoot = contentRoot;
			this.contentBox = contentBox;
			
			// 텍스트 박스안에 있는 스타일 (글머리) 저장 / 텍스트 박스 내용 삭제..
	    	if(contentBox != null){
	    		NodeList styleChilds = contentBox.getChildNodes();
	    		// 스타일 복사
	        	for( int it = 0; it < styleChilds.getLength(); it++ ) {
	        		if( styleChilds.item(it) instanceof Element)
	        			styles.add((Element)styleChilds.item(it).cloneNode(true));        		
	        	}
	        	// 내용 삭제
	        	cleanTextBox();        	
	    	}
		}
		
		public Element getContentTextBox(){ return contentBox; }
		public void setContentTextBox(Element contentBox){ this.contentBox = contentBox; }
		public ArrayList<Element> getStyles() { return styles; }
		public void setStyles(ArrayList<Element> styles) { this.styles = styles; }
		
		public void cleanTextBox(){
			while( contentBox.hasChildNodes() ){
				contentBox.removeChild(contentBox.getFirstChild());
        	}
			currentHeightReset();
		}
		
		/**
		 * 
		 * @param style
		 * @param deep
		 * @param check
		 * @return
		 * 
		 * 박스크기를 체크한다.
		 * true이면 들어갈 내용에 대해 박스크기를 체크해서 넘어간다면 true를 리턴한다.
		 * 그리고 박스에 내용을 쓰지 않는다.
		 * 결국 true를 리턴한다면.. 박스의 내용을 지우고 다시 addContent 든지,
		 * check 인자를 false로 해서 다시 addContent를 불러야 한다. (이경우 박스를 넘기게 된다.)
		 * false이면 내용을 무조건 박스에 넣게된다.
		 */
		public boolean addContent(Element style, int deep, boolean check){
			
			///////////////////////////////////
			// 박스안에 문장일 들어갈수 있는지 계산
			///////////////////////////////////
			
			String st = "";
			Element textSpan = (Element) style.getElementsByTagName("text:span").item(0);			
			if(textSpan != null)
				st = textSpan.getAttribute("text:style-name");
			
			Font ft = null;
			if(st != ""){
				NodeList lists = automatic_styles.getChildNodes();
				for( int i = 0; i < lists.getLength(); i++ ) {				
					Element e = (Element)lists.item(i);
					if(e.getAttribute("style:name").equals(st)){					
						String fontSizeAsian = ((Element)e.getFirstChild()).getAttribute("style:font-size-asian");
						if(!fontSizeAsian.equals("")){
							int pt = Integer.parseInt( fontSizeAsian.substring(0, fontSizeAsian.length()-2) );
							ft = new Font(((Element)e.getFirstChild()).getAttribute("style:font-family-asian"), Font.PLAIN, pt);
						}
						break;
					}
				}
			}
			
			if(ft == null) ft = new Font("굴림", Font.PLAIN, 18);
			
			Rectangle2D r =  ft.getStringBounds(style.getTextContent(), new FontRenderContext(new AffineTransform(), false, false));
			// 폰트의 넓이와 높이를 Cm로 변경
			// TODO 머리글이 있을 경우에.. 넓이를 계산 해야 한다.. 임의로 " + ((0.7*(deep+1))*2.54/72) "
			double width = (r.getWidth()*2.54/72) + ((0.7*(deep+1))*2.54/72);
			// TODO 높이를 조금 높게 하면 더 좋아 보인다. 정확한 높이를 찾아 내야 한다.
			double height = (r.getHeight()*2.54/72) + ((r.getHeight()*2.54/72)*0.2);
			int line = (int) ((width / getWidth())+1);
			addHeight(line*height);
			
			// 박스 높이 조사
			if(check)
				if(getHeight() < currentHeight()) return false;
			
			// 내용 추가
			contentBox.appendChild(style);
			
			return true;
			
		}
		
		public float getWidth(){
			return Float.parseFloat(
			contentRoot.getAttribute("svg:width")
				.substring(0, contentRoot.getAttribute("svg:width").length() - 2));
		}
		
		public float getHeight(){
			return Float.parseFloat(
					contentRoot.getAttribute("svg:height")
						.substring(0, contentRoot.getAttribute("svg:height").length() - 2));
		}
		
		public double currentHeight(){
			return curHeight;
		}
		
		public void addHeight(double height){
			curHeight+=height;
		}
		
		public void currentHeightReset(){
			curHeight = 0;
		}
		
	}
}
