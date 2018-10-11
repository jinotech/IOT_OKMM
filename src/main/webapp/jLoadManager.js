
/**
 *  
 *  Map을 로딩 하는곳.
 *  
 * @author Hahm Myung Sun (hms1475@gmail.com)
 * @created 2011-07-08
 * 
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com)
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */


var Utf8 = {
 
	// public method for url encoding
	encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// public method for url decoding
	decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////// jLoadManager ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jLoadManager = function(map){
	this.map = map;
	this.loading = false;
	this.imageLoading = new Array();
}

jLoadManager.prototype.type= "jLoadManager";

jLoadManager.prototype.cfg = {
		contextPath: '',
		mapId: -1,
		mapName: ''
};

/**
 * 
 */
jLoadManager.prototype.loadMap = function(contextPath, mapId, mapName) {
//	JinoUtil.waitingDialog("Loading Map");
	this.loading = true;
	
	this.cfg.contextPath = contextPath;
	this.cfg.mapId = mapId;
	this.cfg.mapName = mapName;	
	
	var url = "";
	if(this.map.cfg.lazyLoading){
		url = contextPath+"/map/lazy/"+mapId+"/"+mapName;
		this.lazyConfig();
	} else {
		url = contextPath+"/map/"+mapId+"/"+mapName;
	}
	
	var req = false;
    // branch for native XMLHttpRequest object
    if(window.XMLHttpRequest && !(window.ActiveXObject)) {
    	try {
			req = new XMLHttpRequest();
        } catch(e) {
			req = false;
        }
    // branch for IE/Windows ActiveX version
    } else if(window.ActiveXObject) {
       	try {
        	req = new ActiveXObject("Msxml2.XMLHTTP");
      	} catch(e) {
        	try {
          		req = new ActiveXObject("Microsoft.XMLHTTP");
        	} catch(e) {
          		req = false;
        	}
		}
    }

	if(req) {
		req.onreadystatechange = function () {
			if (req.readyState == 4) {
				var xmlDoc = false;
				if (req.status == 200) {
					var xmlStr = Utf8.encode(req.responseText);
					if (window.DOMParser) {
						var parser = new DOMParser();
						xmlDoc = parser.parseFromString(xmlStr,"text/xml");
					} else { // Internet Explorer
						xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
						xmlDoc.async="false";
						xmlDoc.loadXML(xmlStr);
					}
				}
				
				if(xmlDoc) {
					jMap.loadManager.parseMM(xmlDoc);
				}
				
				jMap.setSaved(true);
			}
		}
		req.open("GET", url, true);
		req.send(null);
	}
}

jLoadManager.prototype.loadMapLocal = function(mmFile) {
	// 로컬에 있는 파일은 위 방법으로 못 불러와서 기존의 방식으로 불러옴.
	// 서비스 할 때는 지워도 무방함.
	var xmlDoc = false;
	xmlDoc = this.loadMM(mmFile);
	
	if(xmlDoc) {
		this.parseMM(xmlDoc);
	}
	
	jMap.setSaved(true);
}

//로컬에 있는 파일을 불러오기 위해 사용함.
//서비스할 때는 지워도 무방함.
jLoadManager.prototype.loadMM = function(/*String*/mmFile){	// mm 파일 불러오기
	var xmlDoc = null;
	
	if (BrowserDetect.browser == "Explorer") {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.load(mmFile);
	}
	else {
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", mmFile, false);
		xhttp.send("");
		xmlDoc = xhttp.responseXML;
	}
	
	return xmlDoc;
}

