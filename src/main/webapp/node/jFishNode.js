/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// jFishNode ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jFishNode = function(param){
	var parentNode = param.parent;
	var text = param.text;
	var id = param.id;
	var index = param.index;
	var position = param.position;
	
	jFishNode.superclass.call(this, parentNode, text, id, index, position);
}

extend(jFishNode, jMindMapNode);
jFishNode.prototype.type = "jFishNode";

/**
 * 필요한 Raphael Element를 만든다.
 */
jFishNode.prototype.initElements = function() {
	this.body = RAPHAEL.rect();		
	this.text = RAPHAEL.text();		
	this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
	
	// 대가리
	this.head = RAPHAEL.path();
	// 척추
	this.vertebra = RAPHAEL.path();
	// 꼬리
	this.tail = RAPHAEL.path();
	
	this.angle = 90;
	
	// 그룹화하기 위해 반드시 불러야 한다. (인자 : 그룹화할 Element)
	this.wrapElements(this.body, this.text, this.folderShape, this.head, this.vertebra, this.tail);
}

jFishNode.prototype.create = function(){
	// 노드와 노드를 잇는 선 생성
	this.connection = this.parent && new jLineFish(this.parent, this);
	
	///////////////////////////////////////////////////
	// 노드 초기화	 : 노드 색상, 폰트 설정 등등
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;

	// 초기 위치
	if(this.getParent()){
		var pl = this.getParent().getLocation();
		this.setLocation(pl.x, pl.y)
	}
	
	// 노드의 배경색 없애기
	body.attr({opacity: 0.0});
	
	// 선 색상 입히기..		
	this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, 1);
	
	this.head.attr({stroke: jMap.cfg.edgeDefalutColor});
	this.vertebra.attr({stroke: jMap.cfg.edgeDefalutColor});
	this.tail.attr({stroke: jMap.cfg.edgeDefalutColor});

	// 폰트 설정
	//var fontSize = this.fontSize;
	var fontWeight = 400;
	var fontFamily = 'Arial, Gulim, 굴림';
//	var fontColor = '#000';
	if(!this.getParent()) {
		this.fontSize = jMap.cfg.nodeFontSizes[0];
		fontWeight = '700';
	} else if(this.getParent() && this.getParent().isRootNode()) {
		this.fontSize = jMap.cfg.nodeFontSizes[1];
		fontWeight = '700';
	} else {
		this.fontSize = jMap.cfg.nodeFontSizes[2];
		fontWeight = '400';
	}
	
	if(this.isRootNode()) {
		text.attr({'font-family': fontFamily, 'font-size': this.fontSize, "font-weight": fontWeight});
	} else {
		text.attr({'font-family': fontFamily, 'font-size': this.fontSize, "font-weight": fontWeight, 'text-anchor': 'start'});
	}

	this.setTextExecute(this.plainText);
	///////////////////////////////////////////////////
}

jFishNode.prototype.getSize = function(){
	var h = this.body.getBBox().height;
	var w = this.body.getBBox().width;
	if(this.isVertical()) {
		//return {width:this.body.getBBox().height, height:(this.body.getBBox().width + 5) * Math.cos( Math.PI * (90 - this.angle)/180) };
		return {
			width:  h*Math.abs(Math.sin(Math.PI * this.angle/180)) + w*Math.abs(Math.cos(Math.PI * this.angle/180)),
			height: w*Math.abs(Math.sin(Math.PI * this.angle/180)) + h*Math.abs(Math.cos(Math.PI * this.angle/180))
		};
	} else {
		return {width:this.body.getBBox().width, height:this.body.getBBox().height};
	}
}

jFishNode.prototype.setSize = function(width, height){
	this.body.attr({
		width: width,
		height: height
	});
}

/**
 * 노도의 좌표를 반환
 */
jFishNode.prototype.getLocation = function(){
	return {x:this.body.getBBox().x, y:this.body.getBBox().y};
}

jFishNode.prototype.setLocation = function(x, y){
	var body = this.body;
	
	if(x && !y){
		body.attr({x: x});
	} else if(!x && y) {
		body.attr({y: y});
	} else {
		body.attr({x: x, y: y});
	}
	
	this.updateNodeShapesPos();
}

