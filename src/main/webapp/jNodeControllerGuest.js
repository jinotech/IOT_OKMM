/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// jNodeControllerGuest ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jNodeControllerGuest = function(){}

jNodeControllerGuest.prototype.type= "jNodeControllerGuest";


jNodeControllerGuest.prototype.mousedown = function(e){
	var selectedNodes = jMap.getSelecteds();
	
	// 노드 하일라이팅
	if (e.ctrlKey) this.node.focus(false);	// control키 조합시 중복 선택
	else{
		if(!selectedNodes.contains(this.node)) {
			this.node.focus(true);
		}
	}
}

jNodeControllerGuest.prototype.mouseup = function(e){
	e = e || window.event;
	
}

jNodeControllerGuest.prototype.mousemove = function(e) {
	//KHANG: FIX fold/unfold for guests
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

		//document.body.style.cursor = "url("+jMap.cfg.contextPath+"'/images/folding_blue.png'),default";
		//document.body.style.cursor = "crosshair";
	} else {
		document.body.style.cursor = "auto";
	}
	
}

jNodeControllerGuest.prototype.mouseover = function(e){
	e = e || window.event;
}

jNodeControllerGuest.prototype.mouseout = function(e){
	document.body.style.cursor = "auto";
}

jNodeControllerGuest.prototype.taphold = function(e){
	if(ISMOBILE && supportsTouch && this.node.hyperlink)
		window.open(this.node.hyperlink.attr().href);
}

jNodeControllerGuest.prototype.click = function(e) {
	//KHANG: FIX fold/unfold for guests
	var targ;
	var originalEvent;
	if (!e) var e = window.event;
	originalEvent = e.originalEvent.originalEvent || e.originalEvent || e;
	if (originalEvent.target) targ = originalEvent.target;
	else if (originalEvent.srcElement) targ = originalEvent.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;

	//KHANG: correct offsetX, offsetY return by mouse event
	var rect = targ.getBoundingClientRect();
	e.offsetX = e.clientX - rect.left;
	e.offsetY = e.clientY - rect.top;
	//KHANG

	
	// 노드의 끝쪽 부분을 클릭하면 폴딩 및 언폴딩	
	if (this.node.isFoldingHit(e)) {
		// Folding & unFolding
		this.node.setFoldingExecute(!this.node.folded);
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendants(this.node);				
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this.node);
		jMap.layoutManager.layout(true);
	}
}

jNodeControllerGuest.prototype.dblclick = function(e){}

jNodeControllerGuest.prototype.dragstart = function(e){
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	else
		e.returnValue= false;
}

jNodeControllerGuest.prototype.dragenter = function(e){
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	else
		e.returnValue= false;
}

jNodeControllerGuest.prototype.dragexit = function(e){
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	else
		e.returnValue= false;
}

jNodeControllerGuest.prototype.drop = function(e){
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	else
		e.returnValue= false;
}


///////////////////////// extend ////////////////////////////////////
jNodeControllerGuest.prototype.dragger = function () {}
jNodeControllerGuest.prototype.move = function (dx, dy, x, y) {}
jNodeControllerGuest.prototype.up = function (dx, dy, x, y) {}
///////////////////////// extend 끝////////////////////////////////////