jLoadManager.prototype.parseMM = function(xml) {
	var map = xml.childNodes.item(0);
	var childNodes = map.childNodes;
	
	// 맵 스타일 지정
	var layout = "";
	layout = map.getAttribute("mapstyle");
	if(layout == null || layout == "null" || layout == "") {
		layout = this.map.cfg.mapLayout;
	}	
	var jsCode = "this.map.layoutManager =  new " + layout + "(this.map);";
	eval (jsCode);    
	
	// 노드 생성
	for(var i = 0; i < childNodes.length; i++) {
		if(childNodes.item(i).nodeType == 1 /*NodeTypes.ELEMENT_NODE*/) {
			
			var element = childNodes.item(i);
			var text = element.getAttribute("TEXT");
			var id = element.getAttribute("ID");
			// 루트 노드 생성
			var param = {text: text,
					id: id};

			jMap.rootNode = jMap.createNodeWithCtrlExecute(param);
			jMap.rootNode.lazycomplete = new Date().valueOf();
			
			this.initNodeAttrs(jMap.rootNode, element);	// attr 속성 설정
			this.initChildNodes(jMap.rootNode, element);
		}
	}
	
	// 노드 레이아웃	
	//this.view.layoutNodes(this.rootNode);
	
	// 노드 선 연결
	//this.updateConnections(this.rootNode);
	// 폴딩
	jMap.initFoldingAll();
	
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	
//	// 테마
//	if(typeof NodeTheme !== 'undefined'){
//		NodeTheme.setTheme(theme1, jMap.rootNode);
//	}
	
	JinoUtil.waitingDialogClose();
	
	this.loading = false;
	
	jMap.loaded && jMap.loaded();
}

jLoadManager.prototype.initChildNodes = function(/*jNode*/parentNode, /*Element*/element){	
	if(element.childNodes.length > 0) {
		var children = element.childNodes;
		for(var i = 0; i < children.length; i++) {
			var child = children.item(i);
			if(child.nodeType == 1 /*NodeTypes.ELEMENT_NODE*/) {
				if( child.nodeName == "node" ) {
					var text = child.getAttribute("TEXT");
					var id = child.getAttribute("ID");
					var line_color = child.getAttribute("LINE_COLOR");
					var param = {parent: parentNode,
							text: text,
							id: id,
							line_color : line_color};
					var newNode = jMap.createNodeWithCtrlExecute(param);
					this.initNodeAttrs(newNode, child);	// attr 속성 설정
					this.initChildNodes(newNode, child);				 
				}
				
				else if( child.nodeName == "edge" ) {
					this.initEdgeAttrs(parentNode, child);
				}
								
				else if( child.nodeName == "richcontent" ) {
					var text = "";
					this.parserRichContent(parentNode, child, text);				
					
	//				if (child.textContent != undefined)
	//					parentNode.setText(child.textContent);
	//				else
	//					parentNode.setText(child.text);
				}
				
				else if( child.nodeName == "foreignObject" ) {
					var content = "";
					var width = child.getAttribute("WIDTH");
					var height = child.getAttribute("HEIGHT");
					
					// child은 foreignObject를 가르키고 contentChilds는 그의 자식들이다
					var contentChilds = child.childNodes;
					for(var foi = 0; foi < contentChilds.length; foi++) {
						content += JinoUtil.xml2Str(contentChilds.item(foi));
					}
					
					content = content.replace("<![CDATA[","");
					content = content.replace("]]>", "");
					
					var $videoTest = $(content);
					if($videoTest && $videoTest.prop("tagName") == "IFRAME") {
						width = $videoTest.attr("width");
						height = $videoTest.attr("height");
						var zoom = $videoTest.attr("zoom");
						if (!zoom) zoom = 1.0;
						else zoom = parseInt(zoom, 10)/100;
						
						if(($videoTest.css("margin-left") != "") || ($videoTest.css("margin-top") != "")){
							width = parseInt(width, 10)*zoom + parseInt($videoTest.css("margin-left"), 10);	
							height = parseInt(height, 10)*zoom + parseInt($videoTest.css("margin-top"), 10);	
						}
						parentNode.setForeignObjectExecute(content, Math.round(width), Math.round(height));
						
						// 요 아래줄 부터는 foreignObject 안정화 되면 지우기..
						var spos = content.indexOf("src=")+5;
						var epos = content.indexOf("\"", spos);
						var src = content.substring(spos, epos);					
						parentNode.setHyperlinkExecute(src);
					} else {
						content = content.replace(/&amp;amp;/g, "&amp;");
						content = content.replace(/&amp;nbsp;/g, "&nbsp;");
						content = content.replace(/&amp;lt;/g, "&lt;");
						content = content.replace(/&amp;gt;/g, "&gt;");
						content = content.replace(/&amp;quot;/g, "&quot;");
						content = content.replace(/&amp;(.)acute;/g, "&$1acute;");
						content = content.replace(/&amp;(.)grave;/g, "&$1grave;");
						content = content.replace(/&amp;(.)tilde;/g, "&$1tilde;");
						
						
						parentNode.setForeignObjectExecute(content, width, height);						
					}
				}
				
				else if(child.nodeName == "arrowlink") {
					var arrowlink = this.createArrowLink(parentNode, child);
					parentNode.addArrowLink(arrowlink);
				}
				
				else if(child.nodeName == "info") {
					var attr = child.attributes;
					for (var a = 0; a < attr.length; a++) {
						if (attr[a].nodeName) {										
							parentNode[attr[a].nodeName.toLowerCase()] = attr[a].nodeValue;
						}
					}					
				} //KHANG
				else if (child.nodeName == "attribute") {
					if (!parentNode.attributes)
						parentNode.attributes = {};
					
					var attr_name = child.getAttribute("NAME");
					var attr_value = child.getAttribute("VALUE");
					parentNode.attributes[attr_name] = attr_value;
					
					//alert('load ' + parentNode.plainText + ' ' + attr_name + ': ' + parentNode.attributes[attr_name]);
				}
				//KHANG
				
			}
		}
	}
}

