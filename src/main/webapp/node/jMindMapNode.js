/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
////////////////////////// jMindMapNode ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * 부모와 자식 관계를 갖는 새로운 노드를 만든다.
 * 
 * @param {jNode}	parentNode	부모노드		// require
 * @param {String}	text		텍스트
 * @param {String}	id			id를 직접 정한다
 * @param {int}		index		노드의 순서를 정한다
 * @param {String}	position	left, right를 정한다. ("left" 혹은 "right"를 써야됨)
 * 
 * @return jNode
 */
jMindMapNode = function(parentNode, text, id, index, position, line_color){
	this.index = index;
	this.position = (position)? position : "";		// left, right
	
	// FreeMind Node 속성	// 몇몇의 FreeMind Node 속성은 jNode에도 사용됨		
	this.link = "";
	this.style = "";
	this.created = 0;
	this.modified = 0;
	this.hgap = 0;
	this.vgap = 0;
	this.vshift = 0;
	this.line_color = line_color;
	// FreeMind Node 속성 끝 //
	
	// Layout을 위한 속성
	this.SHIFT = -2;
	this.relYPos = 0;
	this.treeWidth = 0;
	this.treeHeight = 0;
	this.leftTreeWidth = 0;
	this.rightTreeWidth = 0;
	this.upperChildShift = 0;
	
	this.attributes = {};
	jMindMapNode.superclass.call(this, parentNode, text, id);
	
	this.folderShape && this.folderShape.hide();
}

extend(jMindMapNode, jNode);
jMindMapNode.prototype.type = "jMindMapNode";

jMindMapNode.prototype.initCreate = function(){
	if (this.getParent()) {
		if(this.getParent().isRootNode() && this.position){
			this.position = this.position;
		} else if(this.getParent().isRootNode()) {	// 루트노드에서 추가된 경우, 좌우 정하기			
			var children = this.getParent().getChildren();
			var leftCount = 0;
			var rightCount = 0;			
			for (var i = 0; i < children.length; i++) {				
				(children[i].position == "left") && leftCount++;
				(children[i].position == "right") && rightCount++;
			}			
			if(leftCount < rightCount)	
				this.position = "left";
			else
				this.position = "right";
		} else this.position = "";
	}	
}

jMindMapNode.prototype.translate = function(x, y){
	this.body.translate(x, y);
	this.text.translate(x, y);
	this.folderShape && this.folderShape.translate(x, y);
	this.img && this.img.translate(x, y);
	this.hyperlink && this.hyperlink.translate(x, y);
	
	// this.foreignObjEl 도 움직이려면 구현을 해야한다.
	// this.foreignObjEl는 Raphael 객체가 아니고 DomElement이기 때문에 translate이 안먹음
	//this.foreignObjEl.???
	
//	this.connection && jMap.layoutManager.connection(this.connection, null, null, this.isLeft());
	this.connection && this.connection.updateLine();
}

/**
 * hgap, vshift를 이용해 상대 좌표를 정한다.
 * @param {int} dx
 * @param {int} dy
 */
jMindMapNode.prototype.relativeCoordinate = function(dx, dy){
	if(jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);
	
	this.relativeCoordinateExecute(dx, dy);
	
	var redo = history && history.extractNode(this);
	history && history.addToHistory(undo, redo);
	
	jMap.saveAction.editAction(this);	
	jMap.fireActionListener(ACTIONS.ACTION_NODE_COORDMOVED, this, dx, dy);	
	jMap.setSaved(false);
}

jMindMapNode.prototype.relativeCoordinateExecute = function(dx, dy){
	
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			if(this.isLeft()) dx = -dx;
			this.hgap = parseInt(this.hgap) + dx;
			this.vshift = parseInt(this.vshift) + dy;
			break;
		case "jTreeLayout" :
			this.hgap = parseInt(this.hgap) + dy;
			this.vshift = parseInt(this.vshift) + dx;
			break;
		case "jFishboneLayout" :
			if(this.isLeft()) dx = -dx;
			this.hgap = parseInt(this.hgap) + dx;
			this.vshift = parseInt(this.vshift) + dy;
			break;
		default :
			this.hgap = parseInt(this.hgap) + dy;
			this.vshift = parseInt(this.vshift) + dx;
			break;
	}
	
	if(isNaN(this.hgap)) this.hgap = 0;	
	if(isNaN(this.vshift)) this.vshift = 0;
	
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
	jMap.layoutManager.layout(true);
}


