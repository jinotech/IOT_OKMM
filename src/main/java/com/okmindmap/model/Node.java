package com.okmindmap.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.okmindmap.util.HtmlTools;


public class Node implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7685387210378561638L;
	
	public static final String POSITION_LEFT  = "left";
	public static final String POSITION_RIGHT = "right";
	
	private List<ArrowLink> arrowLinks;
	private List<Attribute> attributes;
	private Cloud cloud;
	private Edge edge;
	private Font font;
	private List<Hook> hooks;
	private List<Icon> icons;
	private List<Node> children;
	private RichContent richContent;
	private ForeignObject foreignObject;
	private String backgroundColor;
	private String color;
	private String folded;
	private String identity;
	private String link;
	private String position;
	private String style;
	private String text;
	//구글 검색을 위하여 추가함 text는 xml사용을 위하여 인코딩이 되어 있어서.. 다시 디코드 하느니... 새로 만듦
	
	private String originText;
	
	private long created;
	private long modified;
	private String hGap;
	private String vGap;
	private String vShift;
	private String encryptedContent;
	
	// db
	private int id;
	private int lft;
	private int rgt;
	private int parentId;
	private int mapId;
	
	private String nodeType;
	private long creator = 0;
	private String creatorIP;
	private long modifier = 0;
	private String modifierIP;
	
	// lazy loading을 할 때 자식이 있는지 여부를 클라이언트가 알게 하기 위해 
	// 자식의 갯수를 함께 보내주기 위해 추가
	private int numOfChildren = 0;
	
	private String extraData;
	
	private Node parent = null;

	private String clientId;
	
	private String line_color;
	
	
	
	public String getLine_color() {
		return line_color;
	}


	public void setLine_color(String line_color) {
		this.line_color = line_color;
	}


	public Node() {
		hooks = new ArrayList<Hook>();
		icons = new ArrayList<Icon>();
		children = new ArrayList<Node>();
		arrowLinks = new ArrayList<ArrowLink>();
		attributes = new ArrayList<Attribute>();
	}
	
	
	public String getOriginText() {
		return originText;
	}


	public void setOriginText(String originText) {
		this.originText = originText;
	}


	public List<ArrowLink> getArrowLinks() {
		return arrowLinks;
	}
	public void setArrowLinks(List<ArrowLink> arrowlinks) {
		this.arrowLinks = arrowlinks;
	}
	public void setAttributes(List<Attribute> attributes) {
		this.attributes = attributes;
	}
	public List<Attribute> getAttributes() {
		return attributes;
	}
	public Cloud getCloud() {
		return cloud;
	}
	public void setCloud(Cloud cloud) {
		this.cloud = cloud;
	}
	public Edge getEdge() {
		return edge;
	}
	public void setEdge(Edge edge) {
		this.edge = edge;
	}
	public Font getFont() {
		return font;
	}
	public void setFont(Font font) {
		this.font = font;
	}
	public List<Hook> getHooks() {
		return hooks;
	}
	public void setHooks(List<Hook> hooks) {
		this.hooks = hooks;
	}
	public List<Icon> getIcons() {
		return icons;
	}
	public void setIcons(List<Icon> icons) {
		this.icons = icons;
	}
	public List<Node> getChildren() {
		return children;
	}
	public void setChildren(List<Node> children) {
		this.children = children;
	}
	public RichContent getRichContent() {
		return richContent;
	}
	public void setRichContent(RichContent richContent) {
		this.richContent = richContent;
	}
	public ForeignObject getForeignObject() {
		return foreignObject;
	}
	public void setForeignObject(ForeignObject foreignObject) {
		this.foreignObject = foreignObject;
	}
	public String getBackgroundColor() {
		return backgroundColor;
	}
	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getFolded() {
		return folded;
	}
	public void setFolded(String folded) {
		this.folded = folded;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}
	public String getStyle() {
		return style;
	}
	public void setStyle(String style) {
		this.style = style;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public long getCreated() {
		return created;
	}
	public void setCreated(long created) {
		this.created = created;
	}
	public long getModified() {
		return modified;
	}
	public void setModified(long modified) {
		this.modified = modified;
	}
	public String gethGap() {
		return hGap;
	}
	public void sethGap(String hGap) {
		this.hGap = hGap;
	}
	public String getvGap() {
		return vGap;
	}
	public void setvGap(String vGap) {
		this.vGap = vGap;
	}
	public String getvShift() {
		return vShift;
	}
	public void setvShift(String vShift) {
		this.vShift = vShift;
	}
	public String getEncryptedContent() {
		return encryptedContent;
	}
	public void setEncryptedContent(String encryptedContent) {
		this.encryptedContent = encryptedContent;
	}
	
	public void addChild(Node child) {
		child.setParent(this);
		
		this.children.add(child);
	}
	public void addArrowLink(ArrowLink arrowLink) {
		this.arrowLinks.add(arrowLink);
	}
	public void addAttribute(Attribute attribute) {
		this.attributes.add(attribute);
	}
	public void addHook(Hook hook) {
		this.hooks.add(hook);
	}
	public void addIcon(Icon icon) {
		this.icons.add(icon);
	}
	public String getIdentity() {
		return identity;
	}
	public void setIdentity(String identity) {
		this.identity = identity;
	}
	

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public void setLft(int lft) {
		this.lft = lft;
	}
	public int getLft() {
		return lft;
	}
	public void setRgt(int rgt) {
		this.rgt = rgt;
	}
	public int getRgt() {
		return rgt;
	}
	public int getParentId() {
		return parentId;
	}
	public void setParentId(int parentId) {
		this.parentId = parentId;
	}
	public int getMapId() {
		return mapId;
	}
	public void setMapId(int mapId) {
		this.mapId = mapId;
	}

	public String getPlainTextContent() {
        return HtmlTools.htmlToPlain(getText());
    }
	
	public boolean isLeft() {
        if( (position == null || position == "") && ! isRoot()){
        	setLeft(getParent().isLeft());
        }
        
        return POSITION_LEFT.equals(position);
    }
	
	public void setLeft(boolean isLeft){
        position = isLeft ? POSITION_LEFT : POSITION_RIGHT;
        if(! isRoot()){
            for(int i = 0; i < getChildCount(); i++){
                final Node child = (Node) getChildAt(i);
                child.position = position;
            }
        }
    }
	
	public boolean hasChildren() {
		return children != null && !children.isEmpty();
	}
	
	public int getChildCount() {
		return children == null ? 0 : children.size();
	}
	
	public Node getChildAt(int childIndex) {
        return (Node) children.get(childIndex);
    }
	
	public void setParent(Node parent) {
		this.parent = parent;
	}
	public Node getParent() {
		return this.parent;
	}
	
	public boolean isRoot() {
		return (parent==null);
	}
	
	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}
	public String getNodeType() {
		return nodeType;
	}


	public void setCreatorIP(String creatorIP) {
		this.creatorIP = creatorIP;
	}
	public String getCreatorIP() {
		return creatorIP;
	}


	public void setModifierIP(String modifierIP) {
		this.modifierIP = modifierIP;
	}
	public String getModifierIP() {
		return modifierIP;
	}


	public void setCreator(long creator) {
		this.creator = creator;
	}
	public long getCreator() {
		return creator;
	}


	public void setModifier(long modifier) {
		this.modifier = modifier;
	}
	public long getModifier() {
		return modifier;
	}

	public void setExtraData(String extraData) {
		this.extraData = extraData;
	}


	public String getExtraData() {
		return extraData;
	}
	
	
	public String getTextRecursive(){
		StringBuffer buffer = new StringBuffer();
		buffer.append(originText +", ");
		//System.out.println(children.size());
		if(children.size() > 0) {
			for(int i = 0; i < children.size(); i++) {
				buffer.append(children.get(i).getTextRecursive());
			}
		}
		return buffer.toString();
	}
	
	public String getClientId() {
		return clientId;
	}
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}
	

	public String toXml() {
		boolean hasChild = false;
		StringBuffer buffer = new StringBuffer();
		buffer.append("<node");
		buffer.append(" CREATED=\""+ this.created +"\"");
		buffer.append(" ID=\""+ this.identity +"\"");
		buffer.append(" MODIFIED=\""+ this.modified +"\"");
		if(this.text != null) buffer.append(" TEXT=\""+ this.text +"\"");
		if(this.backgroundColor != null) buffer.append(" BACKGROUND_COLOR=\""+ this.backgroundColor +"\"");
		if(this.color != null) buffer.append(" COLOR=\""+ this.color +"\"");
		if(this.line_color != null) buffer.append(" LINE_COLOR=\""+ this.line_color +"\"");
		if(this.folded != null) buffer.append(" FOLDED=\""+ this.folded +"\"");
		if(this.link != null) buffer.append(" LINK=\""+ this.link +"\"");
		if(this.position != null) buffer.append(" POSITION=\""+ this.position +"\"");
		if(this.style != null) buffer.append(" STYLE=\""+ this.style +"\"");
		if(this.hGap != null) buffer.append(" HGAP=\""+ this.hGap +"\"");
		if(this.vGap != null) buffer.append(" VGAP=\""+ this.vGap +"\"");
		if(this.vShift != null) buffer.append(" VSHIFT=\""+ this.vShift +"\"");
		if(this.encryptedContent != null) buffer.append(" ENCRYPTED_CONTENT=\""+ this.encryptedContent +"\"");
		
		buffer.append(" CREATOR=\""+ this.creator +"\"");
		buffer.append(" MODIFIER=\""+ this.modifier +"\"");
		if(this.creatorIP != null) buffer.append(" CREATOR_IP=\""+ this.creatorIP +"\"");
		if(this.modifierIP != null) buffer.append(" MODIFIER_IP=\""+ this.modifierIP +"\"");
		if(this.nodeType != null) buffer.append(" NODE_TYPE=\""+ this.nodeType +"\"");
		if(this.extraData != null && this.extraData.trim().length() > 0) buffer.append(" EXTRA_DATA=\""+ this.extraData +"\"");
		buffer.append(" DBID=\""+ this.id +"\"");
		buffer.append(" NUMOFCHILDREN=\""+ this.numOfChildren +"\"");
		
		buffer.append(" CLIENT_ID=\""+ this.clientId +"\"");
		
		if(arrowLinks.size() > 0) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			for(int i = 0; i < arrowLinks.size(); i++) {
				buffer.append(arrowLinks.get(i).toXml());
			}
		}
		if(attributes.size() > 0) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			for(int i = 0; i < attributes.size(); i++) {
				buffer.append(attributes.get(i).toXml());
			}
		}
		if(cloud != null) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			buffer.append(cloud.toXml());
		}
		if(edge != null) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			buffer.append(edge.toXml());
		}
		if(font != null) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			buffer.append(font.toXml());
		}
		if(icons.size() > 0) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			for(int i = 0; i < icons.size(); i++) {
				buffer.append(icons.get(i).toXml());
			}
		}
		if(hooks.size() > 0) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			for(int i = 0; i < hooks.size(); i++) {
				buffer.append(hooks.get(i).toXml());
			}
		}
		if(richContent != null) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			buffer.append(richContent.toXml());
		}
		if(foreignObject != null) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			buffer.append(foreignObject.toXml());
		}
		
		if(children.size() > 0) {
			if(hasChild == false) {
				hasChild = true;
				buffer.append(">\n");
			}
			for(int i = 0; i < children.size(); i++) {
				buffer.append(children.get(i).toXml());
			}
		}
		if(hasChild) {
			buffer.append("</node>\n");
		} else {
			buffer.append("/>\n");
		}
		
		return buffer.toString();
	}


	public int getNumOfChildren() {
		return numOfChildren;
	}


	public void setNumOfChildren(int numOfChildren) {
		this.numOfChildren = numOfChildren;
	}

}
