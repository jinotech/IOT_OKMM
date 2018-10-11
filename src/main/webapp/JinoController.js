/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

// Events
// 이벤트 모음 (jNode, document 에서 사용)
//var preventDefault = function () {
//    this.returnValue = false;
//},
//preventTouch = function () {
//    return this.originalEvent.preventDefault();
//},
//stopPropagation = function () {
//    this.cancelBubble = true;
//},
//stopTouch = function () {
//    return this.originalEvent.stopPropagation();
//},
//addEvent = (function () {
//    if (document.addEventListener) {
//        return function (obj, type, fn, element) {
//            var realName = supportsTouch && touchMap[type] ? touchMap[type] : type;
//            var f = function (e) {
//                if (supportsTouch && touchMap.hasOwnProperty(type)) {
//                    for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
//                        if (e.targetTouches[i].target == obj) {
//                            var olde = e;
//                            e = e.targetTouches[i];
//                            e.originalEvent = olde;
//                            e.preventDefault = preventTouch; 
//                            e.stopPropagation = stopTouch;
//                            break;
//                        }
//                    }
//                } 
//                return fn.call(element, e);
//            };
//            obj.addEventListener(realName, f, false);
//            return function () {
//                obj.removeEventListener(realName, f, false);
//                return true;
//            };
//        };
//    } else if (document.attachEvent) {
//        return function (obj, type, fn, element) {
//            var f = function (e) {
//                e = e || win.event;
//                e.preventDefault = e.preventDefault || preventDefault;
//                e.stopPropagation = e.stopPropagation || stopPropagation;
//                return fn.call(element, e);
//            };
//            obj.attachEvent("on" + type, f);
//            var detacher = function () {
//                obj.detachEvent("on" + type, f);
//                return true;
//            };
//            return detacher;
//        };
//    }
//})();

////////////////////////


// 키코드 체크
function F_CheckKey(evt, codes) {
	evt = (evt) ? evt:window.event;
	code = (evt.keyCode)? evt.keyCode:evt.charCode;
	
	for ( var i=0; i<codes.length; i++ ) {
		if ( codes[i] == code ) {
			return true;
		}
	}
	return false;
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// JinoController ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

JinoController = function (map){
	this.map = map;
	this.nodeEditor = null;
	
	this.enterKeyDown = false;
	
	// 키 이벤트 제어
	document.onkeydown = function(evt){
		evt = evt || window.event;		

		//allows paste Event propagate
		if ((evt.metaKey || evt.ctrlKey) && evt.keyCode == 86)
			return true;
		
		if (jMap.work.hasFocus())
			return false;
		
		return true;
	};
	
	
	// 노드 편집창 설정
	this.setNodeEditor(map.nodeEditorHandle[0]);
	
	// 마우스 이벤트
	$(this.map.work).on( "vmousedown", {controller: this}, this.mousedown );
	$(this.map.work).on( "vmousemove", {controller: this}, this.mousemove );
	$(this.map.work).on( "vmouseup", {controller: this}, this.mouseup );
	$(this.map.work).on( "vclick", {controller: this}, this.click );

//	this.map.mousemove(this.mousemove);
//	this.map.mousedown(this.mousedown);
//	this.map.mouseup(this.mouseup);
	
	this.map.work.addEventListener("touchstart", this.touchstart, false);
	
	
	//키보드 이벤트
	this.map.work.onkeydown = this.keyDown;
	this.map.work.onkeyup = this.keyUp;
	
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
	
	// wheel event
	/**
	 * This is high-level function. It must react to delta being more/less than
	 * zero.
	 */
	function handle(delta) {
		if (delta < 0){
			if(jMap.scaleTimes < 0.2) return;
			jMap.scale(jMap.scaleTimes-0.1);
		} else {
			if(jMap.scaleTimes > 2.5) return;			
			jMap.scale(jMap.scaleTimes+0.1);			
		}
	}
	
	/**
	 * Event handler for mouse wheel event.
	 */
	function wheel(event){
		var delta = 0;
		if (!event) /* For IE. */
			event = window.event;
		if (event.wheelDelta) { /* IE/Opera. */
			delta = event.wheelDelta/120;
			/**
			 * In Opera 9, delta differs in sign as compared to IE.
			 */
			if (window.opera)
				delta = -delta;
		} else if (event.detail) { /** Mozilla case. */
			/**
			 * In Mozilla, sign of delta is different than in IE. Also, delta is multiple of
			 * 3.
			 */
			delta = -event.detail/3;
		}
		/**
		 * If delta is nonzero, handle it. Basically, delta is now positive if wheel was
		 * scrolled up, and negative, if wheel was scrolled down.
		 */
		if (delta)
			handle(delta);
		/**
		 * Prevent default actions caused by mouse wheel. That might be ugly, but we
		 * handle scrolls somehow anyway, so don't bother here..
		 */
		if (event.preventDefault)
			event.preventDefault();
		event.returnValue = false;
	}
	
//	/**
//	 * Initialization code. If you use your own event management code, change it as
//	 * required.
//	 */
//	if (window.addEventListener)
//		/** DOMMouseScroll is for mozilla. */
//		window.addEventListener('DOMMouseScroll', wheel, false);
//	/** IE/Opera. */
//	window.onmousewheel = document.onmousewheel = wheel;
	
	
	// 세션 유지를 위해서
	//this.map.setSessionTimeout();
}

JinoController.prototype.type= "JinoController";

JinoController.prototype.keyUp = function(evt) {
	var code = evt.keyCode;
	switch( code ) {
		case 13:	// ENTER
			this.enterKeyDown = false;
		break;
	}
}
JinoController.prototype.keyDown = function(evt) {
	if ( STAT_NODEEDIT ) return true;
	
	evt = evt || window.event;
	
	// ctrl 및 meta 키
	var ctrl = null; 
    if (evt) ctrl = evt.ctrlKey; 
    else if (evt && document.getElementById) ctrl=(Event.META_MASK || Event.CTRL_MASK)
    else if (evt && document.layers) ctrl=(evt.metaKey || evt.ctrlKey);
    // alt 키
    var alt = evt.altKey;
    // shift 키
    var shift = evt.shiftKey;
	
	var code = evt.keyCode;
	switch( code ) {
		case 35:	// END
			if (alt) {
				unfoldingAllAction();
			}
		break;
		case 36:	// HOME
			if (alt) {
				foldingAllAction();
			}
		break;
		case 37:	// LEFT
			if (ScaleAnimate.isShowMode()){
				ScaleAnimate.prevShow(30);
				return false;
			}
			var selected = jMap.getSelecteds().getLastElement();
			switch(jMap.layoutManager.type) {
				case "jMindMapLayout" :
					if(selected.isRootNode()) {
						var children = selected.getChildren();
						for(var i=0; i < children.length; i++){
							if (children[i].position == "left") {
								children[i].focus(true);
								break;
							}											
						}
					} else if(selected.isLeft()) {
						jMap.controller.childNodeFocusAction(selected);
					} else {
						jMap.controller.parentNodeFocusAction(selected);
					}
					break;
				case "jTreeLayout" :
					jMap.controller.prevSiblingNodeFocusAction(selected);					
					break;
				default :
			}
		break;
		case 38:	// UP
			if (ctrl){
				ScaleAnimate.tempRotate(jMap.getSelecteds().getLastElement());
				return false;
			}
			var selected = jMap.getSelecteds().getLastElement();
			switch(jMap.layoutManager.type) {
				case "jMindMapLayout" :
					if (selected.isRootNode()) {
						
					} else {
						jMap.controller.prevSiblingNodeFocusAction(selected);
					}
					break;
				case "jTreeLayout" :
					jMap.controller.parentNodeFocusAction(selected);
					break;
				default :
			}
		break;
		case 39:	// RIGHT
			if (ScaleAnimate.isShowMode()){
				ScaleAnimate.nextShow(30);
				return false;
			}
			var selected = jMap.getSelecteds().getLastElement();
			switch(jMap.layoutManager.type) {
				case "jMindMapLayout" :
					if(selected.isRootNode()) {
						var children = selected.getChildren();
						for(var i=0; i < children.length; i++){
							if (children[i].position == "right") {
								children[i].focus(true);
								break;
							}											
						}
					} else if(selected.isLeft()) {
						jMap.controller.parentNodeFocusAction(selected);				
					} else {
						jMap.controller.childNodeFocusAction(selected);
					}
					break;
				case "jTreeLayout" :
					jMap.controller.nextSiblingNodefocusAction(selected);
					break;
				default :
			}
		break;
		case 40:	// DOWN
			var selected = jMap.getSelecteds().getLastElement();
			switch(jMap.layoutManager.type) {
				case "jMindMapLayout" :
					if (selected.isRootNode()) {
						
					} else {
						jMap.controller.nextSiblingNodefocusAction(selected);
					}
					break;
				case "jTreeLayout" :
					jMap.controller.childNodeFocusAction(selected);
					break;
				default :
			}
		break;
		
		case 48:	// '0'
			if (ctrl || evt.metaKey) {
				jMap.clipboardManager.clipboard = ''; //clear clipboard
			}
		break;

		case 49:	// '1'
			if (ctrl){
				NodeColorMix(jMap.rootNode);
			}
		break;
		case 50:	// '2'
			if (ctrl){
			}
		break;
		case 51:	// '3'
			if (ctrl){
			}
		break;
		case 52:	// '4'
			if (ctrl){
			}
		break;
		case 53:	// '5'
			if (ctrl){
			}
		break;
		case 54:	// '6'
			if (ctrl){
			}
		break;
		case 55:	// '7'
			if (ctrl){
			}
		break;
		case 65:	// 'a'			
			if (ctrl){
			}
		break;
		case 67:	// 'c'
			if (ctrl) {
				copyAction();
			}
		break;		
		case 70:	// 'f'
			if (ctrl){				
				findNodeAction();
			}
		break;
		case 71:	// 'g' google seach on/off
			if ( ctrl ) {
				if(AL_GOOGLE_SEARCHER == null) {
					SET_GOOGLE_SEARCHER(true);
				} else {
					SET_GOOGLE_SEARCHER(false);
				}
			}
		break;
		case 75:	// 'k'
			if (ctrl) {
				insertHyperAction();
			}
			if (alt) {
				imageProviderAction();
			}			
		break;
		case 77:	// 'm'			
		break;
		case 78:	// 'n'
			if (ctrl) {
				location.href="/mindmap/new.do";
			} else if (shift) {
				jMap.controller.prevFindNodeAction();
			} else {
				jMap.controller.nextFindNodeAction();
			}
		break;
		case 79:	// 'o'
			if (ctrl) {
				openMap();
			}
		break;
		case 80:	// 'p'
			if (ctrl) {
				if(ScaleAnimate.isShowMode())
					ScaleAnimate.endShowMode();
				else
					ScaleAnimate.startShowMode(30, 20, true);

			}
		break;
		case 81:	// 'q' 큐의 로그 보여주기
			if (ctrl) {
				var path = location.pathname;
				window.open(path.substring(0, path.indexOf('/map', 0)) + "/viewqueue.do?page="+location.pathname);
			}
		break;
		case 82:	// 'r' 마디 재정렬
			if (ctrl) {
				resetCoordinateAction();
			}
		break;
		case 114:	// 'R' 마디 재정렬
			if (ctrl) {
				resetCoordinateAction();
			}
		break;
		case 83:	// 's' save map
			if ( ctrl ) {
				if(!jMap.isSaved()) {
					saveMap();
				}
			}
		break;
		case 88:	// 'x'
			if (ctrl) {
				cutAction();
			}		
		break;
		case 86:	// 'v'
			if (ctrl) {
				pasteAction();
			}
			if (ctrl || evt.metaKey)
				return true;
		break;
		case 89:	// 'y'
			if (ctrl){
				//redoAction();
			}
		break;
		case 90:	// 'z'
			if (ctrl){
				//undoAction();
			}
		break;
		case 113:	// F2
			editNodeAction();
		break;		
		case 13:	// ENTER
			if(!this.enterKeyDown) {
//				if($("#dialog").dialog("isOpen") == true){
//					jMap.work.focus();
//				}else{
					insertSiblingAction();
					this.enterKeyDown = true;
//				}
			}
		break;
		case 27:	// ESC
			if ( ctrl ) {				
			}
		break;
		case 32:	// SPACE
			foldingAction();
		break;
		case 8:		// 'Mac' DELETE
		case 46:	// DELETE
			deleteAction();
		break;
		case 9:		// TAB
		case 45:	// INSERT
//			if($("#dialog").dialog("isOpen") == true){
//				jMap.work.focus();
//			}else{
				insertAction();
//			}
		break;
		case 107:		// +
			zoominAction(0.1);
		break;
		case 109:		// -
			zoomoutAction(0.1);
		break;
		case 187:		// + (=의 쉽프트)
			if ( shift ) {
				zoominAction(0.1);
			}
		break;
		case 189:		// - (-의 쉽프트)
			if ( shift ) {
				zoomoutAction(0.1);
			}
		break;
		case 191:		// /
			if ( shift ) {
				EditorManager.temporarily();
			}
		break;
//		case 219:		// [
//		break;
//		case 221:		// ]
//		break;
	}

	// 이외 모든 키는 막습니다...
	return false;
}

JinoController.prototype.mousemove = function(e){
	var targ;
	var originalEvent;
	if (!e) var e = window.event;
	originalEvent = e.originalEvent.originalEvent || e.originalEvent || e;
	if (originalEvent.target) targ = originalEvent.target;
	else if (originalEvent.srcElement) targ = originalEvent.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	
	if(targ.id == 'nodeEditor') return true;
	
	if (originalEvent.preventDefault)
		originalEvent.preventDefault();
	else
		originalEvent.returnValue= false;
	
	// Map 위치 이동
	var x = (e.clientX || e.targetTouches[0].pageX);
	var y = (e.clientY || e.targetTouches[0].pageY)
	var dx = x - DRAG_POS.x;
	var dy = y - DRAG_POS.y;
	DRAG_POS.x = x;
	DRAG_POS.y = y;

	if(jMap.DragPaper){		
		this.scrollTop -= dy;		
		this.scrollLeft -= dx;			
	}
	
	
	
	
	if(jMap.mouseRightClicked) return;
	
	if(jMap.dragEl && jMap.dragEl._drag && !jMap.movingNode && !jMap.mouseRightClicked){
		if(!jMap.isAllowNodeEdit(jMap.dragEl.node)) {
			jMap.DragPaper = false;
			jMap.positionChangeNodes = false;
			
			jMap.dragEl._drag = null;
			delete jMap.dragEl._drag;
			jMap.dragEl = null;
			delete jMap.dragEl;
			
	    	return;
	    }
		
		// 옮겨질 노드 설정
		var selectedNodes = jMap.getSelecteds();	
		jMap.positionChangeNodes = selectedNodes;
	
		// 쉐도우 노드 생성
		// jNode로 안만드는 이유는 jNode로 만들면 노드를 드래그 하는 동안 노드 밑에 위치한 노드를 잡아내지 못하기 때문이다.
		// mNode.toBack()을 하는 이유도 그런 이유이다.
		jMap.movingNode = RAPHAEL.rect();
		var mNode = jMap.movingNode;		
		
		mNode.ox = jMap.dragEl.node.body.type == "rect" ? jMap.dragEl.node.body.attr("x") : jMap.dragEl.node.body.attr("cx");
	    mNode.oy = jMap.dragEl.node.body.type == "rect" ? jMap.dragEl.node.body.attr("y") : jMap.dragEl.node.body.attr("cy");
		
		var bodyAttr = jMap.dragEl.node.body.attr();						// body
		delete bodyAttr.scale;
		delete bodyAttr.translation;
		delete bodyAttr.gradient;	
		bodyAttr["fill-opacity"] = .2;
		bodyAttr.fill = jMap.dragEl.node.background_color
		bodyAttr.stroke = jMap.dragEl.node.edge.color;
		mNode.attr(bodyAttr);
		
		mNode.toBack();
		
		/*
		if(!this.node.isRootNode()){			
			mNode.edge_width = this.node.edge.width;
			mNode.connection = JinoUtil.connectionShadow(this.node.parent.body, mNode, this.node.connection.line.attr().stroke, this.node.isLeft()? true : false);
			mNode.connection.line.attr({fill: this.node.connection.line.attr().fill, "fill-opacity":.2, "stroke-opacity":.2});
		}
		*/
	}
	
	if(jMap.dragEl && jMap.dragEl._drag && jMap.movingNode && !jMap.movingNode.removed) {
		var x = e.clientX;
	    var y = e.clientY;
	    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	    x += scrollX;
	    y += scrollY;
	    var dx = x - jMap.dragEl._drag.x;
	    var dy = y - jMap.dragEl._drag.y;
		
		var mNode = jMap.movingNode;
//		mNode.setLocation(mNode.ox + dx, mNode.oy + dy);	// 노드를 복사하는 방법
		
		// 스케일된 상태에 따라 노드
		var sdx = dx / jMap.cfg.scale;
		var sdy = dy / jMap.cfg.scale;
		
		var att = mNode.type == "rect" ? {x: mNode.ox + sdx, y: mNode.oy + sdy} : {cx: mNode.ox + sdx, cy: mNode.oy + sdy};
		mNode.attr(att);
		//mNode.connection && JinoUtil.connectionShadow(mNode.connection, null, null, this.node.isLeft()? true : false);
	}
}

JinoController.prototype.MoveWithChildNode = function(node, dx, dy){	
    node.translate(dx, dy);	

	for (var i = node.children.length; i--;) {
		MoveWithChildNode(node.children[i], dx, dy);
    }
}

JinoController.prototype.touchstart = function(e){
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
			selectedNode.setFolding(!selectedNode.folded);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
			jMap.layoutManager.layout(true);
		}
	}
}

