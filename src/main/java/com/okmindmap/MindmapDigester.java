package com.okmindmap;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.io.StringReader;

import org.apache.commons.digester.Digester;
import org.apache.commons.digester.SetPropertiesRule;
import org.apache.log4j.Logger;

import com.okmindmap.model.ArrowLink;
import com.okmindmap.model.Attribute;
import com.okmindmap.model.Cloud;
import com.okmindmap.model.Edge;
import com.okmindmap.model.Font;
import com.okmindmap.model.ForeignObject;
import com.okmindmap.model.Icon;
import com.okmindmap.model.Map;
import com.okmindmap.model.Node;
import com.okmindmap.model.RichContent;

public class MindmapDigester {
	static Logger logger = Logger.getLogger(MindmapDigester.class);
	
	public static Map parseMap(String xml) throws Exception {
		return parseMap(new StringReader(xml));
	}
	
	public static Map parseMap(File file) throws Exception {
		return parseMap(new FileReader(file));
	}
	
//	public static Map parseMap(InputStream in) throws Exception {
//		return parseMap(new InputStreamReader(in));
//	}
	
	public static Map parseMap(Reader in) throws Exception {
		// add <![CDATA[ ]]> to html tag
		StringBuffer buffer = new StringBuffer();
		char[] data = new char[4096];
		for(int l = in.read(data); l > 0; l = in.read(data)) {
			buffer.append(new String(data, 0, l));
		}
		
		String str = buffer.toString();
		
		
//		System.out.println(str);
//		System.out.println("===================");
		
		str = str.replaceAll("<html>", "<![CDATA[\n<html>");
		str = str.replaceAll("</html>", "</html>\n]]>");
		
		//str = str.replaceAll("<foreignObject( WIDTH=\"[0-9]*\" HEIGHT=\"[0-9]*\")\">", "<foreignObject$1\">\n<![CDATA[\n");
		str = str.replaceAll("<foreignObject([^>]*)\">", "<foreignObject$1\">\n<![CDATA[\n");
		str = str.replaceAll("</foreignObject>", "\n]]>\n</foreignObject>");		
		
//		logger.info(str);
//		System.out.println(str);
//		System.out.println("===================");
		
		Digester digester = new Digester();
		digester.setValidating(false);
		
		digester.addObjectCreate("map", Map.class);
		SetPropertiesRule propertiesRuleMap = new SetPropertiesRule();
		propertiesRuleMap.addAlias("version", "version");
		propertiesRuleMap.addAlias("created", "created");
		
		digester.addRule("map", propertiesRuleMap);
		
		addNodeCreate(digester);
		
		Map map = (Map)digester.parse(new StringReader(str));
		
		return map;
	}
	
	public static Node parseNode(String xml) throws Exception {
		Digester digester = new Digester();
		digester.setValidating(false);
		
		digester.addObjectCreate("node", Node.class);
		digester.addRule("node", getNodeSetPropertiesRule());
		
		addArrowLineCreate(digester);
		addAttributeCreate(digester);
		addCloudCreate(digester);
		addEdgeCreate(digester);
		addFontCreate(digester);
//		addHookCreate(digester);
		addIconCreate(digester);
		addRichContentCreate(digester);
		addForeignObjectCreate(digester);
		
		return (Node)digester.parse(new ByteArrayInputStream(xml.getBytes()));
	}
	
//	public static Html parseHtml(String html) throws Exception {
//		Digester digester = new Digester();
//		digester.setValidating(false);
//		
//		digester.addObjectCreate("html", Html.class);
//		digester.addObjectCreate("html/head", Head.class);
//		digester.addSetNext("html/head", "setHead");
//		
//		digester.addObjectCreate("html/body", Body.class);
//		digester.addSetNext("html/body", "setBody");
//		
//		digester.addObjectCreate("html/body/img", Image.class);
//		digester.addSetProperties("html/body/img", "src", "src" );
//		digester.addSetNext("html/body/img", "addImage");
//		
//		digester.addObjectCreate("html/body/p", Paragraph.class);
//		digester.addCallMethod("html/body/p", "setText", 0);
//		digester.addSetNext("html/body/p", "addParagraph");
//		
//		return (Html)digester.parse(new ByteArrayInputStream(html.getBytes()));
//	}
	
	private static void addNodeCreate(Digester digester) {
		digester.addObjectCreate("*/node", Node.class);
		digester.addRule("*/node", getNodeSetPropertiesRule());
		digester.addSetNext("*/node", "addChild");
		
		addArrowLineCreate(digester);
		addAttributeCreate(digester);
		addCloudCreate(digester);
		addEdgeCreate(digester);
		addFontCreate(digester);
//		addHookCreate(digester);
		addIconCreate(digester);
		addRichContentCreate(digester);
		addForeignObjectCreate(digester);
	}
	