/**
 * Node가 왼쪽에 위치하는 지 여부
 */
jMindMapNode.prototype.isLeft = function() {
//	if(this.isRootNode()) {
//		return false;
//	}
	
	// 테이블 모드에서는 무조건 오른쪽으로 표시
	if(jMap.layoutManager.type == "jTableLayout") return false;
	
	if(this.position && this.position != "") {
		return (this.position == "left")? true : false;
	}
	// position 값이 정의되어 있지 않으면 부모의 값을 확인한다.
	else if ( (this.position == null || this.position == "") && this.parent != null) {
		return this.parent.isLeft();
	}
	else {
		//return this.position == "left";
		return false;
	}
}

/**
 * 하이퍼링크를 생성한다.
 * @param {String} url
 */
jMindMapNode.prototype.setHyperlink = function(url){
	if(jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);
	
	this.setHyperlinkExecute(url);
	
	var redo = history && history.extractNode(this);

	history && history.addToHistory(undo, redo);
	
	jMap.saveAction.editAction(this);	

	jMap.fireActionListener(ACTIONS.ACTION_NODE_HYPER, this);	
	jMap.setSaved(false);
}

jMindMapNode.prototype.setHyperlinkExecute = function(url){
	if (url == null || url == "") {
		if (this.hyperlink){
			var aTag = this.hyperlink.node.parentNode;
			var gTag = this.hyperlink.node.parentNode.parentNode;
			
			gTag.removeChild(aTag);
			//this.hyperlink.remove(); KHANG this command cause a problem			
			this.hyperlink = null;
			
			this.CalcBodySize();
		}
		return;
	}
	if(!this.hyperlink){
		this.hyperlink = RAPHAEL.image(jMap.cfg.contextPath+'/images/hyperlink.png',
										0, 0, 11, 11);
		if(Raphael.svg) this.groupEl.appendChild(this.hyperlink.node);
		if(Raphael.vml) this.groupEl.appendChild(this.hyperlink.Group);
		
		this.hyperlink.attr({cursor:"pointer"});
	}
	this.hyperlink.attr({href:url, target:"blank"});			
	this.CalcBodySize();
	
	jMap.resolveRendering();
}

/**
 * 이미지를 삽입한다.
 * @param {String} url
 */
jMindMapNode.prototype.setImage = function(url, width, height){
	if(jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();	
		if(!isAlive) return null;
	}

	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);
	
	this.setImageExecute(url, width, height, function(){
		var redo = history && history.extractNode(this);
		history && history.addToHistory(undo, redo);
		
		jMap.saveAction.editAction(this);
		jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, url, width, height);		
		jMap.setSaved(false);
	});
}