JinoController.prototype.mousedown = function(e){
	var targ;
	var originalEvent;
	if (!e) var e = window.event;
	originalEvent = e.originalEvent.originalEvent || e.originalEvent || e;
	if (originalEvent.target) targ = originalEvent.target;
	else if (originalEvent.srcElement) targ = originalEvent.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	
	if(targ.id == 'nodeEditor') return true; 
	
	if (originalEvent.preventDefault)
		originalEvent.preventDefault();
	else
		originalEvent.returnValue= false;
	
	if(STAT_NODEEDIT) jMap.controller.stopNodeEdit(true);
	
	// 노드 이외의 공간을 찾아 내야 하는데...
	// 크롬, 사파리는 'jinomap'을 찾아야 된다.. 하지만 저건 스크롤바에 문제가..
	if (targ.id == 'paper_mapview') {
		DRAG_POS.x = e.clientX;
		DRAG_POS.y = e.clientY;
		
		jMap.DragPaper = true;
		
		// 배경에서의 context menu는 무시한다.
		//oOkmContextMenu && oOkmContextMenu.cancel();
		if (!ISMOBILE)	// touchstart보다 먼저 mousedown 불려 touchstart시 노드 제어가 안됨
			jMap.controller.blurAll();
	}
	// 크롬, 사파리...
	else if(targ.id == 'jinomap') {
		// clientX, clientY 값에 offsetLeft, offsetTop 값이 포함되어 있으므로 이를 고려해서 더해주어야 함
		if( targ.offsetLeft <= e.clientX && e.clientX < targ.clientWidth + targ.offsetLeft
		  && targ.offsetTop <= e.clientY && e.clientY < targ.clientHeight + targ.offsetTop) {
			DRAG_POS.x = e.clientX;
			DRAG_POS.y = e.clientY;
			
			jMap.DragPaper = true;
		}
		
		// 배경에서의 context menu는 무시한다.
		//oOkmContextMenu && oOkmContextMenu.cancel();
		if (!ISMOBILE)
			jMap.controller.blurAll();
	}
}

JinoController.prototype.mouseup = function(e){
	var targ;
	var originalEvent;
	if (!e) var e = window.event;
	originalEvent = e.originalEvent.originalEvent || e.originalEvent || e;
	if (originalEvent.target) targ = originalEvent.target;
	else if (originalEvent.srcElement) targ = originalEvent.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	
	if (originalEvent.preventDefault)
		originalEvent.preventDefault();
	else
		originalEvent.returnValue= false;
	
	jMap.DragPaper = false;
	jMap.positionChangeNodes = false;

	if(jMap.movingNode && !jMap.movingNode.removed) {
		var x = e.clientX;
	    var y = e.clientY;
	    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	    x += scrollX;
	    y += scrollY;
	    var dx = x - jMap.dragEl._drag.x;
	    var dy = y - jMap.dragEl._drag.y;
		
	    jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
		jMap.movingNode.remove();
		delete jMap.movingNode;
		
		jMap.dragEl._drag = null;
		delete jMap.dragEl._drag;
		
		var sdx = dx / jMap.cfg.scale;
		var sdy = dy / jMap.cfg.scale;
		
		var testMovePosX = (sdx>0)?sdx:-sdx;
		var testMovePosY = (sdy>0)?sdy:-sdy;		
		if(testMovePosX > NODE_MOVING_IGNORE || testMovePosY > NODE_MOVING_IGNORE) {
			jMap.dragEl.node.relativeCoordinate(sdx, sdy);
		}
		jMap.dragEl = null;
		delete jMap.dragEl;
	} else {
		if(jMap.dragEl) {
			jMap.dragEl._drag = null;
			delete jMap.dragEl._drag;
		}
		jMap.dragEl = null;
		delete jMap.dragEl;
	}
}

JinoController.prototype.click = function(e){
	var targ;
	var originalEvent;
	if (!e) var e = window.event;
	originalEvent = e.originalEvent.originalEvent || e.originalEvent || e;
	if (originalEvent.target) targ = originalEvent.target;
	else if (originalEvent.srcElement) targ = originalEvent.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	
//	if (originalEvent.preventDefault)
//		originalEvent.preventDefault();
//	else
//		originalEvent.returnValue= false;
}

/**
 * 노드 편집시 키 이벤트
 * @param {Event} evt
 */
JinoController.prototype.nodeEditKeyDown = function(evt){
	evt = evt || window.event;

/*	
	// ctrl 및 meta 키
	var ctrl = null; 
    if (evt) ctrl = evt.ctrlKey; 
    else if (evt && document.getElementById) ctrl=(Event.META_MASK || Event.CTRL_MASK)
    else if (evt && document.layers) ctrl=(evt.metaKey || evt.ctrlKey);
    // alt 키
    var alt = evt.altKey
	
	var code = evt.keyCode;
*/
	
	if (F_CheckKey(evt,[27])) {					// esc 키
		if(J_NODE_CREATING){
			var node = null;	
			var parentNode = null;		
			while (node = jMap.getSelecteds().pop()) {
				parentNode = node.getParent();								
				node.remove();
			}
			J_NODE_CREATING.focus(true);
			
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(parentNode);
			jMap.layoutManager.layout(true);
		}
		jMap.controller.stopNodeEdit(false);
	} else if (F_CheckKey(evt,[13])) {			// enter 키
		if (BrowserDetect.browser == "Firefox" && jMap.keyEnterHit++ == 0) {
			return false;
		}
		if (evt.shiftKey) {
			// 높이 늘리기
			var oInput = jMap.controller.nodeEditor;		
			oInput.style.height = oInput.offsetHeight + 9 + "px";
			return true;			
		}		
		jMap.controller.stopNodeEdit(true);
			
		return false;
	}
	
	return true;
}