	private static SetPropertiesRule getNodeSetPropertiesRule() {
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("BACKGROUND_COLOR", "backgroundColor");
		propertiesRule.addAlias("COLOR", "color");
		propertiesRule.addAlias("FOLDED", "folded");
		propertiesRule.addAlias("ID", "identity");
		propertiesRule.addAlias("LINK", "link");
		propertiesRule.addAlias("POSITION", "position");
		propertiesRule.addAlias("STYLE", "style");
		propertiesRule.addAlias("TEXT", "text");
		propertiesRule.addAlias("CREATED", "created");
		propertiesRule.addAlias("MODIFIED", "modified");
		propertiesRule.addAlias("HGAP", "hGap");
		propertiesRule.addAlias("VGAP", "vGap");
		propertiesRule.addAlias("VSHIFT", "vShift");
		propertiesRule.addAlias("ENCRYPTED_CONTENT", "encryptedContent");
		
		propertiesRule.addAlias("CREATOR", "creator");
		propertiesRule.addAlias("CREATOR_IP", "creatorIP");
		propertiesRule.addAlias("MODIFIER", "modifier");
		propertiesRule.addAlias("MODIFIER_IP", "modifierIP");
		propertiesRule.addAlias("NODE_TYPE", "nodeType");
		propertiesRule.addAlias("EXTRA_DATA", "extraData");
		propertiesRule.addAlias("DBID", "id");
		
		return propertiesRule;
	}
	
	private static void addArrowLineCreate(Digester digester) {
		digester.addObjectCreate("*/node/arrowlink", ArrowLink.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("COLOR", "color");
		propertiesRule.addAlias("DESTINATION", "destination");
		propertiesRule.addAlias("ENDARROW", "endArrow");
		propertiesRule.addAlias("ENDINCLINATION", "endInclination");
		propertiesRule.addAlias("ID", "identity");
		propertiesRule.addAlias("STARTARROW", "startArrow");
		propertiesRule.addAlias("STARTINCLINATION", "startInclination");
		digester.addRule("*/node/arrowlink", propertiesRule);
		digester.addSetNext("*/node/arrowlink", "addArrowLink");
	}
	
	private static void addAttributeCreate(Digester digester) {
		digester.addObjectCreate("*/node/attribute", Attribute.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("NAME", "name");
		propertiesRule.addAlias("VALUE", "value");
		digester.addRule("*/node/attribute", propertiesRule);
		digester.addSetNext("*/node/attribute", "addAttribute");
	}
	
	private static void addCloudCreate(Digester digester) {
		digester.addObjectCreate("*/node/cloud", Cloud.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("COLOR", "color");
		digester.addRule("*/node/cloud", propertiesRule);
		digester.addSetNext("*/node/cloud", "setCloud");
	}
	
	private static void addEdgeCreate(Digester digester) {
		digester.addObjectCreate("*/node/edge", Edge.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("COLOR", "color");
		propertiesRule.addAlias("STYLE", "style");
		propertiesRule.addAlias("WIDTH", "width");
		digester.addRule("*/node/edge", propertiesRule);
		digester.addSetNext("*/node/edge", "setEdge");
	}
	
	private static void addFontCreate(Digester digester) {
		digester.addObjectCreate("*/node/font", Font.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("BOLD", "bold");
		propertiesRule.addAlias("ITALIC", "italic");
		propertiesRule.addAlias("NAME", "name");
		propertiesRule.addAlias("SIZE", "size");
		digester.addRule("*/node/font", propertiesRule);
		digester.addSetNext("*/node/font", "setFont");
	}
	
	private static void addIconCreate(Digester digester) {
		digester.addObjectCreate("*/node/icon", Icon.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("BUILTIN", "builtin");
		digester.addRule("*/node/icon", propertiesRule);
		digester.addSetNext("*/node/icon", "addIcon");
	}
	
	private static void addRichContentCreate(Digester digester) {
		digester.addObjectCreate("*/node/richcontent", RichContent.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("TYPE", "type");
		digester.addRule("*/node/richcontent", propertiesRule);
		
		digester.addCallMethod("*/node/richcontent", "setContent", 0);
		
		digester.addSetNext("*/node/richcontent", "setRichContent");
	}
	
	private static void addForeignObjectCreate(Digester digester) {
		digester.addObjectCreate("*/node/foreignObject", ForeignObject.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("WIDTH", "width");
		propertiesRule.addAlias("HEIGHT", "height");
		digester.addRule("*/node/foreignObject", propertiesRule);
		
		digester.addCallMethod("*/node/foreignObject", "setContent", 0);
		
		digester.addSetNext("*/node/foreignObject", "setForeignObject");
	}
}
