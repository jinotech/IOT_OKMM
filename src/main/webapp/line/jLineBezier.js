
/**
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// jLineBezier //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jLineBezier = function (node1, node2){
	jLineBezier.superclass.call(this, node1, node2);
}

extend(jLineBezier, jLine);
jLineBezier.prototype.type= "jLineBezier";

jLineBezier.prototype.draw = function() {
	var width = this.getWidth();
	if(!width) width = 1;
	var isLeft = this.node2.isLeft();
	
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
	
	if(isLeft) {
		var res = [2, 7];
		if(this.node1.isRootNode()){
			outputPort = this.node1.getInputPort();
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
	
	this.line.attr({path: path});
	
	
	//KHANG
	if (this.node2.attributes && this.node2.attributes['branchText']) {
		this.text.show();
		this.text.attr({"text-anchor": "middle"});
		var branch_text = this.node2.attributes['branchText'];

	    var text_path;
	    var offset = 50;
	    var dx = (y4 - y1);
	    var dy = -(x4 - x1);
	    var norm = Math.sqrt(dx*dx + dy*dy);
	    if (norm === 0.0)
	    	norm = 1;
	    dx *= 5.0/norm;
	    dy *= 5.0/norm;


		if (isLeft) {
	    	text_path = ["M", x4.toFixed(3), y4.toFixed(3),
				"C", x3, y3, x2, y2, x1.toFixed(3), y1.toFixed(3)
				].join(",");
	    	dx = -dx;
	    	dy = -dy;
	    	
	    	if (this.node1.isRootNode())
	    		offset -= 20;
	    } else {
	    	text_path = ["M", x1.toFixed(3), y1.toFixed(3),
				"C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)
				].join(",");

	    	if (this.node1.isRootNode())
	    		offset += 20;
	    }
		
	    this.text_line.attr({path: text_path, transform: "t" + dx.toFixed(3) + "," + dy.toFixed(3)});
		this.text.node.innerHTML = '<textPath startOffset="' + offset + '%" xlink:href="#' + this.text_line.node.id + '">' + branch_text + '</textPath>';
	} else {
		this.text.hide();
	}
}