JinoController.prototype.setNodeEditor = function(el) {
	this.nodeEditor = el;
	if ( this.nodeEditor ) {
		this.nodeEditor.style.display = "none";
		this.nodeEditor.onkeypress = this.nodeEditKeyDown;
		//this.nodeEditor.onkeydown = this.nodeEditKeyDown;
	}
}

JinoController.prototype.startNodeEdit = function(node){
	if ( this.nodeEditor == undefined || this.nodeEditor == null || node.removed ) {
		return false;
	}
	
	if(!jMap.isAllowNodeEdit(node)) {
		return false;
	}
	
	var hGap = TEXT_HGAP;
	var vGap = TEXT_VGAP;
	
	if(STAT_NODEEDIT) this.stopNodeEdit(true);
	
	STAT_NODEEDIT = true;
	
	this.nodeEditor.setAttribute("nodeID", node.id);
	
	var oInput = this.nodeEditor;
	
	var viewBox = [];
	viewBox.x = 0;
	viewBox.y = 0;
	viewBox.width = RAPHAEL.getSize().width;
	viewBox.height = RAPHAEL.getSize().height;
	if(RAPHAEL.canvas.getAttribute("viewBox")){
		var vb = RAPHAEL.canvas.getAttribute("viewBox").split(" ");
		viewBox.x = vb[0];
		viewBox.y = vb[1];
		viewBox.width = vb[2];
		viewBox.height = vb[3];		
	}
	
	oInput.style.fontFamily = node.text.attr()['font-family'];
	oInput.style.fontSize = node.text.attr()['font-size'] * this.map.cfg.scale +"px";
	if(node.isLeft && node.isLeft()) oInput.style.textAlign = "right";
	else oInput.style.textAlign = "left";	
	//oInput.style.fontStyle = ( node.font.italic == "true" )? "italic":"normal";
	//oInput.style.fontWeight = ( node.font.bold == "true" )? "bold":"normal";
	//oInput.style.color = ( node.color == "" )? "#"+NODE_FONT_COLOR:"#"+node.color;
	
	var width = node.body.getBBox().width * this.map.cfg.scale - hGap;
	// 편집창 넓이가 70이하일 때는 강제로 늘리기
	//if(width < 70) width = 70;
	var height = node.body.getBBox().height * this.map.cfg.scale - vGap;	
	var left = (node.body.getBBox().x - viewBox.x) * RAPHAEL.getSize().width / viewBox.width + hGap / 4;
	var top = (node.body.getBBox().y - viewBox.y) * RAPHAEL.getSize().height / viewBox.height + vGap / 4;
	
	oInput.style.display = "";
	oInput.style.width = width + "px";
	oInput.style.height = height + vGap + "px";
	oInput.style.left = left + "px";
	oInput.style.top = top - vGap/4 + "px";
	oInput.style.zIndex = 999;	
	
	oInput.isleft = node.isLeft();
	oInput.value = node.getText();
	oInput.focus();
	/*
	if ( org == CARET_ORG_START ) {
		this.setCaretPos(oInput, 0);
	} else if ( org == CARET_ORG_END ) {
		this.setCaretPos(oInput, node.text.length);
	} else {
		oInput.select();
	}
	
	this.panelD.onmousedown = null;
	*/
	return true;
	
}

// res - true: 편집 적용, false: 편집 취소
JinoController.prototype.stopNodeEdit = function(res) {
	STAT_NODEEDIT = false;
	J_NODE_CREATING = false;
	
	jMap.work.focus();
	
	if ( this.nodeEditor == undefined || this.nodeEditor == null ) {
		return null;
	}
	
	if ( res == false ) {
		this.nodeEditor.style.display = "none";
		return null;
	}
	
	var nodeID = this.nodeEditor.getAttribute("nodeID");
	if ( nodeID == undefined || nodeID == null || nodeID == "") {
		this.nodeEditor.style.display = "none";
		return null;
	}
	
	var node = this.map.getNodeById(nodeID);
	if ( node == undefined || node == null ) {
		this.nodeEditor.style.display = "none";
		return null;
	}
	
	this.nodeEditor.style.display = "none";
	this.nodeEditor.setAttribute("nodeID", "");
	
	var oInput = this.nodeEditor;
	
	var val = JinoUtil.trimStr(oInput.value);
	if ( val == node.getText() ) return null;
	
	node.setText(val);
	
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
	jMap.layoutManager.layout(true);
	
	if(ISMOBILE || supportsTouch) {
		$('html').offset({ top: 0 });
	}
	
	return node;
}

JinoController.prototype.blurAll = function(){
	var selectedNodes = jMap.getSelecteds();
	for(var i = selectedNodes.length-1; i >= 0; i--) {
		selectedNodes[i].blur();
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// ACTIONS /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////


JinoController.prototype.copyAction = function(){
	jMap.clipboardManager.toClipboard(jMap.getSelecteds(), true);
}

JinoController.prototype.cutAction = function(selectedNodes){
	if(!selectedNodes) selectedNodes = jMap.getSelecteds();
	
	for (var i = 0; i < selectedNodes.length; i++) {
		if(!jMap.isAllowNodeEdit(selectedNodes[i])) {
			return false;
		}
	}
	
	jMap.clipboardManager.toClipboard(selectedNodes);
	
	for (var i = 0; i < selectedNodes.length; i++) {
		selectedNodes[i].remove();
	}
	
	var parentNode = selectedNodes[0].parent;
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(parentNode);
	jMap.layoutManager.layout(true);
	
	return parentNode;
}

JinoController.prototype.pasteAction = function(selected){
	if(jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
	if(!selected) selected = jMap.getSelected();
	
	// 노드를 펼친다.
	selected.folded && selected.setFolding(false);
	
	// 선택한 노드에 클립보드에 있는 노드들을 붙인다.
	var pasteNodes = jMap.loadManager.pasteNode(selected, jMap.clipboardManager.getClipboardText());
	
	var postPasteProcess = function() {
		// 붙여넣기한 노드를 저장
		// 붙여넣기는 이미 데이터가 있기 때문에 저장후에 화면에 렌더링 할 수 있지만
		// 붙여넣기 하는 과정중에 POSITION 속성은 새로 만들어 지기 때문에 (다른 속성도?)
		// 렌더링된 후에 저장하는 것이다.
		for (var i = 0; i < pasteNodes.length; i++) {
			jMap.saveAction.pasteAction(pasteNodes[i]);
		}
		
		// 레이지 로딩일 경우, 자식들을 모두 삭제 한다.
		// 위에서 이미 서버에 저장되어 있고,
		// 붙여넣은 노드의 로딩은 모두 레이지로딩으로 한다.
		if(jMap.cfg.lazyLoading) {
			for (var i = 0; i < pasteNodes.length; i++) {
				var children = pasteNodes[i].getChildren();
				for (var c = children.length-1; c >= 0; c--) {
					children[c].removeExecute();				
				}
			}
		}
		
		// 이벤트 리스너를 위한 데이터
		// copy&paste의 경우 노드 아이디가 다시 만들어지기 때문에
		var sendXml = "<clipboard>";	
		for(var i = 0; i < pasteNodes.length; i++) {
				var xml = pasteNodes[i].toXML();
				sendXml += xml;
		}	
		sendXml += "</clipboard>";
		
		// 이벤트 리스너 호출
		jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, selected, sendXml);
		
		jMap.initFolding(selected);
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(selected);
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

JinoController.prototype.deleteAction = function(){
	var selectedNodes = jMap.getSelecteds();
	for (var i = 0; i < selectedNodes.length; i++) {
		if(!jMap.isAllowNodeEdit(selectedNodes[i])) {
			return false;
		}
	}
	
	var node = null;
	var parentNode = null;
	var indexPos = -1;
	while (node = jMap.getSelecteds().pop()) {
		parentNode = node.getParent();
		indexPos = node.getIndexPos();
		node.remove();
	}
	
	if (parentNode) {
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(parentNode);
		jMap.layoutManager.layout(true);
		
		// 노드를 삭제후 적정한 노드위치로 포커싱
		if (indexPos != -1) {
			if (parentNode.getChildren().length <= 0) {
				parentNode.focus();
			} else {
				if (parentNode.getChildren().length > indexPos) {
					parentNode.getChildren()[indexPos].focus();
				} else {
					parentNode.getChildren()[parentNode.getChildren().length - 1].focus();
				}
			}
			
		}
	} else {
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.getRootNode().screenFocus();
	}
	
}

JinoController.prototype.editNodeAction = function(){
	jMap.getSelecteds().getLastElement() &&
		jMap.controller.startNodeEdit(jMap.getSelecteds().getLastElement());
}

JinoController.prototype.ShiftenterAction = function(){
	var oInput = jMap.controller.nodeEditor;
	oInput.focus(true);
	$(oInput).insertAtCaret("\n");
	oInput.style.height = oInput.offsetHeight + 9 + "px";
}

JinoController.prototype.insertAction = function(){
	var node = jMap.getSelecteds().getLastElement();
	if (node) {
		J_NODE_CREATING = node;
		node.folded && node.setFolding(false);
		var param = {parent: node};
		
		//KHANG
		if (node.children.length > 0)
			param.sibling = node.children[node.children.length - 1];
		//KHANG
		
		var newNode = jMap.createNodeWithCtrl(param);
		newNode.focus(true);
		
		// 부모 노드를 넘겨야 되나 자신을 넘겨야 제대로 됨..
		// 문제가 되지 않으면 이데로 놔두자...
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
		jMap.layoutManager.layout(true);
		
		newNode.setTextExecute("");
		jMap.controller.startNodeEdit(newNode);
	}
}

JinoController.prototype.insertSiblingAction = function(){
	// FireFox의 엔터키 버그?? 다른 이벤트에서 기대하지 않은 이벤트 발생...
	if (BrowserDetect.browser == "Firefox") {
		jMap.keyEnterHit = 0;
	}
	
	var selectedNode = jMap.getSelecteds().getLastElement();
	var node = selectedNode && selectedNode.parent;
	if (node) {
		J_NODE_CREATING = selectedNode;
		// 폴딩 필요할까? 필요없음.
//		node.folded && node.setFolding(false);
		var index = selectedNode.getIndexPos() + 1;
		var position = null;
		// Root노드 자식에서 추가될 경우 왼쪽 오른쪽 고려
		if (selectedNode.position && selectedNode.getParent().isRootNode()) 
			position = selectedNode.position;
		var param = {parent: node,				
				index: index,
				position: position,
				sibling: selectedNode}; //KHANG add sibling for handling location
		var newNode = jMap.createNodeWithCtrl(param);
		newNode.focus(true);
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(newNode.parent);
		jMap.layoutManager.layout(true);
		
		newNode.setTextExecute("");
		jMap.controller.startNodeEdit(newNode);
	}
}

//KHANG
JinoController.prototype.insertTextOnBranch = function(){
	var selected = jMap.getSelected();
	
	if(!jMap.isAllowNodeEdit(selected)) {
		return false;
	}
	
	var branch_text = selected.attributes && selected.attributes['branchText'];
	branch_text = branch_text || "";
	
	var txt = '<form id="abcd"><div class="dialog_content " style="display:block;">' +
	'<br />Text: ' +
	'<input type="text" id="jino_input_branch_text"' +
	'name="jino_input_branch_text" onfocus= "this.select()" value="' +
	branch_text + '"' +
	' />' +
	'</div></form>';
	function callbackform_hyper(v,f){
		if (v) {
			selected.attributes['branchText'] = f.jino_input_branch_text;
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
			jMap.layoutManager.layout(true);
			
		} else {
			selected.attributes['branchText'] = undefined;
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
			jMap.layoutManager.layout(true);
			document.getElementById("jino_input_branch_text").value = "";
			//$("#dialog").dialog("close");
			
		}
		jMap.saveAction.editAction(selected);
		//$("#dialog").dialog("close");
		//jMap.work.focus();
	}
	
	
	$("#dialog").append(txt);
	 
	$("#dialog").dialog({
		autoOpen:false,
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
		  	$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		}
    });
	$("#dialog").dialog("option", "width", "none" );
	$("#dialog").dialog( "option", "buttons", [
       {
			text: i18n.msgStore["button_apply"], 
			click: function(e) {
					var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
					callbackform_hyper(true, formValue);
				}
       },
	   {
			text: i18n.msgStore["hyperlink_delete"],
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_hyper(false, formValue); 
				}
	   }
	]);
	$("#dialog").dialog("option","dialogClass","insertHyperAction");  		  
	$("#dialog").dialog( "option", "title", i18n.msgStore["menu_edit_text_on_branch"]);
	$("#dialog").dialog( "option", "open", function() {
		$("#abcd input[type='text']").keypress(function(event) {
			if (event.keyCode == 13) {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_hyper(true, formValue);
				$("#dialog").dialog("close");
				return false;
			}
			
		});
	});
	$("#dialog").dialog("open");
	
}

//KHANG


JinoController.prototype.insertHyperAction = function(){
	var selected = jMap.getSelected();
	
	if(!jMap.isAllowNodeEdit(selected)) {
		return false;
	}
	
	var urlText = selected.hyperlink && selected.hyperlink.attr().href;
	urlText = urlText || "http://";

	var txt = '<form id="abcd"><div class="dialog_content " style="display:block;">' +
	'<br />URL: ' +
	'<input type="text" id="jino_input_url"' +
	'name="jino_input_url" onfocus= "this.select()" value="' +
	urlText + '"' +
	' />' +
	'</div></form>';
	function callbackform_hyper(v,f){
		if (v) {
			selected.setHyperlink(f.jino_input_url);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
			jMap.layoutManager.layout(true);
		}else{
			selected.setHyperlink(null);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
			jMap.layoutManager.layout(true);
			document.getElementById("jino_input_url").value = "http://";
			//$("#dialog").dialog("close");
			
		}
		//$("#dialog").dialog("close");
		jMap.work.focus();
	}
	
	
	$("#dialog").append(txt);
	 
	$("#dialog").dialog({
		autoOpen:false,
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
		  	$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		}
    });
	$("#dialog").dialog("option", "width", "none" );
	$("#dialog").dialog( "option", "buttons", [
       {
			text: i18n.msgStore["button_apply"], 
			click: function(e) {
					var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
					callbackform_hyper(true, formValue);
				}
       },
	   {
			text: i18n.msgStore["hyperlink_delete"],
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_hyper(false, formValue); 
				}
	   }
	]);
	$("#dialog").dialog("option","dialogClass","insertHyperAction");  		  
	$("#dialog").dialog( "option", "title", i18n.msgStore["menu_edit_hyperlink"]);
	$("#dialog").dialog( "option", "open", function() {
		$("#abcd input[type='text']").keypress(function(event) {
			if (event.keyCode == 13) {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_hyper(true, formValue);
				$("#dialog").dialog("close");
				return false;
			}
			
		});
	});
	$("#dialog").dialog("open");
	
}