/**
 * 파싱하면서 ArrowLink 속성에 따라 Arrow를 만든다.
 */
jLoadManager.prototype.createArrowLink = function(/*jNode*/node, /*Element*/ element) {
	var arrowlink = null;
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			arrowlink = new CurveArrowLink();
			break;
		case "jTreeLayout" :
			arrowlink = new RightAngleArrowLink();
			break;
		default :
			arrowlink = new CurveArrowLink();
	}
	
	arrowlink.destination = element.getAttribute("DESTINATION");
	arrowlink.color = element.getAttribute("COLOR");
	arrowlink.endArrow = element.getAttribute("ENDARROW");
	arrowlink.endInclination = element.getAttribute("ENDINCLINATION");
	arrowlink.id = element.getAttribute("ID");
	arrowlink.startArrow = element.getAttribute("STARTARROW");
	arrowlink.startInclination = element.getAttribute("STARTINCLINATION");
	
	return arrowlink;
}

jLoadManager.prototype.parserRichContent = function(node, /*Element*/element, text){	
	if(element.childNodes.length > 0) {
		var children = element.childNodes;
		for(var i = 0; i < children.length; i++) {
			var child = children.item(i);
//			if (child.nodeType == 3 /*NodeTypes.ELEMENT_NODE*/) {				
//				var temStr = child.nodeValue;
//				temStr=temStr.replace(/\n/gi, "");
//				temStr=temStr.replace(/  /gi, "");				
//				temStr && node.setText(node.getText() + temStr + "\n");
//				
//			}
			if( child.nodeType == 1 /*NodeTypes.ELEMENT_NODE*/) {
				if(child.nodeName == "img") {					
					var img_width = (child.getAttribute("width") == 'undefined')? null : child.getAttribute("width"); 
					var img_height = (child.getAttribute("height") == 'undefined')? null : child.getAttribute("height");
					node.setImageExecute(child.getAttribute("src"), img_width, img_height);
				} else if(child.nodeName == "p") {
					var txt = JinoUtil.trimStr(node.getText());
					if(child.childNodes.length > 0){
						if( txt != null && txt != "") txt = txt + "\n" + JinoUtil.trimStr(child.childNodes.item(0).nodeValue);
						else txt = JinoUtil.trimStr(child.childNodes.item(0).nodeValue);						
					}
					txt = convertXML2Char(txt);		// & " < > 등 XML 대응 문자 변환					
					node.setTextExecute(txt);
				} else {	// 이건 img, p 이외지만.. freemind에서 글자에 데코가 들어가면 em 태그에 싸이는데.. 처리하기 위해서
					var txt = JinoUtil.trimStr(node.getText());
					if(child.childNodes.length > 0){
						if( txt != null && txt != "") txt = txt + "\n" + JinoUtil.trimStr(child.childNodes.item(0).nodeValue);
						else txt = JinoUtil.trimStr(child.childNodes.item(0).nodeValue);						
					}
					node.setTextExecute(txt );
				}
			}
			this.parserRichContent(node, child, text);
		}
	}
}

