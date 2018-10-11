/**
 * 
 * @author Hahm Myungsun
 * 
 */

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// jConnectorNode ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
jConnectorNode = function(parentNode, text, id, index, position, userjson){
	jConnectorNode.superclass.call(this, parentNode, text, id, index, position);
	this.userjson = userjson;
}

extend(jConnectorNode, jMindMapNode);
jConnectorNode.prototype.type = "jConnectorNode";

/**
 * 필요한 Raphael Element를 만든다.
 */

jConnectorNode.prototype.initElements = function() {
	this.color = "#000";
	this.body = RAPHAEL.path().attr({stroke: this.color, fill: "none"});
	this.text = RAPHAEL.text(0, 0, "");
	this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);

	// 그룹화하기 위해 반드시 불러야 한다. (인자 : 그룹화할 Element)
	this.wrapElements(this.body, this.text, this.folderShape);		
}

jConnectorNode.prototype.create = function(){
//	this.connection = this.parent && jMap.layoutManager.connection(this.parent.body, this.body, "#000", this.isLeft());	
	this.connection = null;
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			this.connection = this.parent && new jLineBezier(this.parent, this);
			break;
		case "jTreeLayout" :
			this.connection = this.parent && new jLinePolygonal(this.parent, this);
			break;
		case "jTableLayout" :
			break
		default :
			this.connection = this.parent && new jLineBezier(this.parent, this);
			break;
	}
	
	///////////////////////////////////////////////////
	// 노드 초기화	 : 노드 색상, 폰트 설정 등등
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;
	this.x = 0;
	this.y = 0;
	this.width=40;
	this.height=20;
	
}

jConnectorNode.prototype.getSize = function(){
	return {width:this.width, height:this.height};
}

jConnectorNode.prototype.setSize = function(width, height){
/*	this.body.attr({
		width: width,
		height: height
	});*/
}

/**
 * 노도의 좌표를 반환
 */
jConnectorNode.prototype.getLocation = function(){
	return {x:this.x, y:this.y};
}

jConnectorNode.prototype.setLocation = function(x, y){
	this.x = x;
	this.y = y;
	var body = this.body;
	
/*	if(x && !y){
		body.attr({x: x});
	} else if(!x && y) {
		body.attr({y: y});
	} else {
		body.attr({x: x, y: y});
	}
	*/
	var path = new Array();
	var userJsonStr = "";
	var umlStringIsa = "isa";
	var umlStringHas = "has";
	
//	if( this.userjson.umlType == umlStringIsa ) {
		this.width = 20;
		path = ["M", x, y+this.height/2, 
	            "L", x+this.width, y, 
	            "L", x+this.width, y+this.height, 
	            "L", x, y+this.height/2 
	            ].join(",");
		this.body.attr({path: path, stroke: this.color});
//	} else if( this.userjson.umlType == umlStringHas ){
//		path = ["M", x, y+this.height/2,
//	            "L", x+this.width/2, y, 
//	            "L", x+this.width, y+this.height/2, 
//	            "L", x+this.width/2, y+this.height, 
//	            "L", x, y+this.height/2
//	            ].join(",");
//		this.body.attr({path: path, stroke: this.color});
//		
//		console.log(x);
//		console.log(y);
//		console.log(path);
//	} else {
//		body.attr({x: this.x, y: this.y});
//	}
	
	this.updateNodeShapesPos();
}

/**
 * 노드의 크기를 계산한다.
 */
jConnectorNode.prototype.CalcBodySize = function(){
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
	
	// icon 계산
	if(this.icon)
		width += this.icon.getBBox().width + hGap/2;
	// hyperlink 계산
	if(this.hyperlink)
		width += this.hyperlink.getBBox().width + hGap/2 ;
	
	this.setSize(
		width + hGap,	// 넓이
		height + vGap	// 높이
	);
	
	this.updateNodeShapesPos();
}

/**
 * 노드가 갖고 있는 여러 도형들(body, text, folderShape...)의 위치를 재정렬 한다.
 */