JinoController.prototype.insertImageAction = function(){
	var selected = jMap.getSelected();
	
	if(!jMap.isAllowNodeEdit(selected)) {
		return false;
	}
	
	var urlImg = selected.imgInfo.href && selected.imgInfo.href;
	urlImg = urlImg || "http://";
	var txt = '<form><div class="dialog_content">' +
	'<br />URL:<br />' +
	'<input type="text" id="jino_input_img_url"' +
	'name="jino_input_img_url" value=' +
	urlImg +
	' />'+
	'</div></form>';
	function callbackform_img(v,f){
		if (v) {
			selected.setImage(f.jino_input_img_url);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
			jMap.layoutManager.layout(true);
		}
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
		  	$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		},
    });
	$("#dialog").dialog("option", "width", "none" );
	$("#dialog").dialog( "option", "buttons", [{
		text: "<spring:message code='button.apply'/>", 
		click: function() {
			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_img(true, formValue); 
		} 
	}]);
			  
	$("#dialog").dialog( "option", "title", "<spring:message code='message.saveas'/>" );
	$("#dialog").dialog("open"); 
	
}

JinoController.prototype.imageRemoveAction = function(node){
	var selected = jMap.getSelected();
	selected.setImage();
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(selected);
	jMap.layoutManager.layout(true);
}

JinoController.prototype.imageResizerAction = function(node){
	if(!node) node = jMap.getSelected();
	JinoUtil.imgResizer(node);
}

JinoController.prototype.videoResizerAction = function(node){
	if(!node) node = jMap.getSelected();
	JinoUtil.videoResizer(node);
}

JinoController.prototype.findNodeAction = function(){
	var txt = '<form><div class="dialog_content">' +
	'<br />'+i18n.msgStore["find"] +' :' +
	'<input type="text" id="jino_input_search_text"' +
	'name="jino_input_search_text" value="" />' +
	'<br /><br />' +
	'<input type="checkbox" id="jino_check_search_ignorecase"' +
	'name="jino_check_search_ignorecase" value="" checked>' + 
	 i18n.msgStore["ignore_case"] +
	'<br />' +
	'<input type="checkbox" id="jino_check_search_wholeword"' +
	'name="jino_check_search_wholeword" value=""> Whole word'
	i18n.msgStore["whole_word"] +
	'</div></form>';
	function callbackform_search(v,f){
		if (v) {
			var searchText = f.jino_input_search_text;
			var isIgnorecase = f.jino_check_search_ignorecase;
			var isWholeword = f.jino_check_search_wholeword;
			jMap.foundNodes = jMap.findNode(searchText, isWholeword, isIgnorecase, jMap.getSelecteds().getLastElement());
			jMap.findIndex = -1;
			if(jMap.foundNodes.length == 0) {
				
			} else {
				jMap.controller.nextFindNodeAction();
			}
			
//			for (var i = 0; i < nodes.length; i++) {
//				var node = nodes[i].node;
//				
//				var currentNode = node;
//				while (!currentNode.isRootNode()) {
//					currentNode = currentNode.getParent();
//					currentNode.folded && currentNode.setFoldingExecute(false);
//				}
//				
//				node.focus(false);
//			}
//			jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
//			jMap.layoutManager.layout(true);
		}
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
		  	$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		},
    });
	$("#dialog").dialog("option", "width", "none" );
	$("#dialog").dialog( "option", "buttons", [{
		text: i18n.msgStore["button_apply"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_search(true, formValue); 
		} 
	}]);
			  
	$("#dialog").dialog( "option", "title", i18n.msgStore["find"]);
	$("#dialog").dialog("open");
}

JinoController.prototype.nextFindNodeAction = function(){
	jMap.findIndex++;
	if(jMap.findIndex < 0) {jMap.findIndex = 0; return; }
	if(jMap.findIndex >= jMap.foundNodes.length) {jMap.findIndex = jMap.foundNodes.length -1; return; }
	
	var node = jMap.foundNodes[jMap.findIndex].node;
	
	var currentNode = node;
	while (!currentNode.isRootNode()) {
		currentNode = currentNode.getParent();
		currentNode.folded && currentNode.setFoldingExecute(false);
	}
	
	node.focus(true);

	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
	jMap.layoutManager.layout(true);
	
	screenFocusAction(node);
}

JinoController.prototype.prevFindNodeAction = function(){
	jMap.findIndex--;
	if(jMap.findIndex < 0) {jMap.findIndex = 0; return; }
	if(jMap.findIndex >= jMap.foundNodes.length) {jMap.findIndex = jMap.foundNodes.length -1; return; }
	
	var node = jMap.foundNodes[jMap.findIndex].node;
	
	var currentNode = node;
	while (!currentNode.isRootNode()) {
		currentNode = currentNode.getParent();
		currentNode.folded && currentNode.setFoldingExecute(false);
	}
	
	node.focus(true);

	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
	jMap.layoutManager.layout(true);
	
	screenFocusAction(node);
}

JinoController.prototype.foldingAction = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	// Folding & unFolding
	node.setFolding(!node.folded);
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
	jMap.layoutManager.layout(true);
}

JinoController.prototype.foldingAllAction = function(){
	if(this.map.cfg.lazyLoading) {
		alert("this is not supported by lazyloading.");
		return;
	}
	var selected = jMap.getSelecteds().getLastElement();
	// 노드 중심으로 화면이동
	if(selected) {
		selected.screenFocus();
	} else {
		jMap.getRootNode().screenFocus();
	}		
	if(!selected) selected = this.map.getRootNode();
	selected.setFoldingAll(true);
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	jMap.layoutManager.layout(true);
}

JinoController.prototype.unfoldingAllAction = function(){
	if(this.map.cfg.lazyLoading) {
		alert("this is not supported by lazyloading.");
		return;
	}
	var selected = jMap.getSelecteds().getLastElement();
	if(!selected) selected = this.map.getRootNode();
	selected.setFoldingAll(false);
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
	jMap.layoutManager.layout(true);
}
	
JinoController.prototype.parentNodeFocusAction = function(selected){
	selected.getParent().focus(true);
}

JinoController.prototype.childNodeFocusAction = function(selected){
	if(selected.folded) {
		selected.setFolding(false);
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(selected);				
		jMap.layoutManager.layout(true);
		
		return false;
	}
	var children = selected.getChildren();
	if(children.length > 0){
		children[0].focus(true);
	}
}

JinoController.prototype.prevSiblingNodeFocusAction = function(selected){
	var prevSiblingNode = selected.prevSibling(true);
	if(prevSiblingNode){
		var parentNode = prevSiblingNode.getParent();
		// 자신의 부모는 항상 언폴딩 되어 있지 않은가?? 삭제해도 무관하지만..
		if(parentNode.folded) {
			parentNode.setFolding(false);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(parentNode);				
			jMap.layoutManager.layout(true);
		}				
		prevSiblingNode.focus(true);
	}
}

JinoController.prototype.nextSiblingNodefocusAction = function(selected){
	var nextSiblingNode = selected.nextSibling(true);
	if(nextSiblingNode){
		var parentNode = nextSiblingNode.getParent();
		// 자신의 부모는 항상 언폴딩 되어 있지 않은가?? 삭제해도 무관하지만..
		if(parentNode.folded) {
			parentNode.setFolding(false);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(parentNode);				
			jMap.layoutManager.layout(true);
		}				
		nextSiblingNode.focus(true);
	}
}

var insertAtCursor = function(myField, myValue){
	// IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
	}
   
	// MOZILLA/NETSCAPE support
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		restoreTop = myField.scrollTop;
		
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
		       
		myField.selectionStart = startPos + myValue.length;
		myField.selectionEnd = startPos + myValue.length;
		
		if (restoreTop>0) {
			myField.scrollTop = restoreTop;
		}
	} else {
		myField.value += myValue;
	}
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

JinoController.prototype.nodeStructureFromText = function(node){
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
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog_c .dialog_content_nod").remove();
			$("#dialog_c").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog_c").dialog("option", "width", "none" );
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
}

JinoController.prototype.nodeStructureToText = function(node){
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
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog_c .dialog_content_xml").remove();
			$("#dialog_c").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog_c").dialog("option", "width", "none" );
	$("#dialog_c").dialog("option","dialogClass","nodeStructureToText");
	$("#dialog_c").dialog( "option", "title", i18n.msgStore["export_text"]);
	$("#dialog_c").dialog("open");
}

