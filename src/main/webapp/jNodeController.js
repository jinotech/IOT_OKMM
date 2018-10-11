/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

var removeGradient = function(node){
	bodyAttr = node.body.attr();
	delete bodyAttr.gradient;
	node.body.attr({fill: node.background_color, stroke: node.edge.color});
}
	
///////////////////////////////////////////////////////////////////////////////
/////////////////////////// jNodeController ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jNodeController = function(){}

jNodeController.prototype.type= "jNodeController";


jNodeController.prototype.contextmenu = function(e) {
	//add context menu
	this.node.focus(true);
	$(jMap.work).trigger('jinocontextmenu', [e]);
	jMap.mouseRightClicked = false; //KHANG: deactivate right clicked
	return false;
}

jNodeController.prototype.mousedown = function(e){
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
	
	var selectedNodes = jMap.getSelecteds();
	
	// 마우스 오른쪽 버튼
	// IE : e.button == 2
	// FF : e.button == 2, e.which == 3
	// Mac : e.button == 2, e.which == 3
	if(e.button == 2) {
		jMap.mouseRightClicked = true;
		jMap.mouseRightSelectedNode = this.node;
		return; //KHANG prevent moving by right click
	}
	
	// 노드 하일라이팅
	if (e.shiftKey || e.ctrlKey) { //ctrlKey
		if(selectedNodes.contains(this.node))
			this.node.blur();
		else this.node.focus(false);	// control키 조합시 중복 선택
	} 
	else{
		if(!selectedNodes.contains(this.node)) {
			this.node.focus(true);
		}
	}
	
	
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    this._drag = {};
    this._drag.x = e.clientX + scrollX;
    this._drag.y = e.clientY + scrollY;
    this._drag.id = e.identifier;
    jMap.dragEl = this;
}

