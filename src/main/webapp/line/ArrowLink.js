
/**
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// ArrowLink ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

ArrowLink = function (endNode) {
	this.startNode = null;

	this.color = null;
	this.destination = endNode?endNode.id:null;
	this.destinationNode = endNode?endNode:null;
	this.endArrow = "Default";
	this.endInclination = "129;0;";
	this.id = this.createID();
	this.startArrow = "None";
	this.startInclination = "129;0;";
	
	//화살표 크기
	this.arrowWidth = 10;
	this.arrowHeight = 5;
	this.defaultColor = "#cc9";
	
	
	this.line = RAPHAEL.path().attr({stroke: this.color, fill: "none"});
    this.arrowEnd = RAPHAEL.path().attr({stroke: this.color, fill: this.defaultColor});
    this.arrowStart = RAPHAEL.path().attr({stroke: this.color, fill: this.defaultColor});

	//this.line.toBack();
	
	this.hided = false;
}

ArrowLink.prototype.type= "ArrowLink";
/*
ArrowLink function (node1, node2){
	ArrowLink.superclass.call(this, node1, node2);
	
	this.color = null;
	this.destination = null;
	this.endArrow = null;
	this.endInclination = null;
	this.id = null;
	this.startArrow = null;
	this.startInclination = null;
}

extend(ArrowLink, jLine);
ArrowLink.prototype.type= "ArrowLink";
*/

ArrowLink.prototype.remove = function() {
	if (this.removed) return false;
	
	this.line.remove();
	this.arrowEnd.remove();
	this.arrowStart.remove();
		
	this.removed = true;
	
	return true;
}

ArrowLink.prototype.hide = function() {
	this.line.hide();
	this.arrowEnd.hide();
	this.arrowStart.hide();
	
	this.hided = true;
}

ArrowLink.prototype.show = function() {
	this.line.show();
	this.arrowEnd.show();
	this.arrowStart.show();
		
	this.hided = false;
}

ArrowLink.prototype.getColor = function() {
	if(this.color != null) {
		return this.color;
	} else {
		return this.defaultColor;
	}
}

ArrowLink.prototype.createID = function(){
	var id = "";
	while(!jMap.checkID(id)) id = "Arrow_ID_" + parseInt(Math.random()*2000000000);
	return id;
}

// <arrowlink DESTINATION="ID_389929301" ENDARROW="Default" ENDINCLINATION="129;0;" ID="Arrow_ID_1225745029" STARTARROW="None" STARTINCLINATION="129;0;"/>
ArrowLink.prototype.toXML = function(){
	var buffer = new StringBuffer();
	buffer.add("<arrowlink");
	buffer.add(" DESTINATION=\"" + this.destination +"\"");
	if(this.color != null) {
		buffer.add("COLOR=\"" + this.color +"\"");
	}
	if(this.endArrow != null) {
		buffer.add(" ENDARROW=\"" + this.endArrow +"\"");
	}
	if(this.endInclination != null) {
		buffer.add(" ENDINCLINATION=\"" + this.endInclination +"\"");
	}
	if(this.id != null) {
		buffer.add(" ID=\"" + this.id +"\"");
	}
	if(this.startArrow != null) {
		buffer.add(" STARTARROW=\"" + this.startArrow +"\"");
	}
	if(this.startInclination != null) {
		buffer.add(" STARTINCLINATION=\"" + this.startInclination +"\"");
	}
	buffer.add("/>")
	return buffer.toString("\n");
}

//interface
ArrowLink.prototype.draw = function() {}