JinoController.prototype.nodeStructureFromXml = function(node){
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
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog_c .dialog_content_nod").remove();
			$("#dialog_c").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog_c").dialog("option", "width", "none" );
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

JinoController.prototype.nodeStructureToXml = function(node){
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
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog_c .dialog_content_xml").remove();
			$("#dialog_c").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog_c").dialog("option", "width", "none" );
	$("#dialog_c").dialog("option","dialogClass","nodeStructureToXml");
	$("#dialog_c").dialog( "option", "title", i18n.msgStore["export_xml"]);
	$("#dialog_c").dialog("open");
		
}

JinoController.prototype.nodeTextColorAction = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	
	if(!jMap.isAllowNodeEdit(node)) {
		return false;
	}
	
	var selectedNodes = jMap.getSelecteds();

	for (var i = 0; i < selectedNodes.length; i++) {
		if(!jMap.isAllowNodeEdit(selectedNodes[i])) {
			return false;
		}
	}
	
	/*
	var txt = '<div class="dialog_content">' +	
	'<form><input type="text" id="color" name="color" value="'+node.getTextColor()+'" /></form>' +
	'<div id="colorpicker"></div>' +	 
	'<script type="text/javascript">' +
	'$("#colorpicker").farbtastic("#color");' +
	'</script>' +
	'</div>';
	 */
	
	var txt = '<div class="dialog_content">' +	
	'<form><input type="text" id="color" name="color" value="'+node.getTextColor()+'" /></form>' +
	'<div id="colorpicker"></div>' +	 
	'<script type="text/javascript">' +
	
	'var picker = $("#color").spectrum({' +
	    'allowEmpty:true,' +
	    'color: "' + node.getTextColor() + '",' +
	    'showInput: true,' +
	    'containerClassName: "full-spectrum",' +
	    'showInitial: true,' +
	    'showAlpha: true,' +
	    'maxPaletteSize: 10,' +
	    'preferredFormat: "hex",' +
	    'showPalette: true,' +
	    'showSelectionPalette: true,' +
	    'showButtons: false,' +
	    'flat: true,' +
	    'localStorageKey: "spectrum.mindmap",' +
	    'move: function (color) {' +
	    '	$("#color").val(color);' +
	    '},' +
	    'show: function () {' +
	    '},' +
	    'beforeShow: function () {' +
	    '},' +
	    'hide: function (color) {' +
	    '},' +
	    'palette: [' +
	        '["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/' +
	        '"rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],' +
	        '["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",' +
	        '"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],' +
	        '["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",' +
	        '"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",' +
	        '"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",' +
	        '"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",' +
	        '"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",' +
	        '"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",' +
	        '"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",' +
	        '"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",' +
	        '/*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",' +
	        '"rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/' +
	        '"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",' +
	        '"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]' +
	    ']' +
	'});' +
	'</script>' +
	'</div>';
	
	function callbackform_color(v,f){
		if (v) {
			for (var i = 0; i < selectedNodes.length; i++)
				selectedNodes[i].setTextColor(f.color);
		}
		$("#dialog").dialog("close");
		jMap.work.focus();
	}
	
	$("#dialog").append(txt);
	 
	$("#dialog").dialog({
		autoOpen:false,
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog").dialog("option", "width", "470" );
	$("#dialog").dialog( "option", "buttons", [{
		text: i18n.msgStore["button_apply"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_color(true, formValue); 
		} 
	}]);
	$("#dialog").dialog("option","dialogClass","nodeTextColorAction");			  
	$("#dialog").dialog( "option", "title", i18n.msgStore["text_color"]);
	$("#dialog").dialog("open");
	
}

JinoController.prototype.nodeBackgroundColorAction = function(node){
	if (!node) node = jMap.getSelecteds().getLastElement();
	
	if(!jMap.isAllowNodeEdit(node)) {
		return false;
	}
	
	var selectedNodes = jMap.getSelecteds();

	for (var i = 0; i < selectedNodes.length; i++) {
		if(!jMap.isAllowNodeEdit(selectedNodes[i])) {
			return false;
		}
	}
	
	var txt = '<div class="dialog_content">' +	
	'<form><input type="text" id="color" name="color" value="'+node.getBackgroundColor()+'" /></form>' +
	'<div id="colorpicker"></div>' +	 
	'<script type="text/javascript">' +
	
	'var picker = $("#color").spectrum({' +
	    'allowEmpty:true,' +
	    'color: "' + node.getBackgroundColor() + '",' +
	    'showInput: true,' +
	    'containerClassName: "full-spectrum",' +
	    'showInitial: true,' +
	    'showAlpha: true,' +
	    'maxPaletteSize: 10,' +
	    'preferredFormat: "hex",' +
	    'showPalette: true,' +
	    'showSelectionPalette: true,' +
	    //'showPaletteOnly: true,' +
	    //'togglePaletteOnly: true,' +
	    'showButtons: false,' +
	    'flat: true,' +
	    'localStorageKey: "spectrum.mindmap",' +
	    'move: function (color) {' +
	    '	$("#color").val(color);' +
	    '},' +
	    'show: function () {' +
	    '},' +
	    'beforeShow: function () {' +
	    '},' +
	    'hide: function (color) {' +
	    '},' +
	    'palette: [' +
	        '["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/' +
	        '"rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],' +
	        '["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",' +
	        '"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],' +
	        '["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",' +
	        '"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",' +
	        '"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",' +
	        '"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",' +
	        '"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",' +
	        '"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",' +
	        '"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",' +
	        '"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",' +
	        '/*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",' +
	        '"rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/' +
	        '"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",' +
	        '"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]' +
	    ']' +
	'});' +
//	'$("#colorpicker").farbtastic("#color");' +
	'</script>' +
	'</div>';
	
	function callbackform_color(v, f){
		if (v) {
			for (var i = 0; i < selectedNodes.length; i++)
				selectedNodes[i].setBackgroundColor(f.color);
		}
		$("#dialog").dialog("close");
		jMap.work.focus();
	}
	
	$("#dialog").append(txt);
	 
	$("#dialog").dialog({
		autoOpen:false,
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		},
	});
	
	$("#dialog").dialog("option", "width", "470");
	$("#dialog").dialog( "option", "buttons", [{
		text: i18n.msgStore["button_apply"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_color(true, formValue); 
		} 
	}]);
	$("#dialog").dialog("option","dialogClass","nodeBackgroundColorAction");			  
	$("#dialog").dialog( "option", "title", i18n.msgStore["bg_color"]);
	$("#dialog").dialog("open");
	
}

JinoController.prototype.changeMapBackground = function() {
	var txt = '<div class="dialog_content">' +
	'<form><input type="text" id="color" name="color" value="' + jMap.cfg.mapBackgroundColor + '" />' +
	'<div style="text-align:left;">Image: <input style="width:320px;" type="text" name="url" id="url" value="'
				+ (jMap.cfg.mapBackgroundImage || '') + '"/></div>' +
	'</form>' +

	'<form id="upload_form" method="post" action="' + jMap.cfg.contextPath + "/media/fileupload.do" + '" enctype="multipart/form-data">' + 
	'<input type="hidden" name="confirm" value="1"/>' +
	'<input type="hidden" name="url_only" value="true"/>' +
	'<input type="hidden" name="mapid" value="'+ jMap.cfg.mapId + '"/>' +

	'<div style="text-align:left"><input id="file" name="file" type="file" capture="camera" accept="image/*"/>' +
	'<input type="submit" id="btn_upload" value="Upload"/><div>' +	
	'</form>' +
	
	'<script type="text/javascript">' +
	
	'$("#color").spectrum({' +
	    'allowEmpty:true,' +
	    'color: "' + jMap.cfg.mapBackgroundColor + '",' +
	    'showInput: true,' +
	    'containerClassName: "full-spectrum",' +
	    'showInitial: true,' +
	    'showAlpha: true,' +
	    'maxPaletteSize: 10,' +
	    'preferredFormat: "hex",' +
	    'showPalette: true,' +
	    'showSelectionPalette: true,' +
	    'showButtons: false,' +
	    'flat: true,' +
	    'localStorageKey: "spectrum.mindmap",' +
	    'clickoutFiresChange: true,' + 
	    'move: function (color) {' +
	    '	$("#color").val(color);' +
	    '},' +
	    'show: function () {' +
	    '},' +
	    'beforeShow: function () {' +
	    '},' +
	    'hide: function (color) {' +
	    '},' +
	    'palette: [' +
	        '["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/' +
	        '"rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],' +
	        '["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",' +
	        '"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],' +
	        '["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",' +
	        '"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",' +
	        '"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",' +
	        '"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",' +
	        '"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",' +
	        '"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",' +
	        '"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",' +
	        '"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",' +
	        '/*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",' +
	        '"rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/' +
	        '"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",' +
	        '"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]' +
	    ']' +
	'});' +
	'</script>' +
	'</div>';
	
	function callbackform_color(v,f) {
		if (v) {
			var t = f.color;
			jMap.cfg.mapBackgroundColor = t;
			$(jMap.work).css("background-color", t);
			jMap.cfg.mapBackgroundImage = f.url;
			$(jMap.work).css("background-image", 'url("' + f.url + '")');
			//KHANG: save mapBackgroundImage, mapBackgroundColor
			var root = jMap.getRootNode();
			if (root.attributes == undefined)
				root.attributes = {};
			root.attributes['mapBackgroundColor'] = t;
			root.attributes['mapBackgroundImage'] = f.url;
			jMap.saveAction.editAction(root);
		}
		$("#dialog").dialog("close");
	}
	
	$("#dialog").append(txt);
	
	$('#upload_form').ajaxForm(function(data) {
		$('#url').val(jMap.cfg.contextPath + '/map' + data);
	});
	 
	$("#dialog").dialog({
		autoOpen:false,
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog").dialog("option", "width", "470" );
	$("#dialog").dialog( "option", "buttons", [{
		text: i18n.msgStore["button_apply"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_color(true, formValue); 
		} 
	}]);
	$("#dialog").dialog("option","dialogClass","insertImageAction");			  
	$("#dialog").dialog( "option", "title", "Map Background"); //i18n.msgStore["text_color"]
	$("#dialog").dialog("open");	
}

JinoController.prototype.nodeLineColor = function(node){
	if (!node) node = jMap.getSelecteds().getLastElement();
	
	if(!jMap.isAllowNodeEdit(node)) {
		return false;
	}
	
	var selectedNodes = jMap.getSelecteds();

	for (var i = 0; i < selectedNodes.length; i++) {
		if(!jMap.isAllowNodeEdit(selectedNodes[i])) {
			return false;
		}
	}
	
	var txt = '<div class="dialog_content">' +	
	'<form><input type="text" id="color" name="color" value="'+node.getBackgroundColor()+'" /></form>' +
	'<div id="colorpicker"></div>' +	 
	'<script type="text/javascript">' +
	
	'var picker = $("#color").spectrum({' +
	    'allowEmpty:true,' +
	    'color: "' + node.getBackgroundColor() + '",' +
	    'showInput: true,' +
	    'containerClassName: "full-spectrum",' +
	    'showInitial: true,' +
	    'showAlpha: true,' +
	    'maxPaletteSize: 10,' +
	    'preferredFormat: "hex",' +
	    'showPalette: true,' +
	    'showSelectionPalette: true,' +
	    //'showPaletteOnly: true,' +
	    //'togglePaletteOnly: true,' +
	    'showButtons: false,' +
	    'flat: true,' +
	    'localStorageKey: "spectrum.mindmap",' +
	    'move: function (color) {' +
	    '	$("#color").val(color);' +
	    '},' +
	    'show: function () {' +
	    '},' +
	    'beforeShow: function () {' +
	    '},' +
	    'hide: function (color) {' +
	    '},' +
	    'palette: [' +
	        '["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/' +
	        '"rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],' +
	        '["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",' +
	        '"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],' +
	        '["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",' +
	        '"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",' +
	        '"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",' +
	        '"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",' +
	        '"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",' +
	        '"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",' +
	        '"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",' +
	        '"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",' +
	        '/*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",' +
	        '"rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/' +
	        '"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",' +
	        '"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]' +
	    ']' +
	'});' +
//	'$("#colorpicker").farbtastic("#color");' +
	'</script>' +
	'</div>';
	
	function callbackform_color(v, f){
		if (v) {
			for (var i = 0; i < selectedNodes.length; i++){
				selectedNodes[i].setBranchColorExecute(f.color);
				//selectedNodes[i].attributes['line_color'] = f.color;
				//jMap.saveAction.editAction(selectedNodes[i]);
				jMap.saveAction.updateLineColorAction(selectedNodes[i].dbid, f.color);
			}
		}
		$("#dialog").dialog("close");
		jMap.work.focus();
	}
	
	$("#dialog").append(txt);
	 
	$("#dialog").dialog({
		autoOpen:false,
		closeOnEscape: true,	//esc키로 창을 닫는다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		},
	});
	
	$("#dialog").dialog("option", "width", "470");
	$("#dialog").dialog( "option", "buttons", [{
		text: i18n.msgStore["button_apply"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_color(true, formValue); 
		} 
	}]);
	$("#dialog").dialog("option","dialogClass","nodeBackgroundColorAction");			  
	$("#dialog").dialog( "option", "title", i18n.msgStore["line_color"]);
	$("#dialog").dialog("open");
	
}

JinoController.prototype.deleteArrowlinkAction = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	
	if(!jMap.isAllowNodeEdit(node)) {
		return false;
	}

	for (var i = 0; i < node.arrowlinks.length; i++) {		
		node.removeArrowLink(node.arrowlinks[i]);
	}
}

JinoController.prototype.screenFocusAction = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	if(!node) node = jMap.getRootNode();
	node.screenFocus();
}

JinoController.prototype.resetCoordinateAction = function(node){
	if(!node) node = jMap.getSelecteds().getLastElement();
	if(!node) node = jMap.getRootNode();
	
	if(!jMap.isAllowNodeEdit(node)) {
		return false;
	}
	
	jMap.resetCoordinate(node);
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
}

JinoController.prototype.qrCodeAction = function() {
	if(typeof jMap.cfg.QRCode == 'undefined') {
		alert("Service Unavailable");
		return false;
	}
	
	var txt = '<from><div class="dialog_content_nod" align="center">' +
		'<img src="'+jMap.cfg.QRCode+'">' +
		'</div></from>';
	
	function callbackform_qrcode(v, f){
		if (v) {}
		$("#dialog").dialog("close");
		jMap.work.focus();
	}
	
	$("#dialog").append(txt);
	 
	$("#dialog").dialog({
		autoOpen:false,
		closeOnEscape: true,	//esc키로 창을 닫는다.
		width:"400px",	//iframe 크기보다 30px 더 필요하다.
		modal:true,		//modal 창으로 설정
		resizable:false,	//사이즈 변경
		close: function( event, ui ) {
			$("#dialog .dialog_content").remove();
			$("#dialog").dialog("destroy");
			jMap.work.focus();
		},
	});
	$("#dialog").dialog("option", "width", "none" );
	$("#dialog").dialog( "option", "buttons", [{
		text: i18n.msgStore["button_apply"], 
		click: function() {
			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
			callbackform_qrcode(true, formValue); 
		} 
	}]);
				  
	$("#dialog").dialog( "option", "title", i18n.msgStore["qr_code"]);
	$("#dialog").dialog("open");
	
}

JinoController.prototype.foreignObjRemoveAction = function(node) {
	if(!node) node = jMap.getSelecteds().getLastElement();
	node.setForeignObject("");
	node.setHyperlink("");
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
	jMap.layoutManager.layout(true);
}

JinoController.prototype.insertIFrameAction = function(node) {
	if(!node) node = jMap.getSelecteds().getLastElement();
	
	if(!jMap.isAllowNodeEdit(node)) {
		return false;
	}
	
	var urlValue = urlValue || "http://";
	var widthValue ="";
	var heightValue ="";
	var oldMargin_left = 0;
	var oldMargin_top = 0;
	var scrollingValue ="no";
	var checkNo = " checked";
	var checkYes = "";
	var zoomValue = 100;
	if(node.foreignObjEl){
		var currentIframe = node.foreignObjEl.getElementsByTagName("iframe")[0];
	}
	if(currentIframe != undefined){
		var urlValue = currentIframe.getAttribute("src");
		var widthValue = node.foreignObjEl.getAttribute("width");
		var heightValue = node.foreignObjEl.getAttribute("height");
		var scrollingValue = currentIframe.getAttribute("scrolling");
		var zoomValue = currentIframe.getAttribute("zoom");
		var oldMargin_left = Math.abs(currentIframe.style.marginLeft.replace("px", ""));
		var oldMargin_top = Math.abs(currentIframe.style.marginTop.replace("px", ""));
		if (!zoomValue) zoomValue = 100;
		
	}else{
		var widthValue =  parent.jMap.cfg.default_img_size;
		var heightValue =  parent.jMap.cfg.default_img_size;
	}
	if(scrollingValue == "Yes"){
		var checkNo = " ";
		var checkYes = " checked";
	}
	var txt = '<form><div class="dialog_content_nod">'
			+ '<br />'
			+ i18n.msgStore["address"] + ' : <input type="text" id="url" name="url" onfocus= "this.select()" value="'+urlValue+'" style="width: 300px" />'
			+ '<br><br>'
			//+ i18n.msgStore["height"] + ' : <input type="text" id="height" name="height" value="'+heightValue+'" style="width:70px" />'
			+ '<table cellspacing="0" style="margin:0px;">'
			+ '<tr>'
			+ '<td><div id="zoom_title">' + i18n.msgStore["zoom"] + ': </div></td><td><div id="zoomSlider"></div></td>'
			+ '<td><input type="text" id="zoom" name="zoom" value="'+zoomValue+'" style="width:50px" />%</td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td><div id="width_title">' + i18n.msgStore["width"] + ': </div></td><td><div id="widthSlider"></div></td>'
			+ '<td><input type="text" id="width" name="width" value="'+widthValue+'" style="width:70px" /></td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td><div id="height_title">' + i18n.msgStore["height"] + ': </div></td><td><div id="heightSlider"></div></td>'
			+ '<td><input type="text" id="height" name="height" value="'+heightValue+'" style="width:70px" /></td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td><div id="margin_left_title">' +i18n.msgStore["margin_left"] + ': </div></td><td><div id="slider_margin_left"></div></td>'
			+ '<td><input type="text" id="margin_left" name="margin_left" value="'+oldMargin_left+'" style="width:70px" /></td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td><div id="margin_top_title">' + i18n.msgStore["margin_top"] + ': </div></td>'
			+ '<td><div id="slider_margin_top"></div></td>'
			+ '<td><input type="text" id="margin_top" name="margin_top" value="'+oldMargin_top+'" style="width:70px" /></td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td><div id=scroll>'+i18n.msgStore["scrolling"] + ': </div></td>'
			+ '<td>' + i18n.msgStore["yes"] + '<input type="radio" id="scrollYes" name="radioScroll" '+checkYes+ ' value="Yes" style="width:10px" />&nbsp;&nbsp;&nbsp;'	
			+ i18n.msgStore["no"] + '<input type="radio" id="scrollNo" name="radioScroll" '+checkNo+ ' value="No" style="width:10px" /></td>'	
			+ '</tr></table>'
			+ '</div></form>';
	function callbackform_structure(v,f) {
		
		if (v) {
			var url = f.url;
			var margin_left = parseInt(Math.abs(f.margin_left), 10);
			var margin_top = parseInt(Math.abs(f.margin_top), 10);
      		var zoom = parseInt(f.zoom, 10)/100.0;
			var width = parseInt(f.width, 10)/zoom + margin_left;
			var height = parseInt(f.height, 10)/zoom + margin_top;
      		var scrollAction = "";
      		
      		if(url != ""){
				// 여기에 margin-left, magin-top 넣을 것 (아래줄)
      			var style_zoom =
      			'-moz-transform: scale(' + zoom + ');' +
      			'-moz-transform-origin: 0 0;' +
      			'-o-transform: scale(' + zoom + ');' +
      			'-o-transform-origin: 0 0;' +
      			'-webkit-transform: scale(' + zoom + ');' +
      			'-webkit-transform-origin: 0 0;'

      			node.setForeignObject('<iframe style="' + style_zoom + 'border: none;margin-left:'+(-margin_left)+'px;margin-top:'+(-margin_top)+'px;" src="'+url+'" width="'
										+width+'" height="'+height+'" scrolling="'+f.radioScroll+'" zoom="' + f.zoom + '"></iframe>', f.width, f.height);
				node.setHyperlink(url);
				jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
				jMap.layoutManager.layout(true);
      		} else if (urlValue == "http://"){
      		}
		} else {
				node = parent.jMap.getSelecteds().getLastElement();
				node.setForeignObject("");
				node.setHyperlink("");
				document.getElementById("url").value = "";
				parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
				parent.jMap.layoutManager.layout(true);
		}
		//$("#dialog").dialog("close");
		//jMap.work.focus();
	}
	
	$("#dialog").append(txt);
	 
	var re = $("#dialog").dialog({
				autoOpen:false,
				closeOnEscape: true,	//esc키로 창을 닫는다.
				modal:true,		//modal 창으로 설정
				resizable:false,	//사이즈 변경
				close: function( event, ui ) {
					var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
					//callbackform_structure(true, formValue); 
					$("#dialog .dialog_content_nod").remove();
					$("#dialog").dialog("destroy");
					jMap.work.focus();
				},
			});
	$("#dialog").dialog("option", "width", "none" );
	$("#dialog").dialog( "option", "buttons", [
	   {
			text: i18n.msgStore["button_apply"], 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_structure(true, formValue); 
		    } 
	   },
	   {
			text: i18n.msgStore["iframe_delete"], 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_structure(false, formValue); 
		    } 
	   }
	   ]);
	$("#dialog").dialog("option","dialogClass","insertIFrameAction");			  
	$("#dialog").dialog( "option", "title", i18n.msgStore["iframe"]);
	$("#dialog").dialog("open");
	
	$(re).ready(function (){
		$("#zoomSlider").slider({
			min:10,
			max:200,
			value: zoomValue,
			change: function(event, ui){
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환			
				var url = formValue.url;
				var margin_left = parseInt(Math.abs(formValue.margin_left), 10);
				var margin_top = parseInt(Math.abs(formValue.margin_top), 10);
				document.getElementById("zoom").value = ui.value;
				var zoom = parseInt(ui.value, 10);
				if (zoom != ""){
					zoom = zoom/100.0;
					var change_foreign_width = parseInt(node.foreignObjEl.getAttribute("width"), 10);
					var change_foreign_height = parseInt(node.foreignObjEl.getAttribute("height"), 10);
					
					/*
					if ($("#scrollno").attr("checked") == null){
						var scrollAction = "Yes";
					}else{
						var scrollAction = "No";						
					}
					*/
					scrollAction = formValue.radioScroll;
					ui.value = parseInt(ui.value);
	      			var style_zoom =
	          			'-moz-transform: scale(' + zoom + ');' +
	          			'-moz-transform-origin: 0 0;' +
	          			'-o-transform: scale(' + zoom + ');' +
	          			'-o-transform-origin: 0 0;' +
	          			'-webkit-transform: scale(' + zoom + ');' +
	          			'-webkit-transform-origin: 0 0;';

					
					node.setForeignObjectExecute('<iframe style="' + style_zoom + 'border: none;margin-left:'+(-margin_left)+'px;margin-top:'+(-margin_top)+'px;" src="'+url+'" width="'
							+(change_foreign_width/zoom + margin_left) +'" height="'+(change_foreign_height/zoom + margin_top)+'" scrolling="'+scrollAction+'" zoom="' + ui.value + '"></iframe>',
							change_foreign_width, change_foreign_height);
				}
			}
		});

		$("#slider_margin_left").slider({
			min:0,
			max:1000,
			value:oldMargin_left,
			change: function(event, ui){
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환			
				var url = formValue.url;
				var margin_left = parseInt(Math.abs(formValue.margin_left), 10);
				var margin_top = parseInt(Math.abs(formValue.margin_top), 10);
				document.getElementById("margin_left").value = ui.value;
				if(margin_left != ""){
					var change_foreign_width = parseInt(node.foreignObjEl.getAttribute("width"), 10);
					var change_foreign_height = parseInt(node.foreignObjEl.getAttribute("height"), 10);
					
					if ($("#scrollno").attr("checked") == null){
						var scrollAction = "Yes";
					} else {
						var scrollAction = "No";						
					}
					
					ui.value = parseInt(ui.value);

					scrollAction = formValue.radioScroll;
					var zoom = parseInt(formValue.zoom, 10);
					if (zoom == "") zoom = 1.0;
					else zoom = zoom/100.0;

	      			var style_zoom =
	          			'-moz-transform: scale(' + zoom + ');' +
	          			'-moz-transform-origin: 0 0;' +
	          			'-o-transform: scale(' + zoom + ');' +
	          			'-o-transform-origin: 0 0;' +
	          			'-webkit-transform: scale(' + zoom + ');' +
	          			'-webkit-transform-origin: 0 0;';
	      			
					node.setForeignObjectExecute('<iframe style="' + style_zoom + 'border: none;margin-left:'+(-ui.value)+'px;margin-top:'+(-margin_top)+'px;" src="'+url+'" width="'
							+(change_foreign_width/zoom + ui.value) +'" height="'+(change_foreign_height/zoom + margin_top)+'" scrolling="'+scrollAction+'" zoom="' + formValue.zoom + '"></iframe>',
							change_foreign_width, change_foreign_height);
				}	
			}
		});
		$("#slider_margin_top").slider({
			min:0,
			max:1000,
			value:oldMargin_top,
			change: function(event, ui){
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환			
				var url = formValue.url;
				var margin_left = parseInt(Math.abs(formValue.margin_left), 10);
				var margin_top = parseInt(Math.abs(formValue.margin_top), 10);
				document.getElementById("margin_top").value = ui.value;
				if(margin_top != ""){
					var change_foreign_width = parseInt(node.foreignObjEl.getAttribute("width"), 10);
					var change_foreign_height = parseInt(node.foreignObjEl.getAttribute("height"), 10);
					if($("#scrollno").attr("checked") == null){
						var scrollAction = "yes";
					}else{
						var scrollAction = "no";						
					}
					ui.value = parseInt(ui.value);
					
					scrollAction = formValue.radioScroll;
					var zoom = parseInt(formValue.zoom, 10);
					if (zoom == "") zoom = 1.0;
					else zoom = zoom/100.0;

	      			var style_zoom =
	          			'-moz-transform: scale(' + zoom + ');' +
	          			'-moz-transform-origin: 0 0;' +
	          			'-o-transform: scale(' + zoom + ');' +
	          			'-o-transform-origin: 0 0;' +
	          			'-webkit-transform: scale(' + zoom + ');' +
	          			'-webkit-transform-origin: 0 0;';
					
					node.setForeignObjectExecute('<iframe style="' + style_zoom + 'border: none;margin-left:'+(-margin_left)+'px;margin-top:'+(-ui.value)+'px;" src="'+url+'" width="'
							+(change_foreign_width/zoom + margin_left) +'" height="'+(change_foreign_height/zoom + ui.value)+'" scrolling="'+scrollAction+'" zoom="' + formValue.zoom + '"></iframe>',
							change_foreign_width, change_foreign_height);
				}	
			}
		});
		$("#widthSlider").slider({
			min:20, 
			max:1000, 
			value:widthValue,
			change: function(event, ui){
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환			
				var url = formValue.url;
				var margin_left = parseInt(Math.abs(formValue.margin_left), 10);
				var margin_top = parseInt(Math.abs(formValue.margin_top), 10);
				var width = parseInt(formValue.width, 10) + margin_left;
				var height = parseInt(formValue.height, 10);
				document.getElementById("width").value = ui.value;
				if($("#scrollno").attr("checked") == null){
					var scrollAction = "yes";
				}else{
					var scrollAction = "no";						
				}

				scrollAction = formValue.radioScroll;
				var zoom = parseInt(formValue.zoom, 10);
				if (zoom == "") zoom = 1.0;
				else zoom = zoom/100.0;

      			var style_zoom =
          			'-moz-transform: scale(' + zoom + ');' +
          			'-moz-transform-origin: 0 0;' +
          			'-o-transform: scale(' + zoom + ');' +
          			'-o-transform-origin: 0 0;' +
          			'-webkit-transform: scale(' + zoom + ');' +
          			'-webkit-transform-origin: 0 0;';
          			//'zoom:' + zoom*100 + '%;';

				if (node.foreignObjEl != undefined){
					node.setForeignObjectExecute('<iframe style="' + style_zoom + 'border: none;margin-left:'+(-margin_left)+'px;margin-top:'+(-margin_top)+'px;" src="'+url+'" width="'
							+(ui.value/zoom+margin_left) +'" height="'+(height/zoom + ui.value + (margin_top - ui.value))+'" scrolling="'+scrollAction+'" zoom="' + formValue.zoom + '"></iframe>',
							ui.value, height);
				}
			}
		});
		$("#heightSlider").slider({
			min:20, 
			max:1000, 
			value:heightValue,
			change: function(event, ui){
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환			
				var url = formValue.url;
				var margin_left = parseInt(Math.abs(formValue.margin_left), 10);
				var margin_top = parseInt(Math.abs(formValue.margin_top), 10);
				var width = parseInt(formValue.width, 10);
				var height = parseInt(formValue.height, 10) + margin_top ;
				document.getElementById("height").value = ui.value;
				if($("#scrollno").attr("checked") == null){
					var scrollAction = "yes";
				}else{
					var scrollAction = "no";						
				}
				
				scrollAction = formValue.radioScroll;
				var zoom = parseInt(formValue.zoom, 10);
				if (zoom == "") zoom = 1.0;
				else zoom = zoom/100.0;

      			var style_zoom =
          			'-moz-transform: scale(' + zoom + ');' +
          			'-moz-transform-origin: 0 0;' +
          			'-o-transform: scale(' + zoom + ');' +
          			'-o-transform-origin: 0 0;' +
          			'-webkit-transform: scale(' + zoom + ');' +
          			'-webkit-transform-origin: 0 0;';

				if(node.foreignObjEl != undefined){
					node.setForeignObjectExecute('<iframe style="' + style_zoom + 'border: none;margin-left:'+(-margin_left)+'px;margin-top:'+(-margin_top)+'px;" src="'+url+'" width="'
							+(width/zoom + ui.value + (margin_left-ui.value)) +'" height="'+(ui.value/zoom + margin_top)+'" scrolling="'+scrollAction+'" zoom="' + formValue.zoom + '"></iframe>',
							width, ui.value);
				}
			}
		});
				
	});
	
}


