/**
 * @author Jinhoon
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

jFishboneLayout = function (map){
	this.map = map;
	this.HGAP = 10;
	this.VGAP = 10;
	
	this.xSize = 0;
	this.ySize = 0;
	
	this.angle = 90;
	
	// 가운데가 보이게...
	var work = this.map.work;
	work.scrollLeft = Math.round( (work.scrollWidth - work.offsetWidth)/2 );
	work.scrollTop = Math.round( (work.scrollHeight - work.offsetHeight)/2 );
	
	this.map.cfg.nodeFontSizes = ['16', '14', '12'];
	this.map.cfg.nodeStyle = "jFishNode";
}

jFishboneLayout.prototype.type= "jFishboneLayout";




jFishboneLayout.prototype.layoutNode = function(/*jNode*/ node) {
	var x = 0;

	if(node.isRootNode()) {
		x = 0;
	} else {
		var tan = Math.tan( Math.PI * (90 - this.angle)/180);
		
		if(node.isVertical()) {
			var l = node.getIndexPos();
			var children = node.getParent().getUnChildren();
			
			if(node.getDepth() == 1) {
				x = this.getRoot().body.getBBox().width +  parseInt(this.HGAP) + node.getSize().width + 30;
				for(var i = l % 2; i < l; i+= 2) {
					x += parseFloat(children[i].getTreeWidth()) +  parseInt(this.HGAP);
				}
				
				var prev = node.prevSibling();
				if(prev != null) {
					var prevParent = prev.getParent();
					var prevX = prev.getLocation().x - (prevParent.getLocation().x + this.HGAP);
					if(x - prevX < 30) {
						x = prevX + 30;
					}
				}
				
				if(!node.isTopSide()) {
					x += node.body.getBBox().width * Math.sin( Math.PI * (90 - this.angle)/180);
				}
			} else {
				var l = node.getIndexPos();
				var parent = node.getParent();
				var children = parent.getUnChildren();
				
				if(node.isTopSide()) {
					x = parent.getSize().width + node.getSize().width + this.HGAP;
					for(var i = 0; i < l; i++) {
						x += parseFloat(children[i].getTreeWidth()) +  parseInt(this.HGAP);
					}
				} else {
					/////
					x = node.getSize().width + this.HGAP;
					x += node.body.getBBox().width * Math.sin( Math.PI * (90 - this.angle)/180);
					for(var i = 0; i < l; i++) {
						x += parseFloat(children[i].getTreeWidth()) +  parseInt(this.HGAP);
					}
				}
			}
		} else {
			x = parseInt(this.HGAP)
			
			var l = node.getIndexPos();
			var parent = node.getParent();
			var children = parent.getUnChildren();
			if(node.isTopSide()) {
				var h = -children[0].body.getBBox().height + this.VGAP;
				for(var i = 0; i <= l; i++) {
					h += children[i].getTreeHeight() + this.VGAP;
				}
				x  += (parent.getTreeHeight() - h ) * tan + 5;
			} else {
				x += (node.relYPos) * tan;
			}
		}
	}

	this.placeNode(node, x, node.relYPos);
	
	node.connectArrowLink();
	//나를 가르키는 arrowlink들에 대해 connect를 다시 한다.
	var alinks = jMap.getArrowLinks(node);
	for(var i = 0; i < alinks.length; i++) {
		alinks[i].draw();
	}
	
	var depth = node.getDepth();
	if(!node.isRootNode() && depth % 2 == 1) {
		// jFishNode에서 아래쪽에 있는 노드는 InputPort와 OutputPort가 바뀌어서 나오기 때문에 이렇게 해야 한다.
		var port = (node.isTopSide()) ? node.getInputPort() : node.getOutputPort();
		var cx = port.x;
		var cy = port.y;
		
		if(depth == 1) {
			if(node.getIndexPos() % 2 == 0 ) { // 위쪽
				// +방향이 시계방향임.
				this.rotate(node, -this.angle, cx, cy);
			} else { // 아래쪽
				// 글자 방향을 맞추기 위해 180을 더함
				this.rotate(node, 180+this.angle, cx, cy);
			}
		} else {
			this.rotate(node, this.getParentAngle(node), cx, cy);
		}
	}
	
	if(node.folded == "false" || node.folded == false) {
		//var children = node.getUnChildren();
		var children = node.getChildren();
		if (children != null && children.length > 0) {
			for (var i = 0; i < children.length; i++) {
				this.layoutNode(children[i]);
			}
		}
	}
	
}

