/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

JinoUtil = (function () {				
	function Util(){}
	
	Util.trimStr = function (str, whitespace){
		if(!str) return "";	
		var whitespace = whitespace || " \n\r\t\f";			
		for( var i= 0; i < str.length; i++ )
			if( whitespace.indexOf( str.charAt(i) ) < 0 )
				break;	
		for( var j= str.length - 1; j >= i; j-- )
			if( whitespace.indexOf( str.charAt(j) ) < 0 )
				break;
	
		return str.substring( i,j+1 );
	}
	
	Util.waitingDialog = function(str){
		if(ISMOBILE){
			jQuery('#jinomap').showLoading();
		} else {
			var txt ='<table border="0"><tr><td class="nobody" rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="'+jMap.cfg.contextPath+'/images/wait16trans.gif"></td><td class="nobody">'+str+'</td><tr><td class="nobody">Please wait...</td></tr></table>';
			$("#waitingDialog").append(txt);
			
			  $("#waitingDialog").dialog({
				  autoOpen:false,
			      modal:true,		//modal 창으로 설정
			      resizable:false,	//사이즈 변경
			      close: function( event, ui ) {
			    	  	$("#waitingDialog table").remove();
			    		$("#waitingDialog").dialog("destroy"); 
			      	},
				  });
			  $("#waitingDialog").dialog("option", "width", "none" );
			    //open
			  $("#waitingDialog").dialog("open");
			
		/*	$.prompt('<table border="0"><tr><td class="nobody" rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="'+jMap.cfg.contextPath+'/images/wait16trans.gif"></td><td class="nobody">'+str+'</td><tr><td class="nobody">Please wait...</td></tr></table>',
					{				      
						top : '40%',
						prefix:'jqismooth2',
						buttons: {}
					});*/
		}
	}
	Util.waitingDialogClose = function(){
		if(ISMOBILE){
			jQuery('#jinomap').hideLoading();			
		} else {
			$("#waitingDialog").dialog("close");
		}
	}
	
	Util.xml2Str = function(xmlNode){
		try {
			// Gecko-based browsers, Safari, Opera.
			return (new XMLSerializer()).serializeToString(xmlNode);
		} catch (e) {
			try {
				// Internet Explorer.
				return xmlNode.xml;
			} catch (e) {
				//Strange Browser ??
				alert('Xmlserializer not supported');
			}
		}
		return false;
	}
	
	//from http://www.activewidgets.com/javascript.forum.6114.43/dynamic-load-javascript-from-javascript.html
	Util.importJS = function(src){
		var scriptElem = document.createElement('script');
		scriptElem.setAttribute('src',src);
		scriptElem.setAttribute('type','text/javascript');
		document.getElementsByTagName('head')[0].appendChild(scriptElem);
	}	
	// import with a random query parameter to avoid caching
	Util.importJSNoCache = function(src){
		var ms = new Date().getTime().toString();
		var seed = "?" + ms;
		Util.importJS(src + seed);
	}
	
	Util.importCSS = function(src){
		var scriptElem = document.createElement('link');
		scriptElem.setAttribute('href',src);
		scriptElem.setAttribute('rel','stylesheet');
		document.getElementsByTagName('head')[0].appendChild(scriptElem);
	}	
	Util.importCSSNoCache = function(src){
		var ms = new Date().getTime().toString();
		var seed = "?" + ms;
		Util.importCSS(src + seed);
	}
	
	Util.imgResizer = function(node){
		var width = parseFloat(node.img.attr().width);
		width = width.toFixed(0);
		var height = parseFloat(node.img.attr().height);
		height = height.toFixed(0);
		
		var txt = '<form><div class="dialog_content">' +		 
		'<br />width:<br />' +
		'<input type="text" id="resizer_input_width"' +
		'name="resizer_input_width" value=' + width +	' />' + 
		'<br />height:<br />' +
		'<input type="text" id="resizer_input_height"' +
		'name="resizer_input_height" value=' + height +	' />' +
		'</div></form>';
		
		function callbackform_imgresizer(v,f){
			if (v) {
				var w = f.resizer_input_width;
				var h = f.resizer_input_height;
				node.imageResize(w, h);
			}
			$("#dialog").dialog("close");
			jMap.work.focus();
		}
		
		$("#dialog").append(txt);
		 
		$("#dialog").dialog({
			autoOpen:false,
			closeOnEscape: true,	//esc키로 창을 닫는다.
			width:350,	//iframe 크기보다 30px 더 필요하다.
			modal:true,		//modal 창으로 설정
			resizable:false,	//사이즈 변경
			close: function( event, ui ) {
				$("#dialog .dialog_content").remove();
				$("#dialog").dialog("destroy"); 
			},
		});
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog( "option", "buttons", [{
			text: i18n.msgStore["button_apply"], 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_imgresizer(true, formValue); 
			} 
		}]);
					  
		$("#dialog").dialog( "option", "title", "Image Resize");
		$("#dialog").dialog("open");
	
	}
	
	Util.videoResizer = function(node){
		
		var width = parseFloat(node.foreignObjEl.getAttribute("width"));
		width = width.toFixed(0);
		var height = parseFloat(node.foreignObjEl.getAttribute("height"));
		height = height.toFixed(0);
		
		var txt = '<form><div class="dialog_content">' +
		'<br />width:<br />' +
		'<input type="text" id="resizer_input_width"' +
		'name="resizer_input_width" value=' + width +	' />' + 
		'<br />height:<br />' +
		'<input type="text" id="resizer_input_height"' +
		'name="resizer_input_height" value=' + height +	' />' +
		'</div></form>';
		
		function callbackform_videoresizer(v, f){
			if (v) {
				var w = f.resizer_input_width;
				var h = f.resizer_input_height;
				node.foreignObjectResize(w, h);
			}
			$("#dialog").dialog("close");
			jMap.work.focus();
		}
		
		$("#dialog").append(txt);
		 
		$("#dialog").dialog({
			autoOpen:false,
			closeOnEscape: true,	//esc키로 창을 닫는다.
			width:350,	//iframe 크기보다 30px 더 필요하다.
			modal:true,		//modal 창으로 설정
			resizable:false,	//사이즈 변경
			close: function( event, ui ) {
				$("#dialog .dialog_content").remove();
				$("#dialog").dialog("destroy"); 
			},
		});
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog( "option", "buttons", [{
			text: i18n.msgStore["button_apply"], 
			click: function() {
				var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
				callbackform_videoresizer(true, formValue); 
			} 
		}]);
					  
		$("#dialog").dialog( "option", "title", "Video Resize");
		$("#dialog").dialog("open");
		
	}
	
	Util.BookmarkCallback = function(xml){
		var createBookmarkNode = function (node, bookmarksData){
	    	for(var i = 0; i < bookmarksData.length; i++){
	    		if(bookmarksData[i].location){
	    			var param = {parent: node,
	    					text: convertHexNCR2Char(bookmarksData[i].name)};
	    			var newNode = jMap.createNodeWithCtrl(param, null, false);
	    			newNode.setHyperlink(convertHexNCR2Char(bookmarksData[i].location));
	    		}
	    		
	    		if(bookmarksData[i].children && bookmarksData[i].children.length > 0){
	    			var param = {parent: node,
	    					text: convertHexNCR2Char(bookmarksData[i].name)};
	    			var dirNode = jMap.createNodeWithCtrl(param);
	    			createBookmarkNode(dirNode, bookmarksData[i].children)		
	    		}		
	    	}
	    }
		
		var bookmarksData = JSON.parse(xml);
    	var node = jMap.selectedNodes.getLastElement();
    	if(!node) node = jMap.getRootNode();
    	createBookmarkNode(node, bookmarksData.children);
    	
    	jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);				
    	jMap.layoutManager.layout(true);
    	$("#dialog_c").dialog("close");
	}
	
	// Hahm's // bg는 삭제합니다. bg가 path라는 shape를 만들어 내는데
	// bg를 사용하고자 한다면 jNode.remove()에 bg를 고려하시길..
	Util.connectionShadow = function (obj1, obj2, line/*, bg*/, isLeft) {
		if (obj1.line && obj1.from && obj1.to) {
	        line = obj1;
	        obj1 = line.from;
	        obj2 = line.to;
	    }
		
		var width = obj2.edge_width?obj2.edge_width:1;
		width = width * 2;
		
	    var bb1 = obj1.getBBox();
	    var bb2 = obj2.getBBox();
		
		var rot1 = obj1.rotate();
		var rot2 = obj2.rotate();
		
		var bb1_width = 0;
		if(isFinite(obj1.getBBox().width)){
			bb1_width = bb1.width;
		}
		var bb2_width = 0;
		if(isFinite(obj2.getBBox().width)){
			bb2_width = bb2.width;
		}

	    var p = [{x: bb1.x + bb1_width / 2, y: bb1.y - 1},
	        {x: bb1.x + bb1_width / 2, y: bb1.y + bb1.height + 1},
	        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
	        {x: bb1.x + bb1_width + 1, y: bb1.y + bb1.height / 2},
	        {x: bb2.x + bb2_width / 2, y: bb2.y - 1},
	        {x: bb2.x + bb2_width / 2, y: bb2.y + bb2.height + 1},
	        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
	        {x: bb2.x + bb2_width + 1, y: bb2.y + bb2.height / 2}];
//	    var d = {}, dis = [];
//	    for (var i = 0; i < 4; i++) {
//	        for (var j = 4; j < 8; j++) {
//	            var dx = Math.abs(p[i].x - p[j].x),
//	                dy = Math.abs(p[i].y - p[j].y);
//	            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
//	                dis.push(dx + dy);
//	                d[dis[dis.length - 1]] = [2, 7];
//					d[dis[dis.length - 1]] = [3, 6];
//	            }
//	        }
//	    }
	//	
//	    if (dis.length == 0) {
//	        var res = [0, 4];
//	    } else {
//	        var res = d[Math.min.apply(Math, dis)];
//	    }
		
		if(isLeft) {
			var res = [2, 7];		
		} else {
			var res = [3, 6];
		}
	    var x1 = p[res[0]].x,
	        y1 = p[res[0]].y - width/2,
	        x4 = p[res[1]].x,
	        y4 = p[res[1]].y,
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
					"C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3),
					"C", x3, y3, x2_width, y2, x1.toFixed(3), y_width.toFixed(3)
					].join(",");
		if (line && line.line) {		
	        //line.bg && line.bg.attr({path: path});
	        line.line.attr({path: path});
		} else {
	        var color = typeof line == "string" ? line : "#000";
	        return {
	            //bg: bg && bg.split && this.map.controller.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
	            line: RAPHAEL.path(path).attr({stroke: color, fill: "none"}),
	            from: obj1,
	            to: obj2
	        };
	    }
	}
	
	Util.detectIframeOpener = function (url) {
		var iframe = (parent !== window);
		var iframe_ = (document.referrer === "");
		if(iframe || iframe_) {
			window.open(url);
		} else {
			javascript:location.href=url
		}
	}
	
	
	return Util;
})();


