
/**
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////////// jLineFish //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jLineFish = function (node1, node2){
	this.HGAP = 10;
	this.VGAP = 10;
	
	this.angle = 90;
	
	jLineFish.superclass.call(this, node1, node2);
}

extend(jLineFish, jLine);
jLineFish.prototype.type= "jLineFish";

jLineFish.prototype.draw = function() {
	var width = this.getWidth();
	if(!width) width = 1;
	
    var bb1 = this.node1.getSize();
    var bb2 = this.node2.getSize();
	
	var bb1_width = 0;
	if(isFinite(bb1.width)){
		bb1_width = bb1.width;
	}
	var bb2_width = 0;
	if(isFinite(bb2.width)){
		bb2_width = bb2.width;
	}

	var x1 = 0,
		 x2 = 0,
		 y1 = 0,
		 y2 = 0;

	var children = this.node2.getUnChildren();
	
	var sin = Math.sin( Math.PI * (90 - this.angle)/180);
	var cos = Math.cos( Math.PI * (90 - this.angle)/180);
	var tan = Math.tan( Math.PI * (90 - this.angle)/180);
	
	if(this.node2.isVertical()) {
		if(this.node2.isTopSide()) {
			x1 = this.node2.getInputPort().x;
			y1 = this.node2.getInputPort().y;
			
			var h = this.node2.getTreeHeight();
			if(children != null && children.length > 0) {
				h -= children[0].getTreeHeight();
			}
			
			y2 = y1 - parseFloat(this.node2.getTreeHeight()) + 7;
			if(children != null && children.length > 0) {
				h +=  this.VGAP
				y2 += children[0].getTreeHeight()  - this.VGAP - 4;
				x2 += 4 * tan;
			}
			
			x2 += x1 + (h - 7) * tan;
			
			x1 -= this.VGAP * tan;
			y1 += this.VGAP;
			
		} else {
			x1 = this.node2.getOutputPort().x -  this.node2.body.getBBox().width * sin;
			// 오차 보정.... 이상하게 어긋남....
			if(this.node2.getDepth() > 1) { x1 += 4}
			
			y1 = this.node1.getOutputPort().y + this.VGAP;
			x2 = x1 + (this.node2.body.getBBox().width - 3) * sin;
			y2 = y1 + (this.node2.body.getBBox().width - 3) * cos;
			
			if(children != null && children.length > 0) {
				var child = children[children.length - 1]; 
				var h = this.node2.getTreeHeight() - child.getTreeHeight() + child.body.getBBox().height;
				
				x2 = Math.max(x2, x1 + h* tan);
				y2 =  Math.max(y2,  y1 + h);
			}
			
			x1 -= this.VGAP * tan;
			y1 -= this.VGAP;
		}
	} else {
		x1 = this.node2.getLocation().x - this.HGAP - 2;
		y1 = this.node2.getLocation().y + this.node2.getSize().height;
		x2 = x1 + this.node2.getTreeWidth() + this.HGAP - 2;
		y2 = y1;
		
		var children = this.node2.getUnChildren();
		if(children != null && children.length > 0) {
			var child = children[children.length - 1]; 
			x2 -=  child.getTreeWidth() - child.getSize().width - this.HGAP
			if(this.node2.isTopSide()) {
				x2 -= 5;
			} else {
				x2 += 1;
			}
		};
		
		if(this.node2.isTopSide()) {
			x1 -= 6;
		} else {
			x1 += 2;
		}
	}
	
    var path = ["M", x1, y1,
				"L", x2, y2
				].join(",");
	
	
	this.line.attr({path: path});
		
}


