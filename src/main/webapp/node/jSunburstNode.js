/**
 *
 * @author Nguyen Van Hoang (nvhoangag@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com)
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
///////////////////////    jSunburstNodeController    /////////////////////////
///////////////////////////////////////////////////////////////////////////////
jSunburstNodeController = function() {
	jSunburstNodeController.superclass.call(this);
};
extend(jSunburstNodeController, jNodeController);
jSunburstNodeController.prototype.type = "jSunburstNodeController";

jSunburstNodeController.prototype.dblclick = function(e) {
	var originalEvent;
	if (!e) var e = window.event;
	originalEvent = e.originalEvent.originalEvent || e.originalEvent || e;
	if (originalEvent.preventDefault)
		originalEvent.preventDefault();
	else
		originalEvent.returnValue = false;

	this.node.zoomExecute();
};

jSunburstNodeController.prototype.mouseenter = function(e) {
	this.node.showPopover();
};

jSunburstNodeController.prototype.mouseleave = function(e) {
	var id = 'data-popover-id';
	var el = e.toElement || e.relatedTarget;
	if ($(el).closest('.jpopover').parent().attr(id) != this.node.popover.container.attr(id)) {
		this.node.hidePopover();
	}
};

jSunburstNodeController.prototype.popoverMouseleave = function(e) {
	var id = $(this).parent().attr('data-popover-id');
	if (jMap.nodes[id]) {
		jMap.nodes[id].hidePopover();
	}
};

///////////////////////////////////////////////////////////////////////////////
////////////////////    jSunburstNodeControllerGuest    ///////////////////////
///////////////////////////////////////////////////////////////////////////////
jSunburstNodeControllerGuest = function() {
	jSunburstNodeControllerGuest.superclass.call(this);
};
extend(jSunburstNodeControllerGuest, jNodeControllerGuest);
jSunburstNodeControllerGuest.prototype.type = "jSunburstNodeControllerGuest";

jSunburstNodeControllerGuest.prototype.dblclick = function(e) {
	var originalEvent;
	if (!e) var e = window.event;
	originalEvent = e.originalEvent.originalEvent || e.originalEvent || e;
	if (originalEvent.preventDefault)
		originalEvent.preventDefault();
	else
		originalEvent.returnValue = false;

	this.node.zoomExecute();
};

jSunburstNodeControllerGuest.prototype.mouseenter = function(e) {
	this.node.showPopover();
};

jSunburstNodeControllerGuest.prototype.mouseleave = function(e) {
	var id = 'data-popover-id';
	var el = e.toElement || e.relatedTarget;
	if ($(el).closest('.jpopover').parent().attr(id) != this.node.popover.container.attr(id)) {
		this.node.hidePopover();
	}
};

jSunburstNodeControllerGuest.prototype.popoverMouseleave = function(e) {
	var id = $(this).parent().attr('data-popover-id');
	if (jMap.nodes[id]) {
		jMap.nodes[id].hidePopover();
	}
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////    jSunburstNode    ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jSunburstNode = function(param) {
	var parentNode = param.parent;
	var text = param.text;
	var id = param.id;
	var index = param.index;
	var position = param.position;

	this.popover = {
		container : null,
		body : null,
		text : null,

		img : null,
		hyperlink : null,
		foreignObjEl : null
	};

	jSunburstNode.superclass.call(this, parentNode, text, id, index, position);
};

extend(jSunburstNode, jNode);
jSunburstNode.prototype.type = "jSunburstNode";

jSunburstNode.prototype.initElements = function() {
	this.body = RAPHAEL.path();
	this.text = RAPHAEL.text();
	this.wrapElements(this.body, this.text);

	this.popover.container = $('<div data-popover-type="' + this.type + '" data-popover-id="' + this.id + '"><div class="jpopover"></div></div>').appendTo(jMap.popoverContainer);
	this.popover.body = $('<div class="jpopover-body"></div>').appendTo(this.popover.container.children('.jpopover'));
	this.popover.text = $('<div class="jpopover-text"></div>').appendTo(this.popover.container.children('.jpopover'));
};

jSunburstNode.prototype.addEventController = function(c) {
	c = jMap.mode ? new jSunburstNodeController() : new jSunburstNodeControllerGuest();
	this.controller = c;

	$(this.groupEl).on("vmousedown", c.mousedown);
	$(this.groupEl).on("vmousemove", c.mousemove);
	$(this.groupEl).on("vmouseup", c.mouseup);

	//	$(this.groupEl).on("vmouseover", c.mouseover);
	//	$(this.groupEl).on("vmouseout", c.mouseout);
	// Use it for popover and do not affect the base event
	$(this.groupEl).on("mouseover", c.mouseenter);
	$(this.groupEl).on("mouseout", c.mouseleave);
	this.popover.container.children('.jpopover').on("mouseleave", c.popoverMouseleave);

	$(this.groupEl).on("taphold", c.taphold);

	$(this.groupEl).on("vclick", c.click);

	$(this.groupEl).on("dblclick", c.dblclick);

//	$(this.groupEl).on("dragenter", c.dragenter);
//	$(this.groupEl).on("dragleave", c.dragexit);
//	$(this.groupEl).on("drop", c.drop);

	$(this.groupEl).on("contextmenu", c.contextmenu);
};

jSunburstNode.prototype.create = function() {
	var centerLocation = jMap.layoutManager.getCenterLocation();

	this.position = this.position || ((this.parent && this.parent.position) ? this.parent.position : 'left');

	this.groupEl.setAttribute('data-node-type', this.type);
	this.groupEl.setAttribute('data-node-id', this.id);
	this.groupEl.setAttribute('transform', 'translate(' + [ centerLocation.x, centerLocation.y ] + ')');
	this.groupEl.setAttribute('pointer-events', 'all');

	this.body.node.setAttribute('pointer-events', 'all');

	this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
	this.setTextColorExecute(jMap.cfg.textDefalutColor);
	this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, jMap.cfg.edgeDefalutWidth);

	if (typeof NodeColorMix !== 'undefined') {
		NodeColorMix.rawDressColor(this);
	}
	var fontWeight = 400;
	var fontFamily = 'Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif';
	this.fontSize = jMap.cfg.nodeFontSizes[3];
	if (!this.getParent()) {
		fontWeight = '700';
	} else if (this.getParent() && this.getParent().isRootNode()) {
		fontWeight = '700';
	} else {
		fontWeight = '400';
	}

	this.text.attr({
		'font-family' : fontFamily,
		'font-size' : this.fontSize,
		'font-weight' : fontWeight,
		'text-anchor' : null
	});
	$(this.text.node).css('pointer-events', 'none');

	this.setTextExecute(this.plainText);
};

jSunburstNode.prototype.setTextExecute = function(text) {
	this.plainText = text;
	this.text.attr({
		text : text
	});
	this.CalcBodySize();

	if (text.indexOf('\n')) {
		text = text.split('\n').join('<br>');
	}
	this.popover.text.html(text);
};

jSunburstNode.prototype.setHyperlink = function(url) {
	if (jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();
		if (!isAlive) return null;
	}

	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);

	this.setHyperlinkExecute(url);

	var redo = history && history.extractNode(this);

	history && history.addToHistory(undo, redo);

	jMap.saveAction.editAction(this);

	jMap.fireActionListener(ACTIONS.ACTION_NODE_HYPER, this);
	jMap.setSaved(false);
};
jSunburstNode.prototype.setHyperlinkExecute = function(url) {
	if (url == null || url == "") {
		if (this.hyperlink) {
			this.hyperlink = null;

			this.popover.hyperlink.remove();
			this.popover.hyperlink = null;
			this.popover.container.removeAttr('data-has-hyperlink');

			this.CalcBodySize();
		}
		return;
	}
	if (!this.hyperlink) {
		this.hyperlink = RAPHAEL.image(jMap.cfg.contextPath + '/images/hyperlink.png', 0, 0, 11, 11);
		this.hyperlink.attr({
			cursor : "pointer"
		});

		this.popover.hyperlink = $('<a></a>')
			.attr('class', 'jpopover-hyperlink')
			.appendTo(this.popover.body);
		$('<img />').attr('src', jMap.cfg.contextPath + '/images/hyperlink.png')
			.width(11)
			.height(11)
			.appendTo(this.popover.hyperlink);
		this.popover.container.attr('data-has-hyperlink', true);
	}
	this.hyperlink.attr({
		href : url,
		target : "blank"
	});
	this.popover.hyperlink.attr('href', url).attr('target', '_blank');

	this.CalcBodySize();
	jMap.resolveRendering();
};
jSunburstNode.prototype.setImage = function(url, width, height) {
	if (jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();
		if (!isAlive) return null;
	}

	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);

	this.setImageExecute(url, width, height, function() {
		var redo = history && history.extractNode(this);
		history && history.addToHistory(undo, redo);

		jMap.saveAction.editAction(this);
		jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, url, width, height);
		jMap.setSaved(false);
	});
};
jSunburstNode.prototype.setImageExecute = function(url, width, height, _callback) {
	if (url == null || url == "") {
		if (this.img) {
			this.img = null;
			this.imgInfo = {};

			this.popover.img.remove();
			this.popover.img = null;

			this.CalcBodySize();

			_callback && _callback.call(this);
		}
		return false;
	}

	var node = this;
	// Preload
	var $img = $('<img />')
		.attr('src', url)
		.load(function() {
			var defaultSize = jMap.cfg.default_img_size;
			var imgSize = {
				width : 0,
				height : 0
			};

			// 크기가 디폴드값 보다 큰 것만 크기를 조정한다.
			if (this.width > defaultSize) {
				imgSize.width = defaultSize;
				imgSize.height = (this.height * defaultSize) / this.width;
			} else {
				imgSize.width = this.width;
				imgSize.height = this.height;
			}


			if (width)
				imgSize.width = width;
			if (height)
				imgSize.height = height;

			imgSize.width = parseInt(imgSize.width);
			imgSize.height = parseInt(imgSize.height);

			// 이미지 중복 방지
			if (node.img) {
				node.img.attr({
					src : this.src,
					width : imgSize.width,
					height : imgSize.height
				});
				node.imgInfo.href = this.src;
				node.imgInfo.width = imgSize.width;
				node.imgInfo.height = imgSize.height;

				node.popover.img
					.attr('src', this.src)
					.width(imgSize.width)
					.height(imgSize.height);
			} else {
				node.img = RAPHAEL.image(this.src, 0, 0, imgSize.width, imgSize.height);
				node.imgInfo.href = this.src;
				node.imgInfo.width = imgSize.width;
				node.imgInfo.height = imgSize.height;

				node.popover.img = $('<img />')
					.attr('class', 'jpopover-img')
					.attr('src', this.src)
					.width(imgSize.width)
					.height(imgSize.height)
					.appendTo(node.popover.body);
			}

			jMap.loadManager.updateImageLoading(this);

			_callback && _callback.call(node);
			return true; // 의미 없음
		}).error(function() {
		var imgBrokenPath = jMap.cfg.contextPath + '/images/image_broken.png';

		// 이미지 중복 방지
		if (node.img) {
			node.img.attr({
				src : imgBrokenPath,
				width : 64,
				height : 64
			});
			node.imgInfo.href = url;
			node.imgInfo.width = width && width;
			node.imgInfo.height = height && height;

			node.popover.img
				.attr('src', imgBrokenPath)
				.width(64)
				.height(64);
		} else {
			node.img = RAPHAEL.image(jMap.cfg.contextPath + '/images/image_broken.png', 0, 0, 64, 64);
			node.imgInfo.href = url;
			node.imgInfo.width = width && width;
			node.imgInfo.height = height && height;

			node.popover.img = $('<img />')
				.attr('class', 'jpopover-img')
				.attr('src', imgBrokenPath)
				.width(64)
				.height(64)
				.appendTo(node.popover.body);
		}

		jMap.loadManager.updateImageLoading(this);

		_callback && _callback.call(node);
	});

	jMap.loadManager.updateImageLoading($img[0]);
};
jSunburstNode.prototype.imageResize = function(width, height) {
	if (jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();
		if (!isAlive) return null;
	}

	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);

	this.imageResizeExecute(width, height);

	var redo = history && history.extractNode(this);
	history && history.addToHistory(undo, redo);

	jMap.saveAction.editAction(this);
	jMap.fireActionListener(ACTIONS.ACTION_NODE_IMAGE, this.id, null, width, height);
	jMap.setSaved(false);
};
jSunburstNode.prototype.imageResizeExecute = function(width, height) {
	this.img && this.img.attr({
		width : width,
		height : height
	});
	this.imgInfo.width = width;
	this.imgInfo.height = height;

	this.popover.img.width(width).height(height);
};
jSunburstNode.prototype.setForeignObject = function(html, width, height) {
	if (jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();
		if (!isAlive) return null;
	}

	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);

	this.setForeignObjectExecute(html, width, height);

	var redo = history && history.extractNode(this);
	history && history.addToHistory(undo, redo);

	jMap.saveAction.editAction(this);
	jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, html, width, height);
	jMap.setSaved(false);
};
jSunburstNode.prototype.setForeignObjectExecute = function(html, width, height) {
	if (!Raphael.svg) return false;

	if (html == null || html == "") {
		this.foreignObjEl = null;
		this.popover.foreignObjEl.remove();
		this.popover.foreignObjEl = null;

		this.CalcBodySize();

		return false;
	}

	if (!this.foreignObjEl) {
		this.foreignObjEl = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		this.foreignObjEl.bodyEl = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
		this.foreignObjEl.appendChild(this.foreignObjEl.bodyEl);

		this.popover.foreignObjEl = $('<div></div>')
			.attr('class', 'jpopover-foreignObjEl')
			.appendTo(this.popover.body);
	}

	width && this.foreignObjEl.setAttribute("width", width);
	height && this.foreignObjEl.setAttribute("height", height);

	width && this.popover.foreignObjEl.width(width);
	height && this.popover.foreignObjEl.height(height);

	// 사용자가 정의한 html은 저장이나 다른 곳에서 사용해야 하는데
	// innerHTML에 html 코드를 넣으면 몇몇 정보가 바뀌어 버리는것이 있다. (태그를 삭제한다든가 하는..)
	// 그래서 plainHtml에 순수한 html 문자열을 갖고 있는다.
	this.foreignObjEl.bodyEl.innerHTML = html;
	this.foreignObjEl.plainHtml = html;

	this.popover.foreignObjEl.html(html);

	// 몇몇 브라우저에서는 유투브 동영상이 지원하지 않아서 그림을 대처하는데,
	// 그 방법으로 html 내용에 youtube.com있으면 유투브 동영상이라 판단하고 처리한다.
	// 문자열에 youtube.com이 있을수도 있기 떄문에 다음과 같이 처리하는것은 좋지 않다.
	if ( /*BrowserDetect.browser == "Firefox" || */ BrowserDetect.browser == "MSIE") {
		var pos = html.search(/youtube\.com/);
		if (pos != -1) {
			var imgVideoNotSupport = '<img src="' + jMap.cfg.contextPath + '/images/video_not_support.png" width="300" height="300"/>';
			this.foreignObjEl.bodyEl.innerHTML = imgVideoNotSupport;
			this.popover.foreignObjEl.html(imgVideoNotSupport);
		}
	}

	this.CalcBodySize();
};
jSunburstNode.prototype.foreignObjectResize = function(width, height) {
	if (jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();
		if (!isAlive) return null;
	}

	var history = jMap.historyManager;
	var undo = history && history.extractNode(this);

	this.foreignObjectResizeExecute(width, height);

	var redo = history && history.extractNode(this);
	history && history.addToHistory(undo, redo);

	jMap.saveAction.editAction(this);
	jMap.fireActionListener(ACTIONS.ACTION_NODE_FOREIGNOBJECT, this, null, width, height);
	jMap.setSaved(false);
};
jSunburstNode.prototype.foreignObjectResizeExecute = function(width, height) {
	width && this.foreignObjEl.setAttribute("width", width);
	height && this.foreignObjEl.setAttribute("height", height);

	width && this.popover.foreignObjEl.width(width);
	height && this.popover.foreignObjEl.height(height);

	var html = this.foreignObjEl.plainHtml;
	html = html.replace(/(width=")([^"]*)/ig, "$1" + width);
	html = html.replace(/(height=")([^"]*)/ig, "$1" + height);

	this.foreignObjEl.bodyEl.innerHTML = html;
	this.foreignObjEl.plainHtml = html;
	this.popover.foreignObjEl.html(html);
	this.CalcBodySize();
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
	jMap.layoutManager.layout(true);
};
jSunburstNode.prototype.setEmbedVideo = function(code) {
	var widthRe = /width?=?["']([^"']*)/gi;
	var width = widthRe.exec(code)[1];
	var heightRe = /height?=?["']([^"']*)/gi;
	var height = heightRe.exec(code)[1];
	this.setForeignObject(code, width, height);
};
jSunburstNode.prototype.setVideo = function(playUrl, width, height) {
	var defaultSize = jMap.cfg.default_video_size;

	var html = '<embed src="' + playUrl + '" width="' + width + '"  height="' + height + '"></embed>';
	this.setHyperlink(playUrl);
	this.setForeignObject(html, width, height);
};
jSunburstNode.prototype.setYoutubeVideo = function(playUrl, width, height) {
	var defaultSize = jMap.cfg.default_video_size;

	if (width == null) {
		width = defaultSize;
	}
	if (height == null) {
		height = defaultSize;
	}
	var re = /v[=\/]([^&]*)/ig;
	var match = re.exec(playUrl);
	if (match) {
		var url = 'http://www.youtube.com/embed/' + match[1];

		var html = '<iframe src="' + url + '" frameborder="0" allowtransparency="true" width="' + width + '"  height="' + height + '" scrolling="no"></iframe>';
		this.setHyperlink(playUrl);
		this.setForeignObject(html, width, height);
	}
};

jSunburstNode.prototype.zoomExecute = function(duration) {
	var layout = jMap.layoutManager;
	var node = this;
	duration = (duration == undefined ? layout.duration : duration);

	node.hidePopover();
	jMap.arcTweenNode = node;

	d3.selectAll('g[data-node-type="' + jMap.cfg.nodeStyle + '"] path')
		.transition()
		.duration(duration)
		.attrTween('d', layout.arcTween(node.getPartitionTreeData()));

	d3.selectAll('g[data-node-type="' + jMap.cfg.nodeStyle + '"] text')
		.style('visibility', function(e) {
			return node.isParentOf(e) ? null : d3.select(this).style('visibility');
		})
		.transition()
		.duration(duration)
		.attrTween('text-anchor', function(d) {
			return function() {
				var textAnchor = 'middle';
				if (jMap.nodes[d.id]) {
					if (!jMap.nodes[d.id].isRootNode()) {
						textAnchor = layout.x(d.x + d.dx / 2) > Math.PI ? 'end' : 'start';
					}
					d3.select(jMap.nodes[d.id].text.node).style({
						'text-anchor' : textAnchor
					});
				}
				return textAnchor;
			};
		})
		.attrTween('transform', function(d) {
			var multiline = (jMap.nodes[d.id].plainText || '').split(' ').length > 1;
			return function() {
				var angle = layout.x(d.x + d.dx / 2) * 180 / Math.PI - 90,
					rotate = angle + (multiline ? -.5 : 0);
				if (jMap.nodes[d.id]) {
					jMap.nodes[d.id].angle = angle;
					if (jMap.nodes[d.id].isRootNode()) return '';
				}
				return 'rotate(' + rotate + ')translate(' + (layout.y(d.y) + layout.padding) + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
			};
		})
		.style('fill-opacity', function(e) {
			return node.isParentOf(e) ? 1 : 1e-6;
		})
		.each('end', function(e) {
			d3.select(this).style('visibility', function(){
				if(node.isParentOf(e)){
					if (jMap.nodes[e.id]) {
						jMap.nodes[e.id].computedTextExecute();
					}
					return null;
				}
				return 'hidden';
			});
		});
	
	return {
		end: function(callback){
			setTimeout(function(){
				callback();
			}, duration);
		}
	};
};

jSunburstNode.prototype.isParentOf = function(node) {
	if (this.id === node.id)
		return true;
	if (this.children) {
		return this.children.some(function(d) {
			return d.isParentOf(node);
		});
	}
	return false;
};

jSunburstNode.prototype.getChildren = function() {
	return this.children || [];
};

jSunburstNode.prototype.screenFocus = function() {
	this.zoomExecute();
};

jSunburstNode.prototype.showPopover = function() {
	var offset = this.getPopoverLocation();

	this.popover.container.attr('style', 'top: ' + (offset.top) + 'px; left: ' + (offset.left) + 'px;');
	this.popover.container.addClass('active');
	this.popover.container.attr('data-placement', this.angle > 90 ? 'left' : 'right');
};

jSunburstNode.prototype.getPopoverLocation = function() {
	var arcTweenNode = jMap.arcTweenNode.groupEl.getBBox();
	arcTweenNode.offset = $(jMap.arcTweenNode.groupEl).offset();
	var offset = {
		top : arcTweenNode.offset.top + ((arcTweenNode.height * jMap.cfg.scale) / 2),
		left : arcTweenNode.offset.left + ((arcTweenNode.width * jMap.cfg.scale) / 2)
	};

	var center = 0;
	if (!this.isRootNode()) {
		center = (this.outerRadius - this.innerRadius) / 2;
	}

	var radius = (this.innerRadius + center) * jMap.cfg.scale;
	var angle = this.angle;

	offset.top += (radius * Math.sin(Math.PI * (angle / 180)));
	offset.left += (radius * Math.cos(Math.PI * (angle / 180)));
	
	var ribbon_h = $('#ribbon').height() + 10;
	var popover_w = this.popover.container.width();
	var popover_h = this.popover.container.height();
	var window_w = $(window).width();
	var window_h = $(window).height();
	var padding = 5;
	
	// top
	if(offset.top < ribbon_h + padding){
		offset.top = ribbon_h + padding;
	}else if(offset.top + popover_h > window_h - padding){
		offset.top = window_h - popover_h - padding;
	}
	
	//left
	if(this.angle > 90){
		if(offset.left - popover_w < padding){
			offset.left = padding + popover_w;
		}
	}else{
		if(offset.left < padding){
			offset.left = padding;
		}else if(offset.left + popover_w > window_w - padding){
			offset.left = window_w - padding - popover_w;
		}
	}

	return offset;
};

jSunburstNode.prototype.hidePopover = function() {
	this.popover.container.removeClass('active');
};

jSunburstNode.prototype.toXML = function(alone) {
	var buffer = new StringBuffer();

	var isrichcontent = false;
	if (this.img != null || (this.text.attrs['text'] != null && this.text.attrs['text'].indexOf("\n") != -1)) {
		isrichcontent = true;
	}

	var buf = new StringBuffer();
	buf.add("<node");
	buf.add("CREATED=\"" + this.created + "\"");
	buf.add("ID=\"" + this.id + "\"");
	buf.add("MODIFIED=\"" + this.modified + "\"");

	buf.add("CREATOR=\"" + this.creator + "\"");
	buf.add("CLIENT_ID=\"" + this.client_id + "\"");

	if (!isrichcontent) {
		buf.add("TEXT=\"" + convertCharStr2SelectiveCPs(convertCharStr2XML(this.plainText, true, true), 'ascii', true, '&#x', ';', 'hex') + "\"");
	}

	buf.add("FOLDED=\"" + this.folded + "\"");
	if (this.background_color != "") {
		buf.add("BACKGROUND_COLOR=\"" + this.background_color + "\"");
	}
	if (this.color != "") {
		buf.add("COLOR=\"" + this.color + "\"");
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
	if (this.hgap) {
		buf.add("HGAP=\"" + this.hgap + "\"");
	}
	if (this.vgap) {
		buf.add("VGAP=\"" + this.vgap + "\"");
	}
	if (this.vshift) {
		buf.add("VSHIFT=\"" + this.vshift + "\"");
	}

	if (this.numofchildren != null) {
		buf.add("NUMOFCHILDREN=\"" + this.numofchildren + "\"");
	}

	buf.add(">");
	buffer.add(buf.toString(" "));

	if (isrichcontent) {
		var richcontent = new StringBuffer();
		richcontent.add("<richcontent TYPE=\"NODE\"><html>\n");
		richcontent.add("  <head>\n");
		richcontent.add("\n");
		richcontent.add("  </head>\n");
		richcontent.add("  <body>\n");

		if (this.img != null) {
			richcontent.add("    <p>\n");
			richcontent.add("      <img src=\"" + this.imgInfo.href + "\" width=\"" + this.imgInfo.width + "\" height=\"" + this.imgInfo.height + "\" />\n");
			richcontent.add("    </p>\n");
		}

		if (this.text.attrs['text'] != null) {
			var textArr = JinoUtil.trimStr(this.text.attrs['text']).split("\n");
			for (var i = 0; i < textArr.length; i++) {
				richcontent.add("<p>" + convertCharStr2SelectiveCPs(convertCharStr2XML(textArr[i], true, true), 'ascii', true, '&#x', ';', 'hex') + "</p>\n");
			}
		}

		richcontent.add("  </body>\n");
		richcontent.add("</html>\n");
		richcontent.add("</richcontent>");

		buffer.add(richcontent.toString(" "));
	}

	// ArrowLink
	if (this.arrowlinks.length > 0) {
		for (var i = 0; i < this.arrowlinks.length; i++) {
			buffer.add(this.arrowlinks[i].toXML());
		}
	}

	// foreignObject
	if (this.foreignObjEl) {
		var foreignObject = new StringBuffer();
		foreignObject.add("<foreignObject WIDTH=\"" + this.foreignObjEl.getAttribute("width") + "\" HEIGHT=\"" + this.foreignObjEl.getAttribute("height") + "\">");
		foreignObject.add(convertCharStr2SelectiveCPs(this.foreignObjEl.plainHtml, 'ascii', true, '&#x', ';', 'hex'));
		foreignObject.add("</foreignObject>");

		buffer.add(foreignObject.toString(" "));
	}

	for (var attr_name in this.attributes)
		buffer.add("<attribute NAME='" + attr_name + "' VALUE='" +
			convertCharStr2SelectiveCPs(convertCharStr2XML(this.attributes[attr_name], true, true),
				'ascii', true, '&#x', ';', 'hex') + "'/>");
	var exInfo = new StringBuffer();
	exInfo.add("<info");
	if (this.lazycomplete) {
		exInfo.add('LAZYCOMPLETE="' + this.lazycomplete + '"');
	}
	exInfo.add("/>");
	buffer.add(exInfo.toString(" "));

	var children = this.getChildren();
	if (children.length > 0 && alone == null) {
		for (var i = 0; i < children.length; i++) {
			buffer.add(children[i].toXML());
		}
	}
	buffer.add("</node>");
	return buffer.toString("\n");
};

jSunburstNode.prototype.getPartitionTreeData = function() {
	var treeData = {};
	treeData.id = this.id;
	treeData.dx = this.dx;
	treeData.dy = this.dy;
	treeData.x = this.x;
	treeData.y = this.y;

	if (this.children.length) {
		treeData.children = [];
		this.children.forEach(function(node) {
			treeData.children.push(node.getPartitionTreeData());
		});
	}

	return treeData;
};

jSunburstNode.prototype.getText = function() {
	return this.plainText;
}

jSunburstNode.prototype.computedTextExecute = function() {
	var node = this;
	var width = node.outerRadius * 2;

	if (!node.isRootNode()) {
		width = node.outerRadius - node.innerRadius;
	}

	var limit = Math.floor((width - 2 * jMap.layoutManager.padding) / (parseFloat(jMap.cfg.nodeFontSizes[3]) / 2)) - 4;

	if (node.plainText.length > limit) {
		var text = node.plainText.slice(0, limit);
		this.text.attr({
			text : text + '...'
		});
	}else{
		this.text.attr({
			text : this.plainText
		});
	}
};

jSunburstNode.prototype.setFolding = function(folded) {
	if(jMap.jDebug) console.log('setFolding');
};
jSunburstNode.prototype.hideChildren = function(node) {
	if(jMap.jDebug) console.log('hideChildren');
};
jSunburstNode.prototype.relativeCoordinate = function(dx, dy){
	if(jMap.jDebug) console.log('relativeCoordinate');
};
jSunburstNode.prototype.relativeCoordinateExecute = function(dx, dy){
	if(jMap.jDebug) console.log('relativeCoordinateExecute');
};