jLoadManager.prototype.initEdgeAttrs = function(/*jNode*/node, /*Element*/ element){
	var attr = element.attributes;
	for (var i = 0; i < attr.length; i++) {
		if (attr[i].nodeName) {
			// Fremind에서 color은 테두리및 가지 색상
			if (attr[i].nodeName.toLowerCase() == "color") {
				node.setEdgeColorExecute(attr[i].nodeValue);
				continue;
			}
			// Freemind에서 width는 가지 두께 
			if (attr[i].nodeName.toLowerCase() == "width") {
				node.setBranchColorExecute(null, attr[i].nodeValue);
				continue;
			}
			node.edge[attr[i].nodeName.toLowerCase()] = attr[i].nodeValue;
		}
	}
}
jLoadManager.prototype.initNodeAttrs = function(/*jNode*/node, /*Element*/ element){
	var attr = element.attributes;
	for (var i = 0; i < attr.length; i++) {
		if (attr[i].nodeName) {
			if (attr[i].nodeName.toLowerCase() == "text") 
				continue;
			if (attr[i].nodeName.toLowerCase() == "id") {				
				continue;
			}
			if (attr[i].nodeName.toLowerCase() == "background_color") {
				node.setBackgroundColorExecute(attr[i].nodeValue);
				continue;
			}
			if (attr[i].nodeName.toLowerCase() == "color") {
				node.setTextColorExecute(attr[i].nodeValue);
				continue;
			}
			if (attr[i].nodeName.toLowerCase() == "link") {
				node.setHyperlinkExecute(attr[i].nodeValue);
				continue;
			}			
			if (attr[i].nodeName.toLowerCase() == "folded") {
				node.folded = (attr[i].nodeValue == "true") ? true : false;				
				continue;
			}			
			node[attr[i].nodeName.toLowerCase()] = attr[i].nodeValue;
//			if (attr[i].nodeName.toLowerCase() == "vshift") {
//			}
		}
	}
	/*for (prop in attr){
		if(attr[prop].nodeName){
			if(attr[prop].nodeName.toLowerCase() == "text") continue;							
			node[attr[prop].nodeName.toLowerCase()] = 			
				attr[prop].nodeValue;
		}
	}*/
}

/**
 * xml 노드 데이터를 가지고 노드를 붙여넣는다.
 * 
 *  @node			: 붙여넣기 대상의 노드
 *  @xml			: 붙여넣을 노드의 데이터
 *  @index			: 자식의 index 위치에 붙어넣기
 *  @position		: 좌우 포지션
 *  @revivePosition : 데이터에 존재하는 포지션 정보를 이용할 것인가 (position 정보가 있으면 position 정보가 우선시 된다.)
 *  
 *  @returns		: 붙여넣기한 깊이1 노드들을 반환한다.
 */
jLoadManager.prototype.pasteNode = function(node, xml, index, position, revivePosition) {
	if(!xml) return false;
	
	xml = xml.replace(/<foreignObject([^>]*)\">/ig, "<foreignObject$1\">\n<![CDATA[\n");
	xml = xml.replace(/<\/foreignObject>/ig, "\n]]>\n</foreignObject>");
	
	if (window.DOMParser) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(xml,"text/xml");
	} else { // Internet Explorer
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(xml);
	}
	
	// 정의된 태그가 있으면 찾고, 없으면 false를 반환
	var docNode = xmlDoc.firstChild;
	while (docNode.nodeType != 1 && (docNode.tagName != 'clipboard' || docNode.tagName != 'paste' || docNode.tagName != 'okm' || docNode.tagName != 'node')) {
		docNode=docNode.nextSibling;
		if(docNode == null) return false;
	}
	
	//node.folded && node.setFoldingExecute(false);
	
	var nodeElements = docNode.childNodes;
	var newNodes = [];
	for(var i = 0; i < nodeElements.length; i++) {
		if(nodeElements.item(i).nodeType == 1 /*NodeTypes.ELEMENT_NODE*/) {
			var element = nodeElements.item(i);	
			if(element.nodeName != "node") continue;
			
			// 복사해 온것이므로 삭제해야 할 정보들
			if(!revivePosition) element.removeAttribute("POSITION");	// 루트 자식은 POSITION 정보를 가지고 있으므로..
			// if(!isID) element.removeAttribute("ID");			// ID 중복 방지를 위해서
			
			var text = element.getAttribute("TEXT");
			var id = element.getAttribute("ID");
			var param = {parent: node,
					text: text,
					id: id,
					index: index,
					position: position};
			var childNode = jMap.createNodeWithCtrlExecute(param);
			this.initNodeAttrs(childNode, element);	// attr 속성 설정
			this.initChildNodes(childNode, element);
			
			// 부모가 폴딩되어 있거나 숨겨져 있으면 숨긴다.
			if(node.folded || node.hided) node.hideChildren(node);
			
			newNodes.push(childNode);
		}
	}
	
	return newNodes;
