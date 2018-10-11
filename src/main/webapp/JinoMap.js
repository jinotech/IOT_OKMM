/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////// 상수 ////////////////////
var HGAP = 20;
var VGAP = 5;
var TEXT_HGAP = 10;
var TEXT_VGAP = 10;
var FOLDER_RADIUS = 4;
var PERCEIVE_WIDTH = 30;				// 노드에서 Folding을 감지하는 넓이
//var MOVING_SHAPE_COLOR = "#5c8edb"		// 노드를 움직이는 표식의 색
var NODE_CORNER_ROUND = 5;
var NODE_MOVING_IGNORE = 5;				// 몇 px만큼을 움직였을때 노드 이동을 무시하는가

//////////////////////////////////////////////////

// IE처리
if (window['console'] === undefined || console.log === undefined ) {
    console = {log: function() {}, info: function() {}, warn: function () {}, error: function() {}};
}

//////// FireFox에소 click() 이벤트 처리 ////////
HTMLElement.prototype.click = function() {
	var evt = this.ownerDocument.createEvent('MouseEvents');
	evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	this.dispatchEvent(evt);
} 

var supportsTouch = "createTouch" in document;

//var events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend dragstart dragenter dragexit drop".split(" ");
//var touchMap = {
//		// 앞에 type가 실제 이벤트로,
//		// 만약 mousedown: "touchstart" 와 같이 지정했다면  touchstart이벤트가 발생되면 mousedown 함수가 불리게 된다.
//		mousedown: "touchstart",
//	    mousemove: "touchmove",
//	    mouseup: "touchend",
//	    click: "click"
//	};
		
var RAPHAEL = null;
var STAT_NODEEDIT = false;
var CLIPBOARD_DATA = "";
var DRAG_POS = {x:0, y:0};
//var PAPER_DRAG_POS = {x:0, y:0};

var J_NODE_CREATING = false;

// eventName 종류..
var ACTIONS = {	ACTION_NEW_NODE : "action_NewNode",				// 새로운 노드가 만들었졌을 때
				ACTION_NODE_REMOVE : "action_NodeRemove",		// 노드가 삭제 되었을 때
				ACTION_NODE_EDITED : "action_NodeEdited",		// 노드 편집이 끝났을 때
				ACTION_NODE_SELECTED : "action_NodeSelected",	// 노드가 선택  되었을 때
				ACTION_NODE_UNSELECTED : "action_NodeUnSelected",	//노드가 선택 해제 되었을때
				ACTION_NODE_FOLDING : "action_NodeFolding",		// 노드가 접히거나 펴졌을 때
				ACTION_NODE_MOVED : "action_NodeMoved",			// 노드가 다른 노드로 이동 되었을 때
				ACTION_NODE_COORDMOVED : "action_NodeCoordMoved",			// 노드의 좌표 위치가 변경되었을 때
				ACTION_NODE_HYPER : "action_NodeHyper",			// 링크가 걸렸을 때
				ACTION_NODE_IMAGE : "action_NodeImage",			// 이미지가 들어갔을 때
				ACTION_NODE_IMAGELOADED : "action_ImageLoaded",			// 이미지가 모두 로딩 되었을 때
				ACTION_NODE_PASTE : "action_NodePaste",			// 이미지가 들어갔을 때
				ACTION_NODE_UNDO : "action_NodeUndo",			// Undo 될 때
				ACTION_NODE_REDO : "action_NodeRedo",			// Redo 될 때
				ACTION_NODE_FOREIGNOBJECT : "action_NodeForeignObject",	// ForeignObject가 들어갈 때
				ACTION_NODE_ATTRS: "action_NodeAttrs"			// 배경색 및 글자 색상 변경시
			  };

//iPhone, iPod Agent 찾기
var ISMOBILE = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i)));

// ie. console.log
if(window.console === undefined) {console = {log:function(){}}}

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// JinoMap ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

