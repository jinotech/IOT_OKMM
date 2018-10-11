/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// JinoControllerGuest ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

JinoControllerGuest = function (map){
	this.map = map;
	this.nodeEditor = null;
	
	// 키 이벤트 제어
	document.onkeydown = function(evt){
		evt = evt || window.event;		
		if(jMap.work.hasFocus())
			return false;		
		return true;
	};
	
	$(this.map.work).on( "vmousedown", {controller: this}, this.mousedown );
	$(this.map.work).on( "vmousemove", {controller: this}, this.mousemove );
	$(this.map.work).on( "vmouseup", {controller: this}, this.mouseup );
	
//	this.map.mousemove(this.mouseMove);
//	this.map.mousedown(this.mouseDown);
//	this.map.mouseup(this.mouseUp);
	
	this.map.work.addEventListener("touchstart", this.touchstart, false);
	
	this.map.work.onkeydown = this.keyPress;
	
	// 노드 이외의 공간에 드래그앤 드롭 이벤트.. 모두 막기
	this.map.work.ondragenter = function(e){
		e = e || window.event;
		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue= false;
	};
	this.map.work.ondragover = function(e) {
		e = e || window.event;
		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue= false;
	};
	this.map.work.ondrop = function(e){
		e = e || window.event;
		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue= false;		
	};
}

JinoControllerGuest.prototype.type= "JinoControllerGuest";

JinoControllerGuest.prototype.keyPress = function(evt) {
	if ( STAT_NODEEDIT ) return true;
	
	evt = evt || window.event;
	
	// ctrl 및 meta 키
	var ctrl = null; 
    if (evt) ctrl = evt.ctrlKey; 
    else if (evt && document.getElementById) ctrl=(Event.META_MASK || Event.CTRL_MASK)
    else if (evt && document.layers) ctrl=(evt.metaKey || evt.ctrlKey);
    // alt 키
    var alt = evt.altKey
    
	var code = evt.keyCode;
	switch( code ) {
		case 37:	// LEFT
			var selected = jMap.getSelecteds().getLastElement();
			if(selected.isRootNode()) {
				var children = selected.getChildren();
				for(var i=0; i < children.length; i++){
					if (children[i].position == "left") {
						children[i].focus(true);
						break;
					}											
				}
			} else if(selected.isLeft && selected.isLeft()) {
				if(selected.folded) {
					selected.setFoldingExecute(false);
					jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(selected);				
					jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
					jMap.layoutManager.layout(true);
					
					return false;
				}
				var children = selected.getChildren();
				if(children.length > 0){
					children[0].focus(true);
				}
			} else {
				selected.getParent().focus(true);
			}
		break;
		case 38:	// UP
			var selected = jMap.getSelecteds().getLastElement();
			if (selected.isRootNode()) {
				
			} else {				
				var children = selected.getParent().getChildren();
				if(selected.getIndexPos() > 0){
					children[selected.getIndexPos() - 1].focus(true);
				}				
			}			
		break;
		case 39:	// RIGHT
			var selected = jMap.getSelecteds().getLastElement();
			if(selected.isRootNode()) {
				var children = selected.getChildren();
				for(var i=0; i < children.length; i++){
					if (children[i].position == "right") {
						children[i].focus(true);
						break;
					}											
				}
			} else if(selected.isLeft && selected.isLeft()) {
				selected.getParent().focus(true);
			} else {
				if(selected.folded) {
					selected.setFoldingExecute(false);
					jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(selected);				
					jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
					jMap.layoutManager.layout(true);
					
					return false;
				}
				var children = selected.getChildren();
				if(children.length > 0){
					children[0].focus(true);
				}
			}			
		break;
		case 40:	// DOWN
			var selected = jMap.getSelecteds().getLastElement();
			if (selected.isRootNode()) {
				
			} else {				
				var children = selected.getParent().getChildren();
				if(children.length > selected.getIndexPos() + 1){
					children[selected.getIndexPos() + 1].focus(true);
				}
			}
						
		break;
		case 70:	// 'f'
			if (ctrl){				
				jMap.controller.findNodeAction();
			}
		break;
		case 71:	// 'g' google seach on/off
			if ( ctrl ) {
				if(AL_GOOGLE_SEARCHER == null) {
					SET_GOOGLE_SEARCHER(true);
				} else {
					SET_GOOGLE_SEARCHER(false);
				}
			} else if ( evt.shiftKey ) {				
			} else {				
			}
		break;
		case 78:	// 'n'
			if (evt.ctrlKey) {
				location.href="/mindmap/new.do";
			}
		break;
		case 79:	// 'o'
			if (evt.ctrlKey) {				
				openMap();
			}
		break;
		case 32:	// SPACE
			var selected = jMap.getSelecteds().getLastElement();
			// Folding & unFolding
			selected.setFoldingExecute(!selected.folded);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(selected);				
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
			jMap.layoutManager.layout(true);
		break;
	}

	// 이외 모든 키는 막습니다...
	return false;
}