jFishboneLayout.prototype.layout = function(/*boolean*/ holdSelected) {
	var selected = this.map.selectedNodes.getLastElement();
	
	holdSelected = holdSelected &&
	 (selected != null &&
			 selected != undefined &&
			 !selected.removed &&
			 selected.getLocation().x != null &&
			 selected.getLocation().x != undefined &&
			 selected.getLocation().x != 0 &&
			 selected.getLocation().y != 0);
	 
	var rootNode = this.getRoot();
	var oldRootX = rootNode.getLocation().x;
	var oldRootY = rootNode.getLocation().y;
	if(holdSelected) {
		oldRootY = selected.getLocation().y;
	}
	
	this.resizeMap(rootNode.treeWidth, rootNode.treeHeight);
	this.layoutNode(this.getRoot());
}

jFishboneLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(/*jNode*/ node) {
	this.updateTreeHeightsAndRelativeYOfDescendants(node);
	if (! node.isRootNode())
       this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent()); 
}

jFishboneLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(/*jNode*/ node) {
	this.updateTreeGeometry(node);
	if (!node.isRootNode()) {
		this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent());
	}
}

jFishboneLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
	this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot()); 
	this.layout(false);
}

jFishboneLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(/*jNode*/ node) {
	var children = node.getUnChildren();
	if(children != null && children.length > 0){
		for(var i=0; i<children.length; i++) {
			this.updateTreeHeightsAndRelativeYOfDescendants(children[i]);
		}
	}
	
	this.updateTreeGeometry(node);
}





jFishboneLayout.prototype.updateRelativeYOfChildren = function(/*jNode*/ node, /*Array*/ children) {
	if(children == null || children.length == 0)
		return;
	
	if(node.isRootNode()) {
		for (var i = 0; i < children.length; i++) {
			if(children[i].isTopSide()) {
				children[i].relYPos = - this.VGAP + node.getSize().height/2 - children[i].body.getBBox().height;
			} else {
				children[i].relYPos = this.VGAP - children[i].body.getBBox().height +  children[i].body.getBBox().width * Math.cos( Math.PI * (90 - this.angle)/180) + node.body.getBBox().height/2;
			}
		}
	} else {
		if(node.isVertical()) {
			if(node.isTopSide()) {
				var pointer = -node.getSize().height ;
				
				var shift = 0;
				var h = 0;
				if(children.length > 1) {
					children[0].relYPos = parseInt(pointer) - children[0].getSize().height + 2*parseInt(this.VGAP);
					
					for (var i = 1; i < children.length; i++) {
						h = parseInt(children[i].getTreeHeight()) + parseInt(this.VGAP);
						pointer +=  h;
						children[i].relYPos = parseInt(pointer);
						
						shift +=  h;
					}
				
					shift = shift - (node.getSize().height -  2*this.VGAP);
					if(shift > 0) {
						for (var i = 0; i < children.length; i++) {
							children[i].relYPos -= shift;
						}
					}
				}
			} else {
				var pointer = -node.getSize().height + children[0].body.getBBox().height + 2*this.VGAP;
				for (var i = 0; i < children.length; i++) {
					children[i].relYPos = (pointer);
					pointer +=  parseInt(children[i].getTreeHeight()) + this.VGAP;
				}
				var shift = pointer - (parseInt(children[children.length-1].getTreeHeight()) + this.VGAP);
				if(shift < 0) {
					for (var i = 0; i < children.length; i++) {
						children[i].relYPos -= shift;
					}
				}
			}
		} else {
			if(node.isTopSide()) {
				for (var i = 0; i < children.length; i++) {
					children[i].relYPos = - this.VGAP;
				}
			} else {
				for (var i = 0; i < children.length; i++) {
					children[i].relYPos = children[i].getSize().height;
				}
			}
		}
	}
}

