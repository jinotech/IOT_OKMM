
/**
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// jLineStraight //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jLineStraight = function (node1, node2){
	jLineStraight.superclass.call(this, node1, node2);
}

extend(jLineStraight, jLine);
jLineStraight.prototype.type= "jLineStraight";

jLineStraight.prototype.draw = function() {
	var width = this.getWidth();
	if(!width) width = 1;
	
    var bb1 = this.node1.body.getBBox();
    var bb2 = this.node2.body.getBBox();
	
	var bb1_width = 0;
	if(isFinite(bb1.width)){
		bb1_width = bb1.width;
	}
	var bb2_width = 0;
	if(isFinite(bb2.width)){
		bb2_width = bb2.width;
	}
	
	var inputPort = this.node2.getInputPort();
	var outputPort = this.node1.getOutputPort();
	
	var x1 = outputPort.x.toFixed(3),
		x2 = inputPort.x.toFixed(3),
		y1 = outputPort.y.toFixed(3),
		y2 = inputPort.y.toFixed(3);
	
    var path = ["M", x1, y1,
				"L", x2, y2
				].join(",");
	
	this.line.attr({path: path});
		
}