JinoMap = function (work, w, h, mode){
	RAPHAEL = Raphael(work, w, h);
	RAPHAEL.canvas.id = "paper_mapview";
	
	// 노드를 움직이기 위한 변수
	this.selectedNodes = new Array();	// 선택된 노드들의 집합
	this.DragPaper = false;				// 화면을 움직였을 때
	this.positionChangeNodes = false;	// 선택한 노드들을 다른 노드로 옮길 때
	this.movingNode = false;			// 노드를 움직일 때 나타는 테두리만 있는 노드
	this.isSavedFlag = true;			// Save Flag
	this.indexColor = 0;				// 색상 인덱스
	this.mouseRightClicked = false;		// 오른쪽 마우스가 눌렸는가
	this.scaleTimes = 1.0;					// viewBox확대 축소를 위해 관리되는 변수
	this._enableDragPaper = true;		// 맵 이동 가능여부
	this.mode = mode || 0;	// 0 : 뷰모드 (편집 권한 없음 - 기본)
							// 1 : 일반모드 (모든권한)
	
	this.Listeners = new Array();	// 리너스 관리	
	
	// 노드를 움직이는 표시
//	this.movingShape = null;
	// 상태바
	this.statusBar = null;
	// note를 표시하기 위한 툴팁
	this.tootipHandle = $('<div style="position:absolute" id="jinomap_tooltip"></div>').appendTo($('#'+work)).hide();
	// 노드 편집창
	this.nodeEditorHandle = $('<textarea id="nodeEditor" value="" style="position:absolute;top:0px;left:0px;width:100px;height:0px;overflow:hidden;display:none" />').appendTo($('#'+work));
	
	this.nodes = new Array();
	
	// 노드를 가르키는 arrowlink들을 찾기위해 
	// 노드들에 있는 arrowlink들을 가지고 있는다.
	this.arrowlinks = new Array();
	
	this.work = $('#'+work)[0];
	$('#'+work).css("background-color", this.cfg.mapBackgroundColor);		// 배경색
	this.controller = this.mode? new JinoController(this) : new JinoControllerGuest(this);
	this.loadManager = new jLoadManager(this);
	this.layoutManager = null;
	//this.historyManager = new UndoRedoManager();
	this.saveAction = new jSaveAction(this);
	this.clipboardManager = new jClipboardManager(this);
	
	this.nodeEditorHandle.textGrow({
	  pad: 25, min_limit: 70, max_limit: 1000
	});
	
	// 키 이벤트를 제어하기 위해 포커스를 설정한다.
	this.work.focused = false;
    this.work.hasFocus = function() {
        return this.focused;
    };
    this.work.onfocus=function() {
        this.focused=true;
    };
    this.work.onblur=function() {
        this.focused=false;
    };
    
    
    // Group 생성 - 전역으로 갖는 그룹을 생성 (나중에 필요가 없다면 삭제)
    if(Raphael.svg){
		this.groupEl = document.createElementNS("http://www.w3.org/2000/svg", "g");
    	this.groupEl.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
		RAPHAEL.canvas && RAPHAEL.canvas.appendChild(this.groupEl);
    }
	
    // Group 생성은 SVG의 애니메이션을 위해 만들어 졌기 때문에 VML은 적용하지 않는다.
    // VML에 적용시 선이 안보이는 문제가 있다. (아마도 레이어 순서 때문에??)
//	if(Raphael.vml){
//		this.groupEl = createNode("group");		
//		RAPHAEL.canvas.appendChild(this.groupEl);
//	}
	// Group 생성 끝
    
    

    // Test    
//    var cc = RAPHAEL.circle(2499.5, 1410.5, 50).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});
//    cc.mousedown(function(){
//    	alert("aaa")
//    });
    
}

JinoMap.prototype.type= "JinoMap";

JinoMap.instance = null; // Will contain the one and only instance of the class

/*
JinoMap.getInstance = function() {
    if (JinoMap.instance == null) {
    	JinoMap.instance = new JinoMap();
    }

    return JinoMap.instance;
}
*/

//JinoMap Events
//for (var i = events.length; i--;) {
//    (function (eventName) {
//        JinoMap.prototype[eventName] = function (fn) {
//            if (Raphael.is(fn, "function")) {
//                this.events = this.events || [];
//                this.events.push({name: eventName, f: fn, unbind: addEvent(this.work, eventName, fn, this)});
//            }
//            return this;
//        };
//        JinoMap.prototype["un" + eventName] = function (fn) {
//            var events = this.events,
//                l = events.length;
//            while (l--) if (events[l].name == eventName && events[l].f == fn) {
//                events[l].unbind();
//                events.splice(l, 1);
//                !events.length && delete this.events;
//                return this;
//            }
//            return this;
//        };
//    })(events[i]);
//}

JinoMap.prototype.deleteNodeById = function(id) {
	// What's this?
	// hashmap is just fine for deleting it's key:value pair.
	delete this.nodes[id];
}

JinoMap.prototype.getNodeById = function(id) {
	return this.nodes[id];
}

/**
 * 
 * @param {String} id	: 검사할 id
 * @return	: true - 써도 OK, false - 쓰지 말것.
 */
JinoMap.prototype.checkID = function(id){
	if(!id) return false;
	for(var iid in this.nodes) {
		if(iid == id) return false;		
	}	
	return true;
}

JinoMap.prototype.getRootNode = function(){
	return this.rootNode;
}

JinoMap.prototype.setRootNode = function(node){
	this.rootNode = node;
}

JinoMap.prototype.addActionListener = function(eventName, fn){
	var al = {name: eventName, f: fn};
	this.Listeners.push(al);
	return al;	
}

JinoMap.prototype.removeActionListener = function(al){
	this.Listeners.remove(al);
}
 
JinoMap.prototype.fireActionListener = function(){
	if(arguments.length < 1) return;
	
	var eventName = Array.prototype.slice.call(arguments, 0, 1)[0];	
	var arg = Array.prototype.slice.call(arguments, 1);
	
	var listeners = this.Listeners,
		l = listeners.length;
	
	while (l--) {
		if(!listeners[l]) continue;
		if(listeners[l].name == eventName) {
			listeners[l].f.apply(this, arg);
		}
	}
}

/**
 * @param {String} text : 검색 문자열
 * @param {bool} wholeword : 온전한 단어(완전 매칭)
 * @param {bool} ignorecase : 대소문자 구분
 * @param {jNode} node : 검색 시작 노드	// 없으면 루트부터..
 * @param {Array} finds : 검색된 노드들의 집합
 * 
 * @return : parm으로 넣은 finds과 같은것이 리턴되는데
 * 			리턴 구조는.. return.node 및 return.match 를 갖는다.
 */