//KHANG
JinoController.prototype.insertWebPageAction = function(node) {
	if (!node) node = jMap.getSelecteds().getLastElement();
	
	if (!jMap.isAllowNodeEdit(node)) {
		return false;
	}
	$(document).on('focusin', function(e) {
	    if ($(e.target).closest(".mce-window, .moxman-window").length) {
			e.stopImmediatePropagation();
		}
	});
	
	if (!node.attributes)
		node.attributes = {};
	
	var webpage = node.attributes['web_page'] || "Your Webpage goes here";
	var widthValue ="";
	var heightValue ="";
	var oldMargin_left = 0;
	var oldMargin_top = 0;
	var scrollingValue ="no";
	var checkNo = " checked";
	var checkYes = "";
	var zoomValue = 100;
	
	if (node.foreignObjEl){
		var currentWebPage = node.foreignObjEl.getElementsByTagName("div")[0];
	}
	if (currentWebPage != undefined){
		var webpage = currentWebPage.innerHTML;
		var widthValue = node.foreignObjEl.getAttribute("width");
		var heightValue = node.foreignObjEl.getAttribute("height");
		var scrollingValue = currentWebPage.style.overflow ? "Yes" : "No";
		
		zoomValue = currentWebPage.getAttribute("zoom");
		if (!zoomValue) zoomValue = 100;
	} else {
		var widthValue =  parent.jMap.cfg.default_img_size;
		var heightValue =  parent.jMap.cfg.default_img_size;
	}
	if (scrollingValue == "Yes"){
		var checkNo = " ";
		var checkYes = " checked";
	}
	var txt = '<form><div class="dialog_content_nod">'
			+ '<div id="webpage_editor">' + webpage + '</div>'
			+ '<table cellspacing="0" style="margin:0;">'
			+ '<tr>'
			+ '<td><div id="width_title" style="white-space:nowrap">' + i18n.msgStore["width"] + ':</div></td>'
			+ '<td><div id="widthSlider"></div></td>'
			+ '<td><input type="text" id="width" name="width" value="'+widthValue+'" style="width: 70px" /></td>'
			+ '<td style="width:99%;"></td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td><div id="height_title">' + i18n.msgStore["height"] + ':</div></td>'
			+ '<td><div id="heightSlider"></div></td>'
			+ '<td><input type="text" id="height" name="height" value="'+heightValue+'" style="width: 70px" /></td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td><div id="zoom_title">' + i18n.msgStore["zoom"] + ': </div></td><td><div id="zoomSlider"></div></td>'
			+ '<td><input type="text" id="zoom" name="zoom" value="'+zoomValue+'" style="width:50px" />%</td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td><div id=scroll style="clear:left;padding-top:5px">'+i18n.msgStore["scrolling"] + ':</div></td>'
			+ '<td>' + i18n.msgStore["yes"] + '<input type="radio" id="scrollYes" name="radioScroll" '+checkYes+ ' value="Yes" style="width:10px" />&nbsp;&nbsp;&nbsp;'	
			+ 		   i18n.msgStore["no"] + '<input type="radio" id="scrollNo" name="radioScroll" '+checkNo+ ' value="No" style="width:10px" /></td>'	
			+ '</tr>'
			+ '</table>'
			+ '</div></form>';
	
	function callbackform_structure(v,f) {
		
		if (v) {
			var webpage = tinyMCE.get('webpage_editor').getContent();
			var width = parseInt(f.width, 10);
			var height = parseInt(f.height, 10);
      		var scrollAction = "";
      		      		
      		if (webpage != ""){
      			var zoom = parseInt(f.zoom, 10);
				if (zoom == "") zoom = 1.0;
				else zoom = zoom/100.0;

      			var style_zoom =
          			'-moz-transform: scale(' + zoom + ');' +
          			'-moz-transform-origin: 0 0;' +
          			'-o-transform: scale(' + zoom + ');' +
          			'-o-transform-origin: 0 0;' +
          			'-webkit-transform: scale(' + zoom + ');' +
          			'-webkit-transform-origin: 0 0;';
      			
      			var srl = f.radioScroll != 'Yes' ? "" : "overflow:auto;"; 
				node.setForeignObject('<div style="' + srl + style_zoom + 'margin:0;border: none;width:'
										+ width/zoom + 'px; height:' + height/zoom + 'px;" zoom="' + f.zoom + '">' + webpage + '</div>', f.width, f.height);
				jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
				jMap.layoutManager.layout(true);
      		} else {
      			//to do: process empty content
      			var zoom = parseInt(f.zoom, 10);
				if (zoom == "") zoom = 1.0;
				else zoom = zoom/100.0;

      			var style_zoom =
          			'-moz-transform: scale(' + zoom + ');' +
          			'-moz-transform-origin: 0 0;' +
          			'-o-transform: scale(' + zoom + ');' +
          			'-o-transform-origin: 0 0;' +
          			'-webkit-transform: scale(' + zoom + ');' +
          			'-webkit-transform-origin: 0 0;';
      			
      			var srl = f.radioScroll != 'Yes' ? "" : "overflow:auto;"; 
				node.setForeignObject('<div style="' + srl + style_zoom + 'margin:0;border: none;width:'
										+ width/zoom + 'px; height:' + height/zoom + 'px;" zoom="' + f.zoom + '">' + webpage + '</div>', f.width, f.height);
				jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
				jMap.layoutManager.layout(true);      			
      		}
		} else {
				node = parent.jMap.getSelecteds().getLastElement();
				node.setForeignObject("");
				node.setHyperlink("");
				parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
				parent.jMap.layoutManager.layout(true);
		}
		//$("#dialog").dialog("close");
		//jMap.work.focus();
	}
	
	$("#dialog").append(txt);
	 
	var re = $("#dialog").dialog({
				autoOpen:false,
				closeOnEscape: true,	//esc키로 창을 닫는다.
				modal: true,		//modal 창으로 설정
				resizable: true,	//사이즈 변경
				close: function( event, ui ) {
					var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
					//callbackform_structure(true, formValue); 
					$("#dialog .dialog_content_nod").remove();
					$("#dialog").dialog("destroy");
					jMap.work.focus();
				},
			});
	$("#dialog").dialog("option", "width", "640");
	$("#dialog").dialog("option", "height", "480");
	$("#dialog").dialog( "option", "buttons", [
	   {
			text: i18n.msgStore["button_apply"], 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_structure(true, formValue); 
		    } 
	   },
	   {
			text: i18n.msgStore["webpage_delete"], 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_structure(false, formValue); 
		    } 
	   }
	   ]);
	$("#dialog").dialog("option","dialogClass","insertWebpageAction");			  
	$("#dialog").dialog( "option", "title", i18n.msgStore["webpage"]);
	$("#dialog").dialog("open");
	
	$(re).ready(function () {
		var editor = tinymce.get("webpage_editor");
		editor && editor.remove(); 
		tinymce.init({
		    selector: '#webpage_editor',
		    //encoding: 'xml',
		    entity_encoding: 'raw',
		    menubar: false,
		    plugins: [
		    	"advlist autolink link image lists charmap print preview hr anchor pagebreak",
		    	"searchreplace wordcount visualblocks visualchars fullscreen insertdatetime media nonbreaking",
		    	"formula table contextmenu directionality emoticons code template textcolor paste textcolor colorpicker textpattern"
		    ],
		    toolbar1: 'toolbar_toggle,formatselect,wrap,bold,italic,wrap,bullist,numlist,wrap,link,unlink,wrap,image',
		    toolbar2: 'undo,redo,wrap,underline,strikethrough,subscript,superscript,wrap,justifyleft,justifycenter,justifyright,wrap,outdent,indent,wrap,forecolor,backcolor,wrap,ltr,rtl',
		    toolbar3: 'fontselect,fontsizeselect,wrap,formula,searchreplace,code,wrap,nonbreaking,charmap,table,wrap,cleanup,removeformat,pastetext,pasteword,wrap,codesample fullscreen',
		    	
		    setup: function (editor) {
		    	editor.addButton('toolbar_toggle', {
		    		tooltip: i18n.msgStore["toolbar_toggle"],
		    		image: tinymce.baseURL + '/img/toolbars.png',
		    		onclick: function () {
		    			var toolbars = editor.theme.panel.find('toolbar');
		    			for (var i = 1; i < toolbars.length; i++)
		    				$(toolbars[i].getEl()).toggle();		    				
		    		}
		    	});
		    	editor.on('init', function (e) {
		    		var toolbars = editor.theme.panel.find('toolbar');
		    		for (var i = 1; i < toolbars.length; i++)
		    			$(toolbars[i].getEl()).toggle();
		    	});
		    }
		});
		
		$("#zoomSlider").slider({
			min:10, 
			max:200, 
			value: zoomValue,
			change: function(event, ui){
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환			
				var webpage = tinyMCE.get('webpage_editor').getContent();
				var width = parseInt(formValue.width, 10);
				var height = parseInt(formValue.height, 10);
				document.getElementById("zoom").value = ui.value;
				if($("#scrollno").attr("checked") == null){
					var scrollAction = "overflow:auto;";
				}else{
					var scrollAction = "";						
				}

      			var zoom = parseInt(ui.value, 10);
				if (zoom == "") zoom = 1.0;
				else zoom = zoom/100.0;

      			var style_zoom =
          			'-moz-transform: scale(' + zoom + ');' +
          			'-moz-transform-origin: 0 0;' +
          			'-o-transform: scale(' + zoom + ');' +
          			'-o-transform-origin: 0 0;' +
          			'-webkit-transform: scale(' + zoom + ');' +
          			'-webkit-transform-origin: 0 0;';
      			
      			if (node.foreignObjEl != undefined){
      				
      				node.setForeignObjectExecute('<div style="' + scrollAction + style_zoom + 'margin:0;border: none;width:'
      									+ width/zoom + 'px; height:' + height/zoom + 'px;" zoom="' + zoom*100 + '">' + webpage + '</div>', width, height);
      				jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
    				jMap.layoutManager.layout(true);
				}
			}
		});
		$("#widthSlider").slider({
			min:20, 
			max:1000, 
			value:widthValue,
			change: function(event, ui){
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환			
				var webpage = tinyMCE.get('webpage_editor').getContent();
				var width = ui.value;
				var height = parseInt(formValue.height, 10);
				document.getElementById("width").value = ui.value;
				if($("#scrollno").attr("checked") == null){
					var scrollAction = "overflow:auto;";
				}else{
					var scrollAction = "";						
				}
				
				
      			var zoom = parseInt(formValue.zoom, 10);
				if (zoom == "") zoom = 1.0;
				else zoom = zoom/100.0;

      			var style_zoom =
          			'-moz-transform: scale(' + zoom + ');' +
          			'-moz-transform-origin: 0 0;' +
          			'-o-transform: scale(' + zoom + ');' +
          			'-o-transform-origin: 0 0;' +
          			'-webkit-transform: scale(' + zoom + ');' +
          			'-webkit-transform-origin: 0 0;';
      			
      			if (node.foreignObjEl != undefined){
      				node.setForeignObjectExecute('<div style="' + scrollAction + style_zoom + 'margin:0;border: none;width:'
      									+ width/zoom + 'px; height:' + height/zoom + 'px;" zoom="' + zoom*100 + '">' + webpage + '</div>', width, height);
      				jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
    				jMap.layoutManager.layout(true);
				}

			}
		});
		$("#heightSlider").slider({
			min:20, 
			max:1000, 
			value:heightValue,
			change: function(event, ui){
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환			
				var webpage = tinyMCE.get('webpage_editor').getContent();
				var width = parseInt(formValue.width, 10);
				var height = ui.value;
				document.getElementById("height").value = ui.value;
				if($("#scrollno").attr("checked") == null){
					var scrollAction = "overflow:auto;";
				}else{
					var scrollAction = "";						
				}
				
      			var zoom = parseInt(formValue.zoom, 10);
				if (zoom == "") zoom = 1.0;
				else zoom = zoom/100.0;

      			var style_zoom =
          			'-moz-transform: scale(' + zoom + ');' +
          			'-moz-transform-origin: 0 0;' +
          			'-o-transform: scale(' + zoom + ');' +
          			'-o-transform-origin: 0 0;' +
          			'-webkit-transform: scale(' + zoom + ');' +
          			'-webkit-transform-origin: 0 0;';
      			
      			if (node.foreignObjEl != undefined){
      				node.setForeignObjectExecute('<div style="' + scrollAction + style_zoom + 'margin:0;border: none;width:'
      									+ width/zoom + 'px; height:' + height/zoom + 'px;" zoom="' + zoom*100 + '">' + webpage + '</div>', width, height);
      				jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
    				jMap.layoutManager.layout(true);
				}
			}
		});
				
	});
	
}

