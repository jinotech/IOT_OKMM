/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// jLine //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * @param {jNode} node1	: 부모 Node
 * @param {jNode} node2	: 자신 Node
 */
jLine = function (node1, node2){
	this.node1 = node1;
	this.node2 = node2;
	
	var color = "#000";
    this.line = RAPHAEL.path().attr({stroke: color, fill: color});
    
    //KHANG: text on branch
    this.text_line = RAPHAEL.path().attr({stroke: "transparent", fill: "transparent"});
    this.text_line.node.id = "line_" + node2.id;
    this.text = RAPHAEL.text();
	
	// 전역 그룹이 설정되어 있다면
	if(jMap.groupEl){
		jMap.groupEl.appendChild(this.line.node);
	}
	
	this.line.toBack();
	
	this.draw();
}

jLine.prototype.type= "jLine";

jLine.prototype.updateLine = function(){
	this.draw();
}

jLine.prototype.getWidth = function(){
	var width = parseInt(this.node2.branch.width);
	if (isNaN(width)) width = 0;
	return width;
}

jLine.prototype.getColor = function(){
	return this.node2.edge.color;
}

/**
 * setColor함수는 권장하지 않음.
 * 노드의 선 색상과 같이 변경되기 때문에
 * jNode.prototype.setEdgeColorExecute에서 처리됨
 */
jLine.prototype.setColor = function(color){
    this.line.attr({stroke: color, fill: color});	
}

jLine.prototype.show = function(){
	this.line.show();
	this.text_line.show(); //KHANG
	this.text.show(); //KHANG
}

jLine.prototype.hide = function(){
	this.line.hide();
	this.text_line.hide(); //KHANG
	this.text.hide(); //KHANG
}

jLine.prototype.remove = function(){
	this.line.remove();
	this.text_line.remove(); //KHANG
	this.text.remove(); //KHANG
}


// interface
jLine.prototype.draw = function() {}