jMindMapNode.prototype.setImageExecute = function(url, width, height, _callback){
	if (url == null || url == "") {
		if(this.img){
			this.img.remove();			
			this.img = null;
			this.imgInfo = {};
			
			this.CalcBodySize();
			
			_callback && _callback.call(this);
		}
		return false;
	}
	
	var node = this;
	// Preload
	var $img = $('<img />')
    	.attr('src', url)
    	.load(function(){
    		var defaultSize = jMap.cfg.default_img_size;
    		var imgSize = {width:0, height:0};
    		
    		// 크기가 디폴드값 보다 큰 것만 크기를 조정한다.
    		if(this.width > defaultSize) {
    			imgSize.width = defaultSize;
    			imgSize.height = (this.height * defaultSize) / this.width;
    		} else {
    			imgSize.width = this.width;
    			imgSize.height = this.height;
    		}
    		
    		
    		if(width) imgSize.width = width;
    		if(height) imgSize.height = height;
    		
    		imgSize.width = parseInt(imgSize.width);		
    		imgSize.height = parseInt(imgSize.height);
    		
    		// 이미지 중복 방지
    		if(node.img){
    			node.img.attr({src: this.src, width: imgSize.width, height: imgSize.height});
    			node.imgInfo.href = this.src;
    			node.imgInfo.width = imgSize.width;
    			node.imgInfo.height = imgSize.height;
    		} else {
    			node.img = RAPHAEL.image(this.src, 0, 0, imgSize.width, imgSize.height);
    			node.imgInfo.href = this.src;
    			node.imgInfo.width = imgSize.width;
    			node.imgInfo.height = imgSize.height;
    			if(Raphael.svg) node.groupEl.appendChild(node.img.node);
    			if(Raphael.vml) node.groupEl.appendChild(node.img.Group);
    		}		
    		
    		node.getParent() && node.getParent().folded && node.img.hide();
    		node.CalcBodySize();				
    		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();		
    		
    		jMap.loadManager.updateImageLoading(this);
    		
    		_callback && _callback.call(node);
    		return true;	// 의미 없음
    	}).error(function() {
    		// 이미지 중복 방지
    		if(node.img){
    			node.img.attr({src: jMap.cfg.contextPath+'/images/image_broken.png', width: 64, height: 64});
    			node.imgInfo.href = url;
    			node.imgInfo.width = width && width;
    			node.imgInfo.height = height && height;
    		} else {
    			node.img = RAPHAEL.image(jMap.cfg.contextPath+'/images/image_broken.png', 0, 0, 64, 64);
    			node.imgInfo.href = url;
    			node.imgInfo.width = width && width;
    			node.imgInfo.height = height && height;
    			if(Raphael.svg) node.groupEl.appendChild(node.img.node);
    			if(Raphael.vml) node.groupEl.appendChild(node.img.Group);
    		}		
    		
    		node.getParent() && node.getParent().folded && node.img.hide();
    		node.CalcBodySize();				
    		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();		
    		
    		jMap.loadManager.updateImageLoading(this);
    		
    		_callback && _callback.call(node);
    	});
	
	jMap.loadManager.updateImageLoading($img[0]);
}

jMindMapNode.prototype.imageResize = function(width, height){
	if(jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);
	
	this.imageResizeExecute(width, height);
	
	var redo = history && history.extractNode(this);
	history && history.addToHistory(undo, redo);
		
	jMap.saveAction.editAction(this);
	jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, null, width, height);		
	jMap.setSaved(false);	
}

jMindMapNode.prototype.imageResizeExecute = function(width, height){
	this.img && this.img.attr({width: width, height: height});
	this.imgInfo.width = width;
	this.imgInfo.height = height;
	this.CalcBodySize();
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
	jMap.layoutManager.layout(true);
}

/**
 * foreignObject를 삽입한다.
 * @param {html} html
 * @param {width} width
 * @param {height} height
 */
jMindMapNode.prototype.setForeignObject = function(html, width, height){
	if(jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);
	
	this.setForeignObjectExecute(html, width, height);
	
	var redo = history && history.extractNode(this);
	history && history.addToHistory(undo, redo);
	
	jMap.saveAction.editAction(this);	
	jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, html, width, height);	
	jMap.setSaved(false);
}

jMindMapNode.prototype.setForeignObjectExecute = function (html, width, height) {
	if(!Raphael.svg) return false;
	
	if (html == null || html == "") {
		this.groupEl.removeChild(this.foreignObjEl);		
		this.foreignObjEl = null;
		this.CalcBodySize();
		
		return false;
	}
	
	if(!this.foreignObjEl) {
		this.foreignObjEl = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.foreignObjEl.bodyEl = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
		//this.bodyEl.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
		this.foreignObjEl.appendChild(this.foreignObjEl.bodyEl);
		this.groupEl.appendChild(this.foreignObjEl);
		
		this.foreignObjEl.setAttribute("x", this.body.getBBox().x);
		this.foreignObjEl.setAttribute("y", this.body.getBBox().y);
	}	
	
	width && this.foreignObjEl.setAttribute("width", width);
	height && this.foreignObjEl.setAttribute("height", height);
	
	// 사용자가 정의한 html은 저장이나 다른 곳에서 사용해야 하는데
	// innerHTML에 html 코드를 넣으면 몇몇 정보가 바뀌어 버리는것이 있다. (태그를 삭제한다든가 하는..)
	// 그래서 plainHtml에 순수한 html 문자열을 갖고 있는다.
	this.foreignObjEl.bodyEl.innerHTML = html;
	this.foreignObjEl.plainHtml = html;
	
	// 몇몇 브라우저에서는 유투브 동영상이 지원하지 않아서 그림을 대처하는데,
	// 그 방법으로 html 내용에 youtube.com있으면 유투브 동영상이라 판단하고 처리한다.
	// 문자열에 youtube.com이 있을수도 있기 떄문에 다음과 같이 처리하는것은 좋지 않다.
	if(/*BrowserDetect.browser == "Firefox" || */BrowserDetect.browser == "MSIE"){
		
		var pos = html.search (/youtube\.com/);
		if(pos != -1) {
//			var re = /embed src="([^"]*)"/g;
//			var match = re.exec(html);
//			if (match) {
//				console.log(match[1]);				
//			}			
			this.foreignObjEl.bodyEl.innerHTML = '<img src="'+jMap.cfg.contextPath+'/images/video_not_support.png" width="300" height="300"/>';			
		}				
	}
	this.CalcBodySize();
	
	//this.fix_flash(this.foreignObjEl.bodyEl);
}