JinoMap.prototype.findNode = function(text, wholeword, ignorecase, node, finds){
	if(!finds) finds = new Array();
	var searchNode = node || this.rootNode;
	
	var op = "g";
	// 정규표현식 특수문자도 검색 되도록..
	var re = /\\/g;
	var matchText = text.replace(re, "");
	re = /([\*\+\$\|\?\(\)\{\}\^\[\]])/g;
	matchText = matchText.replace(re, "\\$1");	
	if(wholeword){
		if(matchText.substr(0, 1) != "^") matchText = "^"+matchText;
		if(matchText.substr(matchText.length-1, 1) != "$") matchText = matchText+"$";		
	} 
	if(ignorecase) op = op + "i";
	var regexp = new RegExp(matchText, op);
	
	var match = regexp.exec(searchNode.getText());
	
	match && finds.push({
		node: searchNode,
		match: match
	});
	
	if(searchNode.getChildren().length > 0) {
		var children = searchNode.getChildren();
		for(var i = 0; i < children.length; i++) {
			this.findNode(text, wholeword, ignorecase, children[i], finds);
		}
	}
	
	return finds;
}

JinoMap.prototype.loadMap = function(contextPath, mapId, mapName){
	this.clearMap();
	this.loadManager.loadMap(contextPath, mapId, mapName);
}

JinoMap.prototype.loadMapFromXml = function(xml){
	this.clearMap();

	var xmlDoc = false;
	if (window.DOMParser) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(xml,"text/xml");
	} else { // Internet Explorer
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(xml);
	}
	
	if(xmlDoc) {
		this.loadManager.parseMM(xmlDoc);
	}
}

JinoMap.prototype.clearMap = function(){
	if(this.rootNode) RAPHAEL.clear();
	if(this.groupEl){ this.groupEl.remove; this.groupEl = null; }
}

/**
 * 새로운 맵 작성
 * @return : 루트 노드 (jNode)
 */
JinoMap.prototype.newMap = function(title){
	this.clearMap();
	
	if(!title) title = "newMap";
	
	// 맵 스타일 지정
	var layout = this.cfg.mapLayout;
	var jsCode = "this.layoutManager =  new " + layout + "(this);";
	eval (jsCode);    
	
	var param = {text: title};
	this.rootNode = this.createNodeWithCtrlExecute(param);
	this.rootNode.focus(true);
	
	// 노드 레이아웃	
	this.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	
	return this.rootNode;
	
	JinoUtil.waitingDialogClose();
}

JinoMap.prototype.getSelecteds = function() {
	return this.selectedNodes;
}

JinoMap.prototype.getSelected = function() {
	if(this.getSelecteds().length < 1) return null;	
	return this.getSelecteds().getLastElement();	
}

JinoMap.prototype.isSaved = function() {
	return this.isSavedFlag;
}

JinoMap.prototype.setSaved = function(isSaved) {
	this.isSavedFlag = isSaved;
	
	// reset을 여기에 놓으면 맵을 로드할때 로드된 노드 수 많큼 불리는데..
	// 퍼포먼스가 떨어질것 같음.. 나중에 개선 할것.
	//this.resetSessionTimeout();
}

JinoMap.prototype.setLayoutManager = function(layoutManager) {
	this.layoutManager = layoutManager;
//	this.changeOfWholeMap(this.getRootNode());
//	this.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	
	// 문장이 너무 긴것은 자른다.
	if(layoutManager.type == "jTableLayout"){
		this.fixTextWidth(this.getRootNode());
	}
	////////////////////////////////////
	
	
	// 서버에 현재 레이아웃 저장
	$.ajax({
		type: 'post',
		async: false,
		url: this.cfg.contextPath+'/mindmap/changeMap.do',
		data: {'mapId': mapId,
					'style': layoutManager.type },		
		success: function(data, textStatus, jqXHR){
			window.location.reload(true);
		},
		error: function(data, status, err) {
			alert("setLayoutManager : " + status);
		}
    });
	
}

////////////////////// 다음함수는 검수를 위해서 만들어진 함수 이다. /////
////////////////////// 이 함수를 쓰고 있다면 이 함수를 전부 삭제 부탁 /////
JinoMap.prototype.fixTextWidth = function(node) {
	var text = node.getText();
	var textLen = text.length;
	var tp = text.split('\n');	
	
	if(textLen > 20 && tp.length < 2) {
		var sliceText = function(text, paragraph_array) {
			var s = text.slice(0,20);
			paragraph_array.push(s);
			var sub = text.substring(20);
			if(sub.length > 20) {
				sliceText(sub, paragraph_array);
			} else {
				paragraph_array.push(sub);
			}
		}
		
		var pa = new Array ();
		sliceText(text, pa);
		
		var newText = pa.join('\n');
		node.setText(newText);		
	}
	
	if(node.getChildren().length > 0) {
		var children = node.getChildren();
		for(var i = 0; i < children.length; i++) {
			this.fixTextWidth(children[i]);			
		}
	}
	
//	
//	var tp = node.getText().split('\n');	
//	for(var ti = 0; ti < tp.length; ti++) {
//		var text = tp[ti];
//		var textLen = text.length;
//		
//		if(textLen > 20) {
//			var sliceText = function(text, paragraph_array) {
//				var s = text.slice(0,20);
//				paragraph_array.push(s);
//				var sub = text.substring(20);
//				if(sub.length > 20) {
//					sliceText(sub, paragraph_array);
//				} else {
//					paragraph_array.push(sub);
//				}
//			}
//			
//			var pa = new Array ();
//			sliceText(text, pa);
//			
//			var newText = pa.join('\n');
//			tp[ti] = newText;
//		}
//	}
//	console.log(tp.join('\n'));
//	//node.setText(tp.join('\n'));
//	

}


