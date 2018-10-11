/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

/////////////////////////// SVG /////////////////////////////
if(Raphael.svg){


Raphael.fn.setSize = function (width, height) {
    this.width = width || this.width;
    this.height = height || this.height;
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);
    return this;
};
	
Raphael.fn.getSize = function(){
	return {
		width: this.width,
		height: this.height
	}
}

	
}

/////////////////////////// VML /////////////////////////////
if(Raphael.vml){


Raphael.fn.setSize = function (width, height) {
    var cs = this.canvas.style;
    width == +width && (width += "px");
    height == +height && (height += "px");
    cs.width = width;
    cs.height = height;
    cs.clip = "rect(0 " + width + " " + height + " 0)";
    return this;
};

Raphael.fn.getSize = function(){
	var cs = this.canvas.style;
	return {
		width: parseInt(cs.width),
		height: parseInt(cs.height)
	}
}

	
}