jFishboneLayout.prototype.getShiftUp = function(/*jNode*/ node) {
	var shift = node.getShift();
	if(shift < 0) {
		return -shift;
	} else {
		return 0;
	}
}

jFishboneLayout.prototype.getShiftDown = function(/*jNode*/ node) {
	var shift = node.getShift();
	if(shift > 0) {
		return shift;
	} else {
		return 0;
	}
}

jFishboneLayout.prototype.updateTreeGeometry = function(/*jNode*/ node) {
		if (node == null || node == undefined || node.removed) return false;
	
		var children = node.getUnChildren();
		
		var treeWidth = this.calcTreeWidth(node, children);
		node.setTreeWidth(treeWidth);
		
		var treeHeight = this.calcTreeHeight(node, children);
		node.setTreeHeight(treeHeight);
		
		this.updateRelativeYOfChildren(node, children);
}

jFishboneLayout.prototype.calcTreeWidth = function(/*jNode*/ parent, /*array*/ children) {
	if (children != null && children.length > 0) {
		if(parent.isRootNode()) {
			var treeWidth =  parent.getSize().width;
			var child = children[children.length - 1];
			
			if(child.getLocation().x == 0) {
				this.layout(true);
			}
			
			//console.log(  child.getLocation().x + ", " + child.getTreeWidth() + ", " +  parent.getLocation().x );
			treeWidth =  Math.max(treeWidth, child.getLocation().x + child.getTreeWidth() - parent.getLocation().x);
			
			child = child.prevSibling();
			if(child != null) {
				treeWidth =  Math.max(treeWidth, child.getLocation().x + child.getTreeWidth() - parent.getLocation().x);
			}
			
			return treeWidth;
		} else if(parent.isVertical()) {
			var treeWidth = 0;
			for (var i = 0; i < children.length; i++) {
				var childNode = children[i];
				if (childNode != null) {
					treeWidth = Math.max(parseInt(childNode.getTreeWidth()), treeWidth );
				}
			}
			
			return parent.getSize().width + treeWidth + this.HGAP;;
		} else {
			var treeWidth = 0;
			
			for (var i = 0; i < children.length; i++) {
				var childNode = children[i];
				if (childNode != null) {
					treeWidth += parseInt(childNode.getTreeWidth()) + this.HGAP;
				}
			}
			
			if(parent.isTopSide()) {
				return parent.getSize().width + treeWidth;
			} else {
				return Math.max(parent.getSize().width, treeWidth);
			}
		}
	}
	
	return parent.getSize().width;
}

jFishboneLayout.prototype.calcTreeHeight = function(/*jNode*/ parent, /*int treeShift, /*array*/ children) {
	if (children != null && children.length > 0) {
		if(parent.isVertical()) {
			if(parent.isTopSide()) {
				var treeHeight = 2*this.VGAP;
				for (var i = 1; i < children.length; i++) {
					var childNode = children[i];
					if (childNode != null) {
						treeHeight += (parseInt(childNode.getTreeHeight()) + parseInt(this.VGAP));
					}
				}
				return Math.max(parent.getSize().height, treeHeight)  + parseInt(children[0].getTreeHeight());;
			} else {
				var treeHeight = this.VGAP;
				for (var i = 0; i < children.length; i++) {
					var childNode = children[i];
					if (childNode != null) {
						treeHeight += (parseInt(childNode.getTreeHeight()) + parseInt(this.VGAP));
					}
				}
				return Math.max(parent.getSize().height, treeHeight);
			}
		} else {
			if(parent.isTopSide()) {
				var treeHeight = parent.getSize().height;
				
				for (var i = 0; i < children.length; i++) {
					var childNode = children[i];
					if (childNode != null) {
						treeHeight = Math.max( parseInt(childNode.getTreeHeight()) + this.VGAP, treeHeight );
					}
				}
				
				return treeHeight;
			} else {
				var treeHeight = 0;
				
				for (var i = 0; i < children.length; i++) {
					var childNode = children[i];
					if (childNode != null) {
						treeHeight = Math.max( parseInt(childNode.getTreeHeight()) + this.VGAP, treeHeight );
					}
				}
				
				return treeHeight + parent.getSize().height;
			}
		}
	}
	
	return parent.getSize().height;
}