/**
 * 노드의 크기를 계산한다.
 */
jFishNode.prototype.CalcBodySize = function(){
	var width = 0;
	var height = 0;
	var hGap = TEXT_HGAP;
	var vGap = TEXT_VGAP;
		
	// Text 계산
	// 노드에 텍스트가 없으면 노드의 크기를 정할수 없다.
	var tempText = false;
	if (this.getText() == "") {
		this.text.attr({
			text: "_"
		});
		var tempText = true;
	}	
	width += this.text.getBBox().width;
	height += this.text.getBBox().height;	
	if (tempText) {
		this.text.attr({
			text: ""
		});		
	}	
	// img 계산
	if (this.img) {		
		width = (width < this.img.getBBox().width) ? this.img.getBBox().width : width;
		height += this.img.getBBox().height;
	}
	// foreignObj 계산
	if (this.foreignObjEl) {
		var foWidth = parseInt(this.foreignObjEl.getAttribute("width"));
		var foHeight = parseInt(this.foreignObjEl.getAttribute("height"));
		width = (width < foWidth) ? foWidth : width;
		height += foHeight;
	}
	// hyperlink 계산
	if(this.hyperlink)
		width += this.hyperlink.getBBox().width + hGap/2 ;
	
	this.setSize(
		width + hGap,	
		height + vGap
	);
	
	this.updateNodeShapesPos();
}

/**
 * 노드가 갖고 있는 여러 도형들(body, text, folderShape...)의 위치를 재정렬 한다.
 */
jFishNode.prototype.updateNodeShapesPos = function(){
	var hGap = TEXT_HGAP;
	var vGap = TEXT_VGAP;
	var currentHeightPos = 0;	// 0에서 부터 요소들의 height따라 위치를 계산에 필요한 변수
	
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;
	var img = this.img;
	var hyperlink = this.hyperlink;
	var foreignObj = this.foreignObjEl;	
	// body의 x, y
	var x = body.getBBox().x;
	var y = body.getBBox().y;
	
	// folder표시 위치
	var foldLocation = this.getOutputPort();
	var fold_x = foldLocation.x;
	var fold_y = foldLocation.y;
	this.folderShape.attr({cx: fold_x, cy: fold_y});
	
	// img 위치
	if (img) {
		var img_x = x + hGap/2;
		var img_y = y + vGap/2;
		
		if(this.isRootNode()) {
			img_x += (body.getBBox().width / 2) - (img.getBBox().width / 2) - hGap / 2;
		}
		
		img.attr({x: img_x, y: img_y});
		currentHeightPos += img.getBBox().height;
	}
	// foreignObj
	if (foreignObj) {
		var ob_x = x + hGap/2;
		var ob_y = y + currentHeightPos + vGap/2;		
		currentHeightPos += parseInt(foreignObj.getAttribute("height"));
		foreignObj.setAttribute("x", ob_x);
		foreignObj.setAttribute("y", ob_y);
	}
	// 텍스트 위치
	if (text) {
		var text_x = x + hGap/2;
		var text_y = y + (vGap + text.getBBox().height) / 2; //this.body.getBBox().height / 2;
		if(this.isRootNode()) {
			text_x += body.getBBox().width / 2 - hGap / 2;
		}
		text_y += currentHeightPos;	
		text.attr({x: text_x, y: text_y});
	}	
	// hyperlink 위치
	if (hyperlink) {
		var hyper_x = x + hGap;
		var text_width = text.getBBox().width;		
		if(img) hyper_x += (text_width > img.getBBox().width)? text_width : img.getBBox().width;
		else hyper_x += text_width;
		var hyper_y = y + text.getBBox().height / 2;
		hyper_y += img && img.getBBox().height / 2;
		hyperlink && hyperlink.attr({x: hyper_x, y: hyper_y});
	}
	
	// 머리, 척추, 꼬리
	if(this.isRootNode()) {
		var port = this.getOutputPort();
		var w = this.getSize().width;
		var h = this.getSize().height;
		var path = [ 
		            "M", port.x, port.y,
		            "L", port.x, port.y - h,
		            "A", w*1.25, h*1.5, 0, 0, 0, port.x - w - w/4, port.y,
		            "A", w*1.25, h*1.5, 0, 0, 0, port.x, port.y + h,
		            "Z"
		       ].join(",");
		this.head.attr({path: path });
		
		var tailX = port.x + this.getTreeWidth() - this.getSize().width + 30;
		
		var path1 = [ 
	            "M", port.x, port.y, 
	            "L", tailX, port.y,
	            "Z"
	       ].join(",");
	   this.vertebra.attr({path: path1 });
	   
	   var path2 = [
	            "M", tailX, port.y,
	            "L",  tailX + h, port.y - h*1.5,
	            "A", h*2, h*3, 0, 0, 0, tailX + h, port.y + h*1.5,
	            "Z"
	        ].join(",");
	   this.tail.attr({path: path2 });
	   this.tail.attr({"stroke-width": 1});
	}
	
	this.connection && this.connection.updateLine();
}