JinoMap.prototype.changeOfWholeMap = function(node) {	
	if(node.connection) node.connection.remove();			// 이전 라인삭제
	
	// 라인 새로 생성
	switch(this.layoutManager.type) {
		case "jMindMapLayout" :
			node.connection = node.parent && new jLineBezier(node.parent, node);
			break;
		case "jTreeLayout" :
			node.connection = node.parent && new jLinePolygonal(node.parent, node);
			break;
		case "jTableLayout" :
			break;
		case "jFishboneLayout" :
			node.connection = node.parent && new jLineBezier(node.parent, node);
			break;
		default :
			node.connection = node.parent && new jLineBezier(node.parent, node);
			break;
	}
		
	// 숨겨야할 선이라면
	if(node.connection && node.hided) node.connection.hide();
	
	
	// 이전 arrowLink 삭제
	var endNodes = new Array();
	for (var i = 0; i < node.arrowlinks.length; i++) {
		endNodes.push(node.arrowlinks[i].destinationNode);
		node.removeArrowLink(node.arrowlinks[i]);
	}
	// 삭제한 arrowLink를 새로운 레이아웃에 적용
	for (var i = 0; i < endNodes.length; i++) {
		var arrowlink = null;
		switch(jMap.layoutManager.type) {
			case "jMindMapLayout" :
				arrowlink = new CurveArrowLink(endNodes[i]);
				break;
			case "jTreeLayout" :
				arrowlink = new RightAngleArrowLink(endNodes[i]);
				break;
			default :
				arrowlink = new CurveArrowLink(endNodes[i]);
		}
		
		node.addArrowLink(arrowlink);
	}
	
	// Font 사이즈 재조정
	if (node.isRootNode()) {		// 루트
		node.fontSize = this.cfg.nodeFontSizes[0];
	} else if (node.getParent().isRootNode()) {		// 깊이 1
		node.fontSize = this.cfg.nodeFontSizes[1];
	} else {		// 나머지
		node.fontSize = this.cfg.nodeFontSizes[2];
	}
	node.text.attr({'font-size': node.fontSize});
	node.CalcBodySize();
	
	if(node.hided) node.hide();	
	
	
	if(node.getChildren().length > 0) {
		var children = node.getChildren();
		for(var i = 0; i < children.length; i++) {
			this.changeOfWholeMap(children[i]);			
		}
	}
}

JinoMap.prototype.getLayoutManager = function() {
	return this.layoutManager;
}

JinoMap.prototype.showAdminNotice = function(notice){
	var txt = '<from><div class="dialog_content_nod" align="center">' +
		'<div>'+notice+'</div>' +
		'</div></from>';
	
	function callbackform_admin_notice(v,f){
		if (v) {}
		$("#dialog").dialog("close");
		jMap.work.focus();
	}
	
	$("#dialog").append(txt);
	 
	$("#dialog").dialog({
		autoOpen:false,
		closeOnEscape: true,	//esc키로 창을 닫는다.
		width:350,	//iframe 크기보다 30px 더 필요하다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog .dialog_content_nod").remove();
			$("#dialog").dialog("destroy"); 
		},
	});
	$("#dialog").dialog("option", "width", "none" );
	$("#dialog").dialog( "option", "buttons", [{
		text: i18n.msgStore["notice_button_ok"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_admin_notice(true, formValue); 
		} 
	}]);
				  
	$("#dialog").dialog( "option", "title", i18n.msgStore["notice_title"]);
	$("#dialog").dialog("open");
	
}

/**
 * 상태바 만드는거 테스트...
 */
JinoMap.prototype.showBlinkStatusBar = function(text) {
	if (!this.statusBar || this.statusBar.removed) {
		this.statusBar = this.body = RAPHAEL.text();
		this.statusBar.attr({'font-size': 12, /*'font-weight': 'bold',*/ 'text-anchor': 'start', fill: '#000', opacity: 0});		
	}

	this.statusBar.attr({text: text,
							x: this.work.scrollLeft + 15,
							y: this.work.scrollTop + this.work.offsetHeight - 30});
	this.statusBar.animate({opacity: 1}, 500, function(){
		this.animate({opacity: 0}, 500);
	});
	
	this.aaa = $('<div style="position:absolute" id="aaa">aaaa</div>').appendTo($('#jinomap')); 
}