jNodeController.prototype.mouseup = function(e){
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
	
	// 오른쪽 마우스 땠을때
	if(jMap.mouseRightClicked) {
		var mouseRightSelectedNode = jMap.mouseRightSelectedNode;
		jMap.mouseRightClicked = false;
		//this.node.blur();
		return; //KHANG
		if (mouseRightSelectedNode == this.node) {
			//KHANG: not necessary
		}
		
		/*
		// 링크선 만들기 (사용하지 않으므로 주석)
		var arrowlink = null;
		switch(jMap.layoutManager.type) {
			case "jMindMapLayout" :
				arrowlink = new CurveArrowLink(this.node);
				break;
			case "jTreeLayout" :
				arrowlink = new RightAngleArrowLink(this.node);
				break;
			default :
				arrowlink = new CurveArrowLink(this.node);
		}
		
		mouseRightSelectedNode.addArrowLink(arrowlink);
		jMap.layoutManager.layout(true);
		*/
	}
	
	// 움직이는 노드를 놓았을 때
	if (jMap.movingNode && !jMap.movingNode.removed) {
		var srcNodes = jMap.positionChangeNodes;
		var targNode = this.node;
		
		if (srcNodes && !srcNodes.contains(targNode)) {
			jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
			jMap.movingNode.remove();
			delete jMap.movingNode;
			
			// 자식 밑으로 옮기는지 체크. 그렇다면 무시..
			for (var i = 0; i < srcNodes.length; i++) {
				if (srcNodes[i].hadChildren(targNode)) {
					removeGradient(targNode);
					//targNode.body.animate({"fill-opacity": 0}, 500);
					jMap.positionChangeNodes = false;
					return;
				}
			}
			
			//KHANG: correct offsetX return by mouse event
			var rect = targ.getBoundingClientRect();
			e.offsetX = e.clientX - rect.left;
			//KHANG
			
			var offsetX = (e.offsetX) ? e.offsetX : e.layerX - this.node.getLocation().x;
			var widthHalf = this.node.body.getBBox().width / 2;
						
			//var pos = (this.node.isLeft()) ? (offsetX > widthHalf) : (offsetX < widthHalf);
			var isleftPos = (offsetX < widthHalf);
			var initFoldingTargetNode = targNode;
			
			// 노드를 자식으로 옮기는 함수
			var toChild = function() {
				
				// 노드를 펼친다.
				targNode.folded && targNode.setFolding(false);
				
				var position = null;
				if (targNode.isRootNode()) 
					position = isleftPos ? "left" : "right";
				
				initFoldingTargetNode = targNode;
				jMap.changePosition(targNode, srcNodes, position);
				
			}
			// 노드를 형제로 옮기는 함수
			var toSibling = function() {
				
				var position = null;
				if (targNode.getParent().isRootNode()) 
					position = targNode.position;
				var nextSibling = targNode.nextSibling();
				
				initFoldingTargetNode = targNode.getParent();
				jMap.changePosition(targNode.getParent(), srcNodes, position, targNode);
				
			}
			
			if (srcNodes) {
				if (targNode.isRootNode()) {
					toChild();
				} else {
					switch(jMap.layoutManager.type) {
						case "jMindMapLayout" :
							if(this.node.isLeft()){
								isleftPos? toChild():toSibling();
							} else {
								isleftPos? toSibling():toChild();
							}	
							break;
						case "jTreeLayout" :
							isleftPos? toSibling():toChild();
							break;
						case "jFishboneLayout" :
							if(this.node.isLeft()){
								isleftPos? toChild():toSibling();
							} else {
								isleftPos? toSibling():toChild();
							}	
							break;
						default :			
					}
				}				
				// 노드 옮김 완료!
			}
			
			removeGradient(targNode);
			jMap.initFolding(initFoldingTargetNode);
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
			//		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(targNode.isRootNode()? targNode : targNode.parent);
			jMap.layoutManager.layout(true);
			targNode.focus(true);
		}
		
		jMap.positionChangeNodes = false;
	}
	
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

jNodeController.prototype.mousemove = function(e){
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
	
	//KHANG: correct offsetX, offsetY return by mouse event
	var rect = targ.getBoundingClientRect();
	e.offsetX = e.clientX - rect.left;
	e.offsetY = e.clientY - rect.top;
	//KHANG
	
	// 폴딩되는 노드라면 커서 모양 변경	
	if(!jMap.positionChangeNodes && this.node.isFoldingHit(e) && !this.node.isRootNode() && !this.node.getChildren().isEmpty()) {
		var coords = '';
		if(this.node.isLeft())
			coords = ' 10 7';
		else
			coords = ' 0 7';
		document.body.style.cursor = "url('"+jMap.cfg.contextPath+"/images/folding_blue.png')"+coords+",default";
			
		//document.body.style.cursor = "crosshair";
	} else {
		document.body.style.cursor = "auto";
	}
	
}

jNodeController.prototype.mouseover = function(e){
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
	
//		if (this.node.note) {
//			// Remove default browser tooltips
//			this.node.t = this.node.note;
//			this.node.title = '';
//			this.node.alt = '';
//						
//			jMap.tootipHandle.html(this.node.t).fadeIn('fast');
//		}

	if (jMap.positionChangeNodes && !jMap.getSelecteds().contains(this.node)) {
		if(jMap.movingNode && !jMap.movingNode.removed){
			jMap.movingNode.hide();
			jMap.movingNode.connection && jMap.movingNode.connection.line.hide();
		}
		
		//KHANG: correct offsetX return by mouse event
		var rect = targ.getBoundingClientRect();
		e.offsetX = e.clientX - rect.left;
		//KHANG

		var offsetX = (e.offsetX)? e.offsetX : e.layerX - this.node.getLocation().x;		
		var widthHalf = this.node.body.getBBox().width/2;
		
		if (jMap.positionChangeNodes) {
			//			   270
			//	  -------------------
			//	0 |					| 180
			//	  -------------------
			//			   90
			var angleLeft = 0;
			var angleRight = 0;
			
			switch(jMap.layoutManager.type) {
				case "jMindMapLayout" :
					if(this.node.isRootNode()) {
						angleLeft = 0;
						angleRight = 180;
					} else {
						angleLeft = (this.node.isLeft())? 0 : 270;
						angleRight = (this.node.isLeft())? 270 : 180;
					}
					break;
				case "jTreeLayout" :
					if(this.node.isRootNode()) {
						angleLeft = 180;
						angleRight = 180;
					} else {
						angleLeft = 0;	// 원래 0 이지만 jMindMapLayout와 호환을 위해 (mouseup 이벤트의 내용도  jTreeLayout를 고려한다면 0으로 해도 좋다)
						angleRight = 90;	// 이도 역시.. 90이지만 0으로..
					}
					break;
				case "jFishboneLayout" :
					if(this.node.isRootNode()) {
						angleLeft = 0;
						angleRight = 180;
					} else {
						angleLeft = (this.node.isLeft())? 0 : 270;
						angleRight = (this.node.isLeft())? 270 : 180;
					}
					break;
				default :			
			}
			
			//var pos = (this.node.isLeft())? (offsetX > widthHalf) : (offsetX < widthHalf);
			if(offsetX < widthHalf)	// 마우스가 노드 왼쪽 편에 있으면 true
				//this.node.body.attr({gradient: angleRight + "-#ffffff-"+jMap.cfg.nodeDropFocusColor, stroke: jMap.cfg.nodeDropFocusColor});
				this.node.body.attr({gradient: angleLeft + "-" + jMap.cfg.nodeDropFocusColor + "-#ffffff", stroke: jMap.cfg.nodeDropFocusColor});
			else
				//this.node.body.attr({gradient: angleLeft + "-#ffffff-"+jMap.cfg.nodeDropFocusColor, stroke: jMap.cfg.nodeDropFocusColor});
				this.node.body.attr({gradient: angleRight + "-" + jMap.cfg.nodeDropFocusColor + "-#ffffff", stroke: jMap.cfg.nodeDropFocusColor});
	    }		
	}
	
	
	if(jMap.mouseRightClicked) {
		//KHANG: not necessary
		//this.node.focus(false);
	}
	
}

jNodeController.prototype.mouseout = function(e){
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
	
	document.body.style.cursor = "auto";
	
//		if (this.node.t) {
//            this.node.title = this.node.t;
//            jMap.tootipHandle.hide();
//        }
	
	if(jMap.movingNode && !jMap.movingNode.removed){
		jMap.movingNode.show();
		jMap.movingNode.connection && jMap.movingNode.connection.line.show();
	}
	
	if (jMap.positionChangeNodes && !jMap.getSelecteds().contains(this.node)) {
		removeGradient(this.node);			
    }
	
	
	if(jMap.mouseRightClicked) {
		if(jMap.mouseRightSelectedNode == this.node) return;
		this.node.blur();
	}
	
}

jNodeController.prototype.taphold = function(e){
	if(ISMOBILE && supportsTouch && this.node.hyperlink)
		window.open(this.node.hyperlink.attr().href);
}

jNodeController.prototype.click = function(e){
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
	
	
	//KHANG: correct offsetX, offsetY return by mouse event
	var rect = targ.getBoundingClientRect();
	e.offsetX = e.clientX - rect.left;
	e.offsetY = e.clientY - rect.top;
	//KHANG

	
	// 노드의 끝쪽 부분을 클릭하면 폴딩 및 언폴딩	
	// ** 하이퍼링크를 클릭시에는 폴딩되지 말아야 한다.
	// ** 그래서 image를 검사한다. (hyperlink는 그림을 클릭하므로..)
	if (this.node.isFoldingHit(e) && targ.nodeName != "image") {
		// Folding & unFolding
		jMap.controller.foldingAction(this.node);		
	}
}

jNodeController.prototype.dblclick = function(e){	
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
	
	jMap.controller.startNodeEdit(this.node);
}

jNodeController.prototype.dragstart = function(e){
	// FF의 버그 때문에.. dragstart를 사용한다.
	// FF는 노드 드래그 이벤트가 두번째부터 먹는다.
	// 그런데 이 이벤트가 먹음 마우스업 이라든가 이런 이벤트는 무시된다.
	// 원인은 잘 모르겠지만 어차피 여기선 쓰지 못하므로 무시..
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
}

jNodeController.prototype.dragenter = function(e){
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
	
	this.node.focus(true);
}

jNodeController.prototype.dragexit = function(e){
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
	
	this.node.blur();
}

jNodeController.prototype.drop = function(e){
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
	
	var droptext = e.originalEvent.dataTransfer.getData('TEXT') || e.originalEvent.dataTransfer.getData('text/plain');	// TEXT는 IE, text/plain은 FF
	var urlText = e.originalEvent.dataTransfer.getData('URL');
	var isUpdateLayout = false;
	
	// 일반 텍스트라도 접두사가 http라면 url로 인식한다.
	if(droptext.substr(0,7) == "http://"){
		urlText = urlText || droptext;
		
		// 링크 설정
		if(urlText){
			this.node.setFoldingExecute(false);
			var param = {parent: this.node,
					text: urlText};
			var newNode = jMap.createNodeWithCtrl(param, null, false);
			newNode.setHyperlink(urlText);
			isUpdateLayout = true;
		}
	} else {
		jMap.createNodeFromText(this.node, droptext);
		isUpdateLayout = true;
	}
	 
	if(isUpdateLayout) {
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(this.node);
		jMap.layoutManager.layout(true);
	}
}


/////////////////////////// extend ////////////////////////////////////
//
//
//jNodeController.prototype.dragger = function () {
//}
//
//jNodeController.prototype.move = function (dx, dy, x, y) {
//	if(jMap.mouseRightClicked) return;
//	
//	if(!jMap.movingNode || jMap.movingNode.removed && !jMap.mouseRightClicked){
//		// 옮겨질 노드 설정
//		var selectedNodes = jMap.getSelecteds();	
//		jMap.positionChangeNodes = selectedNodes;
//	
//		// 쉐도우 노드 생성
//		// jNode로 안만드는 이유는 jNode로 만들면 노드를 드래그 하는 동안 노드 밑에 위치한 노드를 잡아내지 못하기 때문이다.
//		// mNode.toBack()을 하는 이유도 그런 이유이다.
//		jMap.movingNode = RAPHAEL.rect();
//		var mNode = jMap.movingNode;		
//		
//		mNode.ox = this.node.body.type == "rect" ? this.node.body.attr("x") : this.node.body.attr("cx");
//	    mNode.oy = this.node.body.type == "rect" ? this.node.body.attr("y") : this.node.body.attr("cy");
//		
//		var bodyAttr = this.node.body.attr();						// body
//		delete bodyAttr.scale;
//		delete bodyAttr.translation;
//		delete bodyAttr.gradient;	
//		bodyAttr["fill-opacity"] = .2;
//		bodyAttr.fill = this.node.background_color
//		bodyAttr.stroke = this.node.edge.color;
//		mNode.attr(bodyAttr);
//		
//		mNode.toBack();
//		
//		/*
//		if(!this.node.isRootNode()){			
//			mNode.edge_width = this.node.edge.width;
//			mNode.connection = JinoUtil.connectionShadow(this.node.parent.body, mNode, this.node.connection.line.attr().stroke, this.node.isLeft()? true : false);
//			mNode.connection.line.attr({fill: this.node.connection.line.attr().fill, "fill-opacity":.2, "stroke-opacity":.2});
//		}
//		*/
//	}
//	
//	var mNode = jMap.movingNode;
////	mNode.setLocation(mNode.ox + dx, mNode.oy + dy);	// 노드를 복사하는 방법
//	
//	// 스케일된 상태에 따라 노드
//	var sdx = dx / jMap.cfg.scale;
//	var sdy = dy / jMap.cfg.scale;
//	
//	var att = mNode.type == "rect" ? {x: mNode.ox + sdx, y: mNode.oy + sdy} : {cx: mNode.ox + sdx, cy: mNode.oy + sdy};
//	mNode.attr(att);
//	//mNode.connection && JinoUtil.connectionShadow(mNode.connection, null, null, this.node.isLeft()? true : false);
//	
//}
//		
//jNodeController.prototype.up = function (e, dx, dy, x, y) {
//	var targ;
//	if (!e) var e = window.event;
//	if (e.target) targ = e.target;
//	else if (e.srcElement) targ = e.srcElement;
//	if (targ.nodeType == 3) // defeat Safari bug
//		targ = targ.parentNode;
//	
//	//// 프리젠테이션 편집창에 노드 추가 ////
//	var pe = targ;
//	var isPT = false;
//	while(pe != null) {
//		
//		if(EditorManager.getConfig().editorID == pe.id) {
//			isPT = true;
//		}
//		pe = pe.parentNode;
//	}	
//	if(isPT) {
//		if(jMap.movingNode && !jMap.movingNode.removed){
//			jMap.DragPaper = false;
//			jMap.positionChangeNodes = false;
//			
//			jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
//			jMap.movingNode.remove();
//		}
//		
//		EditorManager.addNode(this.node);
//		return;
//	}
//	///////////////////////////////////
//	
//	if(jMap.movingNode && !jMap.movingNode.removed){
//		jMap.movingNode.connection && jMap.movingNode.connection.line.remove();
//		jMap.movingNode.remove();
//		
//		var sdx = dx / jMap.cfg.scale;
//		var sdy = dy / jMap.cfg.scale;
//		
//		var testMovePosX = (sdx>0)?sdx:-sdx;
//		var testMovePosY = (sdy>0)?sdy:-sdy;		
//		if(testMovePosX > NODE_MOVING_IGNORE || testMovePosY > NODE_MOVING_IGNORE)
//			this.node.relativeCoordinate(sdx, sdy);
//	}
//}
//
/////////////////////////// extend 끝////////////////////////////////////