JinoControllerGuest.prototype.mousemove = function(e){
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
		
	if(targ.id == 'nodeEditor') return true;
	
	var dx = e.clientX - DRAG_POS.x;
	var dy = e.clientY - DRAG_POS.y;
	DRAG_POS.x = e.clientX;
	DRAG_POS.y = e.clientY;

	// Map 위치 이동
	if(jMap.DragPaper){		
		this.scrollTop -= dy;		
		this.scrollLeft -= dx;		
	}

	return false;
}

JinoControllerGuest.prototype.touchstart = function(e){
//	var targ;
//	var originalEvent;
//	if (!e) var e = window.event;
//	originalEvent = e.originalEvent.originalEvent || e.originalEvent || e;
//	if (originalEvent.target) targ = originalEvent.target;
//	else if (originalEvent.srcElement) targ = originalEvent.srcElement;
//	if (targ.nodeType == 3) // defeat Safari bug
//		targ = targ.parentNode;
//	
//	if (originalEvent.preventDefault)
//		originalEvent.preventDefault();
//	else
//		originalEvent.returnValue= false;

	// 모바일시 두개의 접점이 생길시 폴딩, 언폴딩
	if (ISMOBILE && supportsTouch && e.touches && e.touches.length == 2) {
		// Folding & unFolding
		var selectedNode = jMap.getSelecteds().getLastElement();
		if (selectedNode) {
			selectedNode.setFoldingExecute(!selectedNode.folded);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
			jMap.layoutManager.layout(true);
		}
	}
}

JinoControllerGuest.prototype.mousedown = function(e){
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	
	if(targ.id == 'nodeEditor') return true;
	if(STAT_NODEEDIT) jMap.controller.stopNodeEdit(true);
	
	DRAG_POS.x = e.clientX;
	DRAG_POS.y = e.clientY;

	// 노드 이외의 공간을 찾아 내야 하는데...
	// 크롬, 사파리는 'jinomap'을 찾아야 된다.. 하지만 저건 스크롤바에 문제가..
	if (targ.id == 'paper_mapview') {
		jMap.DragPaper = true;
	}
	// 크롬, 사파리...
	else if(targ.id == 'jinomap') {
		// clientX, clientY 값에 offsetLeft, offsetTop 값이 포함되어 있으므로 이를 고려해서 더해주어야 함
		if( targ.offsetLeft <= e.clientX && e.clientX < targ.clientWidth + targ.offsetLeft
		  && targ.offsetTop <= e.clientY && e.clientY < targ.clientHeight + targ.offsetTop) {
			jMap.DragPaper = true;
		}
	}
}

JinoControllerGuest.prototype.mouseup = function(e){
	e = e || window.event;	
	
	jMap.DragPaper = false;
	jMap.positionChangeNodes = false;
//	jMap.movingNode = false;
	
	//return false;
}


var interceptTabs = function(evt, control){
	key = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
	if (key==9) {
		insertAtCursor(control, '\t');
		return false;
	} else {
		return key;
	}
}

JinoControllerGuest.prototype.nodeStructureFromText = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	
	var txt = 	'<form><div class="dialog_content_nod">' +
				'<br />'+i18n.msgStore["create_node_text"]+
				'<br /><br /><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" ' +
				'onkeydown="return interceptTabs(event, this);" cols="50" rows="10">' +
				'</textarea></center>'+
				'</div></form>';
	function callbackform_structure(v,f){
		if (v) {
			var stText = f.okm_node_structure_textarea;
			
			node.folded && node.setFoldingExecute(false);
			jMap.createNodeFromText(node, stText);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
			jMap.layoutManager.layout(true);
		}
		$("#dialog_c").dialog("close");
		jMap.work.focus();
	}
	
	$("#dialog_c").append(txt);
	 
	$("#dialog_c").dialog({
		autoOpen:false,
		width:'auto',
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog_c .dialog_content_nod").remove();
			$("#dialog_c").dialog("destroy");
			jMap.work.focus();
		},
	});
				  
	$("#dialog_c").dialog( "option", "buttons", [{
		text: i18n.msgStore["button_apply"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog_c form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_structure(true, formValue); 
		} 
	}]);
	$("#dialog_c").dialog("option","dialogClass","nodeStructureFromText");			  
	$("#dialog_c").dialog( "option", "title", i18n.msgStore["import_text"]);
	$("#dialog_c").dialog("open");
};