JinoMap.prototype.createNodeWithCtrl = function(param, style, async){
	if(this.cfg.realtimeSave) {
		var isAlive = this.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
	var history = this.historyManager;
	var undo = null;
	
	var newNode = this.createNodeWithCtrlExecute(param, style);
	
	var redo = history && history.extractNode(newNode);
	history && history.addToHistory(undo, redo);
	
	this.saveAction.newAction(newNode, async);
	
	this.fireActionListener(ACTIONS.ACTION_NEW_NODE, newNode, param, style);	
	
	this.setSaved(false);
	
	return newNode; 
}

JinoMap.prototype.createNodeWithCtrlExecute = function(param, style){
	if(!style)
		style = this.cfg.nodeStyle;
	
	console.log("JinoMap.prototype.createNodeWithCtrlExecute style : " + style);
	
	var jsCode = "var newNode = new " + style + "(param);";		
	eval (jsCode);
	
//	var newNode = new jRect(parentNode, text, id, index, position);
	// 노드 이벤트
	var controller = this.mode? new jNodeController() : new jNodeControllerGuest();
	newNode.addEventController(controller);
	
	// 노드에 색상 입히기
//	if(typeof NodeColorMix !== 'undefined'){
//		if (newNode.isRootNode()) {
//			newNode.setBackgroundColorExecute(rootColor);
//			newNode.setTextColorExecute(rootTextColor);
//		} else if (newNode.getParent().isRootNode()) {
//			this.indexColor = this.indexColor % iColor.length;
//			color = iColor[this.indexColor];
//			this.indexColor++;			
//			newNode.setBackgroundColorExecute(color);
//			newNode.setEdgeColorExecute(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 8);
//		}
//		else {
//			var parentColor = Raphael.getRGB(newNode.getParent().background_color);
//			var color = NodeColorUtil.randomer(Raphael.getRGB(NodeColorUtil.brighter(parentColor, fadeFactor)), randFactor);
//			newNode.setBackgroundColorExecute(color);
//			newNode.setEdgeColorExecute(NodeColorUtil.darker(Raphael.getRGB(color), darkFactor), 2);
//		}
//	}		
			
	return newNode;
}

/**
 * 노드의 위치를 변경한다.
 * @param {jNode} parent : 이동될 노드의 부모
 * @param {Array} srcNodes : 이동할 노드들. 배열은 jNode로 구성
 * @param {int} position : 이동 될때 몇번째로 들어 갈것인가
 * @param {jNode} targNode : 이동하려고 하는 노드
 * 
 * parent와 targNode가 있는 이유는 자식으로 이동 될수도 있고 형제로 이동될 수도 있기 때문이다.
 * 자식으로 이동 된다면 parent와 targNode는 같다.
 * 하지만 형제로 이동될 경우 parent는 대상의 노드의 부모이고, targNode는 이동 대상의 노드이다.
 */
JinoMap.prototype.changePosition = function(parent, srcNodes, position, targNode){
	if(this.cfg.realtimeSave) {
		var isAlive = this.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
//	var undo = null;
	var pasteNodes = this.changePositionExecute(parent, srcNodes, position, targNode); 
//	var redo = this.historyManager.extractNode(newNode);
//	this.historyManager.addToHistory(undo, redo);
	
	var postPasteProcess = function() {
		// 저장	
		for (var i = 0; i < pasteNodes.length; i++) {
			jMap.saveAction.moveAction(pasteNodes[i], parent, targNode);
		}
		
		// 왼쪽 오른쪽의 정보를 갖고 있기 때문에 그 정보를 업데이트
		for (var i = 0; i < pasteNodes.length; i++) {
			jMap.saveAction.editAction(pasteNodes[i]);
		}
			
		// 이벤트 리스너 호출
		jMap.fireActionListener(ACTIONS.ACTION_NODE_MOVED, parent, pasteNodes, position, targNode);
		
		jMap.setSaved(false);
	}
	
	if(this.loadManager.imageLoading.length == 0) {
		postPasteProcess();
	} else {
		var loaded = this.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function(){
			postPasteProcess();
			// 이미지로더 리스너는 삭제!!! 중요.
			this.removeActionListener(loaded);
		});
	}
	
	return pasteNodes; 
}

JinoMap.prototype.changePositionExecute = function(parent, srcNodes, position, targNode){
	var xml = "<paste>";				
	for(var i = 0; i < srcNodes.length; i++) {
		xml += srcNodes[i].toXML();
		srcNodes[i].removeExecute();
	}				
	xml += "</paste>";
	
	var index = (targNode)? targNode.getIndexPos() : null;
	var pasteNodes = this.loadManager.pasteNode(parent, xml, index, position);
	
	return pasteNodes;
}

JinoMap.prototype.initFolding = function(/*jNode*/node){
	if(this.cfg.lazyLoading) {		// lazyLoading일 경우
		if(node.lazycomplete) {		// 로딩이 되었다면 일반적인 경우와 같음
			if(node.folded) node.setFoldingExecute(node.folded);
		} else {
			// 아직 로딩이 안되었다면 폴딩
			if(node.numofchildren > 0) {
				node.folderShape && node.folderShape.show();
				node.folded = true;
			} else {
				// 자식이 없으면 로딩이 끝났음을..
				node.lazycomplete = new Date().valueOf();
			}
			
			// 협업 과정중 협업자의 의해 자식이 지워져 자식이 없는 경우가 있기 때문에
			// 서버에서 노드의 자식 갯수를 구해온다.
//			$.ajax({
//				type: 'post',
//				async: false,
//				url: jMap.cfg.contextPath+'/mindmap/childnodes.do',
//				data: {'map': mapId,
//							'node': node.getID() },
//				beforeSend: function() {},
//				success: function(data, textStatus, jqXHR) {					
//					var re = /numofchildren="([^"]*)/i;
//					var match = re.exec(jqXHR.responseText);
//					node.numofchildren = match[1];
//					
//					if(node.numofchildren > 0) {
//						node.setFoldingExecute(true);
//					} else {
//						node.folderShape && node.folderShape.hide();
//						node.folded = false;
//					}					
//				},
//				error: function(data, status, err) {
//					alert("getChildnodes : " + status);
//				},
//				complete: function() {
//				}
//		    });
		}
	} else {									// 일반 로딩일 경우
		if(node.folded) node.setFoldingExecute(node.folded);
	}
	
	if(node.getChildren().length > 0) {
		var children = node.getChildren();
		for(var i = 0; i < children.length; i++) {
			this.initFolding(children[i]);						
		}
	}
}

JinoMap.prototype.initFoldingAll = function(){
	this.initFolding(this.getRootNode());
}

// mm 파일 형식으로 변환된 String을 반환한다.
JinoMap.prototype.toXML = function(){
	var strXML = "<map version=\"0.9.0\">\n";
	strXML += "<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->\n";
	strXML += this.rootNode.toXML() + "\n";
	strXML += "</map>";
	return strXML;
}

JinoMap.prototype.resetCoordinate = function(node){
	node.hgap = 0; // 노드사이 라인 기본값
	node.vshift = 0; // 노드 간 y축 기본값
	this.saveAction.editAction(node, false);
	if(node.getChildren().length > 0) {
		var children = node.getChildren();
		for(var i = 0; i < children.length; i++) {
			this.resetCoordinate(children[i]);			
		}
	}
}

JinoMap.prototype.createNodeFromText = function(node, text, separate){
	var lines = text.split("\n");
	var currentNode = node;
	var targetNode = node;
	var targetDeep = 0;
	var sep = separate;
	for(var i=0; i < lines.length; i++){
		if(!separate){
			sep = (lines[i].charAt(0) == '\t')? '\t' : '    ';			
		}		
		var tabs = lines[i].split(sep);
		var deep = tabs.length;
		var nodeText = tabs[deep-1];
		
		while(true){
			if(targetDeep == deep-1){
				var param = {parent: targetNode,
						text: nodeText};
				targetNode = this.createNodeWithCtrl(param);
				targetDeep = deep;
				break;
			}
			if(!targetNode.getParent()) break;
			targetNode = targetNode.getParent();
			targetDeep = targetDeep-1;
		}
	}
}

JinoMap.prototype.createTextFromNode = function(node, separate, text, depth){	
	depth = depth?depth:0;
	text = text?text:"";
	
	var whiteSize = "";
	for(var i = 0; i < depth; i++){		
		whiteSize = whiteSize + separate;
	}	
	text = text + whiteSize + node.getText() + "\n";
	
	if(node.getChildren().length > 0) {
		var children = node.getChildren();
		depth++;
		for(var i = 0; i < children.length; i++) {
			text = this.createTextFromNode(children[i], separate, text, depth);			
		}
	}
	
	return text;
}

JinoMap.prototype.setWaterMark = function(){
	// 워터마크
	this.watermark = $('<div id="okm_wartermark" style="position:absolute;top:0px;left:0px;text-decoration:underline;"><a href="http://www.okmindmap.com" target="_blank">OKMindmap</a></div>'); 
	$(this.work).after(this.watermark);	
	var watermarkResize = function() {
		var watermark = $('#okm_wartermark'); 
		var wm_x = $(window).width() - parseInt(watermark.css('width')) - 15;
		var wm_y = $(window).height() - parseInt(watermark.css('height')) - 15;
		watermark.css('top', wm_y);
		watermark.css('left', wm_x);
	}
	watermarkResize();
	$(window).resize(watermarkResize);	
}

JinoMap.prototype.setSessionTimeout = function(){
	if(!this.mode) return null;
	
	this.sessionTimeout = setTimeout(function(){
		
		if(ISMOBILE){
			alert("서비스 이용이 없어 자동 로그아웃 되었습니다.\n다시 로그인 하시기 바랍니다.");
			location.replace(jMap.cfg.contextPath+"/user/logout.do");
		}

		var callSessionTimeout = function(v,f) {
			// 연장하기를 만들려고 했으나 다음 문제점이 있어 보류.
			// 1. 기본 톰캣 세션 타임아웃이 30분이다.
			//    약 25분쯤 메시지 창이 뜨고  5분뒤 세션은 끊기는데 그 뒤에는 연장을 할 방법이 없다.
			// 2. 연장할 방법을 제대로 찾지 못했다. (가능은 하겠지만 말이다.)
			// 
			// 따라서 메시지 창이 뜨면 무조건 로그아웃된다. (물론, 통신을 하면 resetSessionTimeout함수로 시간을 재조정)
			if(v == 'logout') {
				location.replace(jMap.cfg.contextPath+"/user/logout.do");
			}
			else if(v == 'extension') {	// 아직 제대로 동작하는지 확인 못함
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
								console.log(req.responseText);
							} else {
							}
							
						}
					}
					req.open("GET", "/okmindmap/", true);
					req.send(null);
				}
				$("#dialog").dialog("close");
				jMap.resetSessionTimeout();				
			}
//			else {
//				location.replace(jMap.cfg.contextPath+"/user/logout.do");
//			}
		}
		
		var txt = '<center><font color="#ff0000">Timeout</font></center><br />' +
		'서비스 이용이 없어 자동 로그아웃 되었습니다.<br />' +
		'OK버튼을 눌러 다시 로그인 하시기 바랍니다.<br />';
		
		
		$("#dialog").append(txt);
		 
		$("#dialog").dialog({
			autoOpen:false,
			closeOnEscape: true,	//esc키로 창을 닫는다.
			width:350,	//iframe 크기보다 30px 더 필요하다.
			modal:true,		//modal 창으로 설정
			resizable:false,	//사이즈 변경
			close: function( event, ui ) {
				$("#dialog .dialog_content").remove();
				$("#dialog").dialog("destroy"); 
			},
		});
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog( "option", "buttons", [{
			text: i18n.msgStore["notice_button_ok"], 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callSessionTimeout("logout", formValue); 
			} 
		}]);
					  
		$("#dialog").dialog( "option", "title", "");
		$("#dialog").dialog("open");
		
		/*var re = $.prompt(txt, {
			callback: callSessionTimeout,
			persistent: true,
			top: '30%',
			buttons: {
				'OK': 'logout'
				//'Extension': 'extension',
				//'End': 'end'
			}
		});*/
		
	}, 1500000);	// 25분
}