JinoController.prototype.insertLTIAction = function(node) {
	if(!node) node = jMap.getSelecteds().getLastElement();
	
	if(!jMap.isAllowNodeEdit(node)) {
		return false;
	}
	if (!node.attributes)
		node.attributes = {};
	
	var url = node.attributes['url'] || "http://";
	var secret = node.attributes['secret'] || "";
	var key = node.attributes['key'] || "";
	var widthValue ="";
	var heightValue ="";
	var oldMargin_left = 0;
	var oldMargin_top = 0;
	var scrollingValue ="no";
	var checkNo = " checked";
	var checkYes = "";

	var txt = '<form><div class="dialog_content_nod">'
			+ '<br />'
			+ '<table cellspacing="0" style="margin:0;">'
			+ '<tr>'
			+ '<td><div id="url_title" style="white-space:nowrap">' + i18n.msgStore["launch_url"] + ':</div></td>'
			+ '<td style="width:100%"><input style="width:100%" type="text" id="url" name="url" value="' + url + '"></td>'
			+ '</tr><tr>'
			+ '<td><div id="secret_title" style="white-space:nowrap">' + i18n.msgStore["secret_value"] + ':</div></td>'
			+ '<td style="width:100%"><input style="width:100%" type="text" id="secret" name="secret" value="' + secret + '"></td>'
			+ '</tr><tr>'
			+ '<td><div id="key_title" style="white-space:nowrap">' + i18n.msgStore["key_value"] + ':</div></td>'			
			+ '<td><input type="text" id="key" name="key" value="' + key + '"></td>'
			+ '</td></tr>'
			+ '</table>'
			+ '</div></form>';
	
	function callbackform_structure(v,f) {
		
		if (v) {
			var url = f.url;
			var secret = f.secret;
			var key = f.key;
      		
      		if (url != ""){
				node.attributes['url'] = url; 
				node.attributes['secret'] = secret; 
				node.attributes['key'] = key; 
				node.setHyperlink(jMap.cfg.contextPath + '/mindmap/launch.do?' + 'map=' + mapId + '&node=' + node.getID());
				
				jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
				jMap.layoutManager.layout(true);
      		}
		}
		$("#dialog").dialog("close");
		jMap.work.focus();
	}
	
	$("#dialog").append(txt);
	 
	var re = $("#dialog").dialog({
				autoOpen:false,
				closeOnEscape: true,	//esc키로 창을 닫는다.
				modal:true,		//modal 창으로 설정
				resizable:false,	//사이즈 변경
				close: function( event, ui ) {
					var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
					//callbackform_structure(true, formValue); 
					$("#dialog .dialog_content_nod").remove();
					$("#dialog").dialog("destroy");
					jMap.work.focus();
				},
			});
	$("#dialog").dialog("option", "width", "none" );
	$("#dialog").dialog( "option", "buttons", [
	   {
			text: i18n.msgStore["button_apply"], 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_structure(true, formValue); 
		    } 
	   }
	   ]);
	$("#dialog").dialog("option","dialogClass","insertIFrameAction");			  
	$("#dialog").dialog( "option", "title", i18n.msgStore["lti"]);
	$("#dialog").dialog("open");
}
//KHANG

JinoController.prototype.undoAction = function(){
	jMap.historyManager && jMap.historyManager.undo();
}

JinoController.prototype.redoAction = function(){
	jMap.historyManager && jMap.historyManager.redo();
}


//////////////////////////////////////////ACTIONS /////////////////////////////////////////////////////

