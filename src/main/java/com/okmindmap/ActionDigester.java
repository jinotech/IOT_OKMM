package com.okmindmap;

/**
 * 아래와 같은 xml 형태의 action을 Java 객체(com.okmindmap.action.Action)로 파싱한다.
 * <{new|move|delete|edit} mapid="{mapid}" [attributes]>
 *    <node ...>...</node>
 * </{new|move|delete|edit}>
 * 
 * 실시간 저장시 client의 요청을 Action 객체로 파싱하기 위해 사용한다.
 */

import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.io.StringReader;

import org.apache.commons.digester.Digester;
import org.apache.commons.digester.SetPropertiesRule;

import com.okmindmap.action.Action;
import com.okmindmap.action.DeleteAction;
import com.okmindmap.action.EditAction;
import com.okmindmap.action.MoveAction;
import com.okmindmap.action.NewAction;
import com.okmindmap.model.ArrowLink;
import com.okmindmap.model.Attribute;
import com.okmindmap.model.Cloud;
import com.okmindmap.model.Edge;
import com.okmindmap.model.Font;
import com.okmindmap.model.ForeignObject;
import com.okmindmap.model.Icon;
import com.okmindmap.model.Node;
import com.okmindmap.model.RichContent;

public class ActionDigester {
	public static Action parseAction(String xml) throws Exception {
		return parseAction(new StringReader(xml));
	}
	
	public static Action parseAction(File file) throws Exception {
		return parseAction(new FileReader(file));
	}
	
	/**
	 * client의 save 요청(xml)을 파싱해서 Action 객체를 반환한다.
	 */
	public static Action parseAction(Reader in) throws Exception {
		StringBuffer buffer = new StringBuffer();
		char[] data = new char[4096];
		for(int l = in.read(data); l > 0; l = in.read(data)) {
			buffer.append(new String(data, 0, l));
		}
		
		String str = buffer.toString();
		
		// richconent와 foreignObject의 내용을 텍스트로 처리하기 위해
		// CDATA 를 붙여준다.
		str = str.replaceAll("<html>", "<![CDATA[\n<html>");
		str = str.replaceAll("</html>", "</html>\n]]>");
		
		str = str.replaceAll("<foreignObject([^>]*)\">", "<foreignObject$1\">\n<![CDATA[\n");
		str = str.replaceAll("</foreignObject>", "\n]]>\n</foreignObject>");		
		
		Digester digester = new Digester();
		digester.setValidating(false);

		SetPropertiesRule propertiesRuleMap = new SetPropertiesRule();
		propertiesRuleMap.addAlias("mapid", "mapId");
		
		// action에 따라 첫 노드가 달라지므로 action 값을 가져와서 처리한다.
		// 현재 substring을 사용하지만 정규표현식을 이용할 수도 있을 것 같다.
		String action = str.substring(1, str.indexOf(" "));
		if(Action.NEW.equalsIgnoreCase(action)) {
			digester.addObjectCreate(action, NewAction.class);
			propertiesRuleMap.addAlias("parent", "parent");
			propertiesRuleMap.addAlias("next", "next");
		} else if(Action.EDIT.equalsIgnoreCase(action)) {
			digester.addObjectCreate(action, EditAction.class);
		} else if(Action.DELETE.equalsIgnoreCase(action)) {
			digester.addObjectCreate(action, DeleteAction.class);
		} else if(Action.MOVE.equalsIgnoreCase(action)) {
			digester.addObjectCreate(action, MoveAction.class);
			propertiesRuleMap.addAlias("parent", "parent");
			propertiesRuleMap.addAlias("next", "next");
		} else {
			System.out.println("error");
		}
		
		digester.addRule(action, propertiesRuleMap);
		addNodeCreate(digester, action);
		
		return (Action)digester.parse(new StringReader(str));
	}
	
	
	// {action}/node 처리
	private static void addNodeCreate(Digester digester, String action) {
		digester.addObjectCreate(action + "/node", Node.class);
		digester.addRule(action + "/node", getNodeSetPropertiesRule());
		digester.addSetNext(action + "/node", "setNode");
		
		addArrowLineCreate(digester, "");
		addAttributeCreate(digester, "");
		addCloudCreate(digester, "");
		addEdgeCreate(digester, "");
		addFontCreate(digester, "");
//		addHookCreate(digester);
		addIconCreate(digester, "");
		addRichContentCreate(digester, "");
		addForeignObjectCreate(digester, "");
		
		addChildNodeCreate(digester);
	}
	
