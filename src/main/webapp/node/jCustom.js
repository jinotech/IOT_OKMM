/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// jCustom ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jCustom = function(parentNode, text, id, index, position){
	jCustom.superclass.call(this, parentNode, text, id, index, position);
}

extend(jCustom, jNode);
jCustom.prototype.type = "jCustom";

/**
 * 필요한 Raphael Element를 만든다.
 */
jCustom.prototype.initElements = function() {
	this.body = RAPHAEL.path();		
	this.text = RAPHAEL.text();		
	this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
	
	// 그룹화하기 위해 반드시 불러야 한다. (인자 : 그룹화할 Element)
	this.wrapElements(this.body, this.text, this.folderShape);		
}

jCustom.prototype.create = function(){
//	this.connection = this.parent && jMap.layoutManager.connection(this.parent.body, this.body, "#000", this.isLeft());	
	this.connection = null;
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
//			this.connection = this.parent && new jLineBezier(this.parent, this);
			break;
		case "jTreeLayout" :
//			this.connection = this.parent && new jLinePolygonal(this.parent, this);
			break;
		case "jTableLayout" :
			break
		default :
//			this.connection = this.parent && new jLineBezier(this.parent, this);
			break;
	}
	
	///////////////////////////////////////////////////
	// 노드 초기화	 : 노드 색상, 폰트 설정 등등
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;
	this.width = 0;
	this.height = 0;
	this.x = 0;
	this.y = 0;
	
	// 노드 초기 모양
//	var path = ""
//	body.attr({path: path});
	
	// 초기 위치
	if(this.getParent()){
		var pl = this.getParent().getLocation();
		this.setLocation(pl.x, pl.y)
	}
	
	// 색상 입히기..		
	this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
	this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, 1);
	
	// 폰트 설정
	//var fontSize = this.fontSize;
	var fontWeight = 400;
	var fontFamily = 'Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif';
	var fontColor = '#000';
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
		text.attr({'font-family': fontFamily, 'font-size': this.fontSize, "font-weight": fontWeight, fill: fontColor});
	} else {
		text.attr({'font-family': fontFamily, 'font-size': this.fontSize, "font-weight": fontWeight, 'text-anchor': 'start', fill: fontColor});
	}

	this.setTextExecute(this.plainText);
	///////////////////////////////////////////////////
}

jCustom.prototype.getSize = function(){
	return {width:this.width, height:this.height};
}

jCustom.prototype.setSize = function(width, height){
	this.width = width;
	this.height = height;
}

/**
 * 노도의 좌표를 반환
 */
jCustom.prototype.getLocation = function(){
	return {x:this.x, y:this.y};
}

jCustom.prototype.setLocation = function(x, y){
	if(x && !y){
		this.x = x;
	} else if(!x && y) {
		this.y = y;
	} else {
		this.x = x;
		this.y = y;
	}
	
	this.updateNodeShapesPos();
}

/**
 * 노드의 크기를 계산한다.
 */
jCustom.prototype.CalcBodySize = function(){
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
		width + hGap,	// 넓이
		height + vGap	// 높이
	);
	
//	this.updateNodeShapesPos();
}

/**
 * 노드가 갖고 있는 여러 도형들(body, text, folderShape...)의 위치를 재정렬 한다.
 */
jCustom.prototype.updateNodeShapesPos = function(){
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
	var x = this.x;
	var y = this.y;
	var width = this.width;
	var height = this.height;
	
	// folder표시 위치
	var fold_x = 0
	var fold_y = 0;
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			fold_x = this.isLeft()? x : x + width;
			fold_y = y + height / 2;
			break;
		case "jTreeLayout" :
			fold_x = x + width / 2;
			fold_y = y + height;
			break;
		default :			
	}
	this.folderShape.attr({cx: fold_x, cy: fold_y});
	
	// img 위치
	if (img) {
		var img_x = x + hGap/2;
		var img_y = y + vGap/2;
		
		if(this.isRootNode()) {
			img_x += (width / 2) - (img.getBBox().width / 2) - hGap / 2;
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
			text_x += width / 2 - hGap / 2;
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
	
	
//	this.connection && jMap.layoutManager.connection(this.connection, null, null, this.isLeft());
	this.connection && this.connection.updateLine();
	this.updateBody();
}

jCustom.prototype.getInputPort = function(){
	var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(body.width) && !isNaN(body.width)){
		body_width = body.width;
	}
	if(isFinite(body.height) && !isNaN(body.height)){
		body_height = body.height;
	}
	
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft()) {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x - 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break
		case "jTreeLayout" :
			if(this.isRootNode()) return {x: body.x + body_width / 2, y: body.y + body_height};
			return {x: body.x + body_width / 2, y: body.y};
			break;	// 의미없는 break
		case "jRotateLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft()) {
				return {x: body.x - 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x - 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break
		case "jTableLayout" :
			if(this.isRootNode()) return {x: body.x + body_width / 2, y: body.y + body_height};
			return {x: body.x + body_width / 2, y: body.y};
			break;	// 의미없는 break
		default :			
	}
}

jCustom.prototype.getOutputPort = function(){
	var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(body.width) && !isNaN(body.width)){
		body_width = body.width;
	}
	if(isFinite(body.height) && !isNaN(body.height)){
		body_height = body.height;
	}
	
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft()) {
				return {x: body.x - 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break
		case "jTreeLayout" :
			return {x: body.x + body_width / 2, y: body.y + body_height};
			break;	// 의미없는 break
		case "jRotateLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft()) {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break	
		case "jTableLayout" :
			return {x: body.x + body_width / 2, y: body.y + body_height};
			break;	// 의미없는 break
		default :			
	}
}

jCustom.prototype.toString = function () {
    return "jCustom";
}


//interface
jCustom.prototype.updateBody = function(){}

