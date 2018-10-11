/**
 * @author Jinhoon
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

jMindMapLayout = function (map){
	this.map = map;
	this.HGAP = 30;
	this.VGAP = 10;
	
	this.xSize = 0;
	this.ySize = 0;
	
	// 가운데가 보이게...
	var work = this.map.work;
	work.scrollLeft = Math.round( (work.scrollWidth - work.offsetWidth)/2 );
	work.scrollTop = Math.round( (work.scrollHeight - work.offsetHeight)/2 );
	
	this.map.cfg.nodeFontSizes = ['30', '18', '12'];
	this.map.cfg.nodeStyle = "jRect";
}

jMindMapLayout.prototype.type= "jMindMapLayout";

jMindMapLayout.prototype.layoutNode = function(/*jNode*/ node) {
	var x = 0;
	var hgap = node.hgap;
	if (isNaN(hgap)) hgap = 0;
	if(node.isRootNode()) {
		x = 0;
	} else if(node.isLeft()) {
		x = -hgap - parseInt(node.body.getBBox().width) - parseInt(this.HGAP);
	} else {
		x = parseFloat(node.parent.body.getBBox().width) + parseFloat(hgap) + parseInt(this.HGAP);
	}


	this.placeNode(node, x, node.relYPos);
	
	node.connectArrowLink();
	//나를 가르키는 arrowlink들에 대해 connect를 다시 한다.
	var alinks = jMap.getArrowLinks(node);
	
	for(var i = 0; i < alinks.length; i++) {
		alinks[i].draw();
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

jMindMapLayout.prototype.layout = function(/*boolean*/ holdSelected) {
	var selected = this.map.selectedNodes.getLastElement();
//	var selectedNodes = this.map.getSelecteds();
//	if(selectedNodes.length > 0) {
//		selected = selectedNodes[0];
//	}
	
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

jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function(/*jNode*/ node) {
	this.updateTreeHeightsAndRelativeYOfDescendants(node);
	if (! node.isRootNode())
       this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent()); 
}

jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function(/*jNode*/ node) {
	this.updateTreeGeometry(node);
	if (!node.isRootNode()) {
		this.updateTreeHeightsAndRelativeYOfAncestors(node.getParent());
	}
}

jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
	this.updateTreeHeightsAndRelativeYOfDescendants(this.getRoot()); 
	this.layout(false);
}

jMindMapLayout.prototype.updateTreeHeightsAndRelativeYOfDescendants = function(/*jNode*/ node) {
	var children = node.getUnChildren();
	if(children != null && children.length > 0){
		for(var i=0; i<children.length; i++) {
			this.updateTreeHeightsAndRelativeYOfDescendants(children[i]);
		}
	}
	
	this.updateTreeGeometry(node);
}

jMindMapLayout.prototype.updateRelativeYOfChildren = function(/*jNode*/ node, /*Array*/ children) {
	if(children == null || children.length == 0)
		return;
	
	var vgap = node.vgap;
	var child = children[0];
	var pointer = 0;
	var upperShift = 0;
	for(var i = 0; i < children.length; i++) {
		child = children[i];
		var shiftUp = this.getShiftUp(child);
		var shiftDown = this.getShiftDown(child);
		var upperChildShift = child.getUpperChildShift();
		
		child.relYPos = parseInt(pointer) + parseInt(upperChildShift) + parseInt(shiftDown);
		upperShift += parseInt(upperChildShift) + parseInt(shiftUp);
		
		pointer +=  parseInt(child.getTreeHeight())+ parseInt(shiftUp)
				+ parseInt(shiftDown) + parseInt(vgap) + this.VGAP;
	}
	upperShift += parseInt(this.calcStandardTreeShift(node, children));
	for (var i = 0; i < children.length; i++) {
		child = children[i];
		child.relYPos -= upperShift;
	}
	
}

jMindMapLayout.prototype.getShiftUp = function(/*jNode*/ node) {
	var shift = node.getShift();
	if(shift < 0) {
		return -shift;
	} else {
		return 0;
	}
}

jMindMapLayout.prototype.getShiftDown = function(/*jNode*/ node) {
	var shift = node.getShift();
	if(shift > 0) {
		return shift;
	} else {
		return 0;
	}
}

jMindMapLayout.prototype.updateTreeGeometry = function(/*jNode*/ node) {
	if (node == null || node == undefined || node.removed) return false;
	
	if(node.isRootNode()) {
		var leftNodes = this.getRoot().getLeftChildren();
		var rightNodes = this.getRoot().getRightChildren();
		
		var leftWidth = this.calcTreeWidth(node, leftNodes);
		var rightWidth = this.calcTreeWidth(node, rightNodes);
		
		this.getRoot().setRootTreeWidths(leftWidth, rightWidth);
		
		this.updateRelativeYOfChildren(node, leftNodes);
		this.updateRelativeYOfChildren(node, rightNodes);
		
		var leftTreeShift = this.calcUpperChildShift(node, leftNodes);
		var rightTreeShift = this.calcUpperChildShift(node, rightNodes);
		
		this.getRoot().setRootUpperChildShift(leftTreeShift, rightTreeShift);
		
		var leftTreeHeight = this.calcTreeHeight(node, leftTreeShift, leftNodes);
		var rightTreeHeight = this.calcTreeHeight(node, rightTreeShift, rightNodes);
		
		this.getRoot().setRootTreeHeights(leftTreeHeight, rightTreeHeight);
	} else {
		var children = node.getUnChildren();
		
		var treeWidth = this.calcTreeWidth(node, children);
		node.setTreeWidth(treeWidth);
		
		this.updateRelativeYOfChildren(node, children);
		
		var treeShift = this.calcUpperChildShift(node, children);
		node.setUpperChildShift(treeShift);
		
		var treeHeight = this.calcTreeHeight(node, treeShift, children);
		node.setTreeHeight(treeHeight);
	}
}

jMindMapLayout.prototype.calcTreeWidth = function(/*jNode*/ parent, /*array*/ children) {
	var treeWidth = 0;
	if (children != null && children.length > 0) {
		for (var i = 0; i < children.length; i++) {
			var childNode = children[i];
			if (childNode != null) { 
				var childWidth = parseInt(childNode.getTreeWidth()) + parseInt(childNode.hgap) + this.HGAP;
				if (childWidth > treeWidth) {
					treeWidth = childWidth;
				}
			}
		}
	}
	return parent.getSize().width + treeWidth;
}

jMindMapLayout.prototype.calcTreeHeight = function(/*jNode*/ parent, /*int*/ treeShift, /*array*/ children) {
	var parentHeight = parent.getSize().height;
	try {
		var firstChild = children[0];
		var lastChild = children[children.length - 1];
		
		var minY = Math.min(firstChild.relYPos - firstChild.getUpperChildShift(), 0);
		var maxY = Math.max(lastChild.relYPos - lastChild.getUpperChildShift() + lastChild.getTreeHeight(), parentHeight);
		
		return maxY - minY;
	} catch (err) {
		return parentHeight;
	}
}

jMindMapLayout.prototype.calcUpperChildShift = function(/*jNode*/ node, /*Array*/ children) {
	try {
		var firstChild = children[0];
		
		var childShift = -firstChild.relYPos + parseInt(firstChild.getUpperChildShift());
		if(childShift > 0) {
			return childShift;
		} else {
			return 0;
		}
	} catch (err) {
		return 0;
	}
}

jMindMapLayout.prototype.calcStandardTreeShift = function(/*jNode*/parent, /*Array*/ children){
	var parentHeight = parent.getSize().height;
	if(children.length == 0) {
		return 0;
	}
	
	var height = 0;
	var vgap = parent.vgap;
	for(var i = 0; i < children.length; i++) {
		var node = children[i];
		if(node != null) {
			height += parseInt(node.getSize().height) + parseInt(vgap);
		}
	}
	
	return Math.max(parseInt(height) - parseInt(vgap) - parseInt(parentHeight), 0)/2;
	//return (parseInt(height) - parseInt(vgap) - parseInt(parentHeight) + this.VGAP * (children.length -1))/2;
}

jMindMapLayout.prototype.placeNode = function(/*jNode*/ node, /*int*/relativeX, /*int*/relativeY) {
	if (node.isRootNode()) {
		node.setLocation(this.getRootX(), this.getRootY());
	} else {
		var x = parseFloat(node.parent.getLocation().x) + parseFloat(relativeX);
		var y = parseFloat(node.parent.getLocation().y) + parseFloat(relativeY);
		
		node.setLocation(x, y);
	}
}

jMindMapLayout.prototype.resizeMap = function(/*int*/width, /*int*/height){
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

jMindMapLayout.prototype.getRootY = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.height)*0.5) - parseInt(this.getRoot().body.getBBox().height)/2;
}

jMindMapLayout.prototype.getRootX = function() {
	var canvasSize = RAPHAEL.getSize();
	
	return Math.round( parseInt(canvasSize.width)*0.5) - parseInt(this.getRoot().body.getBBox().width)/2;
}

jMindMapLayout.prototype.getRoot = function() {
	return this.map.rootNode;
}

