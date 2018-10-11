
/**
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */


CurveArrowLink = function(endNode){	
	CurveArrowLink.superclass.call(this, endNode);	
}

extend(CurveArrowLink, ArrowLink);
CurveArrowLink.prototype.type = "CurveArrowLink";

CurveArrowLink.prototype.draw = function() {
	if (this.removed) return false;
	
	var destNode = jMap.getNodeById(this.destination);
	
	// 대상 노드가 안보이는 경우는 그리지 않는다.
	if(destNode == null || destNode.hided) {
		return false;
	}
	
	var color = this.getColor();
	
	var startPort = this.startNode.getOutputPort();
	var endPort = destNode.getOutputPort();
	
	var startInclinations = this.startInclination.split(";");
	var endInclinations = this.endInclination.split(";");
	
	var x1 = startPort.x,
	    y1 = startPort.y,
	    x2 = endPort.x,
	    y2 = endPort.y,
	    cx1 = parseFloat(startPort.x) + parseFloat(startInclinations[0]),
	    cy1 = parseFloat(startPort.y) + parseFloat(startInclinations[1]),
	    cx2 = parseFloat(endPort.x) + parseFloat(endInclinations[0]),
	    cy2 = parseFloat(endPort.y) + parseFloat(endInclinations[1]);
	
	if(this.startNode.isLeft && this.startNode.isLeft()) {
		cx1 = parseFloat(startPort.x) - parseFloat(startInclinations[0]);
	}
	if(destNode.isLeft && destNode.isLeft()) {
		cx2 = parseFloat(endPort.x) - parseFloat(endInclinations[0]);
	}
	
	//<path class="SamplePath" d="M100,200 C100,100 250,100 250,200" />
	var path = ["M", x1.toFixed(3), y1.toFixed(3),
				"C", cx1, cy1, cx2, cy2, x2.toFixed(3), y2.toFixed(3)
				].join(",");
	
	this.line && this.line.attr({path: path, stroke: color});

	//Khang , id: this.id
	this.line && (this.line.node.id = this.id);	
	
	if(this.endArrow != "None") {
		var path2 = ["M", x2.toFixed(3), y2.toFixed(3),
		             "L", x2 + this.arrowWidth, y2 + this.arrowHeight, 
		             "L", x2 + this.arrowWidth, y2 - this.arrowHeight,
		             "L", x2, y2].join(",");
		
		if(destNode.isLeft && destNode.isLeft()) {
			path2 = ["M", x2.toFixed(3), y2.toFixed(3),
		             "L", x2 - this.arrowWidth, y2 + this.arrowHeight, 
		             "L", x2 - this.arrowWidth, y2 - this.arrowHeight,
		             "L", x2, y2].join(",");
		}
		
		this.arrowEnd && this.arrowEnd.attr({path: path2, stroke: color, fill: color});
	}
	
	if(this.startArrow != "None") {
		var path1 = ["M", x1.toFixed(3), y1.toFixed(3),
		             "L", x1 + this.arrowWidth, y1 + this.arrowHeight, 
		             "L", x1 + this.arrowWidth, y1 - this.arrowHeight,
		             "L", x1, y1].join(",");
		
		if(destNode.isLeft && destNode.isLeft()) {
			path1 = ["M", x1.toFixed(3), y1.toFixed(3),
		             "L", x1 - this.arrowWidth, y1 + this.arrowHeight, 
		             "L", x1 - this.arrowWidth, y1 - this.arrowHeight,
		             "L", x1, y1].join(",");
		}
		
		this.arrowStart && this.arrowStart.attr({path: path1, stroke: color, fill: color});
	}
}

/*
CurveArrowLink.prototype.draw = function() {
	var destNode = jMap.getNodeById(this.destination);
	
	// 대상 노드가 안보이는 경우는 그리지 않는다.
	if(destNode.hided) {
		return;
	}
	
	var color = this.getColor();
	
	var width = 1;
	
	var isLeft = destNode.isLeft();
	
    var bb1 = this.startNode.body.getBBox();
    var bb2 = destNode.body.getBBox();
	
	var bb1_width = 0;
	if(isFinite(bb1.width)){
		bb1_width = bb1.width;
	}
	var bb2_width = 0;
	if(isFinite(bb2.width)){
		bb2_width = bb2.width;
	}
	
	var inputPort = this.startNode.getInputPort();
	var outputPort = destNode.getOutputPort();
	
	if(isLeft) {
		var res = [2, 7];
		if(this.startNode.isRootNode()){
			outputPort = this.startNode.getInputPort();
		}
	} else {
		var res = [3, 6];
	}
	
	
    var x1 = outputPort.x,
        y1 = outputPort.y - width/2,
        x4 = inputPort.x,
        y4 = inputPort.y,
        dx = Math.max(Math.abs(x1 - x4) / 2, 10),
        dy = Math.max(Math.abs(y1 - y4) / 2, 10),
        x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3),
		y_width = y1+width,
		x3_width = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]],
		x2_width = [x1, x1, x1 - dx, x1 + dx][res[0]]; 
	
	if(isLeft) {
		if (y1 > y4) {
			x3_width = x3_width - width;
			x2_width = x2_width - width;
		}
		else {
			x3_width = x3_width + width;
			x2_width = x2_width + width;
		}					
	} else {
		if (y1 > y4) {
			x3_width = x3_width + width;
			x2_width = x2_width + width;
		}
		else {
			x3_width = x3_width - width;
			x2_width = x2_width - width;
		}
	}
	
	x3_width = x3_width.toFixed(3);
	x2_width = x2_width.toFixed(3);
	
    var path = ["M", x1.toFixed(3), y1.toFixed(3),
				"C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)
				,
				"C", x3, y3, x2_width, y2, x1.toFixed(3), y_width.toFixed(3)
				].join(",");
	
	this.line.attr({path: path, stroke: color, fill: color});
		
}
*/