JinoMap.prototype.resetSessionTimeout = function(){
	if(!this.mode) return null;
	
	clearTimeout(this.sessionTimeout);
	this.setSessionTimeout();
}


// ** viewBox에 대한 설명 : 
// width, height는 canvas크기에 마추려고 한다고 생각하면 쉽다.
// 따라서 width, height가 canvas보다 크면 그 크기를 canvas에 마추려하기 때문에 작아지는 것처럼보인다.
// 반대로 그 크기가 작으면 canvas에 마추기 위해 늘려야 하므로 커진것처럼 보인다.
// x, y는 canvas의 0,0에 마춘다.
// width와 height가 작아져 커져보인다면 가운데로 마추기 위해
// x, y를 - 방향으로 이동시켜 중심으로 옮길수 있다.
/**
 * 확대 축소
 * 
 *  @times : 비율 - 1을 기준으로 1.0이하 축소, 1.0이상 확대
 *  @frames : 프레임수. 프레임이 1이상 이라면 애니메이션 되는것 처럼 보임.
 */
JinoMap.prototype.scale = function(times, frames){
	if(times < 0.2 || times > 2.5) return;
	if (Raphael.svg) {
		if(!frames) frames = 1;
		
		var selected = this.getSelected();
		
		var oldTimes = this.getViewScale(this.scaleTimes);
		var newTimes = this.getViewScale(times);
		
		var tic = (newTimes - oldTimes) / frames;
		var rt = oldTimes;
		
		var that = this;
		var o = new TimeLine(30, frames);
		o.onframe = function(){
			rt = rt + tic;
			
	/*
			console.log(" ");
			console.log(t);
			var i = Math.floor(t);
			var d = Math.floor( (t*10)%10 );
			var dd = Math.floor( (t*100)%10 );
			var ddd = Math.floor( (t*1000)%10 );
			
			var rt = 0;
			if(1 < t)
				rt = 1/Math.pow(10, i-1)-(i+d-1)/Math.pow(10,i) - (dd*0.001)  - (ddd*0.0001);
			else
				rt = 2-t;
			console.log(rt);
			*/
			
			var canvasSize = RAPHAEL.getSize();
			var x = (1.0 - rt) * (canvasSize.width / 2); //2581.5;
			var y = (1.0 - rt) * (canvasSize.height / 2); //1397;
			var w = canvasSize.width * rt; 
			var h = canvasSize.height * rt;
			
			// 추가로 선택한 노드를 중심으로..
//			x = x - ( (1.0 - t) * (canvasSize.width / 2 - selected.getLocation().x) );
//			y = y - ( (1.0 - t) * (canvasSize.height / 2 - selected.getLocation().y) );	
			
			var viewbox = x+" "+y+" "+w+" "+h;
			RAPHAEL.canvas.setAttribute("viewBox", viewbox);
			
			that.cfg.scale = canvasSize.width / w;			// 실제 scale값 저장
		};
		o.onstart = function(){
		};
		o.onstop = function(){
		};
		o.start();
		
		this.scaleTimes = times;
	}	
}

