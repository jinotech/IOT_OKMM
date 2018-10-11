/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
////////////////////////////// jEllipse ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jEllipse = function(parentNode, text, id, index, position){
	jEllipse.superclass.call(this, parentNode, text, id, index, position);
}

extend(jEllipse, jMindMapNode);
jEllipse.prototype.type = "jEllipse";

/**
 * 필요한 Raphael Element를 만든다.
 */
jEllipse.prototype.initElements = function() {
	this.body = RAPHAEL.ellipse();		
	this.text = RAPHAEL.text();		
	this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
	
	// 그룹화하기 위해 반드시 불러야 한다. (인자 : 그룹화할 Element)
	this.wrapElements(this.body, this.text, this.folderShape);		
}

jEllipse.prototype.create = function(){
//	this.connection = this.parent && jMap.layoutManager.connection(this.parent.body, this.body, "#000", this.isLeft());
	this.connection = this.parent && new jLineBezier(this.parent, this);
	
	///////////////////////////////////////////////////
	// 노드 초기화	 : 노드 색상, 폰트 설정 등등
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;
	
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
		fontWeight = 'bold';
	} else if(this.getParent() && this.getParent().isRootNode()) {
		this.fontSize = jMap.cfg.nodeFontSizes[1];
		fontWeight = 'bold';
	} else {
		this.fontSize = jMap.cfg.nodeFontSizes[2];
		fontWeight = 'normal';	
	}
	
	if(this.isRootNode()) {
		text.attr({'font-family': fontFamily, 'font-size': this.fontSize, "font-weight": fontWeight, fill: fontColor});
	} else {
		text.attr({'font-family': fontFamily, 'font-size': this.fontSize, "font-weight": fontWeight, 'text-anchor': 'start', fill: fontColor});
	}

	this.setTextExecute(this.plainText);
	///////////////////////////////////////////////////
}

jEllipse.prototype.getSize = function(){
	return {width:this.body.getBBox().width, height:this.body.getBBox().height};
}

jEllipse.prototype.setSize = function(width, height){
	this.body.attr({
		rx: width / 2,
		ry: height / 2
	});
}

/**
 * 노도의 좌표를 반환
 */
jEllipse.prototype.getLocation = function(){
	return {x:this.body.getBBox().x, y:this.body.getBBox().y};
}

jEllipse.prototype.setLocation = function(x, y){
	var body = this.body;	
	body.attr({cx: x + this.body.getBBox().width / 2, cy: y + this.body.getBBox().height / 2});
		
	this.updateNodeShapesPos();
}

/**
 * 노드의 크기를 계산한다.
 */
jEllipse.prototype.CalcBodySize = function(){
	var width = 0;
	var height = 0;
		
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
	// hyperlink 계산
	if(this.hyperlink)
		width += this.hyperlink.getBBox().width + TEXT_HGAP/2 ;
	
	this.setSize(
		width + TEXT_HGAP,	// 넓이
		height + TEXT_VGAP	// 높이
	);
	
//	this.updateNodeShapesPos();
}

/**
 * 노드가 갖고 있는 여러 도형들(body, text, folderShape...)의 위치를 재정렬 한다.
 */
jEllipse.prototype.updateNodeShapesPos = function(){
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;
	var img = this.img;
	var hyperlink = this.hyperlink;
	// body의 x, y
	var x = body.getBBox().x;
	var y = body.getBBox().y;
	
	// folder표시 위치
	var fold_x = this.isLeft()? x : x + this.body.getBBox().width;
	var fold_y = y + this.body.getBBox().height / 2;
	this.folderShape.attr({cx: fold_x, cy: fold_y});	
	// img 위치
	var img_x = x + TEXT_HGAP/2;
	var img_y = y + TEXT_VGAP/2;
	img && img.attr({x: img_x, y: img_y});
	// 텍스트 위치
	var text_x = x + TEXT_HGAP/2;
	if(this.isRootNode()) {
		text_x += text.getBBox().width / 2;
	}
	var text_y = y + (text.getBBox().height + TEXT_VGAP) / 2;
	text_y += img && img.getBBox().height;	
	text.attr({x: text_x, y: text_y});
	// hyperlink 위치
	var hyper_x = x + TEXT_HGAP;
	if(img) hyper_x += (text.getBBox().width > img.getBBox().width)? text.getBBox().width : img.getBBox().width; 
	else hyper_x += text.getBBox().width;
	var hyper_y = y + text.getBBox().height / 2;
	hyper_y += img && img.getBBox().height / 2;	
	hyperlink && hyperlink.attr({x: hyper_x, y: hyper_y});
	
	//this.connection && jMap.layoutManager.connection(this.connection, null, null, this.isLeft());
	this.connection && this.connection.updateLine();
}

jEllipse.prototype.getInputPort = function(){
	var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(body.width) && !isNaN(body.width)){
		body_width = body.width;
	}
	if(isFinite(body.height) && !isNaN(body.height)){
		body_height = body.width;
	}
	
	
	if (this.isLeft && this.isLeft()) {
		return {x: body.x + body_width + 1, y: body.y + body_height / 2};
	} else {
		return {x: body.x - 1, y: body.y + body_height / 2};
	}
}

jEllipse.prototype.getOutputPort = function(){	
	var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(body.width) && !isNaN(body.width)){
		body_width = body.width;
	}
	if(isFinite(body.height) && !isNaN(body.height)){
		body_height = body.width;
	}
	
	if (this.isLeft && this.isLeft()) {
		return {x: body.x - 1, y: body.y + body_height / 2};
	} else {
		return {x: body.x + body_width + 1, y: body.y + body_height / 2};
	}
}

jEllipse.prototype.toString = function () {
    return "jEllipse";
}