// StringBuffer 클래스
// jNode.toXML() 함수에서 사용하기 위해서 추가함
// 출처: http://www.koders.com/javascript/fid2C852C89CF087BEC35090A1DCFD2853EAE66ED3A.aspx
StringBuffer = function(){
	this.buffer=[];
};
StringBuffer.prototype.add=function(src){
	this.buffer[this.buffer.length]=src;
};
StringBuffer.prototype.flush=function(){
	this.buffer.length=0;
};
StringBuffer.prototype.getLength=function(){
	return this.buffer.join('').length;
};
StringBuffer.prototype.toString=function(delim){
	return this.buffer.join(delim||'');
};

/**
 * 상속 - http://www.sitepoint.com/blogs/2006/01/17/javascript-inheritance/
 * 테스트 결과 잘 안됨!!
 * @param {Object} descendant
 * @param {Object} parent
 */
function copyPrototype(descendant, parent) {
    var sConstructor = parent.toString();
    var aMatch = sConstructor.match( /\s*function (.*)\(/ );
    if ( aMatch != null ) { descendant.prototype[aMatch[1]] = parent; }
    for (var m in parent.prototype) {
        descendant.prototype[m] = parent.prototype[m];
    }
};

/**
 * http://michaux.ca/articles/class-based-inheritance-in-javascript
 * @param {Object} subclass
 * @param {Object} superclass
 */
function extend(subclass, superclass) {
   function Dummy() {}
   Dummy.prototype = superclass.prototype;
   subclass.prototype = new Dummy();
   subclass.prototype.constructor = subclass;
   subclass.superclass = superclass;
   subclass.superproto = superclass.prototype;
}