//	jMap.initFolding(node);
//	jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
//	jMap.layoutManager.layout(true);
}

jLoadManager.prototype.updateImageLoading = function(el) {
	if(this.imageLoading.contains(el)) {
		this.imageLoading.remove(el);
	} else {
		this.imageLoading.push(el);
	}
	
	if(this.imageLoading.length == 0) {
		jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGELOADED);	
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @node	: node의 자식들이 로딩된다.
 */
jLoadManager.prototype.lazyLoading = function(node){
	if(node.lazycomplete) return;
	
	$.ajax({
		type: 'post',
		async: false,
		url: jMap.cfg.contextPath+'/mindmap/childnodes.do',
		data: {'map': this.cfg.mapId,
					'node': node.getID() },
		beforeSend: function() {},
		success: function(data, textStatus, jqXHR) {
			var loadingNodes = jMap.loadManager.pasteNode(node, jqXHR.responseText, null, null, true);
			// 로딩되었다는 것을 표시하기 위해서 변수에 현재 시간 저장
			node.lazycomplete = new Date().valueOf();
			node.numofchildren = loadingNodes.length;
			
			if(loadingNodes.length > 0) {
					// 로딩된 노드들은 접혀있는 상태로 놓는다.			
					for(var i = 0; i < loadingNodes.length; i++) {				
						if(loadingNodes[i].numofchildren > 0) {
//							loadingNodes[i].setFoldingExecute(true);
//							if(loadingNodes[i].hided)
//								loadingNodes[i].folderShape && loadingNodes[i].folderShape.hide();
							loadingNodes[i].folderShape && loadingNodes[i].folderShape.show();
							loadingNodes[i].folded = true;
						} else {
							// 자식이 없으면 로딩이 끝났음을..
							loadingNodes[i].lazycomplete = new Date().valueOf();
						}
					}
			}
		},
		error: function(data, status, err) {
			alert("editAction : " + status);
		},
		complete: function() {
		}
    });
}

/**
 * lazyloading과 관련된 설정.
 * 1. 리스너
 */
jLoadManager.prototype.lazyConfig = function(){
	this.lazyListeners = [];
	
	// 리스너 등록
	this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NODE_FOLDING, function(){
		var node = arguments[0];
		
		jMap.loadManager.lazyLoading(node);
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
		jMap.layoutManager.layout(true);
		
	}));
	
	this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NODE_MOVED, function(){
		var parent = arguments[0];
		var pasteNodes = arguments[1];
		
		// 옮겨간 노드들은 접혀있는 상태로 놓는다.			
//		for(var i = 0; i < pasteNodes.length; i++) {				
//			if(pasteNodes[i].numofchildren > 0) {
//				pasteNodes[i].setFoldingExecute(true);
//			}
//		}
		
	}));
	
	this.lazyListeners.push(jMap.addActionListener(ACTIONS.ACTION_NEW_NODE, function(){
		var node = arguments[0];
		node.lazycomplete = new Date().valueOf();		
	}));
	
	this.lazyListeners.push(jMap.addActionListener("DWR_InsertNode", function(){
		var node = arguments[0];
		node.lazycomplete = new Date().valueOf();		
	}));
}

/**
 * lazyloading 관련 리스너 삭제
 */
jLoadManager.prototype.removelazyListener = function(){
	var l = null;
	while (l = this.lazyListeners.pop())
		jMap.removeActionListener(l);	
	this.lazyListeners = [];
}