JinoMap.prototype.getViewScale = function(t){
	//t = Math.round(t*1000)/1000.0;
	var i = Math.floor(t);
	var d = Math.floor( (t*10)%10 );
//	var dd = Math.floor( (t*100)%10 );
//	var ddd = Math.floor( (t*1000)%10 );
	
	var rt = 0;
	if(1 < t)
		rt = 1/Math.pow(10, i-1)-(i+d-1)/Math.pow(10,i);// - (dd*0.001);//  - (ddd*0.0001);
	else{
		var bb = function(b) {
			var c = 0;
			while(b < 1) {		
			b = b * 10;
			c = c + 1;
			}

			var d = Math.round(11 - b - c)/10;

			return c + d;
		}
		rt = bb(parseFloat(t));
	}
	
	return rt;
}

/**
 * 확대 축소. transform의 scale 값으로 변경
 * 
 *  @times : 비율 - 1을 기준으로 1.0이하 축소, 1.0이상 확대
 *  @frames : 프레임수. 프레임이 1이상 이라면 애니메이션 되는것 처럼 보임.
 */
JinoMap.prototype.scaleFromTransform = function(times, frames){
	if (Raphael.svg) {
		if(!frames) frames = 1;
		
		var oldTimes = this.scaleTimes;
		var newTimes = times;
		
		var tic = (newTimes - oldTimes) / frames;
		var t = oldTimes;		
		
		var o = new TimeLine(30, frames);
		o.onframe = function(){
			t = t + tic;
			jMap.scaleApply(t, jMap.getSelecteds().getLastElement());
			
			// 가운데가 보이게...
			//var work = jMap.work;

			//work.scrollLeft = Math.round( ( (work.scrollWidth*t) - work.offsetWidth) / 2 );
			//work.scrollTop = Math.round( ( (work.scrollHeight*t) - work.offsetHeight) / 2 );
		};
		o.onstart = function(){
		};
		o.onstop = function(){
		};
		o.start();
				
		this.scaleTimes = newTimes;
		
		
	}
}