jFishboneLayout.prototype.calcUpperChildShift = function(/*jNode*/ node, /*Array*/ children) {
}

jFishboneLayout.prototype.calcStandardTreeShift = function(/*jNode*/parent, /*Array*/ children){
}

jFishboneLayout.prototype.placeNode = function(/*jNode*/ node, /*int*/relativeX, /*int*/relativeY) {
	if (node.isRootNode()) {
		node.setLocation(this.getRootX(), this.getRootY());
	} else {
		var x = parseFloat(node.parent.getLocation().x) + parseFloat(relativeX);
		var y = parseFloat(node.parent.getLocation().y) + parseFloat(relativeY);
		
		node.setLocation(x, y);
	}
}

jFishboneLayout.prototype.resizeMap = function(/*int*/width, /*int*/height){
	var bResized = false;
	
	var oldXSize = RAPHAEL.getSize().width;
	var oldYSize = RAPHAEL.getSize().height;
	
	var newXSize = 0;
	var newYSize = 0;
	
	var locRoot = this.getRoot().getLocation();
	
	if(oldXSize < width * 2) {
		newXSize = width * 2;
		newYSize = oldYSize;
		bResized = true;
	}
	
	if(oldYSize < height * 2) {
		newXSize = oldXSize;
		newYSize = height * 2;
		bResized = true;
		
		this.placeNode(this.getRoot());
	}

	//보이는 위치를 바꿔준다.
	if(bResized) {
		RAPHAEL.setSize(newXSize, newYSize);
		this.placeNode(this.getRoot(), this.getRootX(), this.getRootY());
		
		this.map.work.scrollLeft += (newXSize - oldXSize)/2;
		this.map.work.scrollTop += (newYSize - oldYSize)/2;
	}
}

jFishboneLayout.prototype.getRootY = function() {
	var canvasSize = RAPHAEL.getSize();
	
	//return Math.round( parseInt(canvasSize.height)*0.5) - parseInt(this.getRoot().body.getBBox().height)/2;
	return parseInt( canvasSize.height * 0.5) - parseInt(this.getRoot().body.getBBox().height)/2;
}

jFishboneLayout.prototype.getRootX = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.width)*0.5) - parseInt(this.getRoot().body.getBBox().width)/2;
}

jFishboneLayout.prototype.getRoot = function() {
	return this.map.rootNode;
}


jFishboneLayout.prototype.getTransformations = function(trans){
	var transformations = {};
	var attrs = "rotate matrix translate scale skewX skewY".split(" ");
	
	for (var i=0; i < attrs.length; i++) {
		var re = new RegExp(attrs[i]+'[(]([^)]*)[)]', 'ig');
		var match = re.exec(trans);
		
		transformations[attrs[i]] = match?match[1]:null;
	}
	
	return transformations;
}

/*
 * cx, cy 점을 기준으로 angle 만큼 돌린다.
 * angle은 degree 값
 */
jFishboneLayout.prototype.rotate = function(node, angle, cx, cy){
	var r = angle+","+cx+","+cy;
	var transformations = null;
	var values = [];
	
	// transform을 읽어와 rotate 적용후 다시 쓴다.
	var transNode = node.groupEl.getAttribute("transform");
	transformations = this.getTransformations(transNode);
	transformations.rotate = r;
	values = [];		
	for(var attr in transformations) {
		if(transformations[attr]) {
			values.push(attr+"("+transformations[attr]+")");
		}
	}
	
	node.groupEl.setAttribute("transform", values.join(" "));
}

/*
 * 부모 노드의 각도를 구한다.
 */
jFishboneLayout.prototype.getParentAngle = function(node){
	var currentNode = node;
	
	while (currentNode.getDepth() != 1) {
		currentNode = currentNode.getParent();
	}
	
	var transformations = this.getTransformations(currentNode.groupEl.getAttribute("transform"));
	var rotate = transformations.rotate.split(",");
	
	return rotate[0];
}