JinoControllerGuest.prototype.nodeStructureToText = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	
	var text = jMap.createTextFromNode(node, "\t");
	
	var txt = 	'<div class="dialog_content_xml">' +
				'<br />'+i18n.msgStore["node_structure"]+
				'<br /><br /><center><textarea id="okm_node_structure_textarea"  onfocus= "this.select()" name="okm_node_structure_textarea" ' +
				'onkeydown="return interceptTabs(event, this);" cols="50" rows="10">' +
				text + 
				'</textarea></center>' + 
				'</div>';
	
	$("#dialog_c").append(txt);
	 
	$("#dialog_c").dialog({
		autoOpen:false,
		width:'auto',
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog_c .dialog_content_xml").remove();
			$("#dialog_c").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog_c").dialog("option","dialogClass","nodeStructureToText");
	$("#dialog_c").dialog( "option", "title", i18n.msgStore["export_text"]);
	$("#dialog_c").dialog("open");
};

JinoControllerGuest.prototype.nodeStructureFromXml = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	
	var txt = 	'<form><div class="dialog_content_nod">' +
				'<br />'+i18n.msgStore["create_node_xml"]+
				'<br /><center><textarea id="okm_node_structure_textarea" name="okm_node_structure_textarea" ' +
				'onkeydown="return interceptTabs(event, this);" cols="50" rows="10">' +
				'</textarea></center>' +
				'</div></from>';
	function callbackform_structure(v,f){
		if (v) {
			if(jMap.cfg.realtimeSave) {
				var isAlive = jMap.saveAction.isAlive();	
				if(!isAlive) return null;
			}
			
			var xmlStr = f.okm_node_structure_textarea;
			
			
			xmlStr = xmlStr.replace(/&/g, '&amp;');
			// & < > 는 매칭이 되는데 "는 매칭할 방법이 없다.. 그래서 다음같은 표현식에서 바꾼다. 			
			// /(TEXT=")([^"]*)/ig
			// 아래와 같은 표현식은 정말이지 정말 안좋은 방법이다.
			var re = /(TEXT=")(.*)(" FOLDED=)/ig;			
			xmlStr = xmlStr.replace (re, function () {
				var matchTag = arguments[1];
				var matchText = convertCharStr2XML(arguments[2]);
				var matchOther = arguments[3];
				return matchTag+matchText+matchOther;
			});
			re = /(LINK=")([^"]*)/ig;
			xmlStr = xmlStr.replace (re, function () {
				var matchTag = arguments[1];
				var matchText = convertCharStr2XML(arguments[2]);
				return matchTag+matchText;
			});
			
			// position 삭제			
			xmlStr = xmlStr.replace (/ POSITION="[^"]*"/ig, "");
			var pasteNodes = jMap.loadManager.pasteNode(node, xmlStr);
			var postPasteProcess = function() {
				// 저장
				for (var i = 0; i < pasteNodes.length; i++) {
					jMap.saveAction.pasteAction(pasteNodes[i]);
				}
				
				// 이벤트 리스너 호출
				jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, node, xmlStr);
				
				jMap.initFolding(node);
				jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
				jMap.layoutManager.layout(true);
			}
			
			if(jMap.loadManager.imageLoading.length == 0) {
				postPasteProcess();
			} else {
				var loaded = jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function(){
					postPasteProcess();
					// 이미지로더 리스너는 삭제!!! 중요.
					jMap.removeActionListener(loaded);
				});
			}
		}
		//$("#dialog_c").dialog("close");
		jMap.work.focus();
	}
	
	$("#dialog_c").append(txt);
	 
	$("#dialog_c").dialog({
		autoOpen:false,
		width:'auto',
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog_c .dialog_content_nod").remove();
			$("#dialog_c").dialog("destroy");
			jMap.work.focus();
		},
	});
				  
	$("#dialog_c").dialog( "option", "buttons", [{
		text: i18n.msgStore["button_apply"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog_c form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_structure(true, formValue); 
		} 
	}]);
	$("#dialog_c").dialog("option","dialogClass","nodeStructureFromXml");		  
	$("#dialog_c").dialog( "option", "title", i18n.msgStore["import_xml"]);
	$("#dialog_c").dialog("open");
	
}

JinoControllerGuest.prototype.nodeStructureToXml = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	
	var text = "<okm>" + node.toXML() + "</okm>";
	
	var txt =   '<div class="dialog_content_xml">' +
				'<br />'+i18n.msgStore["node_structure"]+
				'<br /><br /><center><textarea id="okm_node_structure_textarea" onfocus= "this.select()" name="okm_node_structure_textarea" ' +
				'onkeydown="return interceptTabs(event, this);" cols="50" rows="10">' +
				text + 
				'</textarea></center>' +
				'</div>';
	
	$("#dialog_c").append(txt);
	 
	$("#dialog_c").dialog({
		autoOpen:false,
		width:'auto',
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog_c .dialog_content_xml").remove();
			$("#dialog_c").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog_c").dialog("option","dialogClass","nodeStructureToXml");
	$("#dialog_c").dialog( "option", "title", i18n.msgStore["export_xml"]);
	$("#dialog_c").dialog("open");
		
}

JinoControllerGuest.prototype.foldingAction = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	// Folding & unFolding
	node.setFoldingExecute(!node.folded);
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
	jMap.layoutManager.layout(true);
}
