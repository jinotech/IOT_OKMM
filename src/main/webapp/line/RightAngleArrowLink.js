
/**
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

RightAngleArrowLink = function (endNode) {
	RightAngleArrowLink.superclass.call(this, endNode);
	
	this.defaultColor = "#aaa"; 
}

extend(RightAngleArrowLink, ArrowLink);
RightAngleArrowLink.prototype.type= "RightAngleArrowLink";

RightAngleArrowLink.prototype.draw = function() {
	if (this.removed) return false;
	
	var destNode = jMap.getNodeById(this.destination);
	
	// 대상 노드가 안보이는 경우는 그리지 않는다.
	if(destNode == null || destNode.hided) {
		return false;
	}
	
	var color = this.getColor();
	
	var startPort = this.startNode.getOutputPort();
	var endPort = destNode.getInputPort();
	
	var x1 = startPort.x,
	    y1 = startPort.y,
	    x2 = endPort.x,
	    y2 = endPort.y;
	    
	var w1 = this.startNode.getSize().width;
	var w2 = destNode.getSize().width;
	
	
	//<path class="SamplePath" d="M100,200 C100,100 250,100 250,200" />
	var path = ["M", x1.toFixed(3), y1.toFixed(3),
				"L", x1.toFixed(3), parseInt(y1) + 10];
	
	if(parseInt(y1) > parseInt(y2) - 20) {
    path = path.concat(["L", parseInt(x1) + parseInt((parseInt(x2) + parseInt(w1)/2 - parseInt(x1) - parseInt(w2)/2)/2), parseInt(y1) + 10]);
    path = path.concat(["L", parseInt(x1) + parseInt((parseInt(x2) + parseInt(w1)/2 - parseInt(x1) - parseInt(w2)/2)/2), parseInt(y2) - 10]);
    path = path.concat(["L",  x2.toFixed(3), parseInt(y2) - 10]);
	} else {
	  path = path.concat(["L",  x2.toFixed(3), parseInt(y1) + 10]);
	}


  path = path.concat(["L", x2.toFixed(3), y2.toFixed(3)]);

	
	this.line && this.line.attr({path: path.join(","), stroke: color});
	
//	if(this.endArrow != "None") {
//		var path2 = ["M", x2.toFixed(3), y2.toFixed(3),
//		             "L", x2 + this.arrowWidth, y2 + this.arrowHeight, 
//		             "L", x2 + this.arrowWidth, y2 - this.arrowHeight,
//		             "L", x2, y2].join(",");
//		
//		this.arrowEnd && this.arrowEnd.attr({path: path2, stroke: color, fill: color});
//	}
//	
//	if(this.startArrow != "None") {
//		var path1 = ["M", x1.toFixed(3), y1.toFixed(3),
//		             "L", x1 + this.arrowWidth, y1 + this.arrowHeight, 
//		             "L", x1 + this.arrowWidth, y1 - this.arrowHeight,
//		             "L", x1, y1].join(",");
//		
//		this.arrowStart && this.arrowStart.attr({path: path1, stroke: color, fill: color});
//	}
}