jConnectorNode.prototype.updateNodeShapesPos = function(){
	var hGap = TEXT_HGAP;
	var vGap = TEXT_VGAP;
	var currentHeightPos = 0;	// 0에서 부터 요소들의 height따라 위치를 계산에 필요한 변수
	
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;
	var img = this.img;
	var hyperlink = this.hyperlink;
	var icon = this.icon;
	var foreignObj = this.foreignObjEl;	
	// body의 x, y
	var x =this.x;
	var y =this.y;
	
	// folder표시 위치
	var fold_x = 0
	var fold_y = 0;
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			fold_x = this.isLeft()? x : x + this.width;
			fold_y = y + this.height / 2;
			break;
		case "jTreeLayout" :
			fold_x = x + this.width / 2;
			fold_y = y + this.height;
			break;
		default :			
	}
	this.folderShape.attr({cx: fold_x, cy: fold_y});
	
	// icon 위치
	if (icon) {
		var icon_x = x + hGap/2;
		var icon_y = y + (icon.getBBox().height - icon.getBBox().height)/2;
		icon.attr({x: icon_x, y: icon_y});
	}
	
	var obj_width = 0;
	// img 위치
	if (img) {
		var img_x = icon ? x + img.getBBox().width + hGap :  x + hGap/2;
		var img_y = y + vGap/2;
		img.attr({x: img_x, y: img_y});
		currentHeightPos += img.getBBox().height;
		
		obj_width = img.getBBox().width;
	}
	// foreignObj
	if (foreignObj) {
		var ob_x = icon ? x + 16 + hGap : x + hGap/2;
		var ob_y = y + currentHeightPos + vGap/2;		
		currentHeightPos += parseInt(foreignObj.getAttribute("height"));
		foreignObj.setAttribute("x", ob_x);
		foreignObj.setAttribute("y", ob_y);
		
		obj_width = (obj_width > foreignObj.getBBox().width) ? obj_width : foreignObj.getBBox().width;
	}
	// 텍스트 위치
	if (text) {
		var text_x = icon ? x + 16 + hGap : x + hGap/2;
		var text_y = y + (vGap + text.getBBox().height) / 2; //this.body.getBBox().height / 2;
		text_y += currentHeightPos;	
		text.attr({x: text_x, y: text_y});
		
		obj_width = (obj_width > text.getBBox().width) ? obj_width : text.getBBox().width;
	}
	// hyperlink 위치
	if (hyperlink) {
		var hyper_x = icon ? x + 16 + obj_width + hGap : x + obj_width + hGap;
		var hyper_y = y + (this.height - hyperlink.getBBox().height)/2;
		hyperlink && hyperlink.attr({x: hyper_x, y: hyper_y});
	}
	
	
	var oInput = jMap.controller.nodeEditor;
	var oInputNodeId = oInput.getAttribute("nodeID");
	if(oInputNodeId == this.id) {
		var hGap = TEXT_HGAP * jMap.scaleTimes;
		var vGap = TEXT_VGAP * jMap.scaleTimes;
		var left = this.x * jMap.scaleTimes + hGap / 4;
		var top = this.y * jMap.scaleTimes + vGap / 4;
		
		oInput.style.left = left + "px";
		oInput.style.top = top - vGap/4 + "px";
	}
	
//	this.connection && jMap.layoutManager.connection(this.connection, null, null, this.isLeft());
	this.connection && this.connection.updateLine();
}

jConnectorNode.prototype.getInputPort = function(){
	//var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(this.width) && !isNaN(this.width)){
		body_width = this.width;
	}
	if(isFinite(this.height) && !isNaN(this.height)){
		body_height = this.height;
	}
	
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			if(this.isRootNode()) {
				return {x: this.x + body_width / 2, y: this.y + body_height / 2};
			}
			
			if (this.isLeft()) {
				return {x: this.x + body_width + 1, y: this.y + body_height / 2};
			} else {
				return {x: this.x - 1, y: this.y + body_height / 2};
			}
			break;	// 의미없는 break
		case "jTreeLayout" :
			if(this.isRootNode()) return {x: this.x + body_width / 2, y: this.y + body_height};
			return {x: this.x + body_width / 2, y: this.y};
			break;	// 의미없는 break
		default :			
	}
}

jConnectorNode.prototype.getOutputPort = function(){
	var body = this;    
	
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
		default :			
	}
}

jConnectorNode.prototype.toString = function () {
    return "jConnectorNode";
}