jMindMapNode.prototype.foreignObjectResize = function(width, height){
	if(jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);
	
	this.foreignObjectResizeExecute(width, height);
	
	var redo = history && history.extractNode(this);
	history && history.addToHistory(undo, redo);
		
	jMap.saveAction.editAction(this);
	jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, null, width, height);		
	jMap.setSaved(false);	
}

jMindMapNode.prototype.foreignObjectResizeExecute = function(width, height){
	width && this.foreignObjEl.setAttribute("width", width);
	height && this.foreignObjEl.setAttribute("height", height);
	
	var html = this.foreignObjEl.plainHtml;
	html = html.replace(/(width=")([^"]*)/ig, "$1"+width);
	html = html.replace(/(height=")([^"]*)/ig, "$1"+height);
	
	this.foreignObjEl.bodyEl.innerHTML = html;
	this.foreignObjEl.plainHtml = html;
	this.CalcBodySize();
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
	jMap.layoutManager.layout(true);
}

jMindMapNode.prototype.fix_flash = function(el) {
	// loop through every embed tag on the site
	var embeds = el.getElementsByTagName('embed');
	for (i = 0; i < embeds.length; i++) {
		embed = embeds[i];
		var new_embed;
		// everything but Firefox & Konqueror
		if (embed.outerHTML) {
			var html = embed.outerHTML;
			// replace an existing wmode parameter
			if (html.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i))
			    new_embed = html.replace(/wmode\s*=\s*('|")window('|")/i, "wmode='transparent'");
			// add a new wmode parameter
			else
			    new_embed = html.replace(/<embed\s/i, "<embed wmode='transparent' ");
			// replace the old embed object with the fixed version
			embed.insertAdjacentHTML('beforeBegin', new_embed);
			embed.parentNode.removeChild(embed);
		} else {
			// cloneNode is buggy in some versions of Safari & Opera, but works fine in FF
			new_embed = embed.cloneNode(true);
			if (!new_embed.getAttribute('wmode') || new_embed.getAttribute('wmode').toLowerCase() == 'window')
			    new_embed.setAttribute('wmode', 'transparent');
			embed.parentNode.replaceChild(new_embed, embed);
		}
	}
	// loop through every object tag on the site
	var objects = el.getElementsByTagName('object');
	for (i = 0; i < objects.length; i++) {
		object = objects[i];
		var new_object;
		// object is an IE specific tag so we can use outerHTML here
		if (object.outerHTML) {
			var html = object.outerHTML;
			// replace an existing wmode parameter
			if (html.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i))
			    new_object = html.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i, "<param name='wmode' value='transparent' />");
			// add a new wmode parameter
			else
			    new_object = html.replace(/<\/object\>/i, "<param name='wmode' value='transparent' />\n</object>");
			// loop through each of the param tags
			var children = object.childNodes;
			for (j = 0; j < children.length; j++) {
			    try {
			        if (children[j] != null) {
			            var theName = children[j].getAttribute('name');
			            if (theName != null && theName.match(/flashvars/i)) {
			                new_object = new_object.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i, "<param name='flashvars' value='" + children[j].getAttribute('value') + "' />");
			            }
			        }
			    }
			    catch (err) {
			    }
			}
			// replace the old embed object with the fixed versiony
			object.insertAdjacentHTML('beforeBegin', new_object);
			object.parentNode.removeChild(object);
		}
	}
}

