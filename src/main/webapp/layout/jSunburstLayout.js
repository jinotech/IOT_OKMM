/**
 * 
 * @author Nguyen Van Hoang (nvhoangag@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////////    jSunburstController    ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
jSunburstController = function(map) {
	jSunburstController.superclass.call(this, map);
};
extend(jSunburstController, JinoController);

jSunburstController.prototype.startNodeEdit = function(node) {
	if (this.nodeEditor == undefined || this.nodeEditor == null || node.removed) {
		return false;
	}

	if (!jMap.isAllowNodeEdit(node)) {
		return false;
	}

	if (STAT_NODEEDIT) this.stopNodeEdit(true);

	STAT_NODEEDIT = true;

	this.nodeEditor.setAttribute("nodeID", node.id);

	var oInput = this.nodeEditor;

	oInput.style.fontFamily = node.text.attr()['font-family'];
	oInput.style.fontSize = jMap.cfg.nodeFontSizes[2] * this.map.cfg.scale + "px";
	oInput.style.textAlign = 'left';

	var width = (node.outerRadius - node.innerRadius) * jMap.cfg.scale;
	var height = 30 * jMap.cfg.scale;
	var left = RAPHAEL.getSize().width / 2;
	var top = (RAPHAEL.getSize().height / 2) + (90 * jMap.cfg.scale);

	width = Math.max(width, 150);

	var center = 0;
	if (!node.isRootNode()) {
		center = (node.outerRadius - node.innerRadius) / 2;
	}
	var radius = (node.innerRadius + center) * jMap.cfg.scale;
	var angle = node.angle;
	top += (radius * Math.sin(Math.PI * (angle / 180)));
	left += (radius * Math.cos(Math.PI * (angle / 180)));

	oInput.style.display = "";
	oInput.style.width = width + "px";
	oInput.style.height = height + "px";
	oInput.style.left = left + "px";
	oInput.style.top = top + "px";
	oInput.style.zIndex = 999;

	oInput.value = node.getText();
	oInput.focus();

	return true;
};

jSunburstController.prototype.foldingAction = function(node) {
	if(jMap.jDebug) console.log('foldingAction');
};

jSunburstController.prototype.resetCoordinateAction = function(node) {
	if(jMap.jDebug) console.log('resetCoordinateAction');
};

jSunburstController.prototype.foldingAllAction = function() {
	if(jMap.jDebug) console.log('foldingAllAction');
};

jSunburstController.prototype.unfoldingAllAction = function() {
	if(jMap.jDebug) console.log('unfoldingAllAction');
};

jSunburstController.prototype.pasteAction = function(selected) {
	if(jMap.cfg.realtimeSave) {
		var isAlive = jMap.saveAction.isAlive();	
		if(!isAlive) return null;
	}
	
	if(!selected) selected = jMap.getSelected();
	
	// 선택한 노드에 클립보드에 있는 노드들을 붙인다.
	var pasteNodes = jMap.loadManager.pasteNode(selected, jMap.clipboardManager.getClipboardText());
	
	var postPasteProcess = function() {
		// 붙여넣기한 노드를 저장
		// 붙여넣기는 이미 데이터가 있기 때문에 저장후에 화면에 렌더링 할 수 있지만
		// 붙여넣기 하는 과정중에 POSITION 속성은 새로 만들어 지기 때문에 (다른 속성도?)
		// 렌더링된 후에 저장하는 것이다.
		for (var i = 0; i < pasteNodes.length; i++) {
			jMap.saveAction.pasteAction(pasteNodes[i]);
		}
		
		// 레이지 로딩일 경우, 자식들을 모두 삭제 한다.
		// 위에서 이미 서버에 저장되어 있고,
		// 붙여넣은 노드의 로딩은 모두 레이지로딩으로 한다.
		if(jMap.cfg.lazyLoading) {
			for (var i = 0; i < pasteNodes.length; i++) {
				var children = pasteNodes[i].getChildren();
				for (var c = children.length-1; c >= 0; c--) {
					children[c].removeExecute();				
				}
			}
		}
		
		// 이벤트 리스너를 위한 데이터
		// copy&paste의 경우 노드 아이디가 다시 만들어지기 때문에
		var sendXml = "<clipboard>";	
		for(var i = 0; i < pasteNodes.length; i++) {
				var xml = pasteNodes[i].toXML();
				sendXml += xml;
		}	
		sendXml += "</clipboard>";
		
		// 이벤트 리스너 호출
		jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, selected, sendXml);
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(selected);
		jMap.layoutManager.layout(true);
		
		jMap.arcTweenNode.zoomExecute();
	}
	
	if(jMap.loadManager.imageLoading.length == 0) {
		postPasteProcess();
	} else {
		var loaded = jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function(){
			postPasteProcess();
			// 이미지로더 리스너는 삭제!!! 중요.
			jMap.removeActionListener(loaded);
		});
	}
};

jSunburstController.prototype.deleteAction = function() {
	var selectedNodes = jMap.getSelecteds();
	for (var i = 0; i < selectedNodes.length; i++) {
		if (!jMap.isAllowNodeEdit(selectedNodes[i])) {
			return false;
		}
	}

	var node = null;
	var parentNode = null;
	var indexPos = -1;
	while (node = selectedNodes.pop()) {
		parentNode = node.getParent();
		indexPos = node.getIndexPos();

		node.popover.container.remove();
		node.remove();
	}

	if (parentNode) {
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(parentNode);
		jMap.layoutManager.layout(true);

		// 노드를 삭제후 적정한 노드위치로 포커싱
		if (indexPos != -1) {
			if (parentNode.getChildren().length <= 0) {
				parentNode.focus();
			} else {
				if (parentNode.getChildren().length > indexPos) {
					parentNode.getChildren()[indexPos].focus();
				} else {
					parentNode.getChildren()[parentNode.getChildren().length - 1].focus();
				}
			}

		}
		if (jMap.nodes[jMap.arcTweenNode.id]) {
			jMap.arcTweenNode.zoomExecute();
		} else {
			jMap.getRootNode().screenFocus();
		}
	} else {
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.getRootNode().screenFocus();
	}
};

jSunburstController.prototype.insertAction = function() {
	var node = jMap.getSelecteds().getLastElement();
	if (node) {
		J_NODE_CREATING = node;
		var param = {
			parent : node
		};
		var newNode = jMap.createNodeWithCtrl(param);

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
		jMap.layoutManager.layout(true);
		
		jMap.arcTweenNode.zoomExecute(0).end(function(){
			newNode.focus(true);
			jMap.controller.startNodeEdit(newNode);
		});
	}
};

jSunburstController.prototype.insertSiblingAction = function() {
	// FireFox의 엔터키 버그?? 다른 이벤트에서 기대하지 않은 이벤트 발생...
	if (BrowserDetect.browser == "Firefox") {
		jMap.keyEnterHit = 0;
	}

	var selectedNode = jMap.getSelecteds().getLastElement();
	var node = selectedNode && selectedNode.parent;
	if (node) {
		J_NODE_CREATING = selectedNode;
		// 폴딩 필요할까? 필요없음.
		var index = selectedNode.getIndexPos() + 1;
		var position = null;
		// Root노드 자식에서 추가될 경우 왼쪽 오른쪽 고려
		if (selectedNode.position && selectedNode.getParent().isRootNode())
			position = selectedNode.position;
		var param = {
			parent : node,
			index : index,
			position : position
		};
		var newNode = jMap.createNodeWithCtrl(param);

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(newNode.parent);
		jMap.layoutManager.layout(true);

		jMap.arcTweenNode.zoomExecute(0).end(function(){
			newNode.focus(true);
			jMap.controller.startNodeEdit(newNode);
		});
	}
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////    jSunburstControllerGuest    ////////////////////////
///////////////////////////////////////////////////////////////////////////////
jSunburstControllerGuest = function(map) {
	jSunburstControllerGuest.superclass.call(this, map);
};
extend(jSunburstControllerGuest, JinoControllerGuest);

jSunburstControllerGuest.prototype.foldingAction = function(node) {
	if(jMap.jDebug) console.log('foldingAction');
};

jSunburstControllerGuest.prototype.resetCoordinateAction = function(node) {
	if(jMap.jDebug) console.log('resetCoordinateAction');
};

jSunburstControllerGuest.prototype.foldingAllAction = function() {
	if(jMap.jDebug) console.log('foldingAllAction');
};

jSunburstControllerGuest.prototype.unfoldingAllAction = function() {
	if(jMap.jDebug) console.log('unfoldingAllAction');
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////    jSunburstLayout    /////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jSunburstLayout = function(map) {
	var self = this;

	map.controller = map.mode ? new jSunburstController(map) : new jSunburstControllerGuest(map);

	self.map = map;
	self.HGAP = 10;
	self.VGAP = 20;

	self.xSize = 0;
	self.ySize = 0;

	var work = self.map.work;
	work.scrollLeft = Math.round((work.scrollWidth - work.offsetWidth) / 2);
	work.scrollTop = Math.round((work.scrollHeight - work.offsetHeight) / 2);

	self.map.cfg.nodeFontSizes = [ '30', '18', '12', '9' ];
	self.map.cfg.nodeStyle = 'jSunburstNode';

	////////////////////////////////////////////////////////////////////////////
	// D3 js
	// Coffee Flavour Wheel
	////////////////////////////////////////////////////////////////////////////
	self.map.jDebug = false;
	
	self.map.cfg.edgeDefalutColor = '#8a7066';
	self.map.cfg.edgeDefalutWidth = 0.5;
	self.map.arcTweenNode = null;
	self.map.popoverContainer = $('<div class="jpopover-container" id="jsunburstlayout-popover-container"></div>').appendTo(document.body);

	self.radius = (Math.min(work.offsetWidth / 2, work.offsetHeight / 2)) - 100;
	self.x = d3.scale.linear().range([ 0, 2 * Math.PI ]);
	self.y = d3.scale.pow().exponent(1.3).domain([ 0, 1 ]).range([ 0, self.radius ]);
	self.padding = 5;
	self.duration = 800;

	self.partition = d3.layout.partition()
		.sort(null)
		.value(function(d) {
			return 5.8 - d.depth;
		});
	self.arc = d3.svg.arc()
		.startAngle(function(d) {
			var startAngle = Math.max(0, Math.min(2 * Math.PI, self.x(d.x)));
			if (jMap.nodes[d.id]) {
				jMap.nodes[d.id].startAngle = startAngle;
			}
			return startAngle;
		})
		.endAngle(function(d) {
			var endAngle = Math.max(0, Math.min(2 * Math.PI, self.x(d.x + d.dx)));
			if (jMap.nodes[d.id]) {
				jMap.nodes[d.id].endAngle = endAngle;
			}
			return endAngle;
		})
		.innerRadius(function(d) {
			var innerRadius = Math.max(0, d.y ? self.y(d.y) : d.y);
			if (jMap.nodes[d.id]) {
				jMap.nodes[d.id].innerRadius = innerRadius;
			}
			return innerRadius;
		})
		.outerRadius(function(d) {
			var outerRadius = Math.max(0, self.y(d.y + d.dy));
			if (jMap.nodes[d.id]) {
				jMap.nodes[d.id].outerRadius = outerRadius;
			}
			return outerRadius;
		});
};

jSunburstLayout.prototype.type = 'jSunburstLayout';

jSunburstLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
	jMap.arcTweenNode = this.getRoot();
	this.layoutPartition(jMap.arcTweenNode);
};

jSunburstLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function( /*jNode*/ node) {
	this.layoutPartition(this.getRoot());
};

jSunburstLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function( /*jNode*/ node) {
	this.layoutPartition(this.getRoot());
}

jSunburstLayout.prototype.layout = function( /*boolean*/ holdSelected) {};

jSunburstLayout.prototype.layoutPartition = function(node) {
	var layout = this;
	var nodePartition = layout.partition.nodes(node.getPartitionTreeData());

	nodePartition.forEach(function(partition) {
		jMap.nodes[partition.id].depth = partition.depth;
		jMap.nodes[partition.id].dx = partition.dx;
		jMap.nodes[partition.id].dy = partition.dy;
		jMap.nodes[partition.id].x = partition.x;
		jMap.nodes[partition.id].y = partition.y;
		jMap.nodes[partition.id].value = partition.value;

		d3.select('g[data-node-id="' + partition.id + '"] path')
			.data([ partition ])
			.attr('d', layout.arc)
			.attr('fill-rule', 'evenodd')
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round');

		d3.select('g[data-node-id="' + partition.id + '"] text')
			.data([ partition ])
			.attr('transform', function(d) {
				var multiline = (jMap.nodes[d.id].plainText || '').split(' ').length > 1,
					angle = layout.x(d.x + d.dx / 2) * 180 / Math.PI - 90,
					rotate = angle + (multiline ? -.5 : 0);
				if (jMap.nodes[d.id]) {
					jMap.nodes[d.id].angle = angle;
					if (jMap.nodes[d.id].isRootNode()) return '';
				}
				return 'rotate(' + rotate + ')translate(' + (layout.y(d.y) + layout.padding) + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
			})
			.attr('text-anchor', function(d) {
				var textAnchor = 'middle';
				if (jMap.nodes[d.id]) {
					if (!jMap.nodes[d.id].isRootNode()) {
						textAnchor = layout.x(d.x + d.dx / 2) > Math.PI ? 'end' : 'start';
					}
					
					jMap.nodes[d.id].computedTextExecute();
					
					d3.select(jMap.nodes[d.id].text.node).style({
						'text-anchor' : textAnchor
					});
				}
				return textAnchor;
			});
	});
};

jSunburstLayout.prototype.getRoot = function() {
	return this.map.rootNode;
};

jSunburstLayout.prototype.arcTween = function(d) {
	var self = jMap.layoutManager;
	var my = self.maxY(d),
		xd = d3.interpolate(self.x.domain(), [ d.x, d.x + d.dx ]),
		yd = d3.interpolate(self.y.domain(), [ d.y, my ]),
		yr = d3.interpolate(self.y.range(), [ d.y ? 20 : 0, self.radius ]);
	return function(d) {
		return function(t) {
			self.x.domain(xd(t));
			self.y.domain(yd(t)).range(yr(t));
			return self.arc(d);
		};
	};
};

jSunburstLayout.prototype.maxY = function(d) {
	var self = jMap.layoutManager;
	return d.children ? Math.max.apply(Math, d.children.map(self.maxY)) : d.y + d.dy;
};

jSunburstLayout.prototype.getCenterLocation = function() {
	return {
		x : RAPHAEL.getSize().width / 2,
		y : (RAPHAEL.getSize().height / 2) + 90
	};
};