	// node/node 처리
	private static void addChildNodeCreate(Digester digester) {
		digester.addObjectCreate("*/node/node", Node.class);
		digester.addRule("*/node/node", getNodeSetPropertiesRule());
		digester.addSetNext("*/node/node", "addChild");
		
		// node/node 는 "/node" 를 넘겨줘야 한다.
		addArrowLineCreate(digester, "/node");
		addAttributeCreate(digester, "/node");
		addCloudCreate(digester, "/node");
		addEdgeCreate(digester, "/node");
		addFontCreate(digester, "/node");
//		addHookCreate(digester, "/node");
		addIconCreate(digester, "/node");
		addRichContentCreate(digester, "/node");
		addForeignObjectCreate(digester, "/node");
		
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
	
	// {action}/node 와 node/node 를 구분해서 처리하기 위해 str를 더 받는다.
	// 아래 있는 private 메소드들도 마찬가지...
	private static void addArrowLineCreate(Digester digester, String str) {
		digester.addObjectCreate("*" + str + "/node/arrowlink", ArrowLink.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("COLOR", "color");
		propertiesRule.addAlias("DESTINATION", "destination");
		propertiesRule.addAlias("ENDARROW", "endArrow");
		propertiesRule.addAlias("ENDINCLINATION", "endInclination");
		propertiesRule.addAlias("ID", "identity");
		propertiesRule.addAlias("STARTARROW", "startArrow");
		propertiesRule.addAlias("STARTINCLINATION", "startInclination");
		digester.addRule("*" + str + "/node/arrowlink", propertiesRule);
		digester.addSetNext("*" + str + "/node/arrowlink", "addArrowLink");
	}
	
	private static void addAttributeCreate(Digester digester, String str) {
		digester.addObjectCreate("*" + str + "/node/attribute", Attribute.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("NAME", "name");
		propertiesRule.addAlias("VALUE", "value");
		digester.addRule("*" + str + "/node/attribute", propertiesRule);
		digester.addSetNext("*" + str + "/node/attribute", "addAttribute");
	}
	
	private static void addCloudCreate(Digester digester, String str) {
		digester.addObjectCreate("*" + str + "/node/cloud", Cloud.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("COLOR", "color");
		digester.addRule("*" + str + "/node/cloud", propertiesRule);
		digester.addSetNext("*" + str + "/node/cloud", "setCloud");
	}
	
	private static void addEdgeCreate(Digester digester, String str) {
		digester.addObjectCreate("*" + str + "/node/edge", Edge.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("COLOR", "color");
		propertiesRule.addAlias("STYLE", "style");
		propertiesRule.addAlias("WIDTH", "width");
		digester.addRule("*" + str + "/node/edge", propertiesRule);
		digester.addSetNext("*" + str + "/node/edge", "setEdge");
	}
	
	private static void addFontCreate(Digester digester, String str) {
		digester.addObjectCreate("*" + str + "/node/font", Font.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("BOLD", "bold");
		propertiesRule.addAlias("ITALIC", "italic");
		propertiesRule.addAlias("NAME", "name");
		propertiesRule.addAlias("SIZE", "size");
		digester.addRule("*" + str + "/node/font", propertiesRule);
		digester.addSetNext("*" + str + "/node/font", "setFont");
	}
	
	private static void addIconCreate(Digester digester, String str) {
		digester.addObjectCreate("*" + str + "/node/icon", Icon.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("BUILTIN", "builtin");
		digester.addRule("*" + str + "/node/icon", propertiesRule);
		digester.addSetNext("*" + str + "/node/icon", "addIcon");
	}
	
	private static void addRichContentCreate(Digester digester, String str) {
		digester.addObjectCreate("*" + str + "/node/richcontent", RichContent.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("TYPE", "type");
		digester.addRule("*" + str + "/node/richcontent", propertiesRule);
		
		digester.addCallMethod("*" + str + "/node/richcontent", "setContent", 0);
		
		digester.addSetNext("*" + str + "/node/richcontent", "setRichContent");
	}
	
	private static void addForeignObjectCreate(Digester digester, String str) {
		digester.addObjectCreate("*" + str + "/node/foreignObject", ForeignObject.class);
		SetPropertiesRule propertiesRule = new SetPropertiesRule();
		propertiesRule.addAlias("WIDTH", "width");
		propertiesRule.addAlias("HEIGHT", "height");
		digester.addRule("*" + str + "/node/foreignObject", propertiesRule);
		
		digester.addCallMethod("*" + str + "/node/foreignObject", "setContent", 0);
		
		digester.addSetNext("*" + str + "/node/foreignObject", "setForeignObject");
	}
}