jMindMapNode.prototype.setEmbedVideo = function(code) {
	var widthRe = /width?=?["']([^"']*)/gi;	
	var width = widthRe.exec(code)[1];
	var heightRe = /height?=?["']([^"']*)/gi;	
	var height = heightRe.exec(code)[1];
	this.setForeignObject(code, width, height);
}
jMindMapNode.prototype.setVideo = function(playUrl, width, height) {
	var defaultSize = jMap.cfg.default_video_size;
	
	var html = '<embed src="'+playUrl+'" width="'+width+'"  height="'+height+'"></embed>';
	this.setHyperlink(playUrl);
	this.setForeignObject(html, width, height);	
}

jMindMapNode.prototype.setYoutubeVideo = function(playUrl, width, height ) {
	var defaultSize = jMap.cfg.default_video_size;
//	var html = '<object width="'+defaultSize+'" height="'+defaultSize+'"><param name="movie" value="' + playUrl + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + playUrl + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="'+defaultSize+'" height="'+defaultSize+'"></embed></object>';
	
	/*
	//var html = '<EMBED src="' + playUrl + '" width="300" height="300" AUTOSTART="1" loop="1" volume="0" enablecontextmenu="0"></EMBED>';
	//var html = '<iframe title="YouTube video player" class="youtube-player" type="text/html" width="480" height="390" src="http://www.youtube.com/embed/pE3h2tqwqQQ" frameborder="0"></iframe>';
	//var html = '<video autobuffer="autobuffer" xmlns="http://www.w3.org/1999/xhtml" width="300" height="240" id="dilbert"><source src="http://www.youtube.com/v/pE3h2tqwqQQ?fs=1&amp;hl=ko_KR" type="application/x-shockwave-flash" /></video>'
	//var html = '<object width="250" height="250"><param name="movie" value="' + playUrl + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + playUrl + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="250" height="250"></embed></object>';
	*/
	if(width == null) {width = defaultSize;}
	if(height == null) {height = defaultSize;}
	var re = /v[=\/]([^&]*)/ig;
	var match = re.exec(playUrl);
	if (match) {
		var url = 'https://www.youtube.com/embed/' + match[1];
		
//		var that = this;
//		$.ajax({
//			type: 'post',
//			async: false,
//			url: jMap.cfg.contextPath+'/loadpage.do',
//			data: {'url': url},		
//			success: function(data) {
//				console.log(data);
//				that.setForeignObject(data, defaultSize, defaultSize);	
//			},
//			error: function(data, status, err) {
//				alert("setLayoutManager : " + status);
//			}
//	    });
		
		var html = '<iframe src="'+url+'" frameborder="0" allowtransparency="true" width="'+width+'"  height="'+height+'" scrolling="no"></iframe>';
		this.setHyperlink(playUrl);
		
		this.setForeignObject(html, width, height);	
	}
	
	
	//if(BrowserDetect.browser == "Firefox" || BrowserDetect.browser == "MSIE"){
//		this.setHyperlink(playUrl);
	//} else {
//		this.setForeignObject(html, defaultSize, defaultSize);	
	//}
		

	
//	var params = {};
//	params.wmode = "Transparent";
//	params.allowScriptAccess = "always";
//	
//	swfobject.embedSWF(playUrl, "myContent", "300", "300", "9.0.0", "http://localhost:8080/okmindmap/lib/swfobject/swfobject.js", {}, params);
}

jMindMapNode.prototype.getShift = function() {
	try {
		if(this.getParent().getChildren().length == 0) {
			var shift = parseInt(this.vshift) + parseInt(this.SHIFT);
			if (isNaN(shift)) shift = 0;
			return shift;
		} else {
			return this.vshift;
		}
	} catch (err) {
		return 0;
	}
}

jMindMapNode.prototype.getLeftChildren = function() {
	var all = this.getChildren();
	var left = new Array();
	
	for (var i = 0; i < all.length; i++) {
	    var node = all[i];
	    if (node == null) continue;
	    if (node.isLeft()) left.push(node);
	}
	
	return left;
}

jMindMapNode.prototype.getRightChildren = function() {
	var all = this.getChildren();
	var right = new Array();
	
	for (var i = 0; i < all.length; i++) {
	    var node = all[i];
	    if (node == null) continue;
	    if (!node.isLeft()) right.push(node);
	}
	
	return right;
}

jMindMapNode.prototype.setRootTreeWidths = function(/*int*/left, /*int*/right) {
	this.leftTreeWidth = left - this.getSize().width;
	this.rightTreeWidth = right;
	
	this.setTreeWidth(this.leftTreeWidth + this.rightTreeWidth);
}

jMindMapNode.prototype.setTreeWidth = function(/*int*/ treeWidth) {
	this.treeWidth = treeWidth;
}

jMindMapNode.prototype.getTreeWidth = function() {
	return this.treeWidth;
}

jMindMapNode.prototype.setRootTreeHeights = function(/*int*/left, /*int*/right) {
	if(left > right){
		this.setTreeHeight(left);
	}
	else{
		this.setTreeHeight(right);
	}		
}

jMindMapNode.prototype.setTreeHeight = function(/*int*/treeHeight) {
	this.treeHeight = treeHeight;
}

jMindMapNode.prototype.getTreeHeight = function() {
	return this.treeHeight;
}

jMindMapNode.prototype.getUpperChildShift = function(){
	return this.upperChildShift;
}

jMindMapNode.prototype.setRootUpperChildShift = function(/*int*/left, /*int*/right) {
	this.setUpperChildShift(Math.max(left,right));
}

jMindMapNode.prototype.setUpperChildShift = function(/*int*/treeShift) {
	this.upperChildShift = treeShift;
}

/**
 * mm 파일 형식으로 변환된 String을 반환한다.
 * <node CREATED="1255308406937" ID="ID_206921885" MODIFIED="1255308493312" TEXT="PPT Parser">
 */
jMindMapNode.prototype.toXML = function(alone) {
	var buffer = new StringBuffer();

	var isrichcontent = false;
	if(this.img != null || (this.text.attrs['text'] != null && this.text.attrs['text'].indexOf("\n") != -1) ) {
		isrichcontent = true;
	}

	// 속성값들
	var buf = new StringBuffer();
	buf.add("<node");
	buf.add("CREATED=\""+ this.created +"\"");
	buf.add("ID=\""+ this.id +"\"");
	buf.add("MODIFIED=\""+ this.modified +"\"");
	
	// 자기가 생성한 노드만 편집 가능하게 하기 위해 추가. 
	// jinhoon. 201216
	buf.add("CREATOR=\""+ this.creator +"\"");
	buf.add("CLIENT_ID=\""+ this.client_id +"\"");
	
	if(!isrichcontent) {
		//buf.add("TEXT=\""+ utf8_to_unicode(this.text.attrs['text']) +"\"");
		buf.add("TEXT=\""+ convertCharStr2SelectiveCPs( convertCharStr2XML(this.text.attrs['text'], true, true), 'ascii', true, '&#x', ';', 'hex' ) +"\"");
	}

	buf.add("FOLDED=\""+ this.folded +"\"");
	if (this.background_color != "") {
		buf.add("BACKGROUND_COLOR=\""+ this.background_color +"\"");
	}
	if (this.color != "") {
		buf.add("COLOR=\""+ this.color +"\"");
	}
	
	if (this.hyperlink != null) {
		buf.add("LINK=\"" + convertCharStr2XML(this.hyperlink.attr().href) + "\"");		
	}
	if (this.position != "" && this.position != "undefined") {
		buf.add("POSITION=\"" + this.position + "\"");
	}
	if (this.style != "") {
		buf.add("STYLE=\"" + this.style + "\"");
	}
	if (this.hgap != 0) {
		buf.add("HGAP=\""+ this.hgap +"\"");
	}
	if (this.vgap != 0) {
		buf.add("VGAP=\"" + this.vgap + "\"");
	}
	if (this.vshift != 0) {
		buf.add("VSHIFT=\"" + this.vshift + "\"");
	}
	/////////////////// freemind가 갖고 있는 속성 이외 추가적인 속성 ///////////////////////
	if (this.numofchildren != null) {
		buf.add("NUMOFCHILDREN=\"" + this.numofchildren + "\"");
	}
	
	buf.add(">");
	buffer.add(buf.toString(" "));
	
	// richcontent
	if(isrichcontent) {
		var richcontent = new StringBuffer();
		richcontent.add("<richcontent TYPE=\"NODE\"><html>\n");
		richcontent.add("  <head>\n");
		richcontent.add("\n");
		richcontent.add("  </head>\n");
		richcontent.add("  <body>\n");

		if(this.img != null) {
			richcontent.add("    <p>\n");
			richcontent.add("      <img src=\"" + this.imgInfo.href + "\" width=\""+ this.imgInfo.width + "\" height=\"" + this.imgInfo.height + "\" />\n");
			richcontent.add("    </p>\n");
		}

		if(this.text.attrs['text'] != null) {
			var textArr = JinoUtil.trimStr(this.text.attrs['text']).split("\n");
			for(var i = 0; i < textArr.length; i++) {
//				richcontent.add("<p>");
				richcontent.add("<p>" + convertCharStr2SelectiveCPs( convertCharStr2XML(textArr[i], true, true), 'ascii', true, '&#x', ';', 'hex' ) + "</p>\n");
//				richcontent.add("</p>\n");
			}
		}

		richcontent.add("  </body>\n");
		richcontent.add("</html>\n");
		richcontent.add("</richcontent>");

		buffer.add(richcontent.toString(" "));
	}

	// ArrowLink
	if(this.arrowlinks.length > 0) {
		for (var i = 0; i < this.arrowlinks.length; i++) {
			buffer.add(this.arrowlinks[i].toXML());
		}
	}
	
	// foreignObject
	if (this.foreignObjEl) {
		var foreignObject = new StringBuffer();
		foreignObject.add("<foreignObject WIDTH=\"" + this.foreignObjEl.getAttribute("width") + "\" HEIGHT=\"" + this.foreignObjEl.getAttribute("height") + "\">");
		foreignObject.add(convertCharStr2SelectiveCPs(this.foreignObjEl.plainHtml, 'ascii', true, '&#x', ';', 'hex' ));
		foreignObject.add("</foreignObject>");

		buffer.add(foreignObject.toString(" "));
	}
	
	//KHANG
	for (var attr_name in this.attributes) {
		//alert('save ' + attr_name + ": " + this.attributes[attr_name]);
		
		buffer.add("<attribute NAME='" + attr_name + "' VALUE='" +
				convertCharStr2SelectiveCPs(convertCharStr2XML('' + this.attributes[attr_name], true, true),
						'ascii', true, '&#x', ';', 'hex' ) + "'/>");
	}
	//KHANG
	// 노드 정보
	var exInfo = new StringBuffer();
	exInfo.add("<info");	
	if(this.lazycomplete) {
		exInfo.add('LAZYCOMPLETE="'+ this.lazycomplete +'"');
	}	
	exInfo.add("/>");
	buffer.add(exInfo.toString(" "));
	
	var children = this.getChildren()
	if(children.length > 0 && alone == null){
		for(var i=0; i<children.length; i++) {
			buffer.add(children[i].toXML());
		}
	}
	buffer.add("</node>");
	return buffer.toString("\n");
}

jMindMapNode.prototype.toString = function () {
    return "jMindMapNode";
};


// interface
jMindMapNode.prototype.initElements = function(){}
jMindMapNode.prototype.create = function(){}

jMindMapNode.prototype.getSize = function(){}
jMindMapNode.prototype.setSize = function(width, height){}
jMindMapNode.prototype.getLocation = function(){}
jMindMapNode.prototype.setLocation = function(x, y){}

jMindMapNode.prototype.CalcBodySize = function(){}
jMindMapNode.prototype.updateNodeShapesPos = function(){}

jMindMapNode.prototype.getInputPort = function(){}
jMindMapNode.prototype.getOutputPort = function(){}