jFishNode.prototype.getInputPort = function(){
	var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(body.width) && !isNaN(body.width)){
		body_width = body.width;
	}
	if(isFinite(body.height) && !isNaN(body.height)){
		body_height = body.height;
	}
	
	if(this.isRootNode()) {
		return {x: body.x + body_width, y: body.y + body_height / 2};
	} else {
		if(this.isVertical() && !this.isTopSide()) {
			return {x: body.x + body_width + 1, y: body.y + body_height};
		} else {
			return {x: body.x - 1, y: body.y + body_height};
		}
	}
		
}

jFishNode.prototype.getOutputPort = function(){
	var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(body.width) && !isNaN(body.width)){
		body_width = body.width;
	}
	if(isFinite(body.height) && !isNaN(body.height)){
		body_height = body.height;
	}
	
	if(this.isRootNode()) {
		return {x: body.x + body_width, y: body.y + body_height/2};
	} else {
		if(this.isVertical() && !this.isTopSide()) {
			return {x: body.x, y: body.y + body_height};
		} else {
			return {x: body.x + body_width, y: body.y + body_height};
		}
	}
	
}

jFishNode.prototype.isTopSide = function () {
	if(this.isRootNode()) {
		return false;
	}
	
	var depth = this.getDepth();
	if(depth == 1) {
		return this.getIndexPos() % 2 == 0;
	} else {
		return  this.getParent().isTopSide();
	}
}

jFishNode.prototype.isVertical = function () {
	var depth = this.getDepth();
	
	return depth % 2 == 1;
}

/**
 * @overriding
 * @param {boolean} only : 다중 선택시
 */
jFishNode.prototype.focus = function(only){
	var selectedNodes = jMap.getSelecteds();
	
	if(only) {
		// 이전에 선택된 노드의 하일라이팅 없애기 & selectedNodes 비우기
		for(var i = selectedNodes.length-1; i >= 0; i--)
			selectedNodes[i].blur();
	}		
	if (!selectedNodes.contains(this)) {
		selectedNodes.push(this);	// selectedNodes에 선택된 노드 추가
		// 하일라이딩 주기
		this.connection && this.connection.line.animate({stroke: jMap.cfg.nodeSelectedColor, "stroke-width": 3}, 300);
		//this.body.animate({stroke: jMap.cfg.nodeSelectedColor, "stroke-width": 3}, 300);
	}
	
	jMap.fireActionListener(ACTIONS.ACTION_NODE_SELECTED, this);
	
	jMap.work.focus();
}

/**
 * 포커스 없애기
 * @overriding
 */
jFishNode.prototype.blur = function(){
	var selectedNodes = jMap.getSelecteds();
	if (selectedNodes.contains(this)) {
		selectedNodes.remove(this);
		this.connection && this.connection.line.animate({fill: this.background_color,
								stroke: this.branch.color,
								"stroke-width": this.branch.width}, 300);
	}
}

jFishNode.prototype.toString = function () {
    return "jFishNode";
}
