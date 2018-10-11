/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

NodeColorUtil = (function () {				
	function Util(){}
	
	var toHex = function (N) {
		if (N==null) return "00";
		N=parseInt(N); if (N==0 || isNaN(N)) return "00";
		N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
		return "0123456789ABCDEF".charAt((N-N%16)/16)
		  + "0123456789ABCDEF".charAt(N%16);
	}
	
	Util.RGBtoHex = function (R,G,B) {return "#"+toHex(R)+toHex(G)+toHex(B)}

	Util.brighter = function (color,preFactor) {
		var r = (255-color.r) * preFactor + color.r;
		var g = (255-color.g) * preFactor + color.b;
		var b = (255-color.b) * preFactor + color.b;		
		return this.RGBtoHex(r,g,b);
	}
	
	Util.darker = function (color,factor) {
		var r = -(color.r) * factor + color.r;
		var g = -(color.g) * factor + color.g;
		var b = -(color.b) * factor + color.b;
		return this.RGBtoHex(r,g,b);
	}

	Util.randomer = function (color, Factor){
		var r1 = Math.floor(Math.random() * Factor);
		var g1 = Math.floor(Math.random() * Factor);
		var b1 = Math.floor(Math.random() * Factor);
		var r = color.r+r1
		if (r>255){r=r-2*r1}
		var g = color.g+g1
		if (g>255){g=g-2*g1}
		var b = color.b+b1
		if (b>255){b=b-2*b1}
		return this.RGBtoHex(r,g,b);
	}
	
	
	return Util;
})();