// scale 적용
JinoMap.prototype.scaleApply = function(times, node){
	node.groupEl.setAttribute("transform", "scale(" + times + ")");
	node.connection && node.connection.line.node.setAttribute("transform", "scale(" + times + ")");
	
	if(node.getChildren().length > 0) {
		var children = node.getChildren();
		for(var i = 0; i < children.length; i++) {
			this.scaleApply(times, children[i]);			
		}
	}
}



JinoMap.prototype.enableDragPaper = function(bool){
	this._enableDragPaper = bool;
}

JinoMap.prototype.setUserConfig = function(userid){
	var that = this;
	$.ajax({
		type: 'post',
		dataType: 'json',
		async: false,
		url: that.cfg.contextPath+'/user/userconfig.do',
		data: {	'userid': userid,
					'returntype': 'json'
		},
		success: function(data) {
			var configs = data[0];
			for(config in configs) {
				if(configs[config].data != null && configs[config].data != "") {
					that.cfg[config] = configs[config].data;
				}				
			}
		},
		error: function(data, status, err) {
			alert("userConfig : " + status);
		}
	});
}


/**
 * Test 함수..
 * @param {jNode} node
 */
JinoMap.prototype.travelNodes = function(node){
	
	// this...
	// Something Works...
	// ex) node.anything
	
	if(node.getChildren().length > 0) {
		var children = node.getChildren();
		for(var i = 0; i < children.length; i++) {
			this.travelNodes(children[i]);			
		}
	}
}


/////////////////////////////////////////////////////


//노드를 가르키고 있는 ArrowLink들을 반환한다.
JinoMap.prototype.getArrowLinks = function(node) {
	var alinks = new Array();
	
	var nodeId = node.id;
	for(var i = 0; i < this.arrowlinks.length; i++) {
		if(this.arrowlinks[i].destination == nodeId) {
			alinks.push(this.arrowlinks[i]);
		}
	}
	
	return alinks;
}

/**
 * Node 내부에서 사용하는 함수
 * Private!
 */
JinoMap.prototype.addArrowLink = function(arrowlink) {
	this.arrowlinks.push(arrowlink);
}

/**
 * Node 내부에서 사용하는 함수
 * Private!
 */
JinoMap.prototype.removeArrowLink = function(arrowlink) {
	this.arrowlinks.remove(arrowlink);
}

/**
 * Chrome에서 이미지를 랜더링하지 않는 문제를 해결
 */
JinoMap.prototype.resolveRendering = function() {
	setTimeout(function() {
		var newValue = "block";
		
		var currentValue = $('svg').css("display");
		if(currentValue == "block") {
			newValue = "inline";
		}
		
		$('svg').css("display", newValue);
	}, 100);
}

JinoMap.prototype.getClientId = function() {
	return $.cookie('CLIENT_ID');
}

JinoMap.prototype.isAllowNodeEdit = function(node) {
	if(!this.cfg.restrictEditing) {
		return true;
	}
	
	if(this.cfg.mapOwner) {
		return true;
	}
	
	if(node.creator == 0/* && this.cfg.userId == 0*/) {
		var client_id = this.getClientId();
		if(node.client_id == "" || node.client_id == client_id) {
			return true;
		}
	} else if(node.creator == this.cfg.userId) {
		return true;
	}
	
	alert(i18n.msgStore["restrict_editing"]);
	
	return false;
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////// jClipboardManager ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jClipboardManager = function(map){
	this.clipboard = "";
//	this.rawXML = [];
	this.map = map;
}

jClipboardManager.prototype.type= "jClipboardManager";

/**
 * 클립보드에 노드의 내용을 xml형태로 저장한다. xml데이터는 <clipboard>에 싸인다.
 * 
 *  @nodes : 클립보드에 넣을 노드들
 */
jClipboardManager.prototype.toClipboard = function(nodes, isCopy) {
	this.clipboard = "<clipboard>";
	
	if(this.map.cfg.lazyLoading) {
		for(var i = 0; i < nodes.length; i++) {
			var id = nodes[i].getID();
			var that = this;
			$.ajax({
				type: 'post',
				async: false,
				url: jMap.cfg.contextPath+'/mindmap/childnodes.do',
				data: {'map': mapId,
							'node': id,
							'alldescendant': true },
				beforeSend: function() {},
				success: function(data, textStatus, jqXHR) {
					var childdata = jqXHR.responseText;
					if(isCopy){
						childdata = childdata.replace(/ID_[^"]*/g, '');
					}
					that.clipboard += childdata;
				},
				error: function(data, status, err) {
					alert("editAction : " + status);
				},
				complete: function() {
				}
		    });
			
		}
	} else {
//		this.rawXML = [];
		for(var i = 0; i < nodes.length; i++) {
			var xml = nodes[i].toXML();
			this.clipboard += xml;
//			this.rawXML.push(xml);
		}
	}
	
	this.clipboard += "</clipboard>";
}

/**
 * <clipboard>를 감싸고 있는 xml 데이터 텍스트  
 */
jClipboardManager.prototype.getClipboardText = function() {
	return this.clipboard;
}

///**
// * 선택한 노드들이 복사된 순순한 xml <node> 데이터 배열
// */
//jClipboardManager.prototype.getRawXML = function() {
//	return this.rawXML;